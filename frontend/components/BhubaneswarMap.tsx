"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HeatmapCell, RiskZone, RouteOption } from "@/lib/types";

export interface MapAreaSelection {
  areaName: string;
  riskScore: number;
  riskLevel: "CRITICAL" | "HIGH" | "ELEVATED" | "MODERATE" | "LOW";
  incidentCount: number;
  lightingRating?: number;
  patrolFrequency?: string;
  description?: string;
  centerCoords?: [number, number];
}

interface Props {
  userLocation: [number, number];
  riskZones: RiskZone[];
  heatmapCells: HeatmapCell[];
  recommendedRoute?: RouteOption | null;
  alternativeRoutes?: RouteOption[] | null;
  activeRouteId?: string | null;
  onSelectRoute?: (routeId: string) => void;
  destinationLocation?: [number, number] | null;
  destinationName?: string;
  showHeatmap?: boolean;
  showRiskZones?: boolean;
  isEscalated?: boolean;
  onSelectArea?: (area: MapAreaSelection) => void;
}

// Dynamically import MapContainer and Leaflet components to avoid Next.js SSR window error
const DynamicLeafletMap = dynamic(
  async () => {
    const L = await import("leaflet");
    const { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, useMap } = await import("react-leaflet");

    // Leaflet marker icon fix
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Custom user icon (Intense pulsing danger beacon when escalated, calm teal shield otherwise)
    const createUserIcon = (isEscalated: boolean) =>
      L.divIcon({
        className: "custom-user-marker",
        html: isEscalated
          ? `
          <div style="position: relative; width: 64px; height: 64px; margin-left: -16px; margin-top: -16px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 64px; height: 64px; border-radius: 50%; background: rgba(220, 38, 38, 0.25); animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(239, 68, 68, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 0.3s;"></div>
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 0, 0, 0.6); box-shadow: 0 0 20px #ff0000;"></div>
            <div style="position: relative; width: 20px; height: 20px; border-radius: 50%; background: #dc2626; border: 3px solid #ffffff; box-shadow: 0 0 16px #dc2626; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900;">
              !
            </div>
          </div>
        `
          : `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(0, 109, 98, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 18px; height: 18px; border-radius: 50%; background: #006d62; border: 3px solid white; box-shadow: 0 0 12px #006d62;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

    // Custom destination icon (Target pin)
    const createDestinationIcon = () =>
      L.divIcon({
        className: "custom-dest-marker",
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(192, 57, 43, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #c0392b; border: 2.5px solid white; box-shadow: 0 0 10px rgba(192, 57, 43, 0.6); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 800;">
              🏁
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

    // Daylight-friendly 3-tier consumer palette: Red, Orange, Green
    const RISK_COLORS: Record<string, string> = {
      CRITICAL: "#dc2626", // Red
      HIGH: "#dc2626",     // Red
      ELEVATED: "#ea580c", // Orange
      MODERATE: "#ea580c", // Orange
      LOW: "#16a34a",      // Green
    };

    const getCellColor = (level: string) => RISK_COLORS[level] || RISK_COLORS.LOW;

    // Smooth gradient opacity: bold, vibrant heat discs with strong visual presence
    const getSoftOpacity = (level: string) => {
      switch (level) {
        case "CRITICAL":
        case "HIGH":
          return 0.65;
        case "ELEVATED":
        case "MODERATE":
          return 0.48;
        default:
          return 0.24;
      }
    };

    // Controller to update map center smoothly
    function MapRecenter({ center }: { center: [number, number] }) {
      const map = useMap();
      useEffect(() => {
        if (center && center[0] && center[1]) {
          map.panTo(center, { animate: true, duration: 0.8 });
        }
      }, [center, map]);
      return null;
    }

    const MapComponent = ({
      userLocation,
      riskZones,
      heatmapCells,
      recommendedRoute,
      alternativeRoutes,
      activeRouteId,
      onSelectRoute,
      destinationLocation,
      destinationName,
      showHeatmap = true,
      showRiskZones = true,
      isEscalated = false,
      onSelectArea,
    }: Props) => {

      const handleAreaClick = (selection: MapAreaSelection) => {
        if (onSelectArea) {
          onSelectArea(selection);
        }
      };

      return (
        <MapContainer
          center={userLocation}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        >
          <MapRecenter center={userLocation} />

          {/* Base Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Soft Gradient Heatmap Discs (No hard rectangular GIS borders) */}
          {showHeatmap &&
            heatmapCells.map((cell) => {
              const color = getCellColor(cell.risk_level);
              const isRed = cell.risk_level === "CRITICAL" || cell.risk_level === "HIGH";
              const isOrange = cell.risk_level === "ELEVATED" || cell.risk_level === "MODERATE";
              const showMicroBadge = isRed || isOrange;

              return (
                <React.Fragment key={cell.cell_id}>
                  {/* Outer Diffuse Heat Field (Soft radial falloff, no border) */}
                  <Circle
                    center={[cell.center_lat, cell.center_lng]}
                    radius={650}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: getSoftOpacity(cell.risk_level),
                      weight: 0,
                    }}
                    eventHandlers={{
                      click: () =>
                        handleAreaClick({
                          areaName: cell.area_name,
                          riskScore: cell.risk_score,
                          riskLevel: cell.risk_level as any,
                          incidentCount: cell.incident_count,
                          centerCoords: [cell.center_lat, cell.center_lng],
                        }),
                    }}
                  >
                    {/* Clean micro-tag: only for elevated/high areas, no giant score */}
                    {showMicroBadge && (
                      <Tooltip
                        permanent
                        direction="center"
                        className="heatmap-cell-label"
                      >
                        <div
                          style={{
                            fontFamily: "Manrope, sans-serif",
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#17332f",
                            background: "rgba(255,253,248,0.92)",
                            borderRadius: 20,
                            padding: "3px 9px",
                            border: `1px solid ${color}60`,
                            boxShadow: "0 2px 8px rgba(23,51,47,0.10)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span>{isRed ? "🔴" : "🟠"}</span>
                          <span>{cell.area_name.split("/")[0].trim()}</span>
                        </div>
                      </Tooltip>
                    )}
                  </Circle>
                </React.Fragment>
              );
            })}

          {/* Flagged Danger Hotspots: Clean diffused halos */}
          {showRiskZones &&
            riskZones.map((rz) => {
              const isCritical = rz.base_threat_level === "CRITICAL";
              const zoneColor = isCritical ? "#c0392b" : "#d35400";
              return (
                <Circle
                  key={rz.id}
                  center={[rz.latitude, rz.longitude]}
                  radius={rz.radius_meters}
                  pathOptions={{
                    color: zoneColor,
                    fillColor: zoneColor,
                    fillOpacity: isCritical ? 0.45 : 0.35,
                    weight: 2,
                    dashArray: "4, 4",
                  }}
                  eventHandlers={{
                    click: () =>
                      handleAreaClick({
                        areaName: rz.name,
                        riskScore: isCritical ? 88 : 72,
                        riskLevel: isCritical ? "CRITICAL" : "HIGH",
                        incidentCount: rz.historical_incident_count,
                        lightingRating: rz.lighting_rating,
                        patrolFrequency: rz.patrol_frequency,
                        description: rz.description,
                        centerCoords: [rz.latitude, rz.longitude],
                      }),
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -6]} className="zone-label-tooltip">
                    <div
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: 10,
                        fontWeight: 800,
                        color: zoneColor,
                        background: "rgba(255,253,248,0.92)",
                        borderRadius: 20,
                        padding: "2px 8px",
                        border: `1px solid ${zoneColor}50`,
                        boxShadow: "0 2px 6px rgba(23,51,47,0.10)",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⚠ {rz.name.length > 24 ? rz.name.substring(0, 22) + "…" : rz.name}
                    </div>
                  </Tooltip>
                </Circle>
              );
            })}

          {/* Route 1: Recommended Safest Route (Solid Emerald/Teal) */}
          {recommendedRoute && (
            <Polyline
              positions={recommendedRoute.waypoints}
              pathOptions={{
                color: "#006d62",
                weight: activeRouteId === recommendedRoute.route_id || !activeRouteId ? 6 : 4,
                opacity: activeRouteId === recommendedRoute.route_id || !activeRouteId ? 0.95 : 0.45,
              }}
              eventHandlers={{
                click: () => onSelectRoute && onSelectRoute(recommendedRoute.route_id),
              }}
            >
              <Popup>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f" }}>
                  <strong style={{ color: "#006d62", display: "block", marginBottom: 2 }}>🟢 Safest Route (Recommended)</strong>
                  <div style={{ color: "#52635c", fontSize: 11 }}>{recommendedRoute.total_distance_km} km • ~{recommendedRoute.estimated_time_mins} mins</div>
                  <p style={{ color: "#65736f", fontSize: 10, marginTop: 4 }}>{recommendedRoute.factual_explanation}</p>
                </div>
              </Popup>
            </Polyline>
          )}

          {/* Alternative Routes (Balanced & Fastest) */}
          {alternativeRoutes &&
            alternativeRoutes.map((alt) => {
              const isFastest = alt.name.toLowerCase().includes("fastest") || alt.name.toLowerCase().includes("direct");
              const routeColor = isFastest ? "#c0392b" : "#d97706";
              const isActive = activeRouteId === alt.route_id;

              return (
                <Polyline
                  key={alt.route_id}
                  positions={alt.waypoints}
                  pathOptions={{
                    color: routeColor,
                    weight: isActive ? 5.5 : 3.5,
                    dashArray: isFastest ? "6, 5" : undefined,
                    opacity: isActive ? 0.95 : 0.50,
                  }}
                  eventHandlers={{
                    click: () => onSelectRoute && onSelectRoute(alt.route_id),
                  }}
                >
                  <Popup>
                    <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f" }}>
                      <strong style={{ color: routeColor, display: "block", marginBottom: 2 }}>
                        {isFastest ? "🔴 Fastest Route (Elevated Risk)" : "🟡 Balanced Route"}
                      </strong>
                      <div style={{ color: "#52635c", fontSize: 11 }}>{alt.total_distance_km} km • ~{alt.estimated_time_mins} mins</div>
                      <p style={{ color: "#65736f", fontSize: 10, marginTop: 4 }}>{alt.factual_explanation}</p>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

          {/* Active Live User Location Marker */}
          <Marker position={userLocation} icon={createUserIcon(isEscalated)}>
            <Popup>
              <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f" }}>
                <strong style={{ color: "#006d62", display: "block" }}>📍 Your Location</strong>
                <div style={{ color: "#52635c" }}>Lat: {userLocation[0].toFixed(4)}, Lng: {userLocation[1].toFixed(4)}</div>
                <div style={{ color: "#65736f", fontSize: 10 }}>Live GPS telemetry active</div>
              </div>
            </Popup>
          </Marker>

          {/* Destination Target Marker */}
          {destinationLocation && (
            <Marker position={destinationLocation} icon={createDestinationIcon()}>
              <Popup>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f" }}>
                  <strong style={{ color: "#c0392b", display: "block" }}>🎯 Target Destination</strong>
                  <div style={{ fontWeight: 700 }}>{destinationName || "Selected Destination"}</div>
                  <div style={{ color: "#65736f", fontSize: 10 }}>Lat: {destinationLocation[0].toFixed(4)}, Lng: {destinationLocation[1].toFixed(4)}</div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      );
    };

    return MapComponent;
  },
  { ssr: false }
);

export default function BhubaneswarMap(props: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-xl flex items-center justify-center text-xs" style={{ background: "#eef1eb", border: "1px solid #dbe2dc", color: "#65736f" }}>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-6 border-2 border-[#006d62] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Bhubaneswar Safety Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-xl overflow-hidden" style={{ border: "1px solid #cfdad3", boxShadow: "0 12px 32px rgba(23,51,47,0.10)" }}>
      <DynamicLeafletMap {...props} />
      {/* Floating Clean Map Legend */}
      <MapLegendOverlay />
    </div>
  );
}

function MapLegendOverlay() {
  const legendItems = [
    { color: "#dc2626", label: "High Risk (3)" },
    { color: "#ea580c", label: "Caution (7)" },
    { color: "#16a34a", label: "Safe Corridor (13)" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        zIndex: 1000,
        background: "rgba(255,253,248,0.94)",
        backdropFilter: "blur(8px)",
        border: "1px solid #cfdad3",
        borderRadius: 14,
        padding: "8px 12px",
        boxShadow: "0 6px 20px rgba(23,51,47,0.10)",
        fontFamily: "Manrope, sans-serif",
        fontSize: 10,
        lineHeight: "14px",
        color: "#17332f",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#65736f", marginBottom: 5 }}>
        Area Risk Level
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        {legendItems.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
            <span style={{ fontWeight: 700, fontSize: 10 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #dbe2dc", paddingTop: 4, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#006d62" }} />
          <span style={{ fontWeight: 600, fontSize: 9 }}>Your Location</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c0392b" }} />
          <span style={{ fontWeight: 600, fontSize: 9 }}>Destination</span>
        </div>
      </div>
    </div>
  );
}
