import React, { useState, useMemo, useEffect } from 'react';
import {
  Utensils,
  Clock,
  MapPin,
  Star,
  Flame,
  Check,
  ChevronRight,
  Info,
  Sparkles,
  Heart,
  Search,
  Award,
  Globe,
  SlidersHorizontal,
  Compass,
  ArrowUpDown,
  Fish,
  Share2,
  Phone
} from 'lucide-react';
import { useLocation, CITIES } from '../context/LocationContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

export interface RegionalSpot {
  name: string;
  address: string;
  rating: number;
  highlight?: string;
  phone?: string;
}

export interface DishItem {
  id: string;
  name: string;
  category: 'Palovlar' | 'Shashlik & Kabob' | 'Somsalar' | 'Xamir & Manti' | 'Sho‘rvalar' | 'Non & Shirinliklar' | 'Baliq & Daryo Taomlari';
  originCity: string;
  originRegion: string;
  imageUrl: string;
  basePriceUZS: number;
  baseRating: number;
  unit: string;
  bestTime: string;
  description: string;
  ingredients: string[];
  isHalal: boolean;
  historyFact: string;
  regionalPricing: Record<string, {
    priceRange: string;
    rating: number;
    isNative: boolean;
    localSpots: RegionalSpot[];
  }>;
}

