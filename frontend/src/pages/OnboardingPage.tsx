import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Car,
  Languages,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';

interface OnboardingPageProps {
  onComplete: (data: any) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const { languages, setLanguage, currentLanguage } = useLanguage();
  const { setManualCity } = useLocation();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('Samarkand');
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState(1000000);
  const [interests, setInterests] = useState<string[]>(['History', 'Uzbek Food', 'Photography']);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [transportation, setTransportation] = useState('Walking & Taxi');

  const interestOptions = [
    { id: 'History', label: '🏛️ Islamic Architecture & History' },
    { id: 'Uzbek Food', label: '🍲 Authentic Uzbek Gastronomy & Plov' },
    { id: 'Photography', label: '📸 Golden Hour & Drone Photo Spots' },
    { id: 'Crafts', label: '🏺 Silk Paper, Ceramics & Suzani' },
    { id: 'Bazaars', label: '🛍️ Ancient Trading Bazaars & Spices' },
    { id: 'Nightlife', label: '✨ Illuminated Monuments & Tea Houses' }
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    onComplete({
      destination,
      days,
      budget,
      interests: interests.join(', '),
      travelStyle,
      transportation
    });
  };

  return (
    <div style={{ maxWidth: '680px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-xl)' }}>
        {/* Progress Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: s < 4 ? 1 : 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= s ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.1)',
                color: step >= s ? '#070D1E' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px'
              }}>
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 4 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: step > s ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.1)',
                  marginRight: '8px'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Destination & Language */}
        {step === 1 && (
          <div>
            <div className="badge-gold" style={{ marginBottom: '12px' }}>Step 1 of 4</div>
            <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px' }}>Where is your journey taking you?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
              Select your primary Silk Road city and preferred language for AI voice narration.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Primary Destination
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                {[
                  { name: 'Samarkand', tag: 'MVP Live', img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=400&q=80', lat: 39.6547, lng: 66.9758 },
                  { name: 'Bukhara', tag: 'UNESCO City', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80', lat: 39.7747, lng: 64.4286 },
                  { name: 'Khiva', tag: 'Ichan Kala', img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=400&q=80', lat: 41.3783, lng: 60.3639 },
                  { name: 'Tashkent', tag: 'Capital Hub', img: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=400&q=80', lat: 41.2995, lng: 69.2401 },
                  { name: 'Tashkent Region', tag: 'Tian Shan', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', lat: 41.5644, lng: 70.0125 },
                  { name: 'Fergana', tag: 'Crafts & Silk', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', lat: 40.3842, lng: 71.7843 },
                  { name: 'Andijan', tag: 'Babur Heritage', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', lat: 40.7821, lng: 72.3442 },
                  { name: 'Namangan', tag: 'Flowers & Parks', img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80', lat: 40.9983, lng: 71.6726 },
                  { name: 'Kashkadarya', tag: 'Shahrisabz', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', lat: 39.0558, lng: 66.8286 },
                  { name: 'Surkhandarya', tag: 'Termez Silk Road', img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80', lat: 37.2242, lng: 67.2783 },
                  { name: 'Navoiy', tag: 'Nurata Spring', img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80', lat: 40.0844, lng: 65.3792 },
                  { name: 'Jizzakh', tag: 'Zaamin Reserve', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80', lat: 39.9611, lng: 68.3972 },
                  { name: 'Syrdarya', tag: 'River Oasis', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80', lat: 40.4897, lng: 68.7842 },
                  { name: 'Karakalpakstan', tag: 'Savitsky & Aral', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', lat: 42.4619, lng: 59.6166 }
                ].map((c) => (
                  <div
                    key={c.name}
                    onClick={() => {
                      setDestination(c.name);
                      setManualCity(c.name, c.lat, c.lng);
                    }}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: destination === c.name ? '2px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                      background: 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={c.img} alt={c.name} style={{ width: '100%', height: '70px', objectFit: 'cover' }} />
                    <div style={{ padding: '6px 8px' }}>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: '#fff' }}>{c.name}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-gold)' }}>{c.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Your Native / Preferred Language
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: currentLanguage === l.code ? 'rgba(0, 168, 150, 0.25)' : 'rgba(255,255,255,0.04)',
                      border: currentLanguage === l.code ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: currentLanguage === l.code ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Duration & Budget */}
        {step === 2 && (
          <div>
            <div className="badge-gold" style={{ marginBottom: '12px' }}>Step 2 of 4</div>
            <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px' }}>Duration & Estimated Budget</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
              How long will you spend in {destination}, and what is your overall target budget?
            </p>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Trip Duration</label>
                <span style={{ color: 'var(--accent-turquoise)', fontWeight: 800 }}>{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-turquoise)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>1 Day Express</span>
                <span>3 Days Ideal</span>
                <span>7 Days Deep Dive</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Target Budget (UZS)</label>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>
                  {budget.toLocaleString()} UZS (~${Math.round(budget / 12800)} USD)
                </span>
              </div>
              <input
                type="range"
                min="400000"
                max="5000000"
                step="100000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Backpacker (500k)</span>
                <span>Comfort (1.5M)</span>
                <span>Luxury (4M+)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div>
            <div className="badge-gold" style={{ marginBottom: '12px' }}>Step 3 of 4</div>
            <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px' }}>What excites you most?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
              Select your travel interests to personalize the monuments and restaurants in your plan.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {interestOptions.map((opt) => {
                const isSelected = interests.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(0, 168, 150, 0.18)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{opt.label}</span>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: isSelected ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#070D1E'
                    }}>
                      {isSelected && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Travel Style & Transportation */}
        {step === 4 && (
          <div>
            <div className="badge-gold" style={{ marginBottom: '12px' }}>Step 4 of 4</div>
            <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px' }}>Your Travel Pace & Transit</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
              Fine-tune the schedule intensity and preferred modes of transport.
            </p>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Travel Pace
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {['Relaxed', 'Balanced', 'Fast-Paced'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setTravelStyle(style)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      background: travelStyle === style ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: travelStyle === style ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontWeight: travelStyle === style ? 700 : 500,
                      fontSize: '13px'
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
                Transportation Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['Walking & Scenic', 'Taxi & Yandex Go', 'Private Driver / Car', 'Public Transit'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransportation(t)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: transportation === t ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: transportation === t ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontWeight: transportation === t ? 700 : 500,
                      fontSize: '13px',
                      textAlign: 'left'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buttons Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn-gold" style={{ padding: '12px 30px', fontSize: '15px' }}>
              <Sparkles size={16} /> Finish & Generate Itinerary
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
