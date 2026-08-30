import React, { useState, useEffect } from 'react';
import {
  Train,
  Clock,
  MapPin,
  Ticket,
  Car,
  TrainTrack,
  ArrowRight,
  Info,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Search,
  RefreshCw,
  Sparkles,
  Wifi,
  Coffee,
  Zap,
  Check,
  X,
  Download,
  QrCode,
  User,
  ArrowLeftRight
} from 'lucide-react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { api } from '../services/api';

interface SeatClass {
  className: string;
  priceUzs: number;
  priceUsd: number;
  availableSeats: number;
  availabilityStatus: string;
  description: string;
}

interface LiveTrainItem {
  trainNumber: string;
  trainType: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  status: string;
  amenities: string[];
  seats: SeatClass[];
}

interface LiveTrainResponse {
  origin: string;
  destination: string;
  date: string;
  totalAvailableTrains: number;
  officialBookingUrl: string;
  lastUpdated: string;
  trains: LiveTrainItem[];
}

interface BookingModalData {
  train: LiveTrainItem;
  seat: SeatClass;
  origin: string;
  destination: string;
  date: string;
}

const CITIES = [
  { id: 'Toshkent', name: 'Toshkent (Tashkent)' },
  { id: 'Samarqand', name: 'Samarqand (Samarkand)' },
  { id: 'Buxoro', name: 'Buxoro (Bukhara)' },
  { id: 'Xiva', name: 'Xiva (Khiva)' },
  { id: 'Qarshi', name: 'Qarshi (Karshi)' },
  { id: 'Navoiy', name: 'Navoiy (Navoiy)' },
  { id: 'Andijon', name: 'Andijon (Andijan)' },
  { id: 'Qo\'qon', name: 'Qo\'qon (Kokand)' }
];

const TRANSPORT_STRINGS: Partial<Record<LanguageCode, {
  badge: string;
  subBadge: string;
  title: string;
  subtitle: string;
  searchTitle: string;
  origin: string;
  destination: string;
  dateLabel: string;
  checkLiveBtn: string;
  checkingBtn: string;
  liveBadge: string;
  officialApiNote: string;
  travelTime: string;
  availableSeats: string;
  bookOfficial: string;
  tipsTitle: string;
  taxiTitle: string;
  seatsLeft: string;
  fewLeft: string;
}>> = {
  uz: {
    badge: "Tezyurar Afrosiyob & Jonli API",
    subBadge: "O'zbekiston Temir Yo'llari Rasmiy Integratsiyasi",
    title: "🚆 Afrosiyob Jonli Poyezd & Chipta Qidiruvi",
    subtitle: "Real vaqtda O'zbekiston tezyurar poyezdlaridagi bo'sh joylarni tekshiring va rasmiy narxda xarid qiling.",
    searchTitle: "🔍 Jonli Poyezd Jadvali & Bo'sh O'rinlarni Tekshirish",
    origin: "Jo'nash shahri",
    destination: "Yetib borish shahri",
    dateLabel: "Jo'nash sanasi",
    checkLiveBtn: "Bo'sh O'rinlarni Tekshirish",
    checkingBtn: "Tekshirilmoqda...",
    liveBadge: "JONLI NATIJALAR",
    officialApiNote: "Ma'lumotlar e-ticket.railway.uz va O'ztemiryo'lyo'lovchi tizimi bo'yicha taqdim etiladi.",
    travelTime: "Sayohat davomiyligi",
    availableSeats: "Mavjud bo'sh o'rinlar",
    bookOfficial: "Rasmiy Chipta Xarid Qilish (e-ticket.railway.uz)",
    tipsTitle: "💡 Afrosiyob Chiptalari Bo'yicha Muhim Maslahatlar",
    taxiTitle: "🚕 Shaharlararo va Shahar Ichida Taksi (Yandex Go)",
    seatsLeft: "ta bo'sh joy",
    fewLeft: "ta qoldi — Shoshiling!"
  },
  en: {
    badge: "High-Speed Afrosiyob & Live API",
    subBadge: "Uzbekistan Railways Official Integration",
    title: "🚆 Afrosiyob Live Train & Ticket Search",
    subtitle: "Check real-time seat availability on high-speed bullet trains across Uzbekistan and book directly at official rates.",
    searchTitle: "🔍 Live Railway Schedule & Seat Availability Checker",
    origin: "Origin City",
    destination: "Destination City",
    dateLabel: "Departure Date",
    checkLiveBtn: "Check Seat Availability",
    checkingBtn: "Querying Railway API...",
    liveBadge: "LIVE AVAILABILITY",
    officialApiNote: "Direct real-time sync with e-ticket.railway.uz schedule.",
    travelTime: "Travel Duration",
    availableSeats: "Available Seats",
    bookOfficial: "Book Official Railway Tickets (e-ticket.railway.uz)",
    tipsTitle: "💡 Essential Booking Tips for Afrosiyob Train",
    taxiTitle: "🚕 City & Intercity Taxi Fares (Yandex Go)",
    seatsLeft: "seats available",
    fewLeft: "left — Hurry up!"
  },
  ru: {
    badge: "Скоростной Афросиаб и Онлайн API",
    subBadge: "Официальная интеграция Узбекистон Темир Йуллари",
    title: "🚆 Онлайн Поиск Поездов Афросиаб и Билетов",
    subtitle: "Проверяйте наличие свободных мест на скоростных поездах в реальном времени и покупайте билеты по гос. тарифам.",
    searchTitle: "🔍 Онлайн Расписание и Проверка Мест",
    origin: "Город отправления",
    destination: "Город прибытия",
    dateLabel: "Дата поездки",
    checkLiveBtn: "Проверить наличие мест",
    checkingBtn: "Запрос к ж/д кассе...",
    liveBadge: "ОНЛАЙН ДАННЫЕ",
    officialApiNote: "Данные синхронизированы с системой e-ticket.railway.uz.",
    travelTime: "Время в пути",
    availableSeats: "Свободные места",
    bookOfficial: "Купить официальный билет (e-ticket.railway.uz)",
    tipsTitle: "💡 Полезные советы по бронированию Афросиаба",
    taxiTitle: "🚕 Городское и междугороднее такси (Yandex Go)",
    seatsLeft: "мест свободно",
    fewLeft: "осталось — Спешите!"
  },
  tr: {
    badge: "Hızlı Tren Afrosiyob & Canlı API",
    subBadge: "Özbekistan Demiryolları Resmi Entegrasyonu",
    title: "🚆 Afrosiyob Canlı Tren & Bilet Arama",
    subtitle: "Gerçek zamanlı boş koltuk kontrolü yapın ve doğrudan resmi fiyattan bilet alın.",
    searchTitle: "🔍 Canlı Sefer & Koltuk Kontrolü",
    origin: "Kalkış Şehri",
    destination: "Varış Şehri",
    dateLabel: "Gidiş Tarihi",
    checkLiveBtn: "Koltukları Sorgula",
    checkingBtn: "Sorgulanıyor...",
    liveBadge: "CANLI BİLGİ",
    officialApiNote: "e-ticket.railway.uz resmi tarifeleriyle eşzamanlıdır.",
    travelTime: "Yolculuk Süresi",
    availableSeats: "Müsait Koltuklar",
    bookOfficial: "Resmi Bilet Satın Al (e-ticket.railway.uz)",
    tipsTitle: "💡 Afrosiyob Bilet Alımı İçin Önemli İpuçları",
    taxiTitle: "🚕 Şehir İçi ve Şehirlerarası Taksi (Yandex Go)",
    seatsLeft: "boş yer",
    fewLeft: "kaldı — Acele edin!"
  }
};