const ALL_NATIONAL_DISHES: DishItem[] = [
  // --- SIRDARYO (SYRDARYA) SPECIALTIES ---
  {
    id: 'sirdaryo-fried-fish',
    name: "Sirdaryo Qovurilgan Daryo Balig'i (Zog'ora & Oq Amur)",
    category: "Baliq & Daryo Taomlari",
    originCity: "Syrdarya",
    originRegion: "Sirdaryo viloyati (Guliston / Baxt)",
    imageUrl: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 45000,
    baseRating: 4.98,
    unit: "1 porsiya (Katta baliq bo'lagi)",
    bestTime: "12:00 - 22:00 (Tushlik va Kechki ovqat)",
    description: "Sirdaryo daryosidan yangi tutilgan zog'ora (sazan), laqqa va oq amur balig'i. Maxsus sarimsoqli-pomidorli qizil sous, limon va yupqa to'g'ralgan piyoz bilan qarsildoq qilib qovuriladi.",
    ingredients: ["Sirdaryo yangi zog'ora / sazan balig'i", "Maxsus qizil sous", "Sarimsoq", "Zira va kashnich", "Limon", "O'simlik yog'i"],
    isHalal: true,
    historyFact: "Sirdaryo daryosi sohili butun O'zbekistonda eng mashhur baliq pishirish an'anasi bilan tanilgan bo'lib, bu yerga butun respublikadan maxsus kelishadi.",
    regionalPricing: {
      Syrdarya: {
        priceRange: "35,000 - 55,000 UZS",
        rating: 4.99,
        isNative: true,
        localSpots: [
          { name: "Sirdaryo Daryo Bo'yi Baliqxonasi", address: "Sirdaryo daryosi sohili, Baxt yo'li", rating: 4.98, highlight: "O'tin olovida, to'g'ridan-to'g'ri daryodan" },
          { name: "Guliston 'Sirdaryo Balig'i' Markazi", address: "Mustaqillik ko'chasi 18, Guliston", rating: 4.95, highlight: "Zog'ora va Oq amur qovurmasi" },
          { name: "Baxt Shovqinli Baliq Rastasi", address: "M39 magistral yo'li bo'yi", rating: 4.91, highlight: "Yo'lovchilar uchun eng mashhur to'xtash joyi" }
        ]
      },
      Tashkent: {
        priceRange: "55,000 - 85,000 UZS",
        rating: 4.82,
        isNative: false,
        localSpots: [
          { name: "Sirdaryo Baliq Taomlari", address: "Chilonzor 9-mavze", rating: 4.8, highlight: "Sirdaryodan keltirilgan baliq" }
        ]
      },
      Samarkand: {
        priceRange: "50,000 - 75,000 UZS",
        rating: 4.78,
        isNative: false,
        localSpots: [
          { name: "Daryo Balig'i Choyxonasi", address: "Samarqand vokzal yaqini", rating: 4.76 }
        ]
      }
    }
  },
  {
    id: 'sirdaryo-fish-soup',
    name: "Sirdaryo Qaynoq Baliq Sho'rvasi (Uxa)",
    category: "Sho‘rvalar",
    originCity: "Syrdarya",
    originRegion: "Sirdaryo viloyati",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 32000,
    baseRating: 4.93,
    unit: "1 kosa (Qaynoq)",
    bestTime: "Kuz va qish oylarida / Tushlik",
    description: "Daryo balig'ining suyak va lahm qismlaridan tayyorlangan tiniq, xushbo'y va shifobaxsh qaynoq sho'rva. Yangi shivit, ko'k piyoz va qora murch bilan beriladi.",
    ingredients: ["Tirik daryo balig'i", "Yangi shivit va ko'katlar", "Dafna yaprog'i", "Qora murch", "Sabzi", "Kartoshka"],
    isHalal: true,
    historyFact: "Sirdaryo baliqchilari qadimdan shamollash va holsizlikni davolash uchun ushbu qaynoq sho'rvadan ichganlar.",
    regionalPricing: {
      Syrdarya: {
        priceRange: "25,000 - 38,000 UZS",
        rating: 4.96,
        isNative: true,
        localSpots: [
          { name: "Sirdaryo Baliqchilar Oshxonasi", address: "Sirdaryo shahri", rating: 4.95, highlight: "Yangi baliqdan tayyorlanadi" }
        ]
      },
      Tashkent: {
        priceRange: "38,000 - 50,000 UZS",
        rating: 4.75,
        isNative: false,
        localSpots: [{ name: "Daryo Ne'mati", address: "Mirobod", rating: 4.74 }]
      }
    }
  },
  {
    id: 'sirdaryo-qozon-kabob',
    name: "Sirdaryo Qozon Kabobi & Jiz-Biz",
    category: "Shashlik & Kabob",
    originCity: "Syrdarya",
    originRegion: "Sirdaryo viloyati (Guliston)",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 48000,
    baseRating: 4.92,
    unit: "1 porsiya (Go'sht va Qovurilgan kartoshka)",
    bestTime: "12:00 - 21:00",
    description: "Chuqur qozonda qizarguncha qovurilgan lahm mol go'shti, sarg'ish qarsildoq kartoshkalar va ziravorlar bilan dimlangan to'yimli milliy taom.",
    ingredients: ["Mol go'shti", "Kichik butun kartoshka", "Dumba yog'i", "Zira", "Kashnich urug'i", "Yangi piyoz"],
    isHalal: true,
    historyFact: "Cho'l va dasht yo'llarida karvonlar uchun qozonda tez va to'yimli tayyorlangan an'anaviy taom.",
    regionalPricing: {
      Syrdarya: {
        priceRange: "38,000 - 52,000 UZS",
        rating: 4.95,
        isNative: true,
        localSpots: [
          { name: "Guliston Qozon Kabob Markazi", address: "Sayhun ko'chasi 14, Guliston", rating: 4.94, highlight: "Yumshoq dimlangan go'sht" }
        ]
      },
      Samarkand: {
        priceRange: "45,000 - 65,000 UZS",
        rating: 4.82,
        isNative: false,
        localSpots: [{ name: "Samarqand Qozon Kabob", address: "Gagarin", rating: 4.8 }]
      }
    }
  },
  {
    id: 'sirdaryo-mirzachol-qovun',
    name: "Mirzacho'l & Sirdaryo Asal Qovuni (Kukcha & Obi Novvot)",
    category: "Non & Shirinliklar",
    originCity: "Syrdarya",
    originRegion: "Sirdaryo / Mirzacho'l",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 20000,
    baseRating: 4.99,
    unit: "1 dona (Katta tilimlar)",
    bestTime: "Avgust - Noyabr oylari",
    description: "Butun dunyoga mashhur Mirzacho'l qovunlari. Quyosh nuri va Sirdaryo tuprog'ida pishgan, qand miqdori yuqori, og'izda eriydigan xushbo'y qovun.",
    ingredients: ["Mirzacho'l Kukcha qovuni", "Obi Novvot", "Tabiiy quyosh mevasi"],
    isHalal: true,
    historyFact: "Mirzacho'l qovunlari Ipak Yo'li orqali qadimda Xitoy imperatorlari va Yevropa qirollariga sovg'a sifatida olib ketilgan.",
    regionalPricing: {
      Syrdarya: {
        priceRange: "12,000 - 25,000 UZS (Butun qovun)",
        rating: 5.0,
        isNative: true,
        localSpots: [
          { name: "Mirzacho'l Qovun Bozori", address: "M39 magistrali, Sirdaryo", rating: 4.99, highlight: "To'g'ridan-to'g'ri daladan uzilgan" }
        ]
      },
      Tashkent: {
        priceRange: "25,000 - 45,000 UZS",
        rating: 4.88,
        isNative: false,
        localSpots: [{ name: "Qo'yliq Qovun Rastasi", address: "Qo'yliq", rating: 4.87 }]
      }
    }
  },

  // --- SAMARKAND SPECIALTIES ---
  {
    id: 'samarkand-plov',
    name: "Samarqand Ziq Palovi (Qatlamli)",
    category: "Palovlar",
    originCity: "Samarkand",
    originRegion: "Samarqand viloyati",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 40000,
    baseRating: 4.95,
    unit: "1 porsiya",
    bestTime: "11:30 - 14:00 (Tushlik)",
    description: "Samarqand palovining boshqa palovlardan asosiy farqi — u aralashtirilmaydi. Qatlam-qatlam suziladi: pastda sershira guruch, ustida sarg'ish sabzi va yumshoq marmar mol go'shti, bedana tuxumi hamda qazi.",
    ingredients: ["Alanga / Devzira guruch", "Marmar mol go'shti", "Sariq sabzi", "Zira", "Bedana tuxumi", "Qazi", "Zig'ir yog'i"],
    isHalal: true,
    historyFact: "Samarqand palovi Amir Temur davridan buyon jangchilar va olimlarga quvvat manbai sifatida pishirib kelingan.",
    regionalPricing: {
      Samarkand: {
        priceRange: "35,000 - 45,000 UZS",
        rating: 4.98,
        isNative: true,
        localSpots: [
          { name: "Samarqand Osh Markazi", address: "Spitamen shoh ko'chasi 42", rating: 4.95, highlight: "O'tin olovida pishiriladi" },
          { name: "Bobo Dehqon Oshxonasi", address: "Registon maydoniga yaqin", rating: 4.9, highlight: "Qadimgi retsept asosida" }
        ]
      },
      Syrdarya: {
        priceRange: "38,000 - 48,000 UZS",
        rating: 4.85,
        isNative: false,
        localSpots: [
          { name: "Samarqandcha Oshxona Guliston", address: "Guliston markaziy vokzal", rating: 4.84, highlight: "Qatlamli Samarqand palovi" }
        ]
      }
    }
  },

  // --- TASHKENT SPECIALTIES ---
  {
    id: 'tashkent-plov',
    name: "Toshkent To'y Oshi (Choyxona Palovi)",
    category: "Palovlar",
    originCity: "Tashkent",
    originRegion: "Toshkent shahri",
    imageUrl: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 48000,
    baseRating: 4.93,
    unit: "1 porsiya",
    bestTime: "11:45 - 14:00 (Tushlik)",
    description: "Katta qozonlarda no'xat, mayiz, qazi va qo'y dumbasi bilan birga dimlanadigan sershira, qizg'ish tusli an'anaviy Toshkent to'y oshi.",
    ingredients: ["Lazer / Alanga guruch", "Qo'y go'shti va qazi", "Katta no'xat", "Mayiz", "Sariq va qizil sabzi", "Dumba yog'i"],
    isHalal: true,
    historyFact: "Toshkent to'ylarining asosiy shohi hisoblanadi va tonggi soat 06:00 dan boshlab ulashiladi.",
    regionalPricing: {
      Tashkent: {
        priceRange: "45,000 - 65,000 UZS",
        rating: 4.96,
        isNative: true,
        localSpots: [
          { name: "Besh Qozon (Markaziy Osh Markazi)", address: "Minor teleminora yonida", rating: 4.95, highlight: "Kuniga 10 tonna osh damlanadi" }
        ]
      },
      Syrdarya: {
        priceRange: "40,000 - 52,000 UZS",
        rating: 4.88,
        isNative: false,
        localSpots: [{ name: "Toshkent To'y Oshi Guliston", address: "Guliston bozor", rating: 4.86 }]
      }
    }
  },
  {
    id: 'tashkent-norin',
    name: "Toshkent Norini & Ot Go'shti Qazisi",
    category: "Xamir & Manti",
    originCity: "Tashkent",
    originRegion: "Toshkent shahri",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 45000,
    baseRating: 4.96,
    unit: "1 porsiya (Sho'rvasi bilan)",
    bestTime: "Kun davomida",
    description: "Qo'lda nihoyatda ingichka qilib qirqilgan qaynatma xamir, maydalangan ot va mol go'shti hamda xushbo'y zira aralashmasi. Yonida issiq go'sht sho'rvasi beriladi.",
    ingredients: ["Ingichka qirqilgan xamir", "Ot go'shti", "Qazi bo'laklari", "Zira", "Qora murch", "Sho'rva"],
    isHalal: true,
    historyFact: "Toshkentliklarning eng e'zozli va obro'li milliy mehmondorchilik taomi.",
    regionalPricing: {
      Tashkent: {
        priceRange: "40,000 - 58,000 UZS",
        rating: 4.99,
        isNative: true,
        localSpots: [{ name: "Chorsu Norin Rastasi", address: "Chorsu bozori markazi", rating: 4.98 }]
      },
      Syrdarya: {
        priceRange: "38,000 - 48,000 UZS",
        rating: 4.84,
        isNative: false,
        localSpots: [{ name: "Norinxona Sirdaryo", address: "Guliston markaz", rating: 4.83 }]
      }
    }
  },

  // --- JIZZAKH SPECIALTIES ---
  {
    id: 'jizzakh-somsa',
    name: "Jizzaxning Katta Go'shtli Somsasi",
    category: "Somsalar",
    originCity: "Jizzakh",
    originRegion: "Jizzax viloyati",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 22000,
    baseRating: 4.97,
    unit: "1 dona (Ulkan 300g)",
    bestTime: "10:30 - 18:00",
    description: "Hajmi katta, ichida butun lahm mol go'shti va piyoz seli toshib turadigan mashhur Jizzax somsasi. Maxsus qoshiq bilan ichidagi qaynoq sho'rvasi ichiladi.",
    ingredients: ["Tandir xamiri", "Lahm mol go'shti", "Qo'y dumbasi", "Mayda piyoz", "Qora murch", "Zira"],
    isHalal: true,
    historyFact: "Toshkent-Samarqand yo'lida o'tuvchi barcha sayyoh va haydovchilar to'xtab tanovul qiladigan afsonaviy somsa.",
    regionalPricing: {
      Jizzakh: {
        priceRange: "18,000 - 25,000 UZS",
        rating: 5.0,
        isNative: true,
        localSpots: [{ name: "Jizzax Somsa Markazi", address: "M39 Jizzax aylanma yo'li", rating: 4.99 }]
      },
      Syrdarya: {
        priceRange: "18,000 - 24,000 UZS",
        rating: 4.92,
        isNative: false,
        localSpots: [{ name: "Jizzaxcha Somsa Guliston", address: "Baxt yo'li", rating: 4.91 }]
      }
    }
  },

  // --- BUKHARA SPECIALTIES ---
  {
    id: 'bukhara-plov',
    name: "Buxoro Oshi Sofi (Parhezbop)",
    category: "Palovlar",
    originCity: "Bukhara",
    originRegion: "Buxoro viloyati",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 42000,
    baseRating: 4.94,
    unit: "1 porsiya",
    bestTime: "11:30 - 14:00",
    description: "Buxoroning qadimiy uslubdagi mis qozonda pishiriladigan shifobaxsh oshi. Guruch alohida qaynatib olinadi va qatlamlar yog'siz dimlanadi.",
    ingredients: ["Mis qozon", "Aloqa guruch", "Yumshoq mol go'shti", "Mayiz", "Zafaron suvi"],
    isHalal: true,
    historyFact: "Ibn Sino tavsiyalariga ko'ra hazm qilish nihoyatda yengil bo'lgan parhezbop palov.",
    regionalPricing: {
      Bukhara: {
        priceRange: "38,000 - 50,000 UZS",
        rating: 4.98,
        isNative: true,
        localSpots: [{ name: "The Plov Lounge Bukhara", address: "Labi Hovuz", rating: 4.96 }]
      }
    }
  },
  {
    id: 'gijduvon-shashlik',
    name: "G'ijduvon Mashhur Qiyma Shashligi",
    category: "Shashlik & Kabob",
    originCity: "Bukhara",
    originRegion: "Buxoro (G'ijduvon)",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 18000,
    baseRating: 4.96,
    unit: "1 six",
    bestTime: "12:00 - 23:00",
    description: "Og'izda eriydigan, o'ta sershira va xushbo'y G'ijduvon qiyma kabobi. Maxsus sirka va piyoz bilan tortiladi.",
    ingredients: ["Qo'y va mol go'shti qiymasi", "Dumba", "Kashnich urug'i", "Zira", "Sirka"],
    isHalal: true,
    historyFact: "G'ijduvon qassoblari 300 yildan buyon go'shtni maydalash va sixga tortishning maxsus uslubini sir saqlab keladi.",
    regionalPricing: {
      Bukhara: {
        priceRange: "16,000 - 22,000 UZS",
        rating: 4.99,
        isNative: true,
        localSpots: [{ name: "G'ijduvon Shashlikxonasi", address: "G'ijduvon markaz", rating: 4.98 }]
      }
    }
  },

  // --- KHOREZM SPECIALTIES ---
  {
    id: 'khiva-tuxumbarak',
    name: "Xorazm Tuxumbaragi & Shivit Oshi",
    category: "Xamir & Manti",
    originCity: "Khiva",
    originRegion: "Xorazm viloyati",
    imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80",
    basePriceUZS: 38000,
    baseRating: 4.95,
    unit: "1 porsiya",
    bestTime: "11:30 - 21:00",
    description: "Xamir konvertchalar ichiga xom tuxum, sut va sariyog' aralashmasi quyilib, qaynoq suvda bir lahzada pishiriladigan Xorazmning betakror taomi.",
    ingredients: ["Tuxum", "Sut", "Sariyog'", "Yupqa xamir", "Qatiq"],
    isHalal: true,
    historyFact: "Xiva xonlari saroyida xonning quvvatini oshirish uchun tayyorlangan maxsus saroy taomi.",
    regionalPricing: {
      Khiva: {
        priceRange: "32,000 - 45,000 UZS",
        rating: 4.99,
        isNative: true,
        localSpots: [{ name: "Xiva Milliy Taomlar", address: "Ichan Qal'a", rating: 4.98 }]
      }
    }
  }
];

