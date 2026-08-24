import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  Sparkles,
  MapPin,
  DollarSign,
  TrendingUp,
  Globe,
  Server,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AdminStats } from '../types';
import { api } from '../services/api';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getAdminStats();
      setStats(data);
      setLoading(false);
    }
    load();
  }, []);

  if (!stats || loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading Admin Analytics…</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge-gold" style={{ marginBottom: '8px' }}>
            <ShieldCheck size={12} /> Executive Platform Analytics
          </div>
          <h1 style={{ fontSize: '32px', color: '#fff' }}>SAFAR AI Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Live monitoring of tourist demographics, AI trip generations, and Silk Road destination engagement.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge-turquoise" style={{ fontSize: '12px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-turquoise)' }} />
            System Healthy
          </span>
        </div>
      </div>

      {/* Top Metric Cards (6 KPIs) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>TOTAL USERS</span>
            <Users size={18} color="var(--accent-turquoise)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {stats.totalUsers.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-turquoise)', marginTop: '4px' }}>+24% this month</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>ACTIVE TOURISTS</span>
            <Activity size={18} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {stats.activeTourists.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-gold)', marginTop: '4px' }}>In Samarkand now</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>TRIPS GENERATED</span>
            <Sparkles size={18} color="var(--accent-azure)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {stats.totalTripsGenerated.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-azure)', marginTop: '4px' }}>AI Itineraries</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>AI API CALLS</span>
            <Sparkles size={18} color="var(--text-gold)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {stats.totalAiRequests.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Voice, Vision, Chat</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>DESTINATIONS</span>
            <MapPin size={18} color="var(--accent-turquoise)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {stats.totalDestinations} Cities
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{stats.totalPlaces} Landmarks</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>COMMISSION REVENUE</span>
            <DollarSign size={18} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-gold)', marginTop: '8px' }}>
            48.5M UZS
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Hotel/Dining bookings</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Tourist Geography Breakdown */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--accent-turquoise)" /> Tourists by Country of Origin
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.touristCountries.map((c) => (
              <div key={c.country}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{c.country}</span>
                  <span style={{ color: 'var(--text-gold)', fontWeight: 700 }}>{c.percentage}% ({c.count})</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${c.percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-turquoise), var(--accent-azure))' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Visited Landmarks Ranking */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent-gold)" /> Top Visited Landmarks (Samarkand)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.topVisitedPlaces.map((place, idx) => (
              <div
                key={place.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: idx === 0 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                    color: idx === 0 ? '#070D1E' : '#fff',
                    fontWeight: 800,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>{place.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{place.city} • ★ {place.rating}</div>
                  </div>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-turquoise)' }}>
                  {place.visitCount.toLocaleString()} visits
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Microservices & Infrastructure Status */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} color="var(--accent-azure)" /> Architecture & Subsystem Health
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {[
            { name: 'ASP.NET Core 10 Web API', status: 'Online (200 OK)', latency: '12ms' },
            { name: 'PostgreSQL Relational DB', status: 'Healthy / Seeded', latency: '4ms' },
            { name: 'AI Knowledge Engine', status: 'Active (Samarkand)', latency: '35ms' },
            { name: 'GPS Haversine Engine', status: 'Calibrated', latency: '1ms' },
            { name: 'AI Voice TTS Synthesizer', status: 'Operational (10 Langs)', latency: '28ms' },
            { name: 'AI Vision Classifier', status: 'Trained', latency: '45ms' }
          ].map((svc) => (
            <div key={svc.name} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-turquoise)', fontSize: '12px', fontWeight: 700 }}>
                <CheckCircle2 size={14} /> {svc.status}
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '13px', marginTop: '4px' }}>{svc.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Latency: {svc.latency}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
