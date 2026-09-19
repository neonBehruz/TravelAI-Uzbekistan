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
  { id: 'Urganch', name: 'Urganch (Urgench)' },
  { id: 'Qo\'qon', name: 'Qo\'qon (Kokand)' },
  { id: 'Namangan', name: 'Namangan (Namangan)' },
  { id: 'Andijon', name: 'Andijon (Andijan)' },
  { id: 'Marg\'ilon', name: 'Marg\'ilon (Margilan)' },
  { id: 'Qarshi', name: 'Qarshi (Karshi)' },
  { id: 'Sirdaryo', name: 'Sirdaryo (Syrdarya)' },
  { id: 'Guliston', name: 'Guliston (Gulistan)' },
  { id: 'Xovos', name: 'Xovos (Khavast)' },
  { id: 'Bekobod', name: 'Bekobod (Bekabad)' },
  { id: 'Urgut', name: 'Urgut (Urgut)' },
  { id: 'Jizzax', name: 'Jizzax (Jizzakh)' },
  { id: 'Navoiy', name: 'Navoiy (Navoi)' },
  { id: 'Termiz', name: 'Termiz (Termez)' },
  { id: 'Nukus', name: 'Nukus (Nukus)' }
];

const POPULAR_ROUTES = [
  { from: 'Toshkent', to: 'Sirdaryo', label: 'Toshkent ➔ Sirdaryo', tag: '⚡ 12 000 UZS', type: 'electric' },
  { from: 'Toshkent', to: 'Bekobod', label: 'Toshkent ➔ Bekobod', tag: '⚡ 15 000 UZS', type: 'electric' },
  { from: 'Qo\'qon', to: 'Namangan', label: "Qo'qon ➔ Namangan", tag: '⚡ 20 000 UZS', type: 'electric' },
  { from: 'Urganch', to: 'Xiva', label: 'Urganch ➔ Xiva', tag: '⚡ 25 000 UZS', type: 'electric' },
  { from: 'Urgut', to: 'Samarqand', label: 'Urgut ➔ Samarqand', tag: '⚡ 10 000 UZS', type: 'electric' },
  { from: 'Nukus', to: 'Urganch', label: 'Nukus ➔ Urganch', tag: '⚡ 25 000 UZS', type: 'electric' },
  { from: 'Toshkent', to: 'Samarqand', label: 'Toshkent ➔ Samarqand', tag: '🚄 Afrosiyob', type: 'bullet' },
  { from: 'Samarqand', to: 'Buxoro', label: 'Samarqand ➔ Buxoro', tag: '🚄 Afrosiyob', type: 'bullet' },
  { from: 'Toshkent', to: 'Qarshi', label: 'Toshkent ➔ Qarshi', tag: '🚄 Afrosiyob', type: 'bullet' }
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
  transportsFinished: string;
  transportsFinishedDesc: string;
  noTransportBadge: string;
  checkElektropoyezd: string;
  checkTomorrow: string;
  transitTip: string;
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
    officialApiNote: "Ma'lumotlar ticket.elektropoyezd.uz va O'zbekiston Temir Yo'llari tizimi bo'yicha taqdim etiladi.",
    travelTime: "Sayohat davomiyligi",
    availableSeats: "Mavjud bo'sh o'rinlar",
    bookOfficial: "Rasmiy Chipta Xarid Qilish (ticket.elektropoyezd.uz)",
    tipsTitle: "💡 Afrosiyob Chiptalari Bo'yicha Muhim Maslahatlar",
    taxiTitle: "🚕 Shaharlararo va Shahar Ichida Taksi (Yandex Go)",
    seatsLeft: "ta bo'sh joy",
    fewLeft: "ta qoldi — Shoshiling!",
    transportsFinished: "Transportlar tugadi",
    transportsFinishedDesc: "Tanlangan sana bo'yicha ushbu yo'nalishda barcha transportlar va chiptalar tugagan yoki to'g'ridan-to'g'ri poyezd qatnovi mavjud emas.",
    noTransportBadge: "Chiptalar tugagan / Qatnov yo'q",
    checkElektropoyezd: "ticket.elektropoyezd.uz dan tekshirish",
    checkTomorrow: "Ertangi kunga tekshirish",
    transitTip: "💡 Maslahat: Toshkent yoki Samarqand orqali tranzit marshrutlarni tanlab ko'ring."
  },
  en: {
    badge: "High-Speed Afrosiyob & Live API",
    subBadge: "Uzbekistan Railways Official Integration",
    title: "🚆 Afrosiyob Live Train & Ticket Search",
    subtitle: "Check real-time seat availability on high-speed bullet trains across Uzbekistan and book directly at official rates via ticket.elektropoyezd.uz.",
    searchTitle: "🔍 Live Railway Schedule & Seat Availability Checker",
    origin: "Origin City",
    destination: "Destination City",
    dateLabel: "Departure Date",
    checkLiveBtn: "Check Seat Availability",
    checkingBtn: "Querying Railway API...",
    liveBadge: "LIVE AVAILABILITY",
    officialApiNote: "Direct real-time sync with ticket.elektropoyezd.uz schedule.",
    travelTime: "Travel Duration",
    availableSeats: "Available Seats",
    bookOfficial: "Book Official Railway Tickets (ticket.elektropoyezd.uz)",
    tipsTitle: "💡 Essential Booking Tips for Afrosiyob Train",
    taxiTitle: "🚕 City & Intercity Taxi Fares (Yandex Go)",
    seatsLeft: "seats available",
    fewLeft: "left — Hurry up!",
    transportsFinished: "All Transports Sold Out",
    transportsFinishedDesc: "All tickets and direct transports are sold out for this route on the selected date, or no direct train operates between these cities.",
    noTransportBadge: "Sold Out / No Direct Service",
    checkElektropoyezd: "Check on ticket.elektropoyezd.uz",
    checkTomorrow: "Check for Tomorrow",
    transitTip: "💡 Tip: Try searching for transit routes via Tashkent or Samarkand."
  },
  ru: {
    badge: "Скоростной Афросиаб и Онлайн API",
    subBadge: "Официальная интеграция Узбекистон Темир Йуллари",
    title: "🚆 Онлайн Поиск Поездов Афросиаб и Билетов",
    subtitle: "Проверяйте наличие свободных мест на скоростных поездах в реальном времени и покупайте билеты на ticket.elektropoyezd.uz.",
    searchTitle: "🔍 Онлайн Расписание и Проверка Мест",
    origin: "Город отправления",
    destination: "Город прибытия",
    dateLabel: "Дата поездки",
    checkLiveBtn: "Проверить наличие мест",
    checkingBtn: "Запрос к ж/д кассе...",
    liveBadge: "ОНЛАЙН ДАННЫЕ",
    officialApiNote: "Данные синхронизированы с системой ticket.elektropoyezd.uz.",
    travelTime: "Время в пути",
    availableSeats: "Свободные места",
    bookOfficial: "Купить официальный билет (ticket.elektropoyezd.uz)",
    tipsTitle: "💡 Полезные советы по бронированию Афросиаба",
    taxiTitle: "🚕 Городское и междугороднее такси (Yandex Go)",
    seatsLeft: "мест свободно",
    fewLeft: "осталось — Спешите!",
    transportsFinished: "Рейсы закончились",
    transportsFinishedDesc: "На выбранную дату билеты и рейсы по данному направлению закончились, либо прямой скоростной поезд отсутствует.",
    noTransportBadge: "Мест нет / Нет прямого рейса",
    checkElektropoyezd: "Проверить на ticket.elektropoyezd.uz",
    checkTomorrow: "Проверить на завтра",
    transitTip: "💡 Совет: Попробуйте найти маршрут с пересадкой в Ташкенте или Самарканде."
  },
  tr: {
    badge: "Hızlı Tren Afrosiyob & Canlı API",
    subBadge: "Özbekistan Demiryolları Resmi Entegrasyonu",
    title: "🚆 Afrosiyob Canlı Tren & Bilet Arama",
    subtitle: "Gerçek zamanlı boş koltuk kontrolü yapın ve ticket.elektropoyezd.uz üzerinden doğrudan resmi fiyattan bilet alın.",
    searchTitle: "🔍 Canlı Sefer & Koltuk Kontrolü",
    origin: "Kalkış Şehri",
    destination: "Varış Şehri",
    dateLabel: "Gidiş Tarihi",
    checkLiveBtn: "Koltukları Sorgula",
    checkingBtn: "Sorgulanıyor...",
    liveBadge: "CANLI BİLGİ",
    officialApiNote: "ticket.elektropoyezd.uz resmi tarifeleriyle eşzamanlıdır.",
    travelTime: "Yolculuk Süresi",
    availableSeats: "Müsait Koltuklar",
    bookOfficial: "Resmi Bilet Satın Al (ticket.elektropoyezd.uz)",
    tipsTitle: "💡 Afrosiyob Bilet Alımı İçin Önemli İpuçları",
    taxiTitle: "🚕 Şehir İçi ve Şehirlerarası Taksi (Yandex Go)",
    seatsLeft: "boş yer",
    fewLeft: "kaldı — Acele edin!",
    transportsFinished: "Ulaşım Tükendi",
    transportsFinishedDesc: "Seçilen tarihte bu güzergah için tüm bilet ve seferler tükenmiştir veya doğrudan tren seferi bulunmamaktadır.",
    noTransportBadge: "Biletler Tükendi / Sefer Yok",
    checkElektropoyezd: "ticket.elektropoyezd.uz üzerinden sorgula",
    checkTomorrow: "Yarın için sorgula",
    transitTip: "💡 İpucu: Taşkent veya Semerkant aktarmalı güzergahları deneyin."
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

  const [allElektropoyezdRoutes, setAllElektropoyezdRoutes] = useState<any[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

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
    const loadRoutes = async () => {
      setLoadingRoutes(true);
      try {
        const res = await api.getElektropoyezdRoutes();
        if (Array.isArray(res)) {
          setAllElektropoyezdRoutes(res);
        }
      } catch (err) {
        console.error('Failed to load elektropoyezd routes:', err);
      } finally {
        setLoadingRoutes(false);
      }
    };
    loadRoutes();
  }, []);

  const selectQuickRoute = (origin: string, dest: string) => {
    setFromCity(origin);
    setToCity(dest);
    fetchLiveTrains(origin, dest, travelDate);
  };

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    fetchLiveTrains(toCity, temp, travelDate);
  };

  const handleNextDaySearch = () => {
    const current = new Date(travelDate);
    current.setDate(current.getDate() + 1);
    const nextDateStr = current.toISOString().split('T')[0];
    setTravelDate(nextDateStr);
    fetchLiveTrains(fromCity, toCity, nextDateStr);
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

        {/* Popular / Live Elektropoyezd Routes Quick Pills */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--accent-turquoise)" /> Tezkor yo'nalishlar (ticket.elektropoyezd.uz va Tezyurar):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {POPULAR_ROUTES.map((route, rIdx) => {
              const isActive = fromCity === route.from && toCity === route.to;
              return (
                <button
                  key={rIdx}
                  type="button"
                  onClick={() => selectQuickRoute(route.from, route.to)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(5, 178, 210, 0.3), rgba(29, 78, 216, 0.4))'
                      : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#2EE6D6' : '#E2E8F0',
                    border: isActive
                      ? '1px solid var(--accent-turquoise)'
                      : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{route.label}</span>
                  <span style={{
                    fontSize: '10.5px',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    background: route.type === 'electric' ? 'rgba(0, 168, 150, 0.25)' : 'rgba(212, 175, 55, 0.2)',
                    color: route.type === 'electric' ? '#2EE6D6' : '#FCD34D'
                  }}>
                    {route.tag}
                  </span>
                </button>
              );
            })}
          </div>
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

        {/* Official ticket.elektropoyezd.uz Integration Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 18px',
          background: 'linear-gradient(90deg, rgba(29, 78, 216, 0.2), rgba(0, 168, 150, 0.12))',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1d4ed8, #00A896)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Ticket size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff' }}>
                ticket.elektropoyezd.uz — Rasmiy elektron poyezd chiptasi portali
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                O'zbekiston bo'ylab elektropoyezd va tezyurar qatnovlar chiptalari real vaqt rejimida
              </div>
            </div>
          </div>

          <a
            href="https://ticket.elektropoyezd.uz/"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '12.5px',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #1d4ed8, #05B2D2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(29, 78, 216, 0.4)'
            }}
          >
            <span>ticket.elektropoyezd.uz da ochish</span>
            <ExternalLink size={14} />
          </a>
        </div>

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

        {/* Live Train Cards or Sold Out Empty State */}
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            gap: '12px'
          }}>
            <RefreshCw className="animate-spin" size={24} color="var(--accent-turquoise)" />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {tTr.checkingBtn}
            </span>
          </div>
        ) : liveData && liveData.trains && liveData.trains.length > 0 ? (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>{train.trainNumber}</span>
                      {train.trainType === 'ElectricTrain' ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(0, 168, 150, 0.2)',
                          color: '#2EE6D6',
                          border: '1px solid rgba(0, 168, 150, 0.45)',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px'
                        }}>
                          <Zap size={13} /> ticket.elektropoyezd.uz Rasmiy Reysi
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#93C5FD',
                          border: '1px solid rgba(59, 130, 246, 0.45)',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px'
                        }}>
                          <Train size={13} /> Tezyurar Afrosiyob
                        </span>
                      )}
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
                              onClick={() => handleOpenBooking(train, seat)}
                              className="btn-primary"
                              style={{ padding: '5px 12px', fontSize: '11.5px', gap: '4px', cursor: 'pointer' }}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px', gap: '10px' }}>
                  <a
                    href="https://ticket.elektropoyezd.uz"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                      textDecoration: 'none',
                      gap: '6px',
                      color: '#60A5FA',
                      borderColor: 'rgba(96, 165, 250, 0.3)'
                    }}
                  >
                    <span>ticket.elektropoyezd.uz Rasmiy Sayti</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* "Transportlar tugadi" Sold-Out / No Transport State */
          <div
            style={{
              background: 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.12), rgba(13, 22, 48, 0.95))',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '20px',
              padding: '40px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(239, 68, 68, 0.08)'
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F87171',
                boxShadow: '0 0 24px rgba(239, 68, 68, 0.25)'
              }}
            >
              <Train size={34} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                borderRadius: '30px',
                padding: '4px 14px'
              }}
            >
              <X size={14} color="#F87171" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#FCA5A5', letterSpacing: '0.5px' }}>
                {tTr.noTransportBadge}
              </span>
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px', margin: 0 }}>
              {tTr.transportsFinished}
            </h3>

            <p style={{ maxWidth: '580px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {fromCity} ➔ {toCity} yo'nalishida ({travelDate} sanasida) to'g'ridan-to'g'ri poyezd qatnovi mavjud emas yoki ushbu sana bo'yicha barcha chiptalar va transportlar tugagan.
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
              <a
                href="https://ticket.elektropoyezd.uz"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{
                  padding: '11px 22px',
                  fontSize: '13px',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #1d4ed8, #00A896)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(29, 78, 216, 0.4)'
                }}
              >
                <ExternalLink size={15} />
                <span>{tTr.checkElektropoyezd}</span>
              </a>

              <button
                type="button"
                onClick={handleNextDaySearch}
                className="btn-secondary"
                style={{
                  padding: '11px 20px',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#34D399',
                  borderColor: 'rgba(52, 211, 153, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <Calendar size={15} />
                <span>{tTr.checkTomorrow}</span>
              </button>

              <button
                type="button"
                onClick={handleSwapCities}
                className="btn-secondary"
                style={{
                  padding: '11px 20px',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#93C5FD',
                  borderColor: 'rgba(147, 197, 253, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeftRight size={15} />
                <span>Almashtirish</span>
              </button>
            </div>

            <div style={{
              fontSize: '12.5px',
              color: 'var(--text-muted)',
              marginTop: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '8px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              {tTr.transitTip}
            </div>
          </div>
        )}
      </div>

      {/* ELEKTROPOYEZD REGIONAL DIRECTORY / ROUTE CATALOG */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 168, 150, 0.2)', color: '#2EE6D6', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 800, marginBottom: '6px' }}>
              <Zap size={13} /> ticket.elektropoyezd.uz Rasmiy Portali
            </div>
            <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚡ O'zbekiston Elektropoyezd Yo'nalishlari Katalogi
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Hududlararo tezyurar va shahar atrofi elektropoyezdlarining jonli yo'nalishlari va rasmiy tariflari
            </p>
          </div>

          <a
            href="https://ticket.elektropoyezd.uz"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '12px', textDecoration: 'none', gap: '6px', color: '#60A5FA' }}
          >
            <span>ticket.elektropoyezd.uz saytiga o'tish</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {loadingRoutes ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', gap: '10px', color: 'var(--text-secondary)' }}>
            <RefreshCw className="animate-spin" size={18} color="var(--accent-turquoise)" />
            <span style={{ fontSize: '13px' }}>Elektropoyezd yo'nalishlari yuklanmoqda...</span>
          </div>
        ) : allElektropoyezdRoutes.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {allElektropoyezdRoutes.flatMap(reg => 
              (reg.routes || []).map((r: any) => ({ ...r, regionName: reg.region?.name || reg.name || "O'zbekiston" }))
            ).slice(0, 8).map((r: any, rKey: number) => {
              const origCity = r.origin_station?.name || "Boshlang'ich";
              const destCity = r.destination_station?.name || "Oxirgi";
              return (
                <div
                  key={rKey}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '10.5px', background: 'rgba(5, 178, 210, 0.15)', color: '#2EE6D6', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {r.regionName}
                      </span>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff', margin: '6px 0 2px 0' }}>
                        {r.name}
                      </h4>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {origCity} ➔ {destCity}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#2EE6D6' }}>
                        {Number(r.adult_price || 12000).toLocaleString()} UZS
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Bolalar: {Number(r.child_price || 7500).toLocaleString()} UZS
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Reyslar: <strong>{r.trains_count || (r.trains ? r.trains.length : 1)} ta poyezd</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const matchedFrom = CITIES.find(c => origCity.toLowerCase().includes(c.id.toLowerCase()))?.id || 'Toshkent';
                        const matchedTo = CITIES.find(c => destCity.toLowerCase().includes(c.id.toLowerCase()))?.id || 'Sirdaryo';
                        selectQuickRoute(matchedFrom, matchedTo);
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }}
                      className="btn-primary"
                      style={{ padding: '5px 12px', fontSize: '11px', gap: '4px' }}
                    >
                      <Search size={11} /> Qatnovlarni ko'rish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
            Yo'nalishlar ma'lumotlari ticket.elektropoyezd.uz orqali to'g'ridan-to'g'ri yangilanmoqda.
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
                      Chiptani Rasmiylashtirish
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <a
                      href="https://ticket.elektropoyezd.uz"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#60A5FA',
                        textDecoration: 'none'
                      }}
                    >
                      <span>ticket.elektropoyezd.uz rasmiy portalidan sotib olish</span>
                      <ExternalLink size={13} />
                    </a>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href="https://ticket.elektropoyezd.uz"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      color: '#60A5FA',
                      borderColor: 'rgba(96, 165, 250, 0.3)',
                      gap: '6px'
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>ticket.elektropoyezd.uz da tekshirish</span>
                  </a>
                  <button
                    onClick={() => setBookingModal(null)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Tayyor & Yopish
                  </button>
                </div>
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
