import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Destination } from '../types';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

interface DestinationsPageProps {
  onSelectCity: (cityName: string) => void;
}

const DESTINATION_LOCALES: Partial<Record<LanguageCode, Record<string, { name: string; region: string; description: string }>>> = {
  uz: {
    Samarkand: {
      name: "Samarqand",
      region: "Samarqand viloyati",
      description: "Buyuk Ipak yo'lining afsonaviy yuragi. Registon maydoni, Go'ri Amir, Shohi Zinda kabi firuza gumbazli jahon durdonalari joylashgan qadimiy shahar."
    },
    Bukhara: {
      name: "Buxoro",
      region: "Buxoro viloyati",
      description: "2500 yillik tirik ochiq osmon ostidagi muzey. Minorai Kalon, Ark qal'asi, Labi Hovuz va qadimiy gumbazli savdo rastalari maskani."
    },
    Khiva: {
      name: "Xiva",
      region: "Xorazm viloyati",
      description: "To'liq saqlanib qolgan o'rta asr sharq ertagi — Ichan Qal'a, Kalta Minor, Toshhovli saroyi va qadimiy xorazm me'morchiligi."
    },
    Tashkent: {
      name: "Toshkent",
      region: "Toshkent shahri",
      description: "Markaziy Osiyoning zamonaviy megapolisi. Go'zal metropoliten bekatlari, Hazrati Imomdagi qadimiy Usmon Qur'oni va gavjum Chorsu bozori."
    },
    'Tashkent Region': {
      name: "Toshkent Viloyati",
      region: "Bo'stonliq / Chimyon",
      description: "Tyan-Shan tog' tizmasi bag'ridagi so'lim go'shalar — Amirsoy jahon darajasidagi tog' kurorti, firuza Chorvoq suv ombori va alp cho'qqilari."
    },
    Kashkadarya: {
      name: "Qashqadaryo",
      region: "Shahrisabz / Qarshi",
      description: "Sohibqiron Amir Temur tug'ilgan zamin. Muhtasham Oqsaroy qoldiqlari, Dorut Tilovat majmuasi va go'zal Zarafshon tog' manzaralari."
    },
    Surkhandarya: {
      name: "Surxondaryo",
      region: "Termiz / Boysun",
      description: "Qadimiy Baqtriya va buddaviylik yodgorliklari (Fayoztepa, Qoratepa), muqaddas Hakim at-Termiziy va YUNESKO merosi bo'lgan Boysun madaniyati."
    },
    Fergana: {
      name: "Farg'ona",
      region: "Marg'ilon / Qo'qon / Rishton",
      description: "Hunarmandchilik beshigi: Qo'qon Xudoyorxon saroyi, Marg'ilon tabiiy ipak to'qish fabrikalari va Rishton feruza kulolchiligi."
    },
    Andijan: {
      name: "Andijon",
      region: "Andijon viloyati",
      description: "Zahiriddin Muhammad Bobur vatani. Bobur milliy bog'i, xushmanzara yashil vodiylar va mashhur hunarmandlar rastalari."
    },
    Namangan: {
      name: "Namangan",
      region: "Namangan viloyati",
      description: "Gullar shahri, qadimiy Axsikent arxeologik yodgorligi, afsonaviy Chust pichoqsozlik san'ati va Afsonalar Vodiysi bog'i."
    },
    Jizzakh: {
      name: "Jizzax",
      region: "Zomin / Baxmal",
      description: "O'zbekiston Shveytsariyasi hisoblangan Zomin milliy tabiat bog'i, toza tog' archazorlari va shifobaxsh buloqlar."
    },
    Syrdarya: {
      name: "Sirdaryo",
      region: "Guliston / Sirdaryo",
      description: "Buyuk Sirdaryo daryosi qirg'oqlari bo'ylab cho'zilgan quyoshli vohalar, baliqchilik va mehmondo'st dasht tabiati."
    },
    Navoiy: {
      name: "Navoiy",
      region: "Nurota / Qizilqum",
      description: "Qadimiy Nurota chashmasi, Sarmishsoy qoyatosh rasmlari va Qizilqum cho'lidagi Aydarko'l o'tovli safari lagerlari."
    },
    Karakalpakstan: {
      name: "Qoraqalpog'iston",
      region: "Nukus / Mo'ynoq",
      description: "Dunyoga mashhur Savitskiy avangard san'ati muzeyi, Orolbo'yi manzaralari va Mo'ynoqdagi kemalar qabristoni."
    }
  },
  en: {
    Samarkand: {
      name: "Samarkand",
      region: "Samarkand Region",
      description: "The legendary heart of the Great Silk Road. Home to Registan Square, Gur-e-Amir, and Shah-i-Zinda necropolis."
    },
    Bukhara: {
      name: "Bukhara",
      region: "Bukhara Region",
      description: "A 2,500-year-old living open-air museum. Featuring Kalyan Minaret, the Ark Citadel, and Lyabi-Khauz square."
    },
    Khiva: {
      name: "Khiva",
      region: "Khorezm Region",
      description: "A remarkably preserved medieval Silk Road fairy tale — Ichan-Kala fortress, Kalta Minor, and ancient palace halls."
    },
    Tashkent: {
      name: "Tashkent",
      region: "Tashkent City",
      description: "The vibrant capital of Central Asia. Ornate Soviet-era metro stations, the Holy Quran of Uthman, and Chorsu Bazaar."
    },
    'Tashkent Region': {
      name: "Tashkent Region",
      region: "Bostanliq / Chimgan",
      description: "Tian Shan mountains, Amirsoy world-class ski resort, turquoise Charvak reservoir, and alpine hiking trails."
    },
    Kashkadarya: {
      name: "Kashkadarya",
      region: "Shahrisabz / Karshi",
      description: "Birthplace of Emperor Amir Timur. Monumental Ak-Saray Palace ruins, Dorut Tilavat, and Zeravshan mountains."
    },
    Surkhandarya: {
      name: "Surkhandarya",
      region: "Termez / Baysun",
      description: "Ancient Buddhist sites (Fayaztepa), sacred Hakim al-Termizi complex, and UNESCO-listed Boysun folklore culture."
    },
    Fergana: {
      name: "Fergana",
      region: "Margilan / Kokand / Rishtan",
      description: "Cradle of Central Asian handicrafts: Kokand Palace of Khudayar Khan, Margilan silk mills, and Rishtan ceramics."
    },
    Andijan: {
      name: "Andijan",
      region: "Andijan Region",
      description: "Birthplace of Mughal Emperor Babur. Verdant gardens, Bogi Babur memorial park, and bustling craft bazaars."
    },
    Namangan: {
      name: "Namangan",
      region: "Namangan Region",
      description: "The City of Flowers, ancient Aksikent fortress, legendary Chust master knife-makers, and Valley of Legends park."
    },
    Jizzakh: {
      name: "Jizzakh",
      region: "Zaamin / Bakhmal",
      description: "Known as the Switzerland of Uzbekistan — Zaamin National Park, pristine pine forests, and healing springs."
    },
    Syrdarya: {
      name: "Syrdarya",
      region: "Gulistan / Syrdarya",
      description: "Sunny river valleys along the historic Syr Darya River, renowned for rich melon farming and hospitable traditions."
    },
    Navoiy: {
      name: "Navoiy",
      region: "Nurata / Kyzylkum",
      description: "Sacred Chashma holy spring of Nurata, ancient Sarmishsay petroglyphs, and Aydarkul desert yurt camps."
    },
    Karakalpakstan: {
      name: "Karakalpakstan",
      region: "Nukus / Muynak",
      description: "Home to the world-renowned Savitsky Avant-Garde Museum, Aral Sea landscapes, and Muynak ship cemetery."
    }
  },
  ru: {
    Samarkand: {
      name: "Самарканд",
      region: "Самаркандская область",
      description: "Легендарное сердце Великого Шёлкового пути. Площадь Регистан, мавзолей Гур-Эмир и ансамбль Шахи-Зинда."
    },
    Bukhara: {
      name: "Бухара",
      region: "Бухарская область",
      description: "Живой музей под открытым небом с историей в 2500 лет. Минарет Калян, цитадель Арк и площадь Ляби-Хауз."
    },
    Khiva: {
      name: "Хива",
      region: "Хорезмская область",
      description: "Идеально сохранившаяся восточная сказка — крепость Ичан-Кала, Кальта-Минар и древние ханские дворцы."
    },
    Tashkent: {
      name: "Ташкент",
      region: "Город Ташкент",
      description: "Современный мегаполис Центральной Азии. Великолепное метро, Коран Усмана в Хазрати Имаме и базар Чорсу."
    },
    'Tashkent Region': {
      name: "Ташкентская Область",
      region: "Бостанлык / Чимган",
      description: "Горы Западного Тянь-Шаня, всесезонный курорт Амирсой, бирюзовое Чарвакское водохранилище и альпийские пики."
    },
    Kashkadarya: {
      name: "Кашкадарья",
      region: "Шахрисабз / Карши",
      description: "Родина Амира Тимура. Руины грандиозного дворца Аксарай, комплекс Дорут Тилават и горные хребты."
    },
    Surkhandarya: {
      name: "Сурхандарья",
      region: "Термез / Байсун",
      description: "Древние буддийские монастыри (Фаязтепа), комплекс Хакима ат-Термези и культура Байсуна из списка ЮНЕСКО."
    },
    Fergana: {
      name: "Фергана",
      region: "Маргилан / Коканд / Риштан",
      description: "Колыбель ремёсел: дворец Худояр-хана в Коканде, маргиланский шёлк и риштанская лазурная керамика."
    },
    Andijan: {
      name: "Андижан",
      region: "Андижанская область",
      description: "Родина Захириддина Мухаммада Бабура. Парк Бабура, зеленые фруктовые сады и традиционные базары."
    },
    Namangan: {
      name: "Наманган",
      region: "Наманганская область",
      description: "Город цветов, древняя крепость Аксикент, чустские ножевые мастера и парк Долина Легенд."
    },
    Jizzakh: {
      name: "Джизак",
      region: "Заамин / Бахмал",
      description: "Узбекская Швейцария — Зааминский национальный природный парк, целебный воздух и горные леса."
    },
    Syrdarya: {
      name: "Сырдарья",
      region: "Гулистан / Сырдарья",
      description: "Солнечные речные долины вдоль реки Сырдарья, щедрые бахчевые поля и гостеприимные традиции."
    },
    Navoiy: {
      name: "Навои",
      region: "Нурата / Кызылкум",
      description: "Священный источник Чашма в Нурате, петроглифы Сармышсая и юртовые сафари-лагеря на озере Айдаркуль."
    },
    Karakalpakstan: {
      name: "Каракалпакстан",
      region: "Нукус / Муйнак",
      description: "Всемирно известный музей авангарда имени Савицкого, просторы Арала и кладбище кораблей в Муйнаке."
    }
  },
  tr: {
    Samarkand: {
      name: "Semerkant",
      region: "Semerkant Bölgesi",
      description: "İpek Yolu'nun efsanevi kalbi. Registan Meydanı, Gur-i Emir ve Şah-ı Zinda gibi turkuaz kubbeli şaheserler."
    },
    Bukhara: {
      name: "Buhara",
      region: "Buhara Bölgesi",
      description: "2500 yıllık açık hava müzesi. Kalyan Minaresi, Ark Kalesi ve tarihi Leb-i Havuz meydanı."
    },
    Khiva: {
      name: "Hiva",
      region: "Harezm Bölgesi",
      description: "Kusursuz korunmuş bir Orta Çağ masalı — İçan-Kale surları, Kalta Minor ve saraylar."
    },
    Tashkent: {
      name: "Taşkent",
      region: "Taşkent Şehri",
      description: "Orta Asya'nın modern başkenti. Sanatsal metro istasyonları, Hazreti İmam ve Çorsu Pazarı."
    },
    'Tashkent Region': {
      name: "Taşkent Bölgesi",
      region: "Çimgan / Çarvak",
      description: "Tanrı Dağları manzarası, Amirsoy kayak merkezi ve turkuaz Çarvak gölü."
    },
    Kashkadarya: {
      name: "Kaşkaderya",
      region: "Şehrisebz",
      description: "Emir Timur'un doğduğu topraklar. Muazzam Ak Saray kalıntıları ve Zeravşan dağları."
    },
    Surkhandarya: {
      name: "Surhanderya",
      region: "Tirmiz / Baysun",
      description: "Tirmiz'in kadim Budist ve İslami eserleri, Hakim et-Tirmizi türbesi ve Baysun kültürü."
    },
    Fergana: {
      name: "Fergana",
      region: "Hokand / Mergilan",
      description: "El sanatları beşiği: Hokand Han Sarayı, Mergilan ipek dokuması ve Rişton seramiği."
    },
    Andijan: {
      name: "Andican",
      region: "Andican Bölgesi",
      description: "Babür Şah'ın doğduğu şehir. Babür Milli Parkı ve yemyeşil Fergana vadisi bahçeleri."
    },
    Namangan: {
      name: "Namangan",
      region: "Namangan Bölgesi",
      description: "Çiçekler şehri, kadim Ahsikent kalesi ve meşhur Çust el yapımı bıçakları."
    },
    Jizzakh: {
      name: "Cizzak",
      region: "Zaamin Milli Parkı",
      description: "Özbekistan'ın İsviçresi olarak bilinen Zaamin Milli Parkı ve çam ormanları."
    },
    Syrdarya: {
      name: "Sirderya",
      region: "Gülistan",
      description: "Seyhun (Sirdaryo) nehri kıyısındaki bereketli vadiler ve misafirperverlik."
    },
    Navoiy: {
      name: "Navoiy",
      region: "Nurata / Çöl",
      description: "Nurata Çeşme kutsal kaynağı, Sarmışsay kaya resimleri ve Aydarkul çöl çadırları."
    },
    Karakalpakstan: {
      name: "Karakalpakistan",
      region: "Nukus / Moynak",
      description: "Dünyaca ünlü Savitskiy Müzesi, Aral Gölü ve Moynak gemi mezarlığı."
    }
  },
  de: {
    Samarkand: {
      name: "Samarkand",
      region: "Region Samarkand",
      description: "Das legendäre Herz der Seidenstraße mit dem Registan, Gur-Emir und Schah-i Sinda."
    },
    Bukhara: {
      name: "Buchara",
      region: "Region Buchara",
      description: "Ein 2.500 Jahre altes Freilichtmuseum mit dem Kalyan-Minarett und der Zitadelle Ark."
    },
    Khiva: {
      name: "Chiwa",
      region: "Region Choresmien",
      description: "Ein perfekt erhaltenes Märchen der Seidenstraße: Ichan-Kala und Kalta Minor."
    },
    Tashkent: {
      name: "Taschkent",
      region: "Stadt Taschkent",
      description: "Die moderne Metropole Zentralasiens mit kunstvollen Metrostationen und dem Chorsu-Basar."
    },
    'Tashkent Region': {
      name: "Region Taschkent",
      region: "Bostanliq / Chimgan",
      description: "Tien-Shan-Gebirge, Amirsoy-Skiresort und der türkisfarbene Charvak-Stausee."
    },
    Kashkadarya: {
      name: "Kaschkadarja",
      region: "Schachrisabs",
      description: "Geburtsort von Amir Timur mit den majestätischen Ruinen des Ak-Saray-Palastes."
    },
    Surkhandarya: {
      name: "Surchandarja",
      region: "Termis / Boysun",
      description: "Antike buddhistische Stätten und UNESCO-Weltkulturerbe in Boysun."
    },
    Fergana: {
      name: "Fergana",
      region: "Margilan / Kokand",
      description: "Wiege des Kunsthandwerks: Palast von Chudayar Khan und Margilan-Seide."
    },
    Andijan: {
      name: "Andischan",
      region: "Region Andischan",
      description: "Geburtsort von Kaiser Babur mit üppigen Gärten und traditionellen Basaren."
    },
    Namangan: {
      name: "Namangan",
      region: "Region Namangan",
      description: "Stadt der Blumen, antike Festung Aksikent und traditionelle Chust-Messer."
    },
    Jizzakh: {
      name: "Dschissach",
      region: "Zaamin-Nationalpark",
      description: "Die usbekische Schweiz mit dichten Bergwäldern und heilsamer Bergluft."
    },
    Syrdarya: {
      name: "Syrdarja",
      region: "Gulistan",
      description: "Sonnige Flussoasen entlang des historischen Syrdarja-Flusses."
    },
    Navoiy: {
      name: "Nawoi",
      region: "Nurata / Wüste",
      description: "Heilige Quelle Chaschma und Jurten-Camps am Aydarkul-See."
    },
    Karakalpakstan: {
      name: "Karakalpakstan",
      region: "Nukus / Mujnak",
      description: "Berühmtes Sawizki-Kunstmuseum und der Schiffsfriedhof von Mujnak."
    }
  },
  fr: {
    Samarkand: {
      name: "Samarcande",
      region: "Région de Samarcande",
      description: "Le cœur légendaire de la Route de la Soie avec le Régistan et Gour-Emir."
    },
    Bukhara: {
      name: "Boukhara",
      region: "Région de Boukhara",
      description: "Musée à ciel ouvert vieux de 2500 ans avec le minaret Kalyan et la citadelle Ark."
    },
    Khiva: {
      name: "Khiva",
      region: "Région de Khorezm",
      description: "Un conte oriental préservé : la forteresse d'Itchan Kala et Kalta Minor."
    },
    Tashkent: {
      name: "Tachkent",
      region: "Ville de Tachkent",
      description: "Capitale moderne d'Asie centrale, célèbre pour son métro et le bazar Chorsu."
    },
    'Tashkent Region': {
      name: "Région de Tachkent",
      region: "Bostanliq / Chimgan",
      description: "Montagnes du Tian Shan, station de ski Amirsoy et lac turquoise de Tcharvak."
    },
    Kashkadarya: {
      name: "Kachkadaria",
      region: "Chakhrisabz",
      description: "Terre natale de Tamerlan avec les ruines monumentales du palais Ak-Saray."
    },
    Surkhandarya: {
      name: "Sourkhandaria",
      region: "Termez / Baysun",
      description: "Sites bouddhistes anciens et traditions culturelles de Baysun classées par l'UNESCO."
    },
    Fergana: {
      name: "Ferghana",
      region: "Marguilan / Kokand",
      description: "Berceau de l'artisanat : soieries de Marguilan et céramiques de Rishtan."
    },
    Andijan: {
      name: "Andijan",
      region: "Région d'Andijan",
      description: "Terre natale de l'empereur Babour, célèbre pour ses jardins verdoyants."
    },
    Namangan: {
      name: "Namangan",
      region: "Région de Namangan",
      description: "La Cité des Fleurs, la forteresse d'Aksikent et les couteaux de Tchoust."
    },
    Jizzakh: {
      name: "Djizak",
      region: "Parc National de Zaamin",
      description: "La Suisse ouzbèke avec ses forêts de pins et ses sources naturelles."
    },
    Syrdarya: {
      name: "Syr-Daria",
      region: "Goulistan",
      description: "Vallées fluviales ensoleillées le long du fleuve Syr-Daria."
    },
    Navoiy: {
      name: "Navoï",
      region: "Nourata / Désert",
      description: "Source sacrée de Chachma et campements de yourtes au lac Aydarkoul."
    },
    Karakalpakstan: {
      name: "Karakalpakstan",
      region: "Noukous / Mouynak",
      description: "Célèbre musée Savitsky et cimetière des bateaux de Mouynak."
    }
  },
  es: {
    Samarkand: {
      name: "Samarcanda",
      region: "Región de Samarcanda",
      description: "El corazón legendario de la Ruta de la Seda con la plaza Registán y Gur-e-Amir."
    },
    Bukhara: {
      name: "Bujará",
      region: "Región de Bujará",
      description: "Museo vivo al aire libre de 2.500 años con el Minarete Kalyan y el Arca."
    },
    Khiva: {
      name: "Jiva",
      region: "Región de Corasmia",
      description: "Un cuento medieval conservado intacto: la fortaleza Ichan-Kala y Kalta Minor."
    },
    Tashkent: {
      name: "Taskent",
      region: "Ciudad de Taskent",
      description: "La cosmopolita capital con impresionantes estaciones de metro y el bazar Chorsu."
    },
    'Tashkent Region': {
      name: "Región de Taskent",
      region: "Bostanliq / Chimgan",
      description: "Montañas de Tian Shan, estación de esquí Amirsoy y el lago Charvak."
    },
    Kashkadarya: {
      name: "Kashkadarria",
      region: "Shahrisabz",
      description: "Cuna de Tamerlán con las ruinas del grandioso Palacio Ak-Saray."
    },
    Surkhandarya: {
      name: "Surjandaria",
      region: "Termez / Baysun",
      description: "Antiguos templos budistas y cultura folclórica de Baysun (UNESCO)."
    },
    Fergana: {
      name: "Ferganá",
      region: "Margilan / Kokand",
      description: "Cuna de la artesanía: seda de Margilan y cerámica de Rishtan."
    },
    Andijan: {
      name: "Andiyán",
      region: "Región de Andiyán",
      description: "Tierra natal del emperador Babur con verdes jardines y bazares tradicionales."
    },
    Namangan: {
      name: "Namangán",
      region: "Región de Namangán",
      description: "La Ciudad de las Flores, antigua fortaleza de Aksikent y cuchillos de Chust."
    },
    Jizzakh: {
      name: "Yizaj",
      region: "Parque Nacional de Zaamin",
      description: "La Suiza uzbeka con bosques de montaña y aire medicinal puro."
    },
    Syrdarya: {
      name: "Sir Daria",
      region: "Gulistán",
      description: "Valles fértiles a orillas del histórico río Sir Daria."
    },
    Navoiy: {
      name: "Navoi",
      region: "Nurata / Desierto",
      description: "Manantial sagrado de Chashma y campamentos de yurtas en Aydarkul."
    },
    Karakalpakstan: {
      name: "Karakalpakistán",
      region: "Nukus / Muynak",
      description: "Museo Savitsky de vanguardia y el cementerio de barcos de Muynak."
    }
  },
  zh: {
    Samarkand: {
      name: "撒马尔罕",
      region: "撒马尔罕州",
      description: "丝绸之路上传奇古都，拥有雷吉斯坦广场、帖木儿陵墓和夏伊辛达碧蓝建筑群。"
    },
    Bukhara: {
      name: "布哈拉",
      region: "布哈拉州",
      description: "拥有2500年历史的活态露天博物馆，卡扬宣礼塔、雅克城堡与拉比哈乌斯广场。"
    },
    Khiva: {
      name: "希瓦",
      region: "花拉子模州",
      description: "保存完好的中世纪丝路童话之城——伊钦卡拉古城与卡尔塔米诺尔宣礼塔。"
    },
    Tashkent: {
      name: "塔什干",
      region: "塔什干直辖市",
      description: "中亚现代化大都市，富丽堂皇的艺术地铁站、哈兹拉提伊玛目清真寺与琼苏巴扎。"
    },
    'Tashkent Region': {
      name: "塔什干州",
      region: "奇姆甘 / 恰尔瓦克",
      description: "天山山脉壮美风光、阿米尔索伊国际滑雪胜地与碧蓝的恰尔瓦克湖。"
    },
    Kashkadarya: {
      name: "卡什卡达里亚",
      region: "沙赫里萨布兹",
      description: "帖木儿大帝故里，拥有宏伟的阿克萨赖宫遗址与泽拉夫尚山脉风景。"
    },
    Surkhandarya: {
      name: "苏尔汉河州",
      region: "铁尔梅兹 / 白顺",
      description: "古老佛教遗址（法雅兹帖木儿）、哈基姆铁尔梅兹圣殿与白顺民俗文化。"
    },
    Fergana: {
      name: "费尔干纳",
      region: "马尔吉兰 / 浩罕",
      description: "中亚传统手工艺摇篮：浩罕汗国宫殿、马尔吉兰丝绸工坊与里什坦陶瓷。"
    },
    Andijan: {
      name: "安集延",
      region: "安集延州",
      description: "莫卧儿王朝开国皇帝巴布尔出生地，拥有巴布尔纪念公园与繁华巴扎。"
    },
    Namangan: {
      name: "纳曼干",
      region: "纳曼干州",
      description: "鲜花之城、阿克西肯特古城遗址与闻名遐迩的楚斯特手工刀剑。"
    },
    Jizzakh: {
      name: "吉扎克",
      region: "扎明国家公园",
      description: "被誉为乌兹别克斯坦的瑞士——扎明国家自然公园与疗养松林。"
    },
    Syrdarya: {
      name: "锡尔河州",
      region: "古利斯坦",
      description: "锡尔河畔的阳光绿洲，以香甜瓜果和热情民风著称。"
    },
    Navoiy: {
      name: "纳沃伊",
      region: "努拉塔 / 克孜勒库姆",
      description: "努拉塔圣泉、萨尔米什赛史前岩画与艾达尔湖沙漠毡房营地。"
    },
    Karakalpakstan: {
      name: "卡拉卡尔帕克斯坦",
      region: "努库斯 / 穆伊纳克",
      description: "享誉世界的萨维茨基先锋艺术博物馆、咸海景观与穆伊纳克沉船墓地。"
    }
  },
  ja: {
    Samarkand: {
      name: "サマルカンド",
      region: "サマルカンド州",
      description: "シルクロードの青の都。レギスタン広場、グーリ・アミール廟、シャーヒ・ズィンダ廟群。"
    },
    Bukhara: {
      name: "ブハラ",
      region: "ブハラ州",
      description: "2500年の歴史を誇る生きた野外博物館。カラーン・ミナレットやアルク城。"
    },
    Khiva: {
      name: "ヒヴァ",
      region: "ホラズム州",
      description: "完璧に残る中世のオアシス都市・イチャン・カラとカルタ・ミナル。"
    },
    Tashkent: {
      name: "タシュケント",
      region: "タシュケント市",
      description: "中央アジアの大都市。美しい地下鉄駅、ハズラティ・イマーム複合体、チョルスー・バザール。"
    },
    'Tashkent Region': {
      name: "タシュケント州",
      region: "チムガン / チャルワク",
      description: "天山山脈の絶景、アミルソイ山岳リゾート、エメラルドグリーンのチャルワク湖。"
    },
    Kashkadarya: {
      name: "カシュカダリヤ",
      region: "シャフリサブス",
      description: "ティムール生誕の地。壮大なアク・サライ宮殿跡と山岳景観。"
    },
    Surkhandarya: {
      name: "スルハンダリヤ",
      region: "テルメズ / バイスン",
      description: "古代仏教遺跡（ファヤズテパ）やユネスコ無形遺産のバイスン伝統文化。"
    },
    Fergana: {
      name: "フェルガナ",
      region: "マルギラン / コーカンド",
      description: "伝統工芸の中心地：コーカンド・ハーン宮殿、マルギラン絹織物、リシタン陶器。"
    },
    Andijan: {
      name: "アンディジャン",
      region: "アンディジャン州",
      description: "ムガル帝国初代皇帝バーブルの生誕地。緑豊かな庭園と工芸バザール。"
    },
    Namangan: {
      name: "ナマンガン",
      region: "ナマンガン州",
      description: "花の街、古代アクシケント遺跡、チュストの伝統手作りナイフ。"
    },
    Jizzakh: {
      name: "ジザフ",
      region: "ザーミン国立公園",
      description: "ウズベキスタンのスイスと呼ばれるザーミン国立公園と針葉樹林。"
    },
    Syrdarya: {
      name: "シルダリヤ",
      region: "グリスタン",
      description: "シルダリヤ川沿いの温暖なオアシスとメロン栽培の里。"
    },
    Navoiy: {
      name: "ナヴォイ",
      region: "ヌラタ / 砂漠",
      description: "聖なる泉チャシュマ、サルミシュサイ岩面画、アイダルクル湖のユルタキャンプ。"
    },
    Karakalpakstan: {
      name: "カラカルパクスタン",
      region: "ヌクス / ムイナク",
      description: "世界的に有名なサヴィツキー美術館、アラル海、ムイナクの船の墓場。"
    }
  },
  ko: {
    Samarkand: {
      name: "사마르칸트",
      region: "사마르칸트 주",
      description: "실크로드의 푸른 심장. 레기스탄 광장, 구르 에미르, 샤히 진다 유적군."
    },
    Bukhara: {
      name: "부하라",
      region: "부하라 주",
      description: "2500년 역사를 간직한 야외 박물관. 칼랸 미나렛, 아르크 요새, 라비 하우즈."
    },
    Khiva: {
      name: "히바",
      region: "호레즘 주",
      description: "완벽하게 보존된 중세 실크로드 동화의 도시 — 이찬 칼라 성벽과 칼타 미나르."
    },
    Tashkent: {
      name: "타슈켄트",
      region: "타슈켄트 시",
      description: "중앙아시아의 현대 수도. 아름다운 지하철역, 하즈라티 이맘 복합체, 초르수 바자르."
    },
    'Tashkent Region': {
      name: "타슈켄트 주",
      region: "침간 / 차르박",
      description: "톈산 산맥, 아미르소이 사계절 스키 리조트, 에메랄드빛 차르박 호수."
    },
    Kashkadarya: {
      name: "카슈카다리야",
      region: "샤흐리사브스",
      description: "아미르 티무르의 고향. 웅장한 악사라이 궁전 유적과 자라프샨 산맥."
    },
    Surkhandarya: {
      name: "수르한다리야",
      region: "테르메즈 / 바이스운",
      description: "고대 불교 유적(파야즈테파)과 유네스코 무형유산 바이스운 전통 문화."
    },
    Fergana: {
      name: "페르가나",
      region: "마르길란 / 코칸트",
      description: "전통 수공예의 중심지: 코칸트 칸 궁전, 마르길란 실크, 리시탄 도자기."
    },
    Andijan: {
      name: "안디잔",
      region: "안디잔 주",
      description: "무굴 제국 바부르 황제의 탄생지. 바부르 기념 공원과 전통 시장."
    },
    Namangan: {
      name: "나만간",
      region: "나만간 주",
      description: "꽃의 도시, 고대 악시켄트 요새 유적, 전통 추스트 수제 칼."
    },
    Jizzakh: {
      name: "지자흐",
      region: "자민 국립공원",
      description: "우즈베키스탄의 스위스로 불리는 자민 국립공원과 울창한 침엽수림."
    },
    Syrdarya: {
      name: "시르다리야",
      region: "굴리스탄",
      description: "시르다리야 강변의 비옥한 오아시스와 따뜻한 환대."
    },
    Navoiy: {
      name: "나보이",
      region: "누라타 / 키질쿰",
      description: "누라타 성스러운 샘 차슈마, 사르미시사이 암각화, 아이다르쿨 유르트 캠프."
    },
    Karakalpakstan: {
      name: "카라칼파크스탄",
      region: "누쿠스 / 무이나크",
      description: "세계적인 사비츠키 아방가르드 미술관, 아랄해와 무이나크 선박 묘지."
    }
  }
};

