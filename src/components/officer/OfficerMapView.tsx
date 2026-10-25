import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Filter,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Complaint, Urgency } from '../../types';
import { WARDS } from '../../data/wards';
import { useStore } from '../../store/useStore';
import { getDepartmentById } from '../../data/departments';
import { DepartmentChip } from '../common/DepartmentChip';
import { UrgencyBadge } from '../common/UrgencyBadge';

interface OfficerMapViewProps {
  onSelectComplaint: (c: Complaint) => void;
}

// Marker generator for urgency-colored dots
const createUrgencyMarkerIcon = (urgency: Urgency, isDuplicateCluster = false, count = 1) => {
  const colors: Record<Urgency, string> = {
    critical: '#FF5C5C',
    high: '#FFB020',
    medium: '#2DE2C4',
    low: '#94A3B8'
  };
  const color = colors[urgency];

  if (isDuplicateCluster && count > 1) {
    return L.divIcon({
      className: 'cluster-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${color}40; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #0B1020; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${color};">
            <span style="font-size: 11px; font-weight: bold; font-family: monospace; color: ${color};">+${count}</span>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  }

  return L.divIcon({
    className: 'urgency-pin',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
        <div style="width: 14px; height: 14px; border-radius: 50%; background: ${color}; border: 2px solid #0B1020; box-shadow: 0 0 8px ${color};"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const OfficerMapView: React.FC<OfficerMapViewProps> = ({ onSelectComplaint }) => {
  const complaints = useStore((state) => state.complaints);
  const theme = useStore((state) => state.theme);

  // Layer Toggles
  const [showWards, setShowWards] = useState(true);
  const [showHeatCircles, setShowHeatCircles] = useState(true);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState('all');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (selectedDeptFilter !== 'all' && c.departmentId !== selectedDeptFilter) return false;
      if (selectedUrgencyFilter !== 'all' && c.urgency !== selectedUrgencyFilter) return false;
      return true;
    });
  }, [complaints, selectedDeptFilter, selectedUrgencyFilter]);

  // Ward open complaint stats
  const wardOpenStats = useMemo(() => {
    const stats: Record<string, number> = {};
    for (const w of WARDS) {
      stats[w.id] = complaints.filter(
        (c) => c.wardId === w.id && c.status !== 'fixed' && c.status !== 'verified'
      ).length;
    }
    return stats;
  }, [complaints]);

  // Detect hotspots (points within ~0.003 degrees)
  const hotspotClusters = useMemo(() => {
    const clusters: { center: [number, number]; count: number; urgency: Urgency; sample: Complaint }[] = [];
    const visited = new Set<string>();

    for (let i = 0; i < filteredComplaints.length; i++) {
      const c1 = filteredComplaints[i];
      if (visited.has(c1.id)) continue;

      let count = 1;
      visited.add(c1.id);

      for (let j = i + 1; j < filteredComplaints.length; j++) {
        const c2 = filteredComplaints[j];
        if (visited.has(c2.id)) continue;
        const d = Math.hypot(c1.coordinates[0] - c2.coordinates[0], c1.coordinates[1] - c2.coordinates[1]);
        if (d < 0.003) {
          count++;
          visited.add(c2.id);
        }
      }

      if (count > 1) {
        clusters.push({
          center: c1.coordinates,
          count,
          urgency: c1.urgency,
          sample: c1
        });
      }
    }
    return clusters;
  }, [filteredComplaints]);

  return (
    <div className="relative h-[calc(100vh-10rem)] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Floating Controls Bar */}
      <div className="absolute top-4 left-4 z-[1000] p-3 rounded-2xl bg-[#0B1020]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-white font-mono font-bold">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>GIS Layers:</span>
        </div>

        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showWards}
            onChange={(e) => setShowWards(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-amber-400"
          />
          <span>Ward Polygons</span>
        </label>

        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer hover:text-white">
          <input
            type="checkbox"
            checked={showHeatCircles}
            onChange={(e) => setShowHeatCircles(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-amber-400"
          />
          <span>Hotspot Radius</span>
        </label>

        <div className="h-4 w-px bg-white/10" />

        {/* Urgency Filter */}
        <select
          value={selectedUrgencyFilter}
          onChange={(e) => setSelectedUrgencyFilter(e.target.value)}
          className="p-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
        >
          <option value="all" className="bg-[#0F172A]">All Urgencies</option>
          <option value="critical" className="bg-[#0F172A]">Critical Only</option>
          <option value="high" className="bg-[#0F172A]">High Only</option>
          <option value="medium" className="bg-[#0F172A]">Medium Only</option>
        </select>
      </div>

      {/* Full-Height React Leaflet Map */}
      <MapContainer
        center={[19.308, 72.85]}
        zoom={14}
        scrollWheelZoom={true}
        className={`h-full w-full ${theme === 'dark' ? 'brightness-90 invert-[0.88] hue-rotate-180 contrast-125' : ''}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ward Polygons with Hover Tooltips */}
        {showWards &&
          WARDS.map((ward) => {
            const openCount = wardOpenStats[ward.id] || 0;
            return (
              <Polygon
                key={ward.id}
                positions={ward.bounds}
                pathOptions={{
                  color: '#2DE2C4',
                  weight: 1.5,
                  fillColor: '#2DE2C4',
                  fillOpacity: openCount > 6 ? 0.18 : 0.08,
                  dashArray: '3, 3'
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs p-1">
                    <p className="font-bold">{ward.name} ({ward.code})</p>
                    <p className="text-slate-600">Open Complaints: {openCount}</p>
                    <p className="text-[10px] text-slate-500">Pop: {ward.population}</p>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

        {/* Heat Circles for Clusters */}
        {showHeatCircles &&
          hotspotClusters.map((cluster, idx) => (
            <Circle
              key={idx}
              center={cluster.center}
              radius={220}
              pathOptions={{
                color: cluster.urgency === 'critical' ? '#FF5C5C' : '#FFB020',
                fillColor: cluster.urgency === 'critical' ? '#FF5C5C' : '#FFB020',
                fillOpacity: 0.25,
                weight: 1
              }}
            />
          ))}

        {/* Hotspot Markers */}
        {hotspotClusters.map((cluster, idx) => (
          <Marker
            key={`cluster-${idx}`}
            position={cluster.center}
            icon={createUrgencyMarkerIcon(cluster.urgency, true, cluster.count)}
          >
            <Popup>
              <div className="p-2 space-y-1 text-slate-900">
                <span className="font-bold text-xs uppercase text-amber-600 block">
                  Duplicate Cluster Hotspot ({cluster.count} merged reports)
                </span>
                <p className="text-xs font-semibold">{cluster.sample.title}</p>
                <button
                  type="button"
                  onClick={() => onSelectComplaint(cluster.sample)}
                  className="mt-2 text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Open Grievance Drawer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Regular Complaints Markers */}
        {filteredComplaints.slice(0, 50).map((comp) => (
          <Marker
            key={comp.id}
            position={comp.coordinates}
            icon={createUrgencyMarkerIcon(comp.urgency)}
          >
            <Popup>
              <div className="p-2 space-y-1.5 text-slate-900 min-w-[200px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold">{comp.id}</span>
                  <span className="text-[10px] uppercase font-bold text-rose-600">
                    {comp.urgency}
                  </span>
                </div>
                <p className="text-xs font-semibold line-clamp-2">{comp.title}</p>
                <p className="text-[11px] text-slate-600">{comp.locationName}</p>
                <button
                  type="button"
                  onClick={() => onSelectComplaint(comp)}
                  className="w-full mt-2 py-1 px-2.5 rounded bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition flex items-center justify-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
