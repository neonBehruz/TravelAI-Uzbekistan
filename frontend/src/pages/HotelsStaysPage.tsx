import React, { useState, useMemo } from 'react';
import {
  Hotel,
  MapPin,
  Star,
  Sparkles,
  Wifi,
  Coffee,
  Car,
  Compass,
  Check,
  Phone,
  ExternalLink,
  Calendar,
  Users,
  Search,
  Filter,
  ShieldCheck,
  Award,
  X,
  CreditCard,
  Zap,
  Activity,
  BedDouble,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

export interface HotelStay {
  id: string;
  name: string;
  category: 'boutique' | 'luxury' | 'budget' | 'resort';
  city: string;
  region: string;
  address: string;
  distanceToCenter: string;
  image: string;
  rating: number;
  reviewCount: number;
  pricePerNightUSD: number;
  pricePerNightUZS: number;
  availableRoomsNow: number;
  amenities: string[];
  description: string;
  historyHighlight: string;
  phone: string;
  website: string;
  rooms: {
    name: string;
    priceUZS: number;
    capacity: string;
  }[];
}

const ALL_HOTELS: HotelStay[] = [
  {
    id: 'kosh-havuz-samarkand',
    name: 'Kosh Havuz Boutique Hotel',
    category: 'boutique',
    city: 'Samarkand',
    region: 'Samarqand',
    address: 'Dahbed ko‘chasi 14, Registon yaqinida',
    distanceToCenter: 'Registon maydonidan 300 m',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    rating: 4.96,
    reviewCount: 420,
    pricePerNightUSD: 75,
    pricePerNightUZS: 960000,
    availableRoomsNow: 3,
    amenities: ['Milliy Hovli', 'Bepul Nonushta', 'Tezkor Wi-Fi', 'Aeroport Transferi', 'Konditsioner'],
    description: "Samarqandning qadimiy me'moriy uslubida bezatilgan shinam butik mehmonxona. O'yma ganch va milliy suzani naqshlari bilan bezatilgan hovlisi Registonga bir necha qadam masofada joylashgan.",
    historyHighlight: "Bino an'anaviy XIX asr oxiri Samarqand boy xonadoni me'morchiligi asosida tiklangan.",
    phone: '+998 66 233 45 45',
    website: 'https://koshhavuz.uz',
    rooms: [
      { name: 'Standard Double Room', priceUZS: 960000, capacity: '2 kishi' },
      { name: 'Deluxe Silk Road Suite', priceUZS: 1450000, capacity: '2-3 kishi' },
      { name: 'Family Courtyard Room', priceUZS: 1850000, capacity: '4 kishi' }
    ]
  },
  {
    id: 'silk-road-minyun-samarkand',
    name: 'Silk Road by MINYUN 5★ Luxury',
    category: 'luxury',
    city: 'Samarkand',
    region: 'Samarqand',
    address: 'Silk Road Samarkand Turistik Markazi',
    distanceToCenter: 'Boqiy Shahardan 2 daqiqa',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    rating: 4.94,
    reviewCount: 680,
    pricePerNightUSD: 160,
    pricePerNightUZS: 2050000,
    availableRoomsNow: 8,
    amenities: ['Ochiq va Yopiq Basseyn', 'SPA & Wellness', 'Restoranlar', 'Panoramik Manzara', 'Fitnes'],
    description: "Samarqandning eng yirik 5 yulduzli xalqaro mehmonxonasi. Butun dunyodan tashrif buyuruvchi nufuzli mehmonlar, diplomatlar va qulaylikni qadrlovchi sayyohlar uchun ideal maskan.",
    historyHighlight: "Eski Samarqandning afsonaviy Ipak Yo'li saroylari mahobati zamonaviy arxitektura bilan uyg'unlashtirilgan.",
    phone: '+998 66 240 77 77',
    website: 'https://silkroad-samarkand.com',
    rooms: [
      { name: 'Deluxe King Bed Room', priceUZS: 2050000, capacity: '2 kishi' },
      { name: 'Executive Suite Lake View', priceUZS: 3400000, capacity: '2 kishi' },
      { name: 'Presidential Royal Suite', priceUZS: 7800000, capacity: '4 kishi' }
    ]
  },
  {
    id: 'minzifa-boutique-bukhara',
    name: 'Minzifa Boutique Hotel Bukhara',
    category: 'boutique',
    city: 'Bukhara',
    region: 'Buxoro',
    address: 'Eshoni Pir ko‘chasi 6, Labi Hovuz yaqinida',
    distanceToCenter: 'Labi Hovuzdan 150 m',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    rating: 4.95,
    reviewCount: 510,
    pricePerNightUSD: 65,
    pricePerNightUZS: 830000,
    availableRoomsNow: 2,
    amenities: ['Tarixiy Hovli', 'Sharqona Nonushta', 'Wi-Fi', 'Ekskursiya Xizmati', 'Choyxona'],
    description: "Eski Buxoroning yuragida joylashgan XIX asrga oid savdogar saroyi. Qo'lda o'yilgan yog'och ustunlar, suzani kashtalari va sokin favvorali hovli.",
    historyHighlight: "XIX asr Buxoro amirligi davridagi ipak savdogari hovlisi to'liq asl holatida restavratsiya qilingan.",
    phone: '+998 65 224 55 52',
    website: 'https://minzifahotel.com',
    rooms: [
      { name: 'Traditional Bukharian Room', priceUZS: 830000, capacity: '2 kishi' },
      { name: 'Heritage Deluxe Suite', priceUZS: 1200000, capacity: '2 kishi' }
    ]
  },
  {
    id: 'mercure-bukhara-old-town',
    name: 'Mercure Bukhara Old Town 4★',
    category: 'luxury',
    city: 'Bukhara',
    region: 'Buxoro',
    address: 'Samarqand ko‘chasi 1, Eski Shahar',
    distanceToCenter: 'Kalon Minorasidan 400 m',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
    rating: 4.91,
    reviewCount: 380,
    pricePerNightUSD: 110,
    pricePerNightUZS: 1400000,
    availableRoomsNow: 6,
    amenities: ['Basseyn & Turk Hamomi', 'Panoramik Terrasa', 'Restoran', 'Wi-Fi', 'Fitnes'],
    description: "Accor xalqaro tarmog'ining Buxorodagi premium mehmonxonasi. Buxoriyona g'ishtin arxitektura va zamonaviy Yevropa qulayliklari.",
    historyHighlight: "Buxoro shaharsozligi me'yorlariga mos ravishda qadimiy qizil g'ishtlardan bunyod etilgan.",
    phone: '+998 65 221 00 00',
    website: 'https://all.accor.com',
    rooms: [
      { name: 'Classic Queen Room', priceUZS: 1400000, capacity: '2 kishi' },
      { name: 'Privilege Room with Terrace', priceUZS: 1950000, capacity: '2 kishi' }
    ]
  },
  {
    id: 'orient-star-khiva',
    name: 'Orient Star Khiva (Madrasah Hotel)',
    category: 'boutique',
    city: 'Khiva',
    region: 'Xorazm',
    address: 'Ichan Qal‘a, Muhammad Aminxon Madrasasi',
    distanceToCenter: 'Kalta Minor ro‘parasida',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
    rating: 4.92,
    reviewCount: 390,
    pricePerNightUSD: 60,
    pricePerNightUZS: 770000,
    availableRoomsNow: 4,
    amenities: ['Ichan Qal‘a Ichida', 'Madrasa Hujralari', 'Restoran', 'Wi-Fi', 'Milliy Nonushta'],
    description: "Haqiqiy 1850-yillarda qurilgan Muhammad Aminxon madrasasi ichida tunash imkoniyati! O'rta asr talabalari hujralari barcha zamonaviy qulayliklar bilan jihozlangan.",
    historyHighlight: "Markaziy Osiyodagi eng yirik madrasada joylashgan yagona noyob tarixiy mehmonxona.",
    phone: '+998 62 375 25 25',
    website: 'https://orientstar.uz',
    rooms: [
      { name: 'Historic Madrasah Cell Room', priceUZS: 770000, capacity: '2 kishi' },
      { name: 'Khan Deluxe Chamber', priceUZS: 1150000, capacity: '2 kishi' }
    ]
  },
  {
    id: 'hilton-tashkent-city',
    name: 'Hilton Tashkent City 5★',
    category: 'luxury',
    city: 'Tashkent',
    region: 'Toshkent',
    address: 'Islom Karimov ko‘chasi 2, Blok 1',
    distanceToCenter: 'Tashkent City Park markazida',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    rating: 4.97,
    reviewCount: 890,
    pricePerNightUSD: 190,
    pricePerNightUZS: 2450000,
    availableRoomsNow: 11,
    amenities: ['Panoramik SkyBar 21', 'Basseyn & Spa', 'Executive Lounge', 'Fitnes', 'Valet Parking'],
    description: "Toshkent City biznes markazidagi eng nufuzli 5 yulduzli mehmonxona. Musiqali favvoralar va shahar panoramasi ko'rinishidagi hashamatli xonalar.",
    historyHighlight: "O'zbekistonning zamonaviy metropolisi ramzi bo'lgan xalqaro Hilton brendi.",
    phone: '+998 71 210 88 88',
    website: 'https://hilton.com',
    rooms: [
      { name: 'King Guest Room with Park View', priceUZS: 2450000, capacity: '2 kishi' },
      { name: 'Executive Suite High Floor', priceUZS: 4200000, capacity: '2-3 kishi' }
    ]
  },
  {
    id: 'hyatt-regency-tashkent',
    name: 'Hyatt Regency Tashkent 5★',
    category: 'luxury',
    city: 'Tashkent',
    region: 'Toshkent',
    address: 'Navoiy ko‘chasi 1A',
    distanceToCenter: 'Mustaqillik maydonidan 300 m',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    rating: 4.95,
    reviewCount: 760,
    pricePerNightUSD: 180,
    pricePerNightUZS: 2300000,
    availableRoomsNow: 7,
    amenities: ['Yopiq Basseyn & Sauna', 'Khashamatli Spa', 'Soshana Restorani', '24/7 Room Service'],
    description: "Toshkent markazida joylashgan premium darajadagi Hyatt mehmonxonasi. San'at asarlari, oliy darajadagi gastronomiya va shohona xizmat ko'rsatish.",
    historyHighlight: "O'zbekiston poytaxtida xalqaro delegatsiyalar va nufuzli sayyohlarni qabul qiluvchi markaziy mehmonxona.",
    phone: '+998 71 207 12 34',
    website: 'https://hyatt.com',
    rooms: [
      { name: 'King Standard City View', priceUZS: 2300000, capacity: '2 kishi' },
      { name: 'Regency Executive Suite', priceUZS: 3900000, capacity: '2-3 kishi' }
    ]
  },
  {
    id: 'hotel-uzbekistan-tashkent',
    name: 'Hotel Uzbekistan (Tarixiy Bino)',
    category: 'budget',
    city: 'Tashkent',
    region: 'Toshkent',
    address: 'Amir Temur shoh ko‘chasi 45',
    distanceToCenter: 'Amir Temur xiyoboni ro‘parasida',
    image: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1000&q=80',
    rating: 4.75,
    reviewCount: 1120,
    pricePerNightUSD: 40,
    pricePerNightUZS: 510000,
    availableRoomsNow: 15,
    amenities: ['Metro Amir Temur yonida', 'Retro Arxitektura', 'Restoran', 'Wi-Fi', 'Nonushta'],
    description: "Toshkentning eng mashhur ramziy binolaridan biri. Metro bekatiga bir qadam masofada, sovet modernizmi uslubidagi tarixiy fasad.",
    historyHighlight: "1974-yilda bunyod etilgan bo'lib, sharqona panjarali quyosh to'siqlari bilan jahon me'morchiligiga kirgan.",
    phone: '+998 71 113 11 11',
    website: 'https://hoteluzbekistan.uz',
    rooms: [
      { name: 'Standard Single/Double', priceUZS: 510000, capacity: '2 kishi' },
      { name: 'Superior Room Square View', priceUZS: 750000, capacity: '2 kishi' }
    ]
  },
  {
    id: 'amirsoy-resort-chalets',
    name: 'Amirsoy Mountain Resort & Chalets',
    category: 'resort',
    city: 'Tashkent',
    region: 'Toshkent viloyati / Chimyon',
    address: 'Bo‘stonliq tumani, Chimyon tog‘lari',
    distanceToCenter: 'Toshkentdan 65 km masofada',
    image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80',
    rating: 4.96,
    reviewCount: 740,
    pricePerNightUSD: 220,
    pricePerNightUZS: 2800000,
    availableRoomsNow: 4,
    amenities: ['Tog‘ Chang‘i Kanat Yo‘li', 'Shaxsiy Fin Chalelari', 'Spa Kompleks', 'Restoranlar', 'Transfer'],
    description: "Tyan-Shan tog'lari bag'ridagi eng yirik tog'-chang'i va yozgi dam olish kurorti. Yog'och chalelar, toza tog' havosi va xalqaro servis.",
    historyHighlight: "O'zbekistonning jahon darajasidagi birinchi tog' kurorti.",
    phone: '+998 71 200 22 90',
    website: 'https://amirsoy.com',
    rooms: [
      { name: 'Deluxe 2-Bedroom Mountain Chalet', priceUZS: 2800000, capacity: '4 kishi' },
      { name: 'Premium 4-Bedroom Alpine Chalet', priceUZS: 5600000, capacity: '8 kishi' }
    ]
  },
  {
    id: 'zaamin-sunrise-resort',
    name: 'Zaamin Sunrise Resort & SPA',
    category: 'resort',
    city: 'Zomin',
    region: 'Jizzax / Zomin',
    address: 'Zomin Milliy Bog‘i, Archazor tog‘lari',
    distanceToCenter: 'Zomin markazidan 15 km',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
    rating: 4.93,
    reviewCount: 450,
    pricePerNightUSD: 95,
    pricePerNightUZS: 1200000,
    availableRoomsNow: 5,
    amenities: ['Shveytsariya uslubidagi archazor', 'Yopiq Isitiladigan Basseyn', 'Tog‘ Sayrlari', 'Shifobaxsh Havo'],
    description: "O'zbekistonning Shveytsariyasi deb ataladigan Zomin tog'laridagi zamonaviy dam olish maskani. Toza tog' havosi va tinchlantiruvchi tabiat.",
    historyHighlight: "Zomin tog'laridagi 1000 yillik arxazorlar qo'ynida ekologik materiallardan barpo etilgan.",
    phone: '+998 72 221 44 00',
    website: 'https://zaaminresort.uz',
    rooms: [
      { name: 'Superior Pine View Room', priceUZS: 1200000, capacity: '2 kishi' },
      { name: 'Family Mountain Suite', priceUZS: 2100000, capacity: '4 kishi' }
    ]
  },
  {
    id: 'asmald-palace-kokand',
    name: 'Asmald Palace Hotel Kokand 4★',
    category: 'boutique',
    city: 'Kokand',
    region: 'Farg‘ona / Qo‘qon',
    address: 'Turkiston ko‘chasi 21, Qo‘qon markazi',
    distanceToCenter: 'Xudoyorxon O‘rdasidan 500 m',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    rating: 4.90,
    reviewCount: 320,
    pricePerNightUSD: 55,
    pricePerNightUZS: 700000,
    availableRoomsNow: 6,
    amenities: ['Qo‘qon milliy taomlari', 'Wi-Fi', 'Konferens zal', 'Aeroport transferi'],
    description: "Qo'qon xonligi madaniyati bilan uyg'unlashgan hashamatli xonalar. Rishton kulolchiligi va Marg'ilon ipaklari bilan bezatilgan.",
    historyHighlight: "Qo'qon xonlari me'morchiligidan ilhomlanib yaratilgan milliy saroy mehmonxona.",
    phone: '+998 73 542 33 00',
    website: 'https://asmaldpalace.uz',
    rooms: [
      { name: 'Deluxe Queen Room', priceUZS: 700000, capacity: '2 kishi' },
      { name: 'Khan Suite with Balcony', priceUZS: 1100000, capacity: '2 kishi' }
    ]
  },
  {
    id: 'aydarkul-yurt-camp',
    name: 'Aydarkul Desert Yurt Safari Camp',
    category: 'resort',
    city: 'Navoiy',
    region: 'Navoiy / Nurota',
    address: 'Aydarko‘l sohili, Qizilqum cho‘li',
    distanceToCenter: 'Nurotadan 40 km',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80',
    rating: 4.88,
    reviewCount: 310,
    pricePerNightUSD: 45,
    pricePerNightUZS: 580000,
    availableRoomsNow: 4,
    amenities: ['Haqiqiy Katta O‘tovlar', 'Tuyada Sayr Qilish', 'Oqshom Gulxani & Dostonchi', 'Milliy Taomlar'],
    description: "Qizilqum cho'lida yulduzli osmon ostida tunash. Tuyalarda sayr qilish, ko'l bo'yida baliqxo'rlik va oqshom gulxani atrofida baxshi kuylari.",
    historyHighlight: "Ipak yo'lidagi ko'chmanchi xalqlarning 1000 yillik o'tov madaniyati.",
    phone: '+998 79 220 12 34',
    website: 'https://nuratasafari.uz',
    rooms: [
      { name: 'Traditional Felt Yurt Bed', priceUZS: 580000, capacity: '2-4 kishi' }
    ]
  },
  {
    id: 'meros-guest-house-khiva',
    name: 'Meros B&B Traditional Guest House',
    category: 'budget',
    city: 'Khiva',
    region: 'Xorazm',
    address: 'Ichan Qal‘a, Toshhovli orqasida',
    distanceToCenter: 'Ichan Qal‘a markazida',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    rating: 4.93,
    reviewCount: 290,
    pricePerNightUSD: 35,
    pricePerNightUZS: 450000,
    availableRoomsNow: 2,
    amenities: ['Panoramik Tom Terassasi', 'Nonushta Kiritilgan', 'Wi-Fi', 'Samimiy Mezbonlar'],
    description: "Ichan Qal'aning barcha minora va gumbazlariga qaragan afsonaviy tom terassasi bilan mashhur mehmondo'st o'zbek oilaviy mehmonxonasi.",
    historyHighlight: "Xorazm oilaviy mehmondo'stligi va nonushtadagi issiq tandir kulchalari bilan tanilgan.",
    phone: '+998 62 375 41 12',
    website: 'https://meroskhiva.uz',
    rooms: [
      { name: 'Twin Room with Terrace View', priceUZS: 450000, capacity: '2 kishi' },
      { name: 'Triple Family Room', priceUZS: 620000, capacity: '3 kishi' }
    ]
  }
];

const HOTEL_STRINGS: Partial<Record<LanguageCode, {
  badge: string;
  title: string;
  subtitle: string;
  allCategories: string;
  boutique: string;
  luxury: string;
  budget: string;
  resort: string;
  allCities: string;
  searchPlaceholder: string;
  perNight: string;
  bookNow: string;
  callHotel: string;
  reservationTitle: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  selectRoom: string;
  totalPrice: string;
  confirmBooking: string;
  bookingSuccess: string;
}>> = {
  uz: {
    badge: "O'zbekiston Mehmonxonalari & Jonli Bron Tizimi",
    title: "🏨 Mehmonxonalar, Tarixiy Saroylar & Tog' Kurortlari",
    subtitle: "O'zbekiston bo'ylab 5★ lyuks mehmonxonalar, XIX asr an'anaviy hovlilari, madrasa hujralari va tog' chalelari.",
    allCategories: "Barcha Toifalar",
    boutique: "🏰 Tarixiy Butik Saroylar",
    luxury: "💎 5★ Hashamatli (Luxury)",
    budget: "💰 Hamyonbop & Oilaviy",
    resort: "🏔️ Tog' & Cho'l Kurortlari",
    allCities: "Barcha Shaharlar",
    searchPlaceholder: "Mehmonxona nomi, shahar yoki qulayliklar bo'yicha qidiring...",
    perNight: "/ kecha",
    bookNow: "Xonani Band Qilish",
    callHotel: "Qo'ng'iroq Qilish",
    reservationTitle: "Tezkor Mehmonxona Band Qilish (Jonli Tizim)",
    checkIn: "Kelish sanasi (Check-in)",
    checkOut: "Ketish sanasi (Check-out)",
    guests: "Mehmonlar soni",
    selectRoom: "Xona turini tanlang",
    totalPrice: "Jami hisoblangan narx",
    confirmBooking: "Band Qilishni Tasdiqlash",
    bookingSuccess: "Mehmonxona muvaffaqiyatli band qilindi! Sizning elektron vaucheringiz tayyorlandi."
  },
  en: {
    badge: "Uzbekistan Hotels & Live Booking System",
    title: "🏨 Hotels, Boutique Mansions & Caravanserais",
    subtitle: "Hand-picked luxury 5★ hotels, authentic 19th-century courtyards, madrasah cells, and mountain chalets across Uzbekistan.",
    allCategories: "All Categories",
    boutique: "🏰 Historic Boutiques",
    luxury: "💎 5★ Luxury Hotels",
    budget: "💰 Cozy & Budget B&Bs",
    resort: "🏔️ Mountain & Safari Resorts",
    allCities: "All Cities",
    searchPlaceholder: "Search hotel by name, city or amenity...",
    perNight: "/ night",
    bookNow: "Book Room Now",
    callHotel: "Call Hotel",
    reservationTitle: "Instant Hotel Reservation (Live Engine)",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    guests: "Guests Count",
    selectRoom: "Select Room Type",
    totalPrice: "Total Calculated Price",
    confirmBooking: "Confirm Live Reservation",
    bookingSuccess: "Reservation successful! Your instant digital hotel voucher is ready."
  },
  ru: {
    badge: "Отели Узбекистана и Онлайн Бронирование",
    title: "🏨 Отели, Бутик-Дворцы и Горные Курорты",
    subtitle: "Роскошные отели 5★, аутентичные дворики XIX века, кельи в медресе и альпийские шале по всему Узбекистану.",
    allCategories: "Все категории",
    boutique: "🏰 Исторические бутик-отели",
    luxury: "💎 5★ Люкс Отели",
    budget: "💰 Уютные гостевые дома",
    resort: "🏔️ Горные курорты и юрты",
    allCities: "Все города",
    searchPlaceholder: "Поиск отеля по названию или городу...",
    perNight: "/ ночь",
    bookNow: "Забронировать",
    callHotel: "Позвонить",
    reservationTitle: "Мгновенное бронирование номера",
    checkIn: "Дата заезда",
    checkOut: "Дата выезда",
    guests: "Количество гостей",
    selectRoom: "Выберите тип номера",
    totalPrice: "Итоговая стоимость",
    confirmBooking: "Подтвердить бронь",
    bookingSuccess: "Бронирование успешно подтверждено!"
  }
};

export const HotelsStaysPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const tH = HOTEL_STRINGS[currentLanguage] || HOTEL_STRINGS.uz!;

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal State
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState<HotelStay | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingVoucherId, setBookingVoucherId] = useState('');

  const categories = [
    { id: 'all', label: tH.allCategories },
    { id: 'boutique', label: tH.boutique },
    { id: 'luxury', label: tH.luxury },
    { id: 'resort', label: tH.resort },
    { id: 'budget', label: tH.budget }
  ];

  const cityOptions = [
    { id: 'all', name: tH.allCities },
    { id: 'Samarkand', name: 'Samarqand (Samarkand)' },
    { id: 'Bukhara', name: 'Buxoro (Bukhara)' },
    { id: 'Khiva', name: 'Xiva (Khiva)' },
    { id: 'Tashkent', name: 'Toshkent (Tashkent)' },
    { id: 'Zomin', name: 'Zomin (Zaamin)' },
    { id: 'Kokand', name: 'Qo\'qon & Farg\'ona (Kokand)' },
    { id: 'Navoiy', name: 'Navoiy & Nurota' }
  ];

  const filteredHotels = useMemo(() => {
    return ALL_HOTELS.filter((hotel) => {
      const matchCity = selectedCity === 'all' || hotel.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory = selectedCategory === 'all' || hotel.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCity && matchCategory && matchSearch;
    });
  }, [selectedCity, selectedCategory, searchQuery]);

  const handleOpenBooking = (hotel: HotelStay) => {
    setSelectedHotelForBooking(hotel);
    setSelectedRoomIndex(0);
    setBookingDone(false);
    setGuestName('');
    setGuestPhone('');
  };

  const calculateTotal = () => {
    if (!selectedHotelForBooking) return 0;
    const room = selectedHotelForBooking.rooms[selectedRoomIndex] || selectedHotelForBooking.rooms[0];
    return room.priceUZS * 2; // 2 nights standard
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setBookingVoucherId(`HOTEL-UZ-${Math.floor(100000 + Math.random() * 900000)}`);
    setBookingDone(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(13, 22, 48, 0.95))',
          border: '1px solid var(--border-gold)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '10px' }}>
          <div className="badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Hotel size={14} /> {tH.badge}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(7, 13, 30, 0.9)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <MapPin size={14} color="var(--accent-gold)" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="city-select-dropdown"
              style={{
                background: '#0D1630',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {cityOptions.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#0D1630', color: '#ffffff' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
          {tH.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '750px', lineHeight: 1.6, margin: 0 }}>
          {tH.subtitle}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: '220px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#0D1630',
              border: '1px solid var(--border-subtle)',
              padding: '10px 14px',
              borderRadius: '10px'
            }}
          >
            <Search size={16} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder={tH.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '100%' }}
            />
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Mavjud: <strong style={{ color: 'var(--accent-turquoise)' }}>{filteredHotels.length}</strong> ta mehmonxona
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                background: selectedCategory === cat.id ? 'linear-gradient(135deg, var(--accent-gold), #B45309)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat.id ? '#070D1E' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat.id ? 800 : 500,
                fontSize: '12.5px',
                border: `1px solid ${selectedCategory === cat.id ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="glass-panel"
            style={{
              borderRadius: '18px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border-subtle)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            {/* Image Header */}
            <div style={{ position: 'relative', height: '190px' }}>
              <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              {/* Price Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(7, 13, 30, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--accent-gold)' }}>${hotel.pricePerNightUSD}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tH.perNight}</span>
              </div>

              {/* Rating & Live Availability Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  background: 'rgba(7, 13, 30, 0.85)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-active)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  color: '#fff',
                  fontWeight: 800
                }}>
                  <Star size={13} fill="#FBBF24" color="#FBBF24" />
                  <span>{hotel.rating}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({hotel.reviewCount})</span>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  color: '#34D399',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  {hotel.availableRoomsNow} ta xona qoldi
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0 }}>{hotel.name}</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-turquoise)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={12} /> {hotel.city} • {hotel.distanceToCenter}
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                {hotel.description}
              </p>

              {/* Amenities Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {hotel.amenities.slice(0, 3).map((am, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    ✓ {am}
                  </span>
                ))}
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href={`tel:${hotel.phone}`}
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '11.5px', textDecoration: 'none', gap: '4px' }}
                  title="Qo'ng'iroq qilish"
                >
                  <Phone size={13} />
                </a>

                {hotel.website && (
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '11.5px', textDecoration: 'none' }}
                    title="Veb-saytga o'tish"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}

                <button
                  onClick={() => handleOpenBooking(hotel)}
                  className="btn-gold"
                  style={{ flex: 1, padding: '8px 14px', fontSize: '12.5px', fontWeight: 700, gap: '6px', justifyContent: 'center' }}
                >
                  <Calendar size={14} />
                  <span>{tH.bookNow}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK RESERVATION MODAL */}
      {selectedHotelForBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 13, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '28px',
              borderRadius: '20px',
              border: '1px solid var(--border-gold)',
              background: '#0D1630',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.2)', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Hotel size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', color: '#fff', fontWeight: 800 }}>{selectedHotelForBooking.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tH.reservationTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHotelForBooking(null)}
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>Muvaffaqiyatli band qilindi!</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '400px' }}>
                  {tH.bookingSuccess}
                </p>

                {/* Voucher Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #064e3b, #0f172a)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '16px',
                  padding: '18px',
                  textAlign: 'left',
                  width: '100%',
                  color: '#fff',
                  fontSize: '12.5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.2)', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 800 }}>{selectedHotelForBooking.name}</span>
                    <span style={{ color: '#34d399', fontWeight: 800 }}>{bookingVoucherId}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><strong>Mehmon:</strong> {guestName}</div>
                    <div><strong>Telefon:</strong> {guestPhone || 'Kiritilmagan'}</div>
                    <div><strong>Sana:</strong> {checkInDate} - {checkOutDate}</div>
                    <div><strong>Xona:</strong> {selectedHotelForBooking.rooms[selectedRoomIndex]?.name}</div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#FFD700' }}>
                    <span>To'lov miqdori:</span>
                    <span>{calculateTotal().toLocaleString('uz-UZ')} UZS</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHotelForBooking(null)}
                  className="btn-primary"
                  style={{ padding: '8px 24px', fontSize: '13px', marginTop: '10px' }}
                >
                  Yopish
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Guest Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Mehmon Ismi Familiyasi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ALISHER NAVOIY"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#070D1E', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Telefon Raqami *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+998 90 123 45 67"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#070D1E', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {tH.checkIn}
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070D1E', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {tH.checkOut}
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070D1E', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                {/* Room Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {tH.selectRoom}
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedHotelForBooking.rooms.map((rm, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedRoomIndex(idx)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: selectedRoomIndex === idx ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: selectedRoomIndex === idx ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{rm.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sig‘imi: {rm.capacity}</div>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                          {rm.priceUZS.toLocaleString('uz-UZ')} UZS
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Price Summary */}
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0, 168, 150, 0.1)', border: '1px solid var(--border-active)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tH.totalPrice} (2 kecha):</span>
                  <span style={{ fontSize: '17px', fontWeight: 900, color: 'var(--accent-turquoise)' }}>
                    {calculateTotal().toLocaleString('uz-UZ')} UZS
                  </span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', padding: '11px', fontSize: '13.5px', fontWeight: 800, justifyContent: 'center', gap: '6px' }}
                >
                  <Check size={16} /> {tH.confirmBooking}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
