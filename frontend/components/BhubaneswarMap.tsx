"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HeatmapCell, RiskZone, RouteOption } from "@/lib/types";

interface Props {
  userLocation: [number, number];
  riskZones: RiskZone[];
  heatmapCells: HeatmapCell[];
  recommendedRoute?: RouteOption | null;
  alternativeRoute?: RouteOption | null;
  destinationLocation?: [number, number] | null;
  destinationName?: string;
  showHeatmap?: boolean;
  showRiskZones?: boolean;
  isEscalated?: boolean;
}

// Dynamically import MapContainer and Leaflet components to avoid Next.js SSR window error
const DynamicLeafletMap = dynamic(
  async () => {
    const L = await import("leaflet");
    const { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, Tooltip, useMap } = await import("react-leaflet");

    // Leaflet marker icon fix
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Custom user icon (Pulsing shield)
    const createUserIcon = (isEscalated: boolean) =>
      L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: ${
              isEscalated ? "rgba(239, 68, 68, 0.4)" : "rgba(0, 109, 98, 0.35)"
            }; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 18px; height: 18px; border-radius: 50%; background: ${
              isEscalated ? "#ef4444" : "#006d62"
            }; border: 3px solid white; box-shadow: 0 0 12px ${isEscalated ? "#ef4444" : "#006d62"};"></div>
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

    // Color palette for heatmap risk levels (daylight-friendly)
    const RISK_COLORS: Record<string, string> = {
      CRITICAL: "#c0392b",
      HIGH: "#d35400",
      ELEVATED: "#e67e22",
      MODERATE: "#f39c12",
      LOW: "#27ae60",
    };

    const getCellColor = (level: string) => RISK_COLORS[level] || RISK_COLORS.LOW;

    const getCellOpacity = (level: string) => {
      switch (level) {
        case "CRITICAL": return 0.40;
        case "HIGH": return 0.32;
        case "ELEVATED": return 0.24;
        case "MODERATE": return 0.18;
        default: return 0.10;
      }
    };

    const getCellWeight = (level: string) => {
      switch (level) {
        case "CRITICAL": return 2.5;
        case "HIGH": return 2.0;
        case "ELEVATED": return 1.8;
        default: return 1.0;
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
      alternativeRoute,
      destinationLocation,
      destinationName,
      showHeatmap = true,
      showRiskZones = true,
      isEscalated = false,
    }: Props) => {

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

          {/* Dynamic Heatmap Grid Polygons with always-visible tooltips */}
          {showHeatmap &&
            heatmapCells.map((cell) => {
              const color = getCellColor(cell.risk_level);
              const isHighRisk = ["CRITICAL", "HIGH", "ELEVATED"].includes(cell.risk_level);
              return (
                <Polygon
                  key={cell.cell_id}
                  positions={cell.polygon}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: getCellOpacity(cell.risk_level),
                    weight: getCellWeight(cell.risk_level),
                    dashArray: isHighRisk ? "6, 4" : undefined,
                  }}
                >
                  {/* Always-visible label on the polygon */}
                  <Tooltip
                    permanent
                    direction="center"
                    className="heatmap-cell-label"
                  >
                    <div style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#17332f",
                      textAlign: "center",
                      lineHeight: "14px",
                      textShadow: "0 1px 3px rgba(255,255,255,0.9)",
                      background: "rgba(255,253,248,0.82)",
                      borderRadius: 8,
                      padding: "3px 7px",
                      border: `1px solid ${color}40`,
                    }}>
                      <div style={{ fontSize: 9, color: "#65736f", fontWeight: 600 }}>
                        {cell.area_name.length > 22 ? cell.area_name.substring(0, 20) + "…" : cell.area_name}
                      </div>
                      <div style={{ color: color, fontWeight: 800, fontSize: 12 }}>
                        {cell.risk_score}<span style={{ fontSize: 9, fontWeight: 600, color: "#65736f" }}>/100</span>
                      </div>
                    </div>
                  </Tooltip>
                  {/* Popup on click with details */}
                  <Popup>
                    <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f", maxWidth: 220 }}>
                      <strong style={{ display: "block", marginBottom: 4, fontSize: 13 }}>{cell.area_name}</strong>
                      <div>Risk Score: <strong style={{ color }}>{cell.risk_score}/100</strong></div>
                      <div style={{ color: "#65736f" }}>Level: {cell.risk_level}</div>
                      <div style={{ color: "#65736f" }}>Recent Incidents: {cell.incident_count}</div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

          {/* Flagged Danger Hotspot Circles with differentiated styling */}
          {showRiskZones &&
            riskZones.map((rz) => {
              const isCritical = rz.base_threat_level === "CRITICAL";
              const zoneColor = isCritical ? "#c0392b" : "#d35400";
              return (
                <React.Fragment key={rz.id}>
                  {/* Outer zone radius */}
                  <Circle
                    center={[rz.latitude, rz.longitude]}
                    radius={rz.radius_meters}
                    pathOptions={{
                      color: zoneColor,
                      fillColor: zoneColor,
                      fillOpacity: isCritical ? 0.22 : 0.16,
                      weight: isCritical ? 2.5 : 2,
                      dashArray: isCritical ? "8, 5" : "5, 4",
                    }}
                  >
                    {/* Persistent tooltip */}
                    <Tooltip permanent direction="top" offset={[0, -8]} className="zone-label-tooltip">
                      <div style={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: 10,
                        fontWeight: 800,
                        color: zoneColor,
                        textShadow: "0 1px 3px rgba(255,255,255,0.95)",
                        background: "rgba(255,253,248,0.92)",
                        borderRadius: 6,
                        padding: "2px 6px",
                        border: `1px solid ${zoneColor}40`,
                        whiteSpace: "nowrap",
                      }}>
                        ⚠ {rz.name.length > 28 ? rz.name.substring(0, 26) + "…" : rz.name}
                      </div>
                    </Tooltip>
                    {/* Popup on click */}
                    <Popup>
                      <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f", maxWidth: 230 }}>
                        <strong style={{ color: zoneColor, display: "block", marginBottom: 4, fontSize: 13 }}>⚠ {rz.name}</strong>
                        <p style={{ color: "#52635c", fontSize: 11, marginBottom: 4, lineHeight: "15px" }}>{rz.description}</p>
                        <div style={{ color: "#65736f", fontSize: 10 }}>Threat: <strong style={{ color: zoneColor }}>{rz.base_threat_level}</strong></div>
                        <div style={{ color: "#65736f", fontSize: 10 }}>Lighting: {rz.lighting_rating}/5.0 · Patrol: {rz.patrol_frequency}</div>
                        <div style={{ color: "#65736f", fontSize: 10 }}>Radius: {rz.radius_meters}m · Incidents: {rz.historical_incident_count}</div>
                      </div>
                    </Popup>
                  </Circle>

                  {/* Inner core emphasis circle (40% of radius) */}
                  <Circle
                    center={[rz.latitude, rz.longitude]}
                    radius={rz.radius_meters * 0.4}
                    pathOptions={{
                      color: zoneColor,
                      fillColor: zoneColor,
                      fillOpacity: isCritical ? 0.35 : 0.25,
                      weight: 1,
                    }}
                  />
                </React.Fragment>
              );
            })}

          {/* Recommended Safe Route Polyline */}
          {recommendedRoute && (
            <Polyline
              positions={recommendedRoute.waypoints}
              pathOptions={{
                color: "#006d62",
                weight: 5,
                opacity: 0.9,
              }}
            >
              <Popup>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f" }}>
                  <strong style={{ color: "#006d62", display: "block", marginBottom: 4 }}>🛡️ Recommended Safe Corridor</strong>
                  <p style={{ color: "#52635c", fontSize: 11 }}>{recommendedRoute.factual_explanation}</p>
                </div>
              </Popup>
            </Polyline>
          )}

          {/* Alternative Direct Shortcut Polyline */}
          {alternativeRoute && (
            <Polyline
              positions={alternativeRoute.waypoints}
              pathOptions={{
                color: "#c0392b",
                weight: 3,
                dashArray: "6, 6",
                opacity: 0.7,
              }}
            >
              <Popup>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f" }}>
                  <strong style={{ color: "#c0392b", display: "block", marginBottom: 4 }}>⚠️ Direct Unlit Shortcut (High Risk)</strong>
                  <p style={{ color: "#52635c", fontSize: 11 }}>{alternativeRoute.factual_explanation}</p>
                </div>
              </Popup>
            </Polyline>
          )}

          {/* Active Live User Location Marker */}
          <Marker position={userLocation} icon={createUserIcon(isEscalated)}>
            <Popup>
              <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, padding: 2, color: "#17332f" }}>
                <strong style={{ color: "#006d62", display: "block" }}>📍 Your Location</strong>
                <div style={{ color: "#52635c" }}>Lat: {userLocation[0].toFixed(4)}, Lng: {userLocation[1].toFixed(4)}</div>
                <div style={{ color: "#65736f", fontSize: 10 }}>Kavach is monitoring your surroundings</div>
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
          <span>Loading Bhubaneswar Geospatial Grid...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-xl overflow-hidden" style={{ border: "1px solid #cfdad3", boxShadow: "0 12px 32px rgba(23,51,47,0.10)" }}>
      <DynamicLeafletMap {...props} />
      {/* Map Legend Overlay */}
      <MapLegendOverlay />
    </div>
  );
}

