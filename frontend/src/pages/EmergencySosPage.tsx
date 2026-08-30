import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Building2,
  HeartPulse,
  Volume2,
  AlertTriangle,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Search
} from 'lucide-react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

interface Embassy {
  country: string;
  flag: string;
  phone: string;
  emergency: string;
  address: string;
}

const EMBASSIES: Embassy[] = [
  { country: "AQSH (USA)", flag: "🇺🇸", phone: "+998 78 120 54 50", emergency: "+998 78 120 54 50", address: "Toshkent sh., Mayqo'rg'on ko'chasi 3" },
  { country: "Rossiya (Russia)", flag: "🇷🇺", phone: "+998 78 120 35 04", emergency: "+998 78 120 35 04", address: "Toshkent sh., Nukus ko'chasi 83" },
  { country: "Turkiya (Turkey)", flag: "🇹🇷", phone: "+998 78 113 03 00", emergency: "+998 78 113 03 00", address: "Toshkent sh., G'ulomov ko'chasi 87" },
  { country: "Germaniya (Germany)", flag: "🇩🇪", phone: "+998 78 120 84 40", emergency: "+998 78 120 84 40", address: "Toshkent sh., Sharaf Rashidov ko'chasi 15" },
  { country: "Xitoy (China)", flag: "🇨🇳", phone: "+998 71 233 80 88", emergency: "+998 71 233 80 88", address: "Toshkent sh., G'ulomov ko'chasi 79" },
  { country: "Buyuk Britaniya (UK)", flag: "🇬🇧", phone: "+998 78 120 15 00", emergency: "+998 78 120 15 00", address: "Toshkent sh., Gulyamov ko'chasi 67" },
  { country: "Janubiy Koreya (South Korea)", flag: "🇰🇷", phone: "+998 71 252 31 51", emergency: "+998 71 252 31 51", address: "Toshkent sh., Afrosiyob ko'chasi 7" },
  { country: "Fransiya (France)", flag: "🇫🇷", phone: "+998 71 232 81 00", emergency: "+998 71 232 81 00", address: "Toshkent sh., Istiqbol ko'chasi 25" }
];

