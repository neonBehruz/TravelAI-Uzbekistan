import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  Navigation,
  DollarSign,
  Volume2,
  Bookmark,
  Share2,
  Calendar,
  CheckCircle2,
  Car,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { AiTripPlan, AiTripActivity } from '../types';
import { useAudioGuide } from '../context/AudioGuideContext';

interface TripResultPageProps {
  plan: AiTripPlan;
  onOpenMapWithRoute: (activities: AiTripActivity[]) => void;
  onSaveTrip: () => void;
  onNavigatePlace: (placeId: string) => void;
}

export const TripResultPage: React.FC<TripResultPageProps> = ({
  plan,
  onOpenMapWithRoute,
  onSaveTrip,
  onNavigatePlace
}) => {
  const [activeDay, setActiveDay] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const { playAudio } = useAudioGuide();

  const currentDayPlan = plan.days.find((d) => d.dayNumber === activeDay) || plan.days[0];

  const handleSave = () => {
    setIsSaved(true);
    onSaveTrip();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Trip Header Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(212, 175, 55, 0.1)), var(--bg-card)',
        border: '1px solid var(--border-gold)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="badge-gold" style={{ marginBottom: '12px' }}>
              <Sparkles size={12} /> AI Custom Journey Generated
            </div>
            <h1 style={{ fontSize: '32px', color: '#fff', marginBottom: '8px' }}>{plan.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '700px', lineHeight: 1.6 }}>
              {plan.aiSummary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleSave} className="btn-secondary" style={{ padding: '12px 20px' }}>
              <Bookmark size={16} color={isSaved ? 'var(--accent-gold)' : 'currentColor'} />
              <span>{isSaved ? 'Trip Saved!' : 'Save Trip'}</span>
            </button>

            <button
              onClick={() => onOpenMapWithRoute(currentDayPlan.activities)}
              className="btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <MapPin size={16} />
              <span>Open on Smart Map</span>
            </button>
          </div>
        </div>

        {/* Top Summary Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Destination</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{plan.destinationName}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Duration</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-turquoise)' }}>{plan.numberOfDays} Days</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Distance</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-azure)' }}>~{plan.totalDistanceKm} km</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Spend</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-gold)' }}>
              {plan.estimatedSpentUzs.toLocaleString()} UZS
            </div>
          </div>
        </div>
      </div>

      {/* Budget Breakdown Visualization */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={18} color="var(--accent-gold)" /> Smart AI Budget Distribution
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🍽️ Food & Plov</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              {plan.budgetBreakdown.foodUzs.toLocaleString()} UZS
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🎟️ Monument Tickets</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              {plan.budgetBreakdown.ticketsUzs.toLocaleString()} UZS
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🚕 Taxis & Transport</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              {plan.budgetBreakdown.transportUzs.toLocaleString()} UZS
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0, 168, 150, 0.1)', border: '1px solid var(--border-active)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-turquoise)' }}>✨ Buffer / Remaining</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-turquoise)' }}>
              {plan.budgetBreakdown.remainingUzs.toLocaleString()} UZS
            </div>
          </div>
        </div>

        {/* Progress Bar of Budget Utilization */}
        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: '40%', background: '#F4B942' }} title="Food" />
          <div style={{ width: '30%', background: '#00A896' }} title="Tickets" />
          <div style={{ width: '15%', background: '#05B2D2' }} title="Transport" />
          <div style={{ width: '15%', background: 'rgba(255,255,255,0.2)' }} title="Remaining" />
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {plan.days.map((d) => (
          <button
            key={d.dayNumber}
            onClick={() => setActiveDay(d.dayNumber)}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              background: activeDay === d.dayNumber ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.05)',
              color: activeDay === d.dayNumber ? '#070D1E' : '#fff',
              fontWeight: 700,
              fontSize: '14px',
              border: activeDay === d.dayNumber ? 'none' : '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            Day {d.dayNumber}
          </button>
        ))}
      </div>

      {/* Day Timeline Activities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ padding: '0 8px' }}>
          <h2 style={{ fontSize: '24px', color: '#fff' }}>{currentDayPlan.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {currentDayPlan.summary}
          </p>
        </div>

        {currentDayPlan.activities.map((act, index) => (
          <div
            key={index}
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            {/* Thumbnail */}
            <div style={{
              width: '120px',
              height: '100px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img src={act.imageUrl} alt={act.activityTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Main Info */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span className="badge-turquoise" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  <Clock size={12} /> {act.timeSlot}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-gold)', fontWeight: 600 }}>
                  {act.durationMinutes} mins visit
                </span>
                {act.distanceFromPreviousKm > 0 && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    • ~{act.distanceFromPreviousKm} km via {act.transitMode}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 700 }}>{act.activityTitle}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                {act.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-turquoise)' }}>
                  Cost: {act.estimatedCostUzs > 0 ? `${act.estimatedCostUzs.toLocaleString()} UZS` : 'Free'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => playAudio(act.activityTitle, act.description, 'en')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <Volume2 size={14} /> Listen
              </button>

              {act.placeId && (
                <button
                  onClick={() => onNavigatePlace(act.placeId!)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Place Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
