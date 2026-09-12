"""Memory Store for Kavach.
Manages persistent conversational episodic memories.
Enforces strict salience rules:
- Stores: ongoing harassment situations, recurring fears, recurring offenders, prior incidents, important preferences.
- Rejects: small talk, greetings, trivial chat.
"""

import re
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from backend.app.models.memory import UserMemory


class UserMemoryStore:
    """Service to store and retrieve high-salience user memories."""

    TRIVIAL_PATTERNS = [
        r"^(hi|hello|hey|good\s+morning|good\s+evening|good\s+afternoon|howdy|sup)\b",
        r"^(how\s+are\s+you|who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do)\b",
        r"^(thanks|thank\s+you|ok|okay|bye|goodbye|see\s+ya|cool)\b",
    ]

    SALIENT_KEYWORDS = {
        "HARASSMENT": ["manager", "boss", "colleague", "stalking", "follow", "stalked", "threatened", "messages", "harass", "bothering"],
        "FEAR": ["scared", "dark", "alley", "night", "alone", "panic", "anxious", "terrified", "afraid"],
        "OFFENDER": ["pulsar", "bike", "crescent", "scar", "tall", "helmet", "jacket", "man", "guy"],
        "INCIDENT": ["yesterday", "last week", "reported", "police", "fir", "chased", "grabbed", "stopped me"],
        "PREFERENCE": ["prefer", "call my", "always route", "don't like", "avoid"],
    }

    @classmethod
    def is_trivial(cls, text: str) -> bool:
        """Check if message is trivial small talk or greetings."""
        cleaned = text.strip().lower()
        if len(cleaned) < 4:
            return True
        for pattern in cls.TRIVIAL_PATTERNS:
            if re.search(pattern, cleaned):
                return True
        return False

    @classmethod
    def detect_category(cls, text: str) -> Optional[str]:
        """Detect salience category based on key phrases."""
        text_lower = text.lower()
        for cat, kw_list in cls.SALIENT_KEYWORDS.items():
            if any(kw in text_lower for kw in kw_list):
                return cat
        return None

    @classmethod
    def store_memory_if_salient(
        cls,
        db: Session,
        user_message: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        extracted_memory: Optional[str] = None,
        category: Optional[str] = None,
    ) -> Optional[UserMemory]:
        """Inspect user message or extracted statement; store if it passes salience thresholds."""
        if cls.is_trivial(user_message):
            return None

        detected_cat = category or cls.detect_category(user_message)
        if not detected_cat and not extracted_memory:
            return None

        memory_text = extracted_memory or user_message.strip()
        
        # Avoid storing identical memory within the same user/session
        existing = db.query(UserMemory).filter(
            or_(UserMemory.user_id == user_id, UserMemory.session_id == session_id),
            UserMemory.memory_text == memory_text
        ).first()

        if existing:
            return existing

        record = UserMemory(
            user_id=user_id,
            session_id=session_id,
            memory_text=memory_text,
            category=detected_cat or "GENERAL",
            salience_score=0.85 if detected_cat in ["HARASSMENT", "FEAR", "OFFENDER"] else 0.7,
            created_at=datetime.utcnow()
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @classmethod
    def retrieve_relevant_memories(
        cls,
        db: Session,
        query_text: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        top_k: int = 3
    ) -> List[str]:
        """Retrieve most relevant stored memories for the user/session given a query."""
        if not db:
            return []

        # Find memories for this user or session
        query = db.query(UserMemory)
        if user_id and session_id:
            query = query.filter(or_(UserMemory.user_id == user_id, UserMemory.session_id == session_id))
        elif user_id:
            query = query.filter(UserMemory.user_id == user_id)
        elif session_id:
            query = query.filter(UserMemory.session_id == session_id)
        else:
            # Fallback to recent general memories
            pass

        records = query.order_by(desc(UserMemory.created_at)).limit(20).all()
        if not records:
            return []

        query_tokens = set(re.findall(r"\w+", query_text.lower()))
        
        # Rank by keyword overlap and salience
        scored: List[tuple] = []
        for r in records:
            mem_tokens = set(re.findall(r"\w+", r.memory_text.lower()))
            overlap = len(query_tokens.intersection(mem_tokens))
            score = overlap * 2.0 + (r.salience_score or 0.5)
            scored.append((score, r.memory_text))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [mem for _, mem in scored[:top_k] if mem]