const MEDICAL_PHRASES: Partial<Record<LanguageCode, { uz: string; translated: string; phonetic: string }[]>> = {
  uz: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "Menga tez yordam chaqirib bering!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "Eng yaqin 24 soatlik dorixona qayerda?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "Mening bu doriga allergiyam bor.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "Pasportimni / hamyonimni yo'qotib qo'ydim.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  en: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "Please call an ambulance for me!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "Where is the nearest 24/7 pharmacy?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "My blood pressure is high / my heart hurts.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "I am allergic to this medicine.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "I lost my passport / wallet.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  ru: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "Пожалуйста, вызовите мне скорую помощь!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "Где находится ближайшая круглосуточная аптека?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "У меня поднялось давление / болит сердце.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "У меня аллергия на это лекарство.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "Я потерял свой паспорт / кошелек.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  tr: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "Lütfen bana bir ambulans çağırın!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "En yakın 24 saat açık eczane nerede?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "Tansiyonum yükseldi / kalbim ağrıyor.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "Bu ilaca alerjim var.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "Pasaportumu / cüzdanımı kaybettim.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  de: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "Bitte rufen Sie einen Krankenwagen für mich!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "Wo ist die nächste 24-Stunden-Apotheke?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "Mein Blutdruck ist hoch / mein Herz schmerzt.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "Ich bin allergisch gegen dieses Medikament.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "Ich habe meinen Pass / meine Brieftasche verloren.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  fr: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "Veuillez m'appeler une ambulance s'il vous plaît !", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "Où se trouve la pharmacie 24h/24 la plus proche ?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "Ma tension est élevée / j'ai mal au cœur.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "Je suis allergique à ce médicament.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "J'ai perdu mon passeport / portefeuille.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  es: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "¡Por favor, llame a una ambulancia!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "¿Dónde está la farmacia 24 horas más cercana?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "Tengo la presión alta / me duele el corazón.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "Soy alérgico a este medicamento.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "He perdido mi pasaporte / billetera.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  zh: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "请帮我叫救护车！", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "最近的24小时药店在哪里？", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "我血压升高了/心脏不适。", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "我对这种药物过敏。", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "我把护照/钱包弄丢了。", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  ja: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "救急車を呼んでください！", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "最寄りの24時間営業の薬局はどこですか？", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "血圧が上がっています / 心臓が苦しいです。", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "この薬にアレルギーがあります。", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "パスポート / 財布を紛失しました。", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ],
  ko: [
    { uz: "Menga tez yordam chaqirib bering!", translated: "구급차를 불러주세요!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
    { uz: "Eng yaqin 24 soatlik dorixona qayerda?", translated: "가장 가까운 24시간 약국이 어디인가요?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
    { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", translated: "혈압이 올랐어요 / 가슴이 답답해요.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
    { uz: "Mening bu doriga allergiyam bor.", translated: "이 약에 알레르기가 있습니다.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
    { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", translated: "여권 / 지갑을 잃어버렸습니다.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
  ]
};

const SOS_TITLES: Partial<Record<LanguageCode, {
  badge: string;
  activeLines: string;
  title: string;
  subtitle: string;
  oneTapCall: string;
  police: string;
  policeDesc: string;
  rescue: string;
  rescueDesc: string;
  ambulance: string;
  ambulanceDesc: string;
  militia: string;
  militiaDesc: string;
  medicalPhrasesTitle: string;
  embassiesTitle: string;
  searchEmbassy: string;
}>> = {
  uz: {
    badge: "24/7 Sayyohlik Xavfsizligi",
    activeLines: "● Tezkor aloqa liniyalari faol",
    title: "🆘 Sayyoh SOS & Favqulodda Yordam",
    subtitle: "O'zbekistonda sayyohlik politsiyasi, tez tibbiy yordam va elchixonalar bilan 1 ta teginishda bog'lanish.",
    oneTapCall: "1-Bosishda Qo'ng'iroq Qilish",
    police: "Sayyohlik Politsiyasi",
    policeDesc: "Ingliz, Rus, Turk tillarida yordam",
    rescue: "Yagona Qutqaruv (MChS)",
    rescueDesc: "Barcha favqulodda holatlar",
    ambulance: "Tez Tibbiy Yordam",
    ambulanceDesc: "Kasalxona va shoshilinch feldsher",
    militia: "Ichki Ishlar (Militsiya)",
    militiaDesc: "Xavfsizlik va huquqiy yordam",
    medicalPhrasesTitle: "Tibbiy & Favqulodda O'zbekcha Iboralar (Ovozli)",
    embassiesTitle: "Toshkentdagi Xorijiy Elchixonalar",
    searchEmbassy: "Davlat nomi bo'yicha qidirish..."
  },
  en: {
    badge: "24/7 Tourist Safety & Security",
    activeLines: "● Fast Emergency Lines Active",
    title: "🆘 Tourist SOS & Emergency Assistance",
    subtitle: "One-touch direct calling for Tourist Police, Ambulance, Rescue, and Foreign Embassies in Uzbekistan.",
    oneTapCall: "1-Tap Emergency Hotlines",
    police: "Tourist Police",
    policeDesc: "Assistance in English, Russian & Turkish",
    rescue: "Emergency Rescue (112)",
    rescueDesc: "All general emergencies",
    ambulance: "Medical Ambulance",
    ambulanceDesc: "Hospital & urgent paramedics",
    militia: "Police & Security",
    militiaDesc: "Safety and legal assistance",
    medicalPhrasesTitle: "Essential Uzbek Medical & Emergency Phrases (Audio)",
    embassiesTitle: "Foreign Embassies in Tashkent",
    searchEmbassy: "Search embassy by country name..."
  },
  ru: {
    badge: "24/7 Безопасность Туристов",
    activeLines: "● Экстренные линии активны",
    title: "🆘 SOS и Экстренная Помощь Туристу",
    subtitle: "Связь в один клик с туристической полицией, скорой помощью и посольствами в Узбекистане.",
    oneTapCall: "Экстренный вызов в 1 клик",
    police: "Туристическая Полиция",
    policeDesc: "Помощь на английском, русском и турецком",
    rescue: "Единая Служба Спасения (МЧС)",
    rescueDesc: "Все чрезвычайные ситуации",
    ambulance: "Скорая Медицинская Помощь",
    ambulanceDesc: "Больницы и неотложные вызовы",
    militia: "Органы Внутренних Дел",
    militiaDesc: "Безопасность и правовая помощь",
    medicalPhrasesTitle: "Медицинские и экстренные фразы на узбекском (Аудио)",
    embassiesTitle: "Иностранные Посольства в Ташкенте",
    searchEmbassy: "Поиск посольства по стране..."
  },
  tr: {
    badge: "7/24 Turist Güvenliği",
    activeLines: "● Acil hatlar aktif",
    title: "🆘 Turist SOS & Acil Yardım",
    subtitle: "Özbekistan'da turist polisi, ambulans ve büyükelçiliklere tek dokunuşla ulaşın.",
    oneTapCall: "Tek Dokunuşla Acil Arama",
    police: "Turizm Polisi",
    policeDesc: "İngilizce, Rusça ve Türkçe destek",
    rescue: "Acil Kurtarma (MÇS)",
    rescueDesc: "Tüm acil durumlar",
    ambulance: "Acil Tıbbi Yardım (Ambulans)",
    ambulanceDesc: "Hastaneler ve acil sağlık",
    militia: "Emniyet Müdürlüğü",
    militiaDesc: "Güvenlik ve yasal yardım",
    medicalPhrasesTitle: "Özbekçe Tıbbi ve Acil Durum Cümleleri (Sesli)",
    embassiesTitle: "Taşkent'teki Yabancı Büyükelçilikler",
    searchEmbassy: "Ülke adına göre büyükelçilik ara..."
  },
  de: {
    badge: "24/7 Touristensicherheit",
    activeLines: "● Notrufleitungen aktiv",
    title: "🆘 Touristen-SOS & Notfallhilfe",
    subtitle: "Direkte One-Touch-Verbindung zu Touristenpolizei, Rettungsdienst und Botschaften in Usbekistan.",
    oneTapCall: "1-Klick-Notrufnummern",
    police: "Touristenpolizei",
    policeDesc: "Hilfe auf Englisch, Russisch & Türkisch",
    rescue: "Rettungsdienst (112)",
    rescueDesc: "Alle allgemeinen Notfälle",
    ambulance: "Krankenwagen / Notarzt",
    ambulanceDesc: "Krankenhaus und Rettungsdienst",
    militia: "Polizei & Sicherheit",
    militiaDesc: "Sicherheit und rechtliche Hilfe",
    medicalPhrasesTitle: "Wichtige usbekische Notfallsätze (Audio)",
    embassiesTitle: "Ausländische Botschaften in Taschkent",
    searchEmbassy: "Botschaft nach Land suchen..."
  },
  fr: {
    badge: "Sécurité Touriste 24/7",
    activeLines: "● Lignes d'urgence actives",
    title: "🆘 SOS Touriste & Urgences",
    subtitle: "Contact direct en 1 clic avec la police touristique, les urgences et les ambassades en Ouzbékistan.",
    oneTapCall: "Appel d'Urgence en 1 Clic",
    police: "Police Touristique",
    policeDesc: "Assistance en anglais, russe et turc",
    rescue: "Services de Sauvetage (112)",
    rescueDesc: "Toutes urgences générales",
    ambulance: "Ambulance Médicale",
    ambulanceDesc: "Hôpitaux et premiers secours",
    militia: "Police & Sécurité",
    militiaDesc: "Sécurité et assistance légale",
    medicalPhrasesTitle: "Phrases d'Urgence en Ouzbek (Audio)",
    embassiesTitle: "Ambassades Étrangères à Tachkent",
    searchEmbassy: "Rechercher une ambassade..."
  },
  es: {
    badge: "Seguridad Turística 24/7",
    activeLines: "● Líneas de emergencia activas",
    title: "🆘 SOS para Turistas y Emergencias",
    subtitle: "Contacto directo en 1 toque con la Policía Turística, Ambulancias y Embajadas en Uzbekistán.",
    oneTapCall: "Llamada de Emergencia en 1 Toque",
    police: "Policía Turística",
    policeDesc: "Asistencia en inglés, ruso y turco",
    rescue: "Servicio de Rescate (112)",
    rescueDesc: "Todas las emergencias generales",
    ambulance: "Ambulancia Médica",
    ambulanceDesc: "Hospitales y paramédicos",
    militia: "Policía y Seguridad",
    militiaDesc: "Seguridad y ayuda legal",
    medicalPhrasesTitle: "Frases Médicas de Emergencia en Uzbeko (Audio)",
    embassiesTitle: "Embajadas Extranjeras en Taskent",
    searchEmbassy: "Buscar embajada por país..."
  },
  zh: {
    badge: "24/7 游客全天候安全保障",
    activeLines: "● 紧急求助专线畅通",
    title: "🆘 游客 SOS 紧急救援协助",
    subtitle: "一键直拨乌兹别克斯坦旅游警察、急救中心及驻乌使领馆。",
    oneTapCall: "一键紧急求助热线",
    police: "旅游警察",
    policeDesc: "提供英语、俄语及土耳其语支持",
    rescue: "综合应急救援 (112)",
    rescueDesc: "所有紧急突发状况",
    ambulance: "医疗急救中心 (103)",
    ambulanceDesc: "医院抢救与紧急医护",
    militia: "治安与警察 (102)",
    militiaDesc: "人身安全与法律援助",
    medicalPhrasesTitle: "实用乌兹别克语医疗求助应急短语（带发音）",
    embassiesTitle: "各国驻塔什干大使馆",
    searchEmbassy: "按国家名称搜索使领馆..."
  },
  ja: {
    badge: "24時間 観光客安全サポート",
    activeLines: "● 緊急連絡窓口稼働中",
    title: "🆘 観光客SOS＆緊急サポート",
    subtitle: "ウズベキスタンの観光警察、救急車、各国大使館へワンタップで発信できます。",
    oneTapCall: "ワンタップ緊急発信",
    police: "観光警察",
    policeDesc: "英語・ロシア語・トルコ語対応",
    rescue: "総合救助センター (112)",
    rescueDesc: "あらゆる緊急事態に対応",
    ambulance: "救急車・医療搬送 (103)",
    ambulanceDesc: "病院および救急救命士",
    militia: "警察・保安機関 (102)",
    militiaDesc: "治安・法的支援",
    medicalPhrasesTitle: "ウズベク語 緊急・医療フレーズ（音声付）",
    embassiesTitle: "タシュケント所在の外国大使館",
    searchEmbassy: "国名で大使館を検索..."
  },
  ko: {
    badge: "24시간 여행자 안전 지원",
    activeLines: "● 긴급 핫라인 활성화",
    title: "🆘 여행자 SOS & 긴급 지원",
    subtitle: "우즈베키스탄 관광 경찰, 응급 구급차, 대사관으로 원터치 긴급 연결.",
    oneTapCall: "원터치 긴급 전화",
    police: "관광 경찰 (Tourist Police)",
    policeDesc: "영어, 러시아어, 터키어 안내 지원",
    rescue: "통합 구조대 (112)",
    rescueDesc: "모든 긴급 비상 상황",
    ambulance: "응급 구급차 (103)",
    ambulanceDesc: "병원 및 응급 처치",
    militia: "경찰 및 치안 (102)",
    militiaDesc: "신변 안전 및 법적 지원",
    medicalPhrasesTitle: "우즈베크어 필수 응급·의료 표현 (오디오 발음)",
    embassiesTitle: "타슈켄트 주재 외국 대사관",
    searchEmbassy: "국가명으로 대사관 검색..."
  }
};

export const EmergencySosPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [searchEmbassy, setSearchEmbassy] = useState('');

  const tSos = SOS_TITLES[currentLanguage] || SOS_TITLES.uz!;
  const phrases = MEDICAL_PHRASES[currentLanguage] || MEDICAL_PHRASES.uz!;

  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const filteredEmbassies = EMBASSIES.filter(e =>
    e.country.toLowerCase().includes(searchEmbassy.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Red Alert Header */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(7, 13, 30, 0.95))',
        border: '1px solid rgba(239, 68, 68, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <ShieldAlert size={14} /> {tSos.badge}
          </div>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>{tSos.activeLines}</span>
        </div>
        <h1 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
          {tSos.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
          {tSos.subtitle}
        </p>
      </div>

      {/* 1-Tap Emergency Hotlines */}
      <div>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PhoneCall size={18} color="var(--accent-turquoise)" /> {tSos.oneTapCall}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { title: tSos.police, number: "1173", desc: tSos.policeDesc, color: "var(--accent-turquoise)" },
            { title: tSos.rescue, number: "112", desc: tSos.rescueDesc, color: "#EF4444" },
            { title: tSos.ambulance, number: "103", desc: tSos.ambulanceDesc, color: "#10B981" },
            { title: tSos.militia, number: "102", desc: tSos.militiaDesc, color: "var(--accent-gold)" }
          ].map((item, i) => (
            <a
              key={i}
              href={`tel:${item.number}`}
              className="glass-panel"
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px solid ${item.color}40`,
                textDecoration: 'none',
                transition: 'transform 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '2px 0' }}>{item.number}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                <PhoneCall size={20} />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Essential Medical & Police Phrases */}
      <div>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartPulse size={18} color="#EF4444" /> {tSos.medicalPhrasesTitle}
        </h2>

        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {phrases.map((phrase, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#fff' }}>"{phrase.uz}"</div>
                <div style={{ fontSize: '12px', color: 'var(--text-turquoise)', marginTop: '2px' }}>Talaffuz: {phrase.phonetic}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{phrase.translated}</div>
              </div>

              <button
                onClick={() => speakPhrase(phrase.uz)}
                className="btn-secondary"
                style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', flexShrink: 0 }}
                title="Ovoz chiqarib o'qish"
              >
                <Volume2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Embassies Directory */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--accent-gold)" /> {tSos.embassiesTitle}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', width: '260px' }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder={tSos.searchEmbassy}
              value={searchEmbassy}
              onChange={(e) => setSearchEmbassy(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {filteredEmbassies.map((emb, i) => (
            <div key={i} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{emb.flag}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{emb.country}</span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                📍 {emb.address}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href={`tel:${emb.phone}`}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '6px', fontSize: '11px', textDecoration: 'none', justifyContent: 'center' }}
                >
                  <PhoneCall size={12} /> {emb.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
