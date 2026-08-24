import React, { useState, useEffect } from 'react';
import {
  Volume2,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Send,
  Bookmark,
  Share2,
  Navigation
} from 'lucide-react';
import { Place, Review } from '../types';
import { api } from '../services/api';
import { useAudioGuide } from '../context/AudioGuideContext';

interface PlaceDetailPageProps {
  placeId: string;
  onBack: () => void;
  onOpenMapToPlace: (place: Place) => void;
}

export const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({
  placeId,
  onBack,
  onOpenMapToPlace
}) => {
  const { playAudio } = useAudioGuide();
  const [place, setPlace] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await api.getPlaceById(placeId);
      setPlace(p);
      const revs = await api.getReviews(placeId);
      setReviews(revs);
    }
    load();
  }, [placeId]);

  if (!place) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading place details…</div>;
  }

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const rev = await api.addReview(place.id, newRating, newComment);
      setReviews([rev, ...reviews]);
      setNewComment('');
    } catch (err) {
      console.error('Review error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', alignSelf: 'flex-start' }}
      >
        <ArrowLeft size={16} /> Back to Places
      </button>

      {/* Hero Banner */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--border-active)'
      }}>
        <div style={{ position: 'relative', height: '380px' }}>
          <img src={place.imageUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(7, 13, 30, 0.95), transparent)',
            padding: '36px'
          }}>
            <div className="badge-gold" style={{ marginBottom: '8px' }}>{place.categoryName}</div>
            <h1 style={{ fontSize: '38px', color: '#fff', fontWeight: 800 }}>{place.name}</h1>
            <div style={{ fontSize: '16px', color: 'var(--text-gold)', marginTop: '4px' }}>{place.localName} • {place.address}</div>
          </div>
        </div>

        {/* Quick Details Bar */}
        <div style={{
          padding: '24px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'rgba(13, 22, 48, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ticket Price</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-turquoise)' }}>
                {place.ticketPriceUzs > 0 ? `${place.ticketPriceUzs.toLocaleString()} UZS` : 'Free Entry'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Opening Hours</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{place.openingHours}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Recommended Visit</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{place.recommendedVisitDurationMinutes} Minutes</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rating</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-gold)' }}>★ {place.rating} ({place.reviewCount} reviews)</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => playAudio(place.name, place.audioGuideScript, 'en')}
              className="btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <Volume2 size={18} /> Listen to AI Guide
            </button>

            <button
              onClick={() => onOpenMapToPlace(place)}
              className="btn-secondary"
              style={{ padding: '12px 20px' }}
            >
              <Navigation size={18} color="var(--accent-turquoise)" /> Directions
            </button>
          </div>
        </div>
      </div>

      {/* Narrative & History */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-turquoise)" /> Historical Narrative
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
            {place.detailedHistory}
          </p>

          <h3 style={{ fontSize: '16px', color: '#fff', marginTop: '24px', marginBottom: '10px' }}>
            Architectural Masterpiece
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
            {place.architectureDetails}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="var(--accent-gold)" /> Fascinating Facts & Secrets
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {place.interestingFacts.map((fact, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  color: '#E2E8F0',
                  lineHeight: 1.5
                }}
              >
                ✨ {fact}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', color: '#fff' }}>Tourist Reviews & Experience</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Real impressions from travelers worldwide</p>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-gold)' }}>★ {place.rating} / 5.0</span>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                style={{ color: star <= newRating ? '#D4AF37' : '#475569', fontSize: '18px' }}
              >
                ★
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your travel experience, best photo spots, or visiting tips..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                color: '#fff',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <Send size={16} /> Post Review
            </button>
          </div>
        </form>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                  {r.userName} <span style={{ color: 'var(--text-gold)', fontWeight: 500, fontSize: '12px' }}>• {r.touristCountry}</span>
                </div>
                <div style={{ color: '#D4AF37', fontSize: '13px' }}>{'★'.repeat(r.rating)}</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