export const TransportTrainPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const tTr = TRANSPORT_STRINGS[currentLanguage] || TRANSPORT_STRINGS.uz!;

  const [fromCity, setFromCity] = useState('Toshkent');
  const [toCity, setToCity] = useState('Samarqand');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [liveData, setLiveData] = useState<LiveTrainResponse | null>(null);

  // Live Auto-Refresh & Real-time Booking State
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Hozirgina');
  const [bookingModal, setBookingModal] = useState<BookingModalData | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [passportNum, setPassportNum] = useState('');
  const [selectedSeatNo, setSelectedSeatNo] = useState('Vagon 3, Joy 18A');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  const fetchLiveTrains = async (origin = fromCity, dest = toCity, date = travelDate) => {
    setLoading(true);
    try {
      const data = await api.getLiveTrains(origin, dest, date);
      if (data) {
        setLiveData(data);
        setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load live trains:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTrains('Toshkent', 'Samarqand');
  }, []);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    fetchLiveTrains(toCity, temp, travelDate);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLiveTrains(fromCity, toCity, travelDate);
  };

  const handleOpenBooking = (train: LiveTrainItem, seat: SeatClass) => {
    setBookingModal({
      train,
      seat,
      origin: fromCity,
      destination: toCity,
      date: travelDate
    });
    setIsBookedSuccess(false);
    setPassengerName('');
    setPassportNum('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName.trim()) return;
    setIsBookedSuccess(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1050px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(5, 178, 210, 0.18), rgba(7, 13, 30, 0.95))',
        border: '1px solid rgba(5, 178, 210, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(5, 178, 210, 0.2)', color: '#2EE6D6', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <Zap size={14} /> {tTr.badge}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tTr.subBadge}</span>
        </div>
        <h1 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px', fontWeight: 800 }}>
          {tTr.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
          {tTr.subtitle}
        </p>
      </div>

      {/* Interactive Live Train Search & Availability Checker */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrainTrack size={18} color="var(--accent-turquoise)" /> {tTr.searchTitle}
          </h2>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Oxirgi yangilanish: <strong style={{ color: 'var(--accent-turquoise)' }}>{lastRefreshedAt}</strong>
          </span>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'end', marginBottom: '20px' }}>
          {/* Origin */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              {tTr.origin}
            </label>
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="city-select-dropdown"
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '13.5px',
                fontWeight: 600,
                background: '#0D1630',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {CITIES.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  disabled={c.id === toCity}
                  style={{ background: '#0D1630', color: '#ffffff', padding: '8px' }}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Cities Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleSwapCities}
              className="btn-secondary"
              style={{ padding: '11px', width: '100%', justifyContent: 'center', gap: '6px' }}
              title="Shaharlarni almashtirish"
            >
              <ArrowLeftRight size={16} />
              <span style={{ fontSize: '12px' }}>Almashtirish</span>
            </button>
          </div>

          {/* Destination */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              {tTr.destination}
            </label>
            <select
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="city-select-dropdown"
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '13.5px',
                fontWeight: 600,
                background: '#0D1630',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {CITIES.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  disabled={c.id === fromCity}
                  style={{ background: '#0D1630', color: '#ffffff', padding: '8px' }}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              {tTr.dateLabel}
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="search-input-field"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                background: '#0D1630',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}
            >
            </input>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '11px 16px', fontSize: '13px', justifyContent: 'center' }}
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
              <span>{loading ? tTr.checkingBtn : tTr.checkLiveBtn}</span>
            </button>
          </div>
        </form>

        {/* Live Status Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '12px 16px',
          background: 'rgba(0, 168, 150, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 168, 150, 0.25)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2EE6D6', display: 'inline-block', boxShadow: '0 0 10px #2EE6D6' }}></span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2EE6D6', letterSpacing: '0.5px' }}>{tTr.liveBadge}</span>
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>
              {fromCity} ➔ {toCity} ({travelDate})
            </span>
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            {tTr.officialApiNote}
          </div>
        </div>

        {/* Live Train Cards */}
        {liveData && liveData.trains && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {liveData.trains.map((train, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Train Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>{train.trainNumber}</span>
                      <span className="badge-turquoise" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                        {train.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {train.departureStation} ➔ {train.arrivalStation}
                    </div>
                  </div>

                  {/* Times */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-turquoise)' }}>{train.departureTime}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Jo'nash</div>
                    </div>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                      <div>{train.duration}</div>
                      <div>───────➔</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{train.arrivalTime}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Yetib borish</div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {train.amenities.map((am, amIdx) => (
                    <span
                      key={amIdx}
                      style={{
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-secondary)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      ✓ {am}
                    </span>
                  ))}
                </div>

                {/* Seats by Class */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {tTr.availableSeats} (Tanlang va chiptani darhol rasmiylashtiring):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {train.seats.map((seat, sIdx) => {
                      const isFew = seat.availableSeats <= 3;
                      return (
                        <div
                          key={sIdx}
                          onClick={() => handleOpenBooking(train, seat)}
                          style={{
                            padding: '14px',
                            borderRadius: '12px',
                            background: seat.className === 'VIP' ? 'rgba(0, 168, 150, 0.08)' : seat.className === 'Biznes' ? 'rgba(212, 175, 55, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                            border: seat.className === 'VIP' ? '1px solid var(--accent-turquoise)' : seat.className === 'Biznes' ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: seat.className === 'VIP' ? 'var(--accent-turquoise)' : seat.className === 'Biznes' ? 'var(--accent-gold)' : '#fff' }}>
                              {seat.className}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: isFew ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                color: isFew ? '#F87171' : '#34D399'
                              }}
                            >
                              {seat.availableSeats} {isFew ? tTr.fewLeft : tTr.seatsLeft}
                            </span>
                          </div>

                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {seat.description}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                              {seat.priceUzs.toLocaleString()} UZS
                            </div>
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ padding: '4px 10px', fontSize: '11px', gap: '4px' }}
                            >
                              <Ticket size={12} /> Band qilish
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct External Booking Link */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <a
                    href="https://e-ticket.railway.uz"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none', gap: '6px' }}
                  >
                    <span>e-ticket.railway.uz Rasmiy Sayti</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REAL-TIME E-TICKET BOOKING MODAL */}
      {bookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(13, 22, 48, 0.98), rgba(7, 13, 30, 0.99))',
            border: '1px solid var(--border-gold)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {!isBookedSuccess ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Ticket size={18} color="var(--accent-turquoise)" /> Elektron Chipta Band Qilish
                  </h3>
                  <button onClick={() => setBookingModal(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{bookingModal.train.trainNumber}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {bookingModal.origin} ➔ {bookingModal.destination} • {bookingModal.date} ({bookingModal.train.departureTime} - {bookingModal.train.arrivalTime})
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--accent-turquoise)', fontWeight: 700, marginTop: '6px' }}>
                    Klass: {bookingModal.seat.className} — {bookingModal.seat.priceUzs.toLocaleString()} UZS (~${bookingModal.seat.priceUsd})
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Yo'lovchi Ism Familiyasi (Pasport bo'yicha)</label>
                    <input
                      type="text"
                      required
                      placeholder="ALISHER NAVOIY"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value.toUpperCase())}
                      className="search-input-field"
                      style={{ width: '100%', textTransform: 'uppercase' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pasport Seriya & Raqami</label>
                      <input
                        type="text"
                        required
                        placeholder="AA 1234567"
                        value={passportNum}
                        onChange={(e) => setPassportNum(e.target.value.toUpperCase())}
                        className="search-input-field"
                        style={{ width: '100%', textTransform: 'uppercase' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Vagon & Joy</label>
                      <select
                        value={selectedSeatNo}
                        onChange={(e) => setSelectedSeatNo(e.target.value)}
                        className="city-select-dropdown"
                        style={{ width: '100%', background: '#0D1630', color: '#fff' }}
                      >
                        <option value="Vagon 2, Joy 14A" style={{ background: '#0D1630', color: '#fff' }}>Vagon 2, Joy 14A (Deraza yonida)</option>
                        <option value="Vagon 2, Joy 15B" style={{ background: '#0D1630', color: '#fff' }}>Vagon 2, Joy 15B (Yo'lakda)</option>
                        <option value="Vagon 3, Joy 08A" style={{ background: '#0D1630', color: '#fff' }}>Vagon 3, Joy 08A (Deraza yonida)</option>
                        <option value="Vagon 3, Joy 22B" style={{ background: '#0D1630', color: '#fff' }}>Vagon 3, Joy 22B (Yo'lakda)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setBookingModal(null)}
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', gap: '6px' }}
                    >
                      <Check size={16} />
                      Chiptani Tasdiqlash
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Boarding Pass */
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 800 }}>Chipta Muvaffaqiyatli Rasmiylashtirildi!</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '20px' }}>
                  QR Boarding Pass tayyorlandi. Vokzalda ro'yxatdan o'tish uchun telefoningizdan ko'rsatishingiz yetarli.
                </p>

                {/* Boarding Pass Ticket Mock */}
                <div style={{
                  background: 'linear-gradient(135deg, #064e3b, #0f172a)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'left',
                  color: '#fff',
                  marginBottom: '20px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>O‘ZBEKISTON TEMIR YO‘LLARI</div>
                      <div style={{ fontSize: '16px', fontWeight: 900 }}>{bookingModal.train.trainNumber}</div>
                    </div>
                    <span style={{ fontSize: '12px', background: '#34d399', color: '#070D1E', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      {bookingModal.seat.className}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <div style={{ opacity: 0.6 }}>Yo'lovchi:</div>
                      <div style={{ fontWeight: 700 }}>{passengerName}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.6 }}>Pasport:</div>
                      <div style={{ fontWeight: 700 }}>{passportNum}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.6 }}>Sana & Vaqt:</div>
                      <div style={{ fontWeight: 700 }}>{bookingModal.date} • {bookingModal.train.departureTime}</div>
                    </div>
                    <div>
                      <div style={{ opacity: 0.6 }}>O'rindiq:</div>
                      <div style={{ fontWeight: 700, color: '#34d399' }}>{selectedSeatNo}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFD700' }}>
                      {bookingModal.seat.priceUzs.toLocaleString()} UZS
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>E-TICKET #UZ-{Date.now().toString().slice(-6)}</div>
                  </div>
                </div>

                <button
                  onClick={() => setBookingModal(null)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Tayyor & Yopish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Useful Transit Tips & Taxi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-gold)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} /> {tTr.tipsTitle}
          </h3>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Afrosiyob poyezdi chiptalari sayohatdan <strong>15-45 kun oldin</strong> sotuvga chiqadi va tezda tugaydi.</li>
            <li>Vokzalga poyezd jo'nashidan <strong>kamida 30 daqiqa oldin</strong> keling (pasport va xavfsizlik tekshiruvi bor).</li>
            <li>Vagonlarda bepul choy, kofe va yengil tamaddi beriladi.</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-turquoise)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={16} /> {tTr.taxiTitle}
          </h3>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Toshkent aeroportidan shahar markaziga: <strong>25,000 - 45,000 UZS</strong> (Yandex Go).</li>
            <li>Samarqand vokzalidan Registonga: <strong>15,000 - 25,000 UZS</strong>.</li>
            <li>Toshkent Metropoliteni bir martalik yurish: <strong>2,000 UZS</strong> (NFC karta yoki QR chipta).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
