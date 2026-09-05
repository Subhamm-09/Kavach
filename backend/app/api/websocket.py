"""WebSocket Router for real-time live GPS simulation and agent telemetry streaming."""

import asyncio
import json
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal
from backend.app.services.simulation_service import SimulationService

ws_router = APIRouter(tags=["Real-Time WebSockets"])


class ConnectionManager:
    """Manages active WebSocket subscriber connections."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_json(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                pass


manager = ConnectionManager()


@ws_router.websocket("/ws/simulation")
async def websocket_simulation_endpoint(websocket: WebSocket):
    """Live WebSocket stream for GPS movements and autonomous agent handoffs.
    Client can send JSON commands:
    - {"action": "start", "scenario": "patia_hotspot", "session_id": "DEMO-123"}
    - {"action": "pause"}
    - {"action": "reset"}
    """
    await manager.connect(websocket)
    is_running = False
    current_step = 0
    scenario = "patia_hotspot"
    session_id = "WS-DEMO-SESS"

    try:
        while True:
            # Handle incoming client messages
            try:
                msg_text = await asyncio.wait_for(websocket.receive_text(), timeout=0.05)
                msg_data = json.loads(msg_text)
                action = msg_data.get("action")
                
                if action == "start":
                    is_running = True
                    scenario = msg_data.get("scenario", "patia_hotspot")
                    session_id = msg_data.get("session_id", "WS-DEMO-SESS")
                    if msg_data.get("reset"):
                        current_step = 0
                elif action == "pause":
                    is_running = False
                elif action == "reset":
                    is_running = False
                    current_step = 0
            except asyncio.TimeoutError:
                pass
            except json.JSONDecodeError:
                pass

            if is_running:
                db: Session = SessionLocal()
                try:
                    step_data = SimulationService.process_simulation_step(
                        db=db,
                        session_id=session_id,
                        step_index=current_step,
                        scenario=scenario,
                    )
                    await websocket.send_json({
                        "type": "GPS_TELEMETRY_UPDATE",
                        "data": step_data
                    })

                    current_step += 1
                    if step_data.get("is_completed"):
                        is_running = False
                finally:
                    db.close()

                await asyncio.sleep(1.2)  # 1.2s interval between GPS pings
            else:
                await asyncio.sleep(0.2)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