function MapLegendOverlay() {
  const RISK_COLORS: Record<string, string> = {
    CRITICAL: "#c0392b",
    HIGH: "#d35400",
    ELEVATED: "#e67e22",
    MODERATE: "#f39c12",
    LOW: "#27ae60",
  };

  const legendItems = [
    { color: RISK_COLORS.CRITICAL, label: "Critical" },
    { color: RISK_COLORS.HIGH, label: "High" },
    { color: RISK_COLORS.ELEVATED, label: "Elevated" },
    { color: RISK_COLORS.MODERATE, label: "Moderate" },
    { color: RISK_COLORS.LOW, label: "Low" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        zIndex: 1000,
        background: "rgba(255,253,248,0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid #cfdad3",
        borderRadius: 14,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(23,51,47,0.12)",
        fontFamily: "Manrope, sans-serif",
        fontSize: 11,
        lineHeight: "16px",
        color: "#17332f",
        minWidth: 140,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#65736f", marginBottom: 6 }}>
        Risk level
      </div>
      {legendItems.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{
            width: 16, height: 10, borderRadius: 3,
            background: item.color, opacity: 0.85,
            border: `1.5px solid ${item.color}`,
          }} />
          <span style={{ fontWeight: 600 }}>{item.label}</span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #dbe2dc", marginTop: 6, paddingTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 14, height: 14, borderRadius: "50%",
            border: "2px dashed #c0392b",
            background: "rgba(192,57,43,0.12)",
          }} />
          <span style={{ fontWeight: 600, fontSize: 10 }}>Flagged zone</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: "#006d62", border: "2px solid white",
            boxShadow: "0 0 4px #006d62",
          }} />
          <span style={{ fontWeight: 600, fontSize: 10 }}>Your location</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: "#c0392b", border: "2px solid white",
            boxShadow: "0 0 4px #c0392b",
          }} />
          <span style={{ fontWeight: 600, fontSize: 10 }}>Destination</span>
        </div>
      </div>
    </div>
  );
}
