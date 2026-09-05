"""Geospatial coordinate calculations and distance utilities."""

import math
from typing import Tuple, List

EARTH_RADIUS_METERS = 6371000.0  # Earth's radius in meters


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on Earth using the Haversine formula.
    Returns distance in meters.
    """
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return EARTH_RADIUS_METERS * c


def interpolate_path(
    waypoints: List[Tuple[float, float]],
    num_intermediate_points: int = 10
) -> List[Tuple[float, float]]:
    """Interpolate smooth coordinate points along waypoints for simulated GPS movement."""
    if len(waypoints) < 2:
        return waypoints

    smooth_path = []
    for i in range(len(waypoints) - 1):
        p1 = waypoints[i]
        p2 = waypoints[i + 1]
        for step in range(num_intermediate_points):
            t = step / float(num_intermediate_points)
            lat = p1[0] + t * (p2[0] - p1[0])
            lng = p1[1] + t * (p2[1] - p1[1])
            smooth_path.append((lat, lng))
    smooth_path.append(waypoints[-1])
    return smooth_path