const UI_STRINGS: Partial<Record<LanguageCode, {
  badgeLive: string;
  badgeExpanding: string;
  featuredCount: string;
  exploreCity: string;
  filterAll: string;
  filterUnesco: string;
  filterNature: string;
  filterValley: string;
  filterOasis: string;
}>> = {
  uz: {
    badgeLive: "✨ ASOSIY SHAHAR",
    badgeExpanding: "KASHF ETISH",
    featuredCount: "ta tarixiy obida",
    exploreCity: "Kashf etish",
    filterAll: "Barchasi",
    filterUnesco: "🏛️ YUNESKO Shaharlari",
    filterNature: "⛰️ Tog'lar & Tabiat",
    filterValley: "🏺 Farg'ona Vodiysi",
    filterOasis: "🏜️ Janubiy Voha"
  },
  en: {
    badgeLive: "✨ PRIMARY HUB",
    badgeExpanding: "EXPLORE",
    featuredCount: "Featured Landmarks",
    exploreCity: "Explore",
    filterAll: "All Destinations",
    filterUnesco: "🏛️ UNESCO Cities",
    filterNature: "⛰️ Nature & Peaks",
    filterValley: "🏺 Fergana Valley",
    filterOasis: "🏜️ Southern & Oasis"
  },
  ru: {
    badgeLive: "✨ ГЛАВНЫЙ ЦЕНТР",
    badgeExpanding: "ИССЛЕДОВАТЬ",
    featuredCount: "достопримечательностей",
    exploreCity: "Исследовать",
    filterAll: "Все направления",
    filterUnesco: "🏛️ Города ЮНЕСКО",
    filterNature: "⛰️ Горы и Природа",
    filterValley: "🏺 Ферганская Долина",
    filterOasis: "🏜️ Южный Оазис"
  },
  tr: {
    badgeLive: "✨ ANA MERKEZ",
    badgeExpanding: "KEŞFET",
    featuredCount: "Tarihi Eser",
    exploreCity: "Keşfet",
    filterAll: "Tümü",
    filterUnesco: "🏛️ UNESCO Şehirleri",
    filterNature: "⛰️ Doğa ve Dağlar",
    filterValley: "🏺 Fergana Vadisi",
    filterOasis: "🏜️ Güney Vaha"
  },
  de: {
    badgeLive: "✨ HAUPTZENTRUM",
    badgeExpanding: "ENTDECKEN",
    featuredCount: "Sehenswürdigkeiten",
    exploreCity: "Entdecken",
    filterAll: "Alle Reiseziele",
    filterUnesco: "🏛️ UNESCO-Städte",
    filterNature: "⛰️ Natur & Berge",
    filterValley: "🏺 Fergana-Tal",
    filterOasis: "🏜️ Südliche Oasen"
  },
  fr: {
    badgeLive: "✨ VILLE PRINCIPALE",
    badgeExpanding: "EXPLORER",
    featuredCount: "Monuments Clés",
    exploreCity: "Explorer",
    filterAll: "Toutes les destinations",
    filterUnesco: "🏛️ Villes UNESCO",
    filterNature: "⛰️ Nature & Montagnes",
    filterValley: "🏺 Vallée de Fergana",
    filterOasis: "🏜️ Oasis du Sud"
  },
  es: {
    badgeLive: "✨ CENTRO PRINCIPAL",
    badgeExpanding: "EXPLORAR",
    featuredCount: "Lugares Destacados",
    exploreCity: "Explorar",
    filterAll: "Todos los destinos",
    filterUnesco: "🏛️ Ciudades UNESCO",
    filterNature: "⛰️ Naturaleza y Picos",
    filterValley: "🏺 Valle de Ferganá",
    filterOasis: "🏜️ Oasis del Sur"
  },
  zh: {
    badgeLive: "✨ 核心枢纽",
    badgeExpanding: "深度探索",
    featuredCount: "处代表性历史古迹",
    exploreCity: "探索城市",
    filterAll: "全部目的地",
    filterUnesco: "🏛️ 联合国教科文名城",
    filterNature: "⛰️ 自然山岳风光",
    filterValley: "🏺 费尔干纳盆地",
    filterOasis: "🏜️ 南部绿洲与遗址"
  },
  ja: {
    badgeLive: "✨ 主要都市",
    badgeExpanding: "探索する",
    featuredCount: "箇所の主要名所",
    exploreCity: "詳しく見る",
    filterAll: "すべての都市",
    filterUnesco: "🏛️ ユネスコ世界遺産の街",
    filterNature: "⛰️ 大自然と山岳",
    filterValley: "🏺 フェルガナ盆地",
    filterOasis: "🏜️ 南部オアシス"
  },
  ko: {
    badgeLive: "✨ 핵심 도시",
    badgeExpanding: "둘러보기",
    featuredCount: "곳의 대표 명소",
    exploreCity: "탐방하기",
    filterAll: "전체 도시",
    filterUnesco: "🏛️ 유네스코 세계유산 도시",
    filterNature: "⛰️ 자연 및 산악",
    filterValley: "🏺 페르가나 밸리",
    filterOasis: "🏜️ 남부 오아시스"
  }
};

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ onSelectCity }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const { setManualCity } = useLocation();
  const { t, currentLanguage } = useLanguage();

  const tUI = UI_STRINGS[currentLanguage] || UI_STRINGS.uz!;
  const currentLocales = DESTINATION_LOCALES[currentLanguage] || DESTINATION_LOCALES.uz!;

  useEffect(() => {
    async function load() {
      const data = await api.getDestinations();
      setDestinations(data);
    }
    load();
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    const localized = currentLocales[dest.name];
    const targetSearch = (
      dest.name +
      ' ' +
      (localized?.name || '') +
      ' ' +
      (localized?.region || '') +
      ' ' +
      dest.region
    ).toLowerCase();

    const matchesSearch = targetSearch.includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'Historic') return ['Samarkand', 'Bukhara', 'Khiva', 'Tashkent', 'Kashkadarya'].includes(dest.name);
    if (filter === 'Nature') return ['Tashkent Region', 'Jizzakh', 'Syrdarya'].includes(dest.name);
    if (filter === 'Valley') return ['Fergana', 'Andijan', 'Namangan'].includes(dest.name);
    if (filter === 'Oasis') return ['Surkhandarya', 'Navoiy', 'Karakalpakstan'].includes(dest.name);
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
        <div>
          <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
            <Globe size={12} /> {t('silkRoadTreasures')}
          </div>
          <h1 style={{ fontSize: '32px', color: '#fff' }}>{t('exploreIconicDestinations')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '650px', marginTop: '6px' }}>
            {t('exploreRegionsSubtitle')}
          </p>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: tUI.filterAll },
            { id: 'Historic', label: tUI.filterUnesco },
            { id: 'Nature', label: tUI.filterNature },
            { id: 'Valley', label: tUI.filterValley },
            { id: 'Oasis', label: tUI.filterOasis }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={filter === tab.id ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredDestinations.map((dest) => {
          const loc = currentLocales[dest.name] || {
            name: dest.name,
            region: dest.region,
            description: dest.description
          };

          return (
            <div
              key={dest.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => {
                setManualCity(dest.name, dest.latitude, dest.longitude);
                onSelectCity(dest.name);
              }}
            >
              <div style={{ position: 'relative', height: '220px' }}>
                <img src={dest.imageUrl} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: dest.name === 'Samarkand' ? 'var(--accent-turquoise)' : 'rgba(7, 13, 30, 0.85)',
                  color: dest.name === 'Samarkand' ? '#070D1E' : '#fff',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  {dest.name === 'Samarkand' ? tUI.badgeLive : tUI.badgeExpanding}
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '14px',
                  right: '14px',
                  background: 'linear-gradient(to top, rgba(7, 13, 30, 0.9), transparent)',
                  padding: '12px',
                  borderRadius: '10px'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{loc.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gold)' }}>{loc.region}</div>
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                  {loc.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px'
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-turquoise)', fontWeight: 700 }}>
                    {dest.placesCount} {tUI.featuredCount}
                  </span>

                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px', gap: '6px' }}>
                    <span>{tUI.exploreCity} {loc.name}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
