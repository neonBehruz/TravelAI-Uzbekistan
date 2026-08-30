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
  RefreshCw,
  Crown,
  ShieldAlert,
  Search,
  Filter,
  UserCheck,
  UserX,
  Trash2
} from 'lucide-react';
import { AdminStats, UserProfile } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'users'>('analytics');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Admin' | 'User'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [data, usersData] = await Promise.all([
          api.getAdminStats(),
          api.getAdminUsers()
        ]);
        setStats(data);
        setUsers(usersData);
      } catch (err) {
        console.error('Failed to load admin telemetry:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (user?.role !== 'Admin') {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <ShieldAlert size={32} color="#EF4444" />
        </div>
        <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px' }}>Ruxsat Cheklangan (Access Denied)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
          Ushbu boshqaruv paneliga kirish faqat tizim Administratorlari uchun ajratilgan.
        </p>
      </div>
    );
  }

  if (!stats || loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading Admin Analytics…</div>;
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.country.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge-admin-crown" style={{ marginBottom: '8px' }}>
            <Crown size={13} color="#FFD700" /> Executive Platform Control
          </div>
          <h1 style={{ fontSize: '32px', color: '#fff' }}>SAFAR AI Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Boshqaruv markazi: Foydalanuvchilar rollari, tizim telemetriyasi va sayyohlar tahlili.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveAdminTab('analytics')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: activeAdminTab === 'analytics' ? '#070D1E' : 'var(--text-secondary)',
              background: activeAdminTab === 'analytics' ? 'var(--accent-gold)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            📊 Analytics & KPIs
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: activeAdminTab === 'users' ? '#070D1E' : 'var(--text-secondary)',
              background: activeAdminTab === 'users' ? 'var(--accent-gold)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            👥 Users & Roles ({users.length})
          </button>
        </div>
      </div>

      {activeAdminTab === 'users' ? (
        /* Users Management View */
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="var(--accent-gold)" /> Ro'yxatdan O'tgan Foydalanuvchilar
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Admin va oddiy sayyoh (User) hisoblarini ko'rish va boshqarish.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px 12px'
              }}>
                <Search size={14} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Qidiruv (Ism, Email, Davlat)..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', outline: 'none', width: '180px' }}
                />
              </div>

              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="all" style={{ background: '#0D1630' }}>Barcha Rollar</option>
                <option value="Admin" style={{ background: '#0D1630' }}>👑 Faqat Admin</option>
                <option value="User" style={{ background: '#0D1630' }}>🎒 Faqat User (Sayyoh)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th>Email</th>
                  <th>Davlat / Til</th>
                  <th>Rol (Darajasi)</th>
                  <th>Sayohatlar</th>
                  <th>Saqlanganlar</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      Foydalanuvchilar topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isRowAdmin = u.role === 'Admin';
                    const isCurrentUser = user?.id === u.id;
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isRowAdmin
                                ? 'linear-gradient(135deg, var(--accent-gold), #991B1B)'
                                : 'linear-gradient(135deg, var(--accent-turquoise), #0A1128)',
                              border: isRowAdmin ? '1px solid var(--accent-gold)' : '1px solid var(--accent-turquoise)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '12px',
                              color: '#fff'
                            }}>
                              {isRowAdmin ? <Crown size={14} color="#FFD700" /> : u.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff' }}>{u.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {u.id.substring(0, 8)}…</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td>{u.country} ({u.preferredLanguage.toUpperCase()})</td>
                        <td>
                          {isRowAdmin ? (
                            <span className="role-pill-admin">
                              <Crown size={11} /> ADMIN
                            </span>
                          ) : (
                            <span className="role-pill-user">
                              <UserCheck size={11} /> SAYYOH (USER)
                            </span>
                          )}
                        </td>
                        <td>{u.tripsCount} ta reja</td>
                        <td>{u.savedPlacesCount} ta joy</td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> Faol
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={async () => {
                                const newRole = isRowAdmin ? 'User' : 'Admin';
                                const success = await api.updateAdminUserRole(u.id, newRole);
                                if (success) {
                                  setUsers((prev) => prev.map((item) => item.id === u.id ? { ...item, role: newRole } : item));
                                }
                              }}
                              disabled={isCurrentUser}
                              className="btn-secondary"
                              style={{
                                padding: '5px 10px',
                                fontSize: '11px',
                                opacity: isCurrentUser ? 0.4 : 1,
                                cursor: isCurrentUser ? 'not-allowed' : 'pointer'
                              }}
                              title={isCurrentUser ? "O'z rolingizni o'zgartira olmaysiz" : "Rolni o'zgartirish"}
                            >
                              {isRowAdmin ? 'Sayyohga aylantirish' : 'Admin qilish'}
                            </button>
                            <button
                              onClick={async () => {
                                if (window.confirm(`"${u.name}" (${u.email}) foydalanuvchisini ro'yxatdan butunlay o'chirishni tasdiqlaysizmi?`)) {
                                  try {
                                    await api.deleteAdminUser(u.id);
                                    setUsers((prev) => prev.filter((item) => item.id !== u.id));
                                  } catch (err: any) {
                                    alert(err.message || "Xatolik yuz berdi");
                                  }
                                }
                              }}
                              disabled={isCurrentUser}
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                color: '#EF4444',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                cursor: isCurrentUser ? 'not-allowed' : 'pointer',
                                opacity: isCurrentUser ? 0.3 : 1
                              }}
                              title={isCurrentUser ? "O'zingizni o'chira olmaysiz" : "Foydalanuvchini o'chirish (Role-based deletion)"}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Analytics View */
        <>
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
      </>
      )}
    </div>
  );
};
