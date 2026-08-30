import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  DollarSign,
  Compass,
  Car,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Bot
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { AiTripPlan } from '../types';

interface TripPlannerPageProps {
  onPlanGenerated: (plan: AiTripPlan) => void;
}

export const TripPlannerPage: React.FC<TripPlannerPageProps> = ({ onPlanGenerated }) => {
  const { t, currentLanguage } = useLanguage();

  const isUzbek = currentLanguage === 'uz';
  const isRussian = currentLanguage === 'ru';

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('Samarkand');
  const [days, setDays] = useState(2);
  const [budgetUzs, setBudgetUzs] = useState(1000000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'History',
    'Uzbek Food',
    'Photography'
  ]);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [transportation, setTransportation] = useState('Walking & Taxi');
  const [travelersCount, setTravelersCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const interestOptions = [
    {
      id: 'History',
      label: isUzbek ? '🏛️ Islom meʼmorchiligi & Yodgorliklar' : isRussian ? '🏛️ Исламская архитектура и памятники' : '🏛️ Islamic Architecture & Monuments'
    },
    {
      id: 'Uzbek Food',
      label: isUzbek ? '🍲 Milliy Samarqand Oshi & Taomlar' : isRussian ? '🍲 Национальный узбекский плов и гастрономия' : '🍲 Traditional Uzbek Plov & Dining'
    },
    {
      id: 'Photography',
      label: isUzbek ? '📸 Oltin soat foto lokatsiyalar' : isRussian ? '📸 Локации для фото на закате' : '📸 Golden Hour Photo Spots'
    },
    {
      id: 'Crafts',
      label: isUzbek ? '🏺 Ipak qog‘ozi & Kulolchilik' : isRussian ? '🏺 Шёлковая бумага и керамика' : '🏺 Silk Paper & Ceramics'
    },
    {
      id: 'Bazaars',
      label: isUzbek ? '🛍️ Siyob bozori ziravorlar & esdaliklar' : isRussian ? '🛍️ Сиабский базар, специи и сувениры' : '🛍️ Siyob Spices & Souvenirs'
    },
    {
      id: 'Astronomy',
      label: isUzbek ? '🔭 Qadimiy ilm-fan & Rasadxona' : isRussian ? '🔭 Древняя наука и обсерватория Улугбека' : '🔭 Ancient Science & Observatories'
    }
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const plan = await api.planTrip({
        destination,
        days,
        budgetUzs,
        interests: selectedInterests.join(', '),
        language: currentLanguage,
        travelStyle,
        transportation
      });
      setIsGenerating(false);
      onPlanGenerated(plan);
    } catch (err) {
      console.error('Generation error:', err);
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(0, 168, 150, 0.6)',
          marginBottom: '24px',
          animation: 'pulse-radar 2s infinite'
        }}>
          <Bot size={40} color="#070D1E" />
        </div>

        <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '12px' }}>
          {t('generatingTrip')}
        </h2>

        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '15px', lineHeight: 1.6 }}>
          {isUzbek
            ? `${destination} shahridagi ${days} kunlik sayohatingiz uchun ${budgetUzs.toLocaleString()} so‘m byudjetni taqsimlab, tarixiy obidalar va marshrutlar tahlil qilinmoqda.`
            : `Analyzing historical landmark schedules, calculating pedestrian and taxi routes, and distributing your ${budgetUzs.toLocaleString()} UZS budget across ${days} days in ${destination}.`}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-xl)' }}>
        {/* Wizard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
              <Sparkles size={12} /> {t('planTrip')}
            </div>
            <h1 style={{ fontSize: '28px', color: '#fff' }}>{t('buildCustomItinerary')}</h1>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-gold)', fontWeight: 700 }}>
            {t('stepOf')} {step} {t('ofTotal')} 4
          </span>
        </div>

        {/* Step 1: Destination & Duration */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>{t('chooseDestinationDuration')}</h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('cityInUzbekistan')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                {[
                  { name: 'Samarkand', tag: isUzbek ? '🌟 Faol Tur' : '🌟 MVP Live' },
                  { name: 'Bukhara', tag: isUzbek ? '🏛️ Tarixiy' : '🏛️ Historic' },
                  { name: 'Khiva', tag: isUzbek ? '🏰 Ko‘hna Voha' : '🏰 Oasis' },
                  { name: 'Tashkent', tag: isUzbek ? '🏙️ Poytaxt' : '🏙️ Capital' },
                  { name: 'Tashkent Region', tag: isUzbek ? '⛰️ Tog‘lar' : '⛰️ Mountains' },
                  { name: 'Fergana', tag: isUzbek ? '🏺 Hunarmandlar' : '🏺 Crafts' },
                  { name: 'Andijan', tag: isUzbek ? '🌳 Bog‘lar' : '🌳 Gardens' },
                  { name: 'Namangan', tag: isUzbek ? '🌸 Gullar' : '🌸 Flowers' },
                  { name: 'Kashkadarya', tag: isUzbek ? '👑 Temuriylar' : '👑 Timurid' },
                  { name: 'Surkhandarya', tag: isUzbek ? '☀️ Janubiy' : '☀️ Southern' },
                  { name: 'Navoiy', tag: isUzbek ? '🏜️ Sahro & Qizilqum' : '🏜️ Desert' },
                  { name: 'Jizzakh', tag: isUzbek ? '🌲 Zomin Archalari' : '🌲 Zaamin' },
                  { name: 'Syrdarya', tag: isUzbek ? '🌊 Daryo' : '🌊 River' },
                  { name: 'Karakalpakstan', tag: isUzbek ? '🎨 Savitskiy Muzeyi' : '🎨 Savitsky' }
                ].map((item) => {
                  const isSelected = destination === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setDestination(item.name)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? '2px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? 'var(--text-turquoise)' : '#fff', marginBottom: '2px' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '10px', color: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                        {item.tag}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('numberOfDays')}</label>
                <span style={{ fontWeight: 800, color: 'var(--accent-turquoise)' }}>{days} {t('days')}</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-turquoise)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('numberOfTravelers')}
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[1, 2, 3, 4, '5+'].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => setTravelersCount(typeof num === 'number' ? num : 5)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      background: travelersCount === num ? 'var(--accent-gold)' : 'rgba(255,255,255,0.04)',
                      color: travelersCount === num ? '#070D1E' : '#fff',
                      fontWeight: 700,
                      fontSize: '14px'
                    }}
                  >
                    {num} {typeof num === 'number' && num === 1 ? t('soloTraveler') : t('peopleTravelers')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>{t('specifyBudget')}</h3>

            <div style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid var(--border-gold)',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                {t('totalAllocatedBudget')}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#fff', margin: '6px 0' }}>
                {budgetUzs.toLocaleString()} {t('currency')}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {isUzbek ? 'Taqriban' : 'Approx.'} ${Math.round(budgetUzs / 12800)} USD / €{Math.round(budgetUzs / 13900)} EUR
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="100000"
                value={budgetUzs}
                onChange={(e) => setBudgetUzs(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                <span>{isUzbek ? 'Iqtisodiy (500,000 UZS)' : 'Budget (500,000 UZS)'}</span>
                <span>{isUzbek ? 'Standart (1,500,000 UZS)' : 'Standard (1,500,000 UZS)'}</span>
                <span>{isUzbek ? 'Premium (5,000,000 UZS)' : 'Luxury (5,000,000 UZS)'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>{t('mainInterests')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {t('interestsSubtitle')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{opt.label}</span>
                    {isSelected && <Check size={16} color="var(--accent-turquoise)" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Pace & Transit */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px' }}>{t('paceAndTransit')}</h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('preferredTravelStyle')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { id: 'Relaxed', label: t('relaxed') },
                  { id: 'Balanced', label: t('balanced') },
                  { id: 'Fast-Paced', label: t('fastPaced') }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setTravelStyle(st.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: travelStyle === st.id ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255,255,255,0.04)',
                      border: travelStyle === st.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {t('transitPreference')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { id: 'Walking & Scenic', label: t('walkingScenic') },
                  { id: 'Taxi & Yandex Go', label: t('taxiYandex') },
                  { id: 'Private Rental Car', label: t('rentalCar') },
                  { id: 'Public Transit', label: t('publicTransit') }
                ].map((tr) => (
                  <button
                    key={tr.id}
                    onClick={() => setTransportation(tr.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: transportation === tr.id ? 'rgba(0, 168, 150, 0.25)' : 'rgba(255,255,255,0.04)',
                      border: transportation === tr.id ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '13px',
                      textAlign: 'left'
                    }}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn-secondary">
              <ArrowLeft size={16} /> {t('back')}
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary">
              {t('nextStep')} <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleGenerate} className="btn-gold" style={{ padding: '14px 32px' }}>
              <Sparkles size={18} /> {t('generateTripItinerary')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