export const GastronomyPlovPage: React.FC<{ onOpenMap?: () => void }> = ({ onOpenMap }) => {
  const { location, setManualCity } = useLocation();

  const [selectedCityFilter, setSelectedCityFilter] = useState<string>(() => location.city || 'Syrdarya');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hammasi');
  const [onlyLocalDishes, setOnlyLocalDishes] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<DishItem>(ALL_NATIONAL_DISHES[0]);

  // Keep synced if user location changes
  useEffect(() => {
    if (location.city) {
      setSelectedCityFilter(location.city);
    }
  }, [location.city]);

  // When city filter changes, automatically select the best native dish of that city
  useEffect(() => {
    const nativeDish = ALL_NATIONAL_DISHES.find(
      (d) => d.originCity.toLowerCase() === selectedCityFilter.toLowerCase()
    );
    if (nativeDish) {
      setSelectedDish(nativeDish);
    }
  }, [selectedCityFilter]);

  const categories = [
    'Hammasi',
    'Baliq & Daryo Taomlari',
    'Palovlar',
    'Shashlik & Kabob',
    'Somsalar',
    'Xamir & Manti',
    'Sho‘rvalar',
    'Non & Shirinliklar'
  ];

  const cityOptions = Object.keys(CITIES);

  // Filter & Sort dishes: Put native dishes of the selected city at the top!
  const filteredDishes = useMemo(() => {
    return ALL_NATIONAL_DISHES.filter((dish) => {
      const matchCat = selectedCategory === 'Hammasi' || dish.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.originRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());

      const isNative = dish.originCity.toLowerCase() === selectedCityFilter.toLowerCase();
      const matchLocalOnly = !onlyLocalDishes || isNative;

      return matchCat && matchSearch && matchLocalOnly;
    }).sort((a, b) => {
      const aNative = a.originCity.toLowerCase() === selectedCityFilter.toLowerCase() ? 1 : 0;
      const bNative = b.originCity.toLowerCase() === selectedCityFilter.toLowerCase() ? 1 : 0;
      return bNative - aNative; // Native dishes first
    });
  }, [selectedCategory, searchQuery, selectedCityFilter, onlyLocalDishes]);

  // Compute dynamic price, rating and restaurant spots for the active region
  const getDynamicDishData = (dish: DishItem, city: string) => {
    const regional = dish.regionalPricing[city];
    if (regional) {
      return {
        priceRange: regional.priceRange,
        rating: regional.rating,
        isNative: regional.isNative,
        spots: regional.localSpots
      };
    }

    const isOrigin = dish.originCity.toLowerCase() === city.toLowerCase();
    const multiplier = city === 'Tashkent' ? 1.25 : city === 'Samarkand' ? 1.05 : 0.95;
    const priceMin = Math.round((dish.basePriceUZS * multiplier * 0.9) / 1000) * 1000;
    const priceMax = Math.round((dish.basePriceUZS * multiplier * 1.25) / 1000) * 1000;

    return {
      priceRange: `${priceMin.toLocaleString()} - ${priceMax.toLocaleString()} UZS`,
      rating: isOrigin ? dish.baseRating : Math.max(4.65, Number((dish.baseRating - 0.18).toFixed(2))),
      isNative: isOrigin,
      spots: [
        {
          name: `${city} Markaziy Milliy Taomlar Choyxonasi`,
          address: `${city} shahar markazi`,
          rating: 4.82,
          highlight: "Mahalliy an'anaviy uslubda"
        }
      ]
    };
  };

  const currentDishDynamic = getDynamicDishData(selectedDish, selectedCityFilter);
  const isSelectedDishNative = selectedDish.originCity.toLowerCase() === selectedCityFilter.toLowerCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.18), rgba(13, 22, 48, 0.95))',
          border: '1px solid var(--border-active)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '10px' }}>
          <div className="badge-turquoise" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Utensils size={14} /> O'zbekiston Milliy Gastronomiyasi
          </div>

          {/* Active City Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(7, 13, 30, 0.9)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
            <MapPin size={14} color="var(--accent-gold)" />
            <span style={{ fontSize: '12px', color: 'var(--text-gold)', fontWeight: 800 }}>Hududni Tanlang:</span>
            <select
              value={selectedCityFilter}
              onChange={(e) => {
                const newCity = e.target.value;
                setSelectedCityFilter(newCity);
                if (CITIES[newCity]) {
                  setManualCity(newCity, CITIES[newCity].lat, CITIES[newCity].lng);
                }
              }}
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
                <option key={c} value={c} style={{ background: '#0D1630', color: '#ffffff' }}>
                  {c} ({CITIES[c]?.region || 'Viloyat'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
          🍲 O'zbekiston Milliy Taomlar Ensiklopediyasi
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '750px', lineHeight: 1.6, margin: 0 }}>
          Siz hozir <strong>{CITIES[selectedCityFilter]?.localName || selectedCityFilter} ({selectedCityFilter})</strong> hududidasiz.
          Quyidagi taomlar ushbu viloyatning eng mashhur brendlari, narxlari va choyxonalari bo'yicha dinamik moslashtirildi.
        </p>

        {/* Local Highlights Badge */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setOnlyLocalDishes(!onlyLocalDishes)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: onlyLocalDishes ? '#10B981' : 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              color: onlyLocalDishes ? '#070D1E' : '#34D399',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={14} />
            <span>Faqat {CITIES[selectedCityFilter]?.localName || selectedCityFilter} Mahalliy Taomlari ({onlyLocalDishes ? 'Faol' : 'Barchasi'})</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
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
              placeholder="Taom nomi, tarkibi yoki viloyat bo'yicha izlash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '13px',
                width: '100%'
              }}
            />
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Ko'rsatilmoqda: <strong style={{ color: 'var(--accent-turquoise)' }}>{filteredDishes.length}</strong> ta taom
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                background: selectedCategory === cat ? 'linear-gradient(135deg, var(--accent-turquoise), #028090)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat ? '#070D1E' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat ? 800 : 500,
                fontSize: '12.5px',
                border: `1px solid ${selectedCategory === cat ? 'var(--accent-turquoise)' : 'var(--border-subtle)'}`,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
        {filteredDishes.map((dish) => {
          const dynamic = getDynamicDishData(dish, selectedCityFilter);
          const isSelected = selectedDish.id === dish.id;
          const isNativeToCurrentCity = dish.originCity.toLowerCase() === selectedCityFilter.toLowerCase();

          return (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="glass-panel"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected
                  ? '2px solid var(--accent-turquoise)'
                  : isNativeToCurrentCity
                  ? '1px solid rgba(16, 185, 129, 0.5)'
                  : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 24px rgba(0, 168, 150, 0.35)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
            >
              {/* Card Image */}
              <div style={{ position: 'relative', height: '170px' }}>
                <img src={dish.imageUrl} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                {/* Native Region Tag */}
                {isNativeToCurrentCity && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: '#10B981',
                    color: '#070D1E',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10.5px',
                    fontWeight: 900,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    ★ {selectedCityFilter} Maxsus Brendi
                  </div>
                )}

                {/* Rating Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(7, 13, 30, 0.9)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    color: 'var(--accent-gold)'
                  }}
                >
                  <Star size={12} fill="var(--accent-gold)" />
                  <span>{dynamic.rating}</span>
                </div>

                {/* Origin Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    background: 'rgba(7, 13, 30, 0.85)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MapPin size={10} color="var(--accent-turquoise)" />
                  <span>{dish.originCity}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.3 }}>
                  {dish.name}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {dish.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{selectedCityFilter}dagi narxi:</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-turquoise)' }}>
                      {dynamic.priceRange}
                    </div>
                  </div>

                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: isSelected ? 'var(--accent-turquoise)' : 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    Batafsil <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED DISH COMPREHENSIVE DETAIL PANEL */}
      {selectedDish && (
        <div
          className="glass-panel"
          style={{
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid var(--border-turquoise)',
            background: 'linear-gradient(135deg, rgba(7, 13, 30, 0.98), rgba(13, 22, 48, 0.95))',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge-turquoise" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {selectedDish.category}
                </span>
                {isSelectedDishNative && (
                  <span style={{ background: '#10B981', color: '#070D1E', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 900 }}>
                    ★ {selectedCityFilter}ning Haqiqiy Mahalliy Taomi
                  </span>
                )}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedDish.unit}</span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                {selectedDish.name}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedDish.description}
              </p>
            </div>

            {/* Price & Rating Highlight for Selected Region */}
            <div style={{ background: 'rgba(0, 168, 150, 0.1)', padding: '16px 22px', borderRadius: '16px', border: '1px solid var(--border-active)', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {selectedCityFilter} bo'yicha o'rtacha narx:
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--accent-turquoise)', margin: '4px 0' }}>
                {currentDishDynamic.priceRange}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-gold)', fontWeight: 700 }}>
                ★ {currentDishDynamic.rating} reyting ({selectedCityFilter})
              </div>
            </div>
          </div>

          {/* Ingredients & Best Time */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--text-gold)', fontWeight: 800, marginBottom: '8px' }}>
                🥗 Asosiy Masalliqlar:
              </h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selectedDish.ingredients.map((ing, i) => (
                  <span key={i} style={{ fontSize: '11.5px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                    • {ing}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--accent-turquoise)', fontWeight: 800, marginBottom: '8px' }}>
                ⏰ Tavsiya Etilgan Vaqt:
              </h4>
              <div style={{ fontSize: '13px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="var(--accent-turquoise)" />
                <span>{selectedDish.bestTime}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Tarix: {selectedDish.historyFact}
              </div>
            </div>
          </div>

          {/* Top Local Spots in Selected City */}
          <div>
            <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--accent-gold)" /> {selectedCityFilter}dagi Eng Mashhur Joylar & Choyxonalar:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {currentDishDynamic.spots.map((spot, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff' }}>{spot.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 800 }}>★ {spot.rating}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{spot.address}</div>
                  {spot.highlight && (
                    <div style={{ fontSize: '11px', color: 'var(--accent-turquoise)', fontStyle: 'italic' }}>
                      "{spot.highlight}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
