using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SafarAi.Core.Entities;
using SafarAi.Core.Enums;

namespace SafarAi.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Destinations.AnyAsync())
        {
            return; // Already seeded
        }

        // 1. Categories
        var catHistorical = new PlaceCategory { Name = "Historical Landmark", Icon = "landmark", Type = PlaceCategoryType.HistoricalLandmark };
        var catMuseum = new PlaceCategory { Name = "Museum", Icon = "building", Type = PlaceCategoryType.Museum };
        var catReligious = new PlaceCategory { Name = "Religious Site", Icon = "moon-star", Type = PlaceCategoryType.ReligiousSite };
        var catRestaurant = new PlaceCategory { Name = "Restaurant", Icon = "utensils", Type = PlaceCategoryType.Restaurant };
        var catHotel = new PlaceCategory { Name = "Hotel", Icon = "bed", Type = PlaceCategoryType.Hotel };
        var catCafe = new PlaceCategory { Name = "Cafe & Tea House", Icon = "coffee", Type = PlaceCategoryType.Cafe };
        var catPhoto = new PlaceCategory { Name = "Photo Spot", Icon = "camera", Type = PlaceCategoryType.PhotoSpot };
        var catShopping = new PlaceCategory { Name = "Bazaar & Shopping", Icon = "shopping-bag", Type = PlaceCategoryType.Shopping };
        var catNature = new PlaceCategory { Name = "Craft Village & Nature", Icon = "trees", Type = PlaceCategoryType.Nature };

        context.PlaceCategories.AddRange(catHistorical, catMuseum, catReligious, catRestaurant, catHotel, catCafe, catPhoto, catShopping, catNature);
        await context.SaveChangesAsync();

        // 2. Destinations (All 14 Regions of Uzbekistan)
        var samarkand = new Destination
        {
            Name = "Samarkand",
            Region = "Samarkand Region",
            Description = "The Pearl of the Silk Road and Timurid Renaissance capital, renowned for turquoise domes, majestic madrasahs, and 2,750 years of history.",
            ImageUrl = "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80",
            Latitude = 39.6547,
            Longitude = 66.9758,
            PopularityScore = 99
        };

        var bukhara = new Destination
        {
            Name = "Bukhara",
            Region = "Bukhara Region",
            Description = "A sacred UNESCO World Heritage living museum city boasting the ancient Ark of Bukhara, Kalyan Minaret, and Lyabi-Khauz trading domes.",
            ImageUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
            Latitude = 39.7747,
            Longitude = 64.4286,
            PopularityScore = 96
        };

        var khiva = new Destination
        {
            Name = "Khiva",
            Region = "Khorezm Region",
            Description = "The breathtaking open-air desert fortress of Ichan-Kala, preserved exactly as it stood centuries ago along the ancient oasis routes.",
            ImageUrl = "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
            Latitude = 41.3783,
            Longitude = 60.3639,
            PopularityScore = 94
        };

        var tashkent = new Destination
        {
            Name = "Tashkent",
            Region = "Tashkent City",
            Description = "The vibrant cosmopolitan capital uniting majestic Soviet-era metro stations, modern parks, Chorsu Bazaar, and rich Islamic heritage.",
            ImageUrl = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
            Latitude = 41.2995,
            Longitude = 69.2401,
            PopularityScore = 92
        };

        var tashkentRegion = new Destination
        {
            Name = "Tashkent Region",
            Region = "Tashkent Region (Bostanliq)",
            Description = "Scenic Western Tian Shan mountains, Amirsoy world-class ski resort, turquoise Charvak reservoir, and alpine hiking peaks.",
            ImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
            Latitude = 41.5644,
            Longitude = 70.0125,
            PopularityScore = 90
        };

        var fergana = new Destination
        {
            Name = "Fergana",
            Region = "Fergana Valley",
            Description = "The cradle of Central Asian handicrafts, celebrated for Kokand Palace of Khudayar Khan, Margilan silk weaving, and Rishtan cobalt ceramics.",
            ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            Latitude = 40.3842,
            Longitude = 71.7843,
            PopularityScore = 88
        };

        var andijan = new Destination
        {
            Name = "Andijan",
            Region = "Andijan Region",
            Description = "Birthplace of Emperor Zahiriddin Muhammad Babur, famed for verdant gardens, Bogi Babur memorial park, and bustling craft bazaars.",
            ImageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
            Latitude = 40.7821,
            Longitude = 72.3442,
            PopularityScore = 85
        };

        var namangan = new Destination
        {
            Name = "Namangan",
            Region = "Namangan Region",
            Description = "The City of Flowers and ancient Aksikent fortress, home to legendary Chust master knife-makers and Afsonalar Vodiysi park.",
            ImageUrl = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
            Latitude = 40.9983,
            Longitude = 71.6726,
            PopularityScore = 84
        };

        var kashkadarya = new Destination
        {
            Name = "Kashkadarya",
            Region = "Kashkadarya Region (Shahrisabz)",
            Description = "Birthplace of Amir Timur, housing monumental Ak-Saray Palace ruins, Dorut Tilavat, and stunning Zeravshan mountain landscapes.",
            ImageUrl = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
            Latitude = 39.0558,
            Longitude = 66.8286,
            PopularityScore = 89
        };

        var surkhandarya = new Destination
        {
            Name = "Surkhandarya",
            Region = "Surkhandarya Region (Termez)",
            Description = "Southern archaeological gateway with ancient Buddhist stupas at Fayaz Tepe, Hakim at-Termizi complex, and picturesque Boysun canyons.",
            ImageUrl = "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
            Latitude = 37.2242,
            Longitude = 67.2783,
            PopularityScore = 87
        };

        var navoiy = new Destination
        {
            Name = "Navoiy",
            Region = "Navoiy Region (Nurata)",
            Description = "Where Alexander the Great built Nur Fortress, famous for Sarmishsay Bronze Age petroglyphs, Chashma sacred spring, and Aydarkul yurt camps.",
            ImageUrl = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
            Latitude = 40.0844,
            Longitude = 65.3792,
            PopularityScore = 83
        };

        var jizzakh = new Destination
        {
            Name = "Jizzakh",
            Region = "Jizzakh Region (Zaamin)",
            Description = "Known as 'Uzbek Switzerland', featuring pristine Zaamin pine forests, dramatic mountain canyons, and the glass suspension bridge.",
            ImageUrl = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
            Latitude = 39.9611,
            Longitude = 68.3972,
            PopularityScore = 86
        };

        var syrdarya = new Destination
        {
            Name = "Syrdarya",
            Region = "Syrdarya Region (Guliston)",
            Description = "The agricultural heart on the banks of Syr Darya River, renowned for sweetest Mirza seeds melons, river eco-tourism, and tranquility.",
            ImageUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
            Latitude = 40.4897,
            Longitude = 68.7842,
            PopularityScore = 80
        };

        var karakalpakstan = new Destination
        {
            Name = "Karakalpakstan",
            Region = "Republic of Karakalpakstan (Nukus)",
            Description = "Home to the world-renowned Savitsky Russian Avant-Garde Museum, Moynaq Aral Sea ship graveyard, and ancient Zoroastrian Chilpak dakhmas.",
            ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            Latitude = 42.4619,
            Longitude = 59.6166,
            PopularityScore = 91
        };

        context.Destinations.AddRange(
            samarkand, bukhara, khiva, tashkent,
            tashkentRegion, fergana, andijan, namangan,
            kashkadarya, surkhandarya, navoiy, jizzakh,
            syrdarya, karakalpakstan
        );
        await context.SaveChangesAsync();

        // 3. Places in Samarkand
        var places = new List<Place>
        {
            new Place
            {
                Name = "Registan Square",
                LocalName = "Registon Maydoni",
                DestinationId = samarkand.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "The heart of ancient Samarkand, flanked by three colossal madrasahs: Ulugh Beg, Sher-Dor, and Tilla-Kori.",
                DetailedHistory = "Registan, meaning 'sandy place' in Persian, was the public square of medieval Samarkand where crowds gathered for royal proclamations, public celebrations, and trade. The Ulugh Beg Madrasah was built between 1417–1420 by Timur's grandson. The Sher-Dor Madrasah ('Having Tigers') was completed in 1636 featuring Persian lion-tiger sun mosaics, and Tilla-Kori ('Gilded') Madrasah was finished in 1660 with breathtaking gilded dome interiors.",
                ArchitectureDetails = "Masterpiece of Islamic tilework featuring geometric azure and turquoise majolica, monumental pishtaqs (portals), towering minarets, and a trompe-l'œil golden dome in Tilla-Kori that appears concave but is architecturally flat.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Sher-Dor Madrasah defies traditional Islamic aniconism by depicting stylized tigers chasing stags beneath human-faced rising suns.",
                    "Ulugh Beg personally taught astronomy and mathematics to students inside his madrasah.",
                    "The interior of Tilla-Kori's dome is coated with five kilograms of genuine pure leaf gold leafing."
                }),
                Latitude = 39.6547,
                Longitude = 66.9758,
                Address = "Registan St, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 50000,
                OpeningHours = "08:00 - 20:00",
                RecommendedVisitDurationMinutes = 90,
                Rating = 4.98,
                ReviewCount = 342,
                AudioGuideScript = "Welcome to Registan Square, the beating heart of the Timurid Empire. Standing before you are three magnificent madrasahs framing this historic plaza. Look closely at Sher-Dor on your right—observe the ferocious solar tigers emblazoned across its turquoise facade. As night falls, the square illuminates into an awe-inspiring symphony of gold and azure light.",
                VisionRecognitionTags = "registan,sherdor,ulughbeg,tillakori,madrasah,square,samarkand,turquoise dome,minaret",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Gur-e-Amir Mausoleum",
                LocalName = "Go'ri Amir Maqbarasi",
                DestinationId = samarkand.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "The monumental resting place of Amir Timur (Tamerlane), his sons Shah Rukh and Miran Shah, and grandson Ulugh Beg.",
                DetailedHistory = "Constructed starting in 1403 after the unexpected death of Timur's beloved grandson Muhammad Sultan. When Amir Timur died during his winter campaign toward China in 1405, heavy snow passes to Shahrisabz forced his burial here in Samarkand. It served as the architectural prototype for subsequent Mughal masterpieces including Humayun's Tomb and the Taj Mahal.",
                ArchitectureDetails = "Features a distinctive 64-ribbed fluted azure dome soaring 36 meters high, intricately carved onyx dado paneling, and an exquisite dark nephrite jade headstone carved for Timur.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Timur's jade tombstone is inscribed with a warning: 'Whosoever disturbs my tomb shall unleash an invader more terrible than I.' Soviet archaeologists opened it on June 20, 1941, two days before Hitler launched Operation Barbarossa.",
                    "The ribbed azure dome can be seen shimmering across Samarkand from miles away."
                }),
                Latitude = 39.6486,
                Longitude = 66.9691,
                Address = "1/4 Bustonsaroy St, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 40000,
                OpeningHours = "09:00 - 19:00",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.94,
                ReviewCount = 210,
                AudioGuideScript = "You are entering Gur-e-Amir, Persian for 'Tomb of the King'. Beneath this soaring ribbed dome rests Amir Timur, the conqueror who united vast expanses of Central Asia. The central dark green jade block marks his symbolic resting place, while the actual crypt lies in the vault directly underneath.",
                VisionRecognitionTags = "gureamir,tamerlane,timur,tomb,mausoleum,ribbed dome,samarkand",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Shah-i-Zinda Necropolis",
                LocalName = "Shohi Zinda Majmuasi",
                DestinationId = samarkand.Id,
                CategoryId = catReligious.Id,
                ShortDescription = "An ethereal avenue of azure-domed royal mausoleums spanning from the 11th to the 15th century.",
                DetailedHistory = "Shah-i-Zinda translates to 'The Living King', referring to Kusam ibn Abbas, a cousin of the Prophet Muhammad who brought Islam to Central Asia in the 7th century. Legend tells that after being attacked, he retreated into a sacred well where he lives eternally. Over centuries, Timur and his successors built opulent mausoleums for royal women, generals, and scholars around his holy shrine.",
                ArchitectureDetails = "Considered the pinnacle of ceramic art in the Islamic world, showcasing terracotta reliefs, carved glazed tiles, and intricate multi-layered lapis lazuli mosaics in endless geometric and floral motifs.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Local folklore says if you count the steep stone entrance steps going up and get the exact same number coming down, all your sins are forgiven.",
                    "No two mausoleums along the sacred alley share identical tile designs."
                }),
                Latitude = 39.6644,
                Longitude = 66.9877,
                Address = "Shah-i-Zinda St, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 40000,
                OpeningHours = "08:30 - 19:30",
                RecommendedVisitDurationMinutes = 75,
                Rating = 4.97,
                ReviewCount = 289,
                AudioGuideScript = "Step into the magical blue corridor of Shah-i-Zinda. Look around you at the walls: every single tile was hand-fired over 600 years ago using pulverized lapis lazuli and cobalt glazes. Walk quietly as pilgrims still come from across the Islamic world to pay respects to the Living King.",
                VisionRecognitionTags = "shahizinda,shohizinda,necropolis,blue corridor,mausoleums,tiles,samarkand",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Bibi-Khanym Mosque",
                LocalName = "Bibi Xonim Masjidi",
                DestinationId = samarkand.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Once the largest and most colossal cathedral mosque in the Islamic world, commissioned by Amir Timur in 1399.",
                DetailedHistory = "Built after Timur's victorious Indian campaign using 95 captured war elephants and master stone carvers brought from across Asia. Named after Timur's beloved Chinese empress, Saray Mulk Khanum (Bibi-Khanym). Its monumental portal was so huge that builders pushed contemporary structural engineering beyond its limits.",
                ArchitectureDetails = "Huge pishtaq portal rising over 35 meters, flanked by round minarets and crowned with a monumental cupola. In the courtyard sits a colossal carved marble Quran stand sculpted for the ancient Uthman Quran.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Legend says the master architect fell madly in love with Empress Bibi-Khanym and demanded a kiss before finishing the portal on time.",
                    "Women praying for children historically crawled beneath the giant outdoor marble Quran stand in the center courtyard."
                }),
                Latitude = 39.6583,
                Longitude = 66.9794,
                Address = "Bibikhonim St, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 35000,
                OpeningHours = "08:00 - 19:00",
                RecommendedVisitDurationMinutes = 50,
                Rating = 4.88,
                ReviewCount = 175,
                AudioGuideScript = "Behold Bibi-Khanym Mosque! When completed in 1404, contemporaries wrote that its dome would have been unique had the heavens not been its duplicate, and its portal was so grand it seemed to challenge the Milky Way.",
                VisionRecognitionTags = "bibikhanym,bibixonim,mosque,quran stand,giant portal,samarkand",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Siyob Bazaar",
                LocalName = "Siyob Bozori",
                DestinationId = samarkand.Id,
                CategoryId = catShopping.Id,
                ShortDescription = "The ancient vibrant trading bazaar located directly adjacent to Bibi-Khanym Mosque, bursting with dried fruits, spices, and Samarkand bread.",
                DetailedHistory = "Siyob Bazaar has been active for over 600 years along the Silk Road caravan routes. Traders from mountain villages and desert oases still assemble here daily to sell sweet melons, pomegranates, dried mountain apricots, roasted almonds, halva, and the legendary glazed Samarkand non bread.",
                ArchitectureDetails = "Sprawling covered bazaar under grand open-air archways, organized into specialized alleys: spice rows, bread masters, fresh produce, and traditional sweets.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Legendary Samarkand non (flatbread) is baked in glowing clay tandirs and can stay fresh for up to three years after being dried and re-sprinkled with water.",
                    "Sellers warmly invite visitors to taste sweet dried fruits, saffron, and mountain nuts before buying."
                }),
                Latitude = 39.6595,
                Longitude = 66.9812,
                Address = "Bibikhonim St, next to Bibi-Khanym Mosque, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 0,
                OpeningHours = "07:00 - 19:00 (Daily)",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.91,
                ReviewCount = 412,
                AudioGuideScript = "Welcome to the bustling aromas and vibrant colors of Siyob Bazaar. Take a breath: you can smell fresh roasted cumin, dried figs, mountain honey, and hot tandir bread. Don't leave without tasting a piece of authentic Samarkand bread with local tea!",
                VisionRecognitionTags = "siyob,bazaar,market,spices,bread,samarkand non,fruits",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Ulugh Beg Observatory",
                LocalName = "Ulug'bek Rasadxonasi",
                DestinationId = samarkand.Id,
                CategoryId = catMuseum.Id,
                ShortDescription = "The monumental 15th-century astronomical observatory built by scholar-ruler Ulugh Beg on the hills of Chupan-Ata.",
                DetailedHistory = "Erected in the 1420s by Timur's grandson, astronomer-king Ulugh Beg. With his giant subterranean meridian sextant, Ulugh Beg calculated the solar year to within 25 seconds of modern satellite measurements and charted the precise positions of 1,018 stars published in the famous Zij-i Sultani star catalog.",
                ArchitectureDetails = "Preserved subterranean curved double arc of the gargantuan 40-meter radius marble meridian sextant dug deep into the bedrock hill, complemented by an adjacent museum.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Ulugh Beg calculated the Earth's axial tilt with pinpoint accuracy centuries before European telescopes existed.",
                    "A crater on the Moon is named in honor of Ulugh Beg by the International Astronomical Union."
                }),
                Latitude = 39.6747,
                Longitude = 67.0061,
                Address = "Toshkent Yoli St, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 35000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 45,
                Rating = 4.82,
                ReviewCount = 145,
                AudioGuideScript = "You are standing at the forefront of medieval astronomy. Here, Ulugh Beg directed the most sophisticated observatory of his era, turning Samarkand into the scientific capital of Eurasia.",
                VisionRecognitionTags = "observatory,ulughbeg,astronomy,sextant,stars,samarkand",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Afrosiyob Museum & Ancient City",
                LocalName = "Afrosiyob Muzeyi",
                DestinationId = samarkand.Id,
                CategoryId = catMuseum.Id,
                ShortDescription = "Archaeological site of ancient pre-Mongol Samarkand and museum preserving famous 7th-century Sogdian palace frescoes.",
                DetailedHistory = "Afrosiyob was the ancient Sogdian settlement that flourished along the Silk Road from the 8th century BC until destroyed by Genghis Khan in 1220. The on-site museum preserves the world-renowned Hall of the Ambassadors fresco murals depicting international diplomats from China, Korea, and Persia presenting gifts to King Varkhuman.",
                ArchitectureDetails = "Rolling loess earthen mounds of the ancient fortified citadel surrounding a modern museum pavilion housing excavated Sogdian artifacts, ceramic jars, coins, and preserved wall paintings.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The Hall of the Ambassadors fresco explicitly illustrates Korean emissaries wearing double-feather caps in 7th-century Samarkand.",
                    "Alexander the Great captured Afrosiyob in 329 BC, famously proclaiming: 'Everything I have heard about Samarkand is true, except that it is even more beautiful than I imagined.'"
                }),
                Latitude = 39.6706,
                Longitude = 66.9936,
                Address = "Toshkent Yoli St, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 30000,
                OpeningHours = "09:00 - 17:00",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.79,
                ReviewCount = 118,
                AudioGuideScript = "Welcome to Afrosiyob, where Samarkand's history began over 2,700 years ago. In the main hall, take a close look at the vibrant diplomatic murals that prove Samarkand was the cosmopolitan bridge connecting China, India, and the Mediterranean.",
                VisionRecognitionTags = "afrosiyob,sogdian,frescoes,museum,ancient city,samarkand",
                IsMustVisit = false
            },
            new Place
            {
                Name = "Konigil 'Meros' Silk Paper Mill",
                LocalName = "Konigil Meros Qog'oz Fabrikasi",
                DestinationId = samarkand.Id,
                CategoryId = catNature.Id,
                ShortDescription = "An idyllic eco-village and restored water-powered mill reviving the 8th-century art of manual mulberry paper making.",
                DetailedHistory = "After the Battle of Talas in 751 AD, Chinese papermakers captured by Arabs revealed the secrets of papermaking in Samarkand. Samarkand silk paper became famous worldwide for its durability, lasting over a millennium without decay. Brothers Zarif and Islam Mukhtarov meticulously revived the ancient watermill techniques along the Siab River.",
                ArchitectureDetails = "Picturesque shady gardens along running water streams, wooden waterwheels, traditional clay drying rooms, and open craft workshops for pottery, embroidery, and woodcarving.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Samarkand paper is made exclusively from the inner bark of mulberry trees and polished with agate stones until smooth like silk.",
                    "Documents written on Konigil paper are naturally insect-proof and last for over 1,000 years."
                }),
                Latitude = 39.6601,
                Longitude = 67.0380,
                Address = "Konigil Village, Samarkand suburbs",
                ImageUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 25000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 90,
                Rating = 4.93,
                ReviewCount = 204,
                AudioGuideScript = "Listen to the tranquil splash of the ancient watermill here in Konigil village. Watch master artisans strip mulberry bark, beat it in stone mortars, and lift delicate paper screens out of river water exactly as Silk Road craftsmen did 1,300 years ago.",
                VisionRecognitionTags = "konigil,paper mill,mulberry,watermill,craft village,meros,samarkand",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Hazrati Khizr Mosque",
                LocalName = "Hazrati Xizr Masjidi",
                DestinationId = samarkand.Id,
                CategoryId = catReligious.Id,
                ShortDescription = "Historic hillside mosque with ornate carved wood columns and the Memorial complex of Uzbekistan's first president.",
                DetailedHistory = "Situated on the elevated edge of Afrosiyob overlooking Shah-i-Zinda. Originally built in the 8th century at the arrival of Islam, rebuilt in 1854 with exquisite wooden porticoes and a slender carved minaret. In 2018, a graceful white marble and granite mausoleum was completed for Islam Karimov.",
                ArchitectureDetails = "Intricately carved open-air wooden aivan (portico), ornate polychrome ceiling paintings, and panoramic viewpoint overlooking the Registan and Bibi-Khanym domes.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Dedicated to Khizr, the immortal patron saint of travelers who is believed to assist those in danger across water and desert.",
                    "Offers the highest elevated panoramic view over central Samarkand's architectural skyline."
                }),
                Latitude = 39.6622,
                Longitude = 66.9839,
                Address = "Shah-i-Zinda St, Samarkand",
                ImageUrl = "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string>
                {
                    "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80"
                }),
                TicketPriceUzs = 20000,
                OpeningHours = "08:00 - 19:00",
                RecommendedVisitDurationMinutes = 40,
                Rating = 4.87,
                ReviewCount = 135,
                AudioGuideScript = "Take in the panoramic breeze at Hazrati Khizr Mosque. Look out toward the horizon—you can see the monumental blue crown of Bibi-Khanym and the ancient earthen hills of Afrosiyob stretching into the distance.",
                VisionRecognitionTags = "hazratikhizr,hazratixizr,hillside mosque,viewpoint,samarkand",
                IsMustVisit = false
            },

            // --- BUKHARA PLACES ---
            new Place
            {
                Name = "Ark of Bukhara",
                LocalName = "Buxoro Arki",
                DestinationId = bukhara.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Massive 5th-century fortress city within a city, former fortified residence of the Emirs of Bukhara.",
                DetailedHistory = "The ancient citadel is the oldest architectural monument in Bukhara, founded around the 5th century AD. It served as a complete royal town with palaces, treasuries, arsenals, mint, and prisons until 1920.",
                ArchitectureDetails = "Soaring undulating earthen ramparts, monumental dual-tower portal with high ceremonial ramp, and an open-air throne room.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Avicenna (Ibn Sina) and Omar Khayyam studied in the grand royal library of the Ark in the 10th century.",
                    "The fortress ramparts slope dramatically upward to a height of nearly 20 meters."
                }),
                Latitude = 39.7778,
                Longitude = 64.4108,
                Address = "Ark Citadel, Bukhara",
                ImageUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 40000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 80,
                Rating = 4.93,
                ReviewCount = 280,
                AudioGuideScript = "Welcome to the Ark of Bukhara, the majestic stronghold where Bukhara's emirs once ruled. Walk through the imposing fortress gates that have guarded Silk Road secrets for over fifteen centuries.",
                VisionRecognitionTags = "ark,citadel,fortress,bukhara,emir palace",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Po-i-Kalyan Complex & Minaret",
                LocalName = "Poi Kalon Majmuasi",
                DestinationId = bukhara.Id,
                CategoryId = catReligious.Id,
                ShortDescription = "The iconic 45-meter brick minaret built in 1127, which Genghis Khan spared from destruction because of its sheer majesty.",
                DetailedHistory = "Built by the Karakhanid ruler Arslan Khan in 1127. The minaret served as a beacon for desert caravans, a call to prayer tower, and a watchtower.",
                ArchitectureDetails = "Masterpiece of 14 intricate decorative brick bands, each with a distinct geometric pattern carved in unglazed terracotta without a single repetition.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Genghis Khan was so impressed by the minaret's sheer grandeur that he explicitly ordered it spared while destroying the rest of the city in 1220.",
                    "At 45.6 meters, it was the tallest tower in Central Asia for centuries."
                }),
                Latitude = 39.7758,
                Longitude = 64.4149,
                Address = "Khaja Nurobod St, Bukhara",
                ImageUrl = "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 35000,
                OpeningHours = "08:00 - 20:00",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.96,
                ReviewCount = 310,
                AudioGuideScript = "Look up at the breathtaking Kalyan Minaret. For nine centuries it has survived earthquakes and invasions. Observe the fourteen bands of decorative brickwork encircling the shaft.",
                VisionRecognitionTags = "kalyan,minaret,po-i-kalyan,poi kalon,mir-i-arab,bukhara",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Lyabi-Khauz Ensemble",
                LocalName = "Labihovuz Majmuasi",
                DestinationId = bukhara.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Charming historic plaza centered around a tranquil 17th-century pool shaded by centuries-old mulberry trees.",
                DetailedHistory = "Built in 1620 by Nadir Divan-begi, grand vizier of Bukhara. It became the social and commercial epicenter where merchants gathered for tea and gossip.",
                ArchitectureDetails = "Large stone-lined reservoir flanked by the Kukeldash Madrasah, Nadir Divan-begi Madrasah with majestic Simurgh bird mosaics, and a sufi Khanqah.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Features a beloved bronze statue of the folkloric hero Nasreddin Hodja riding his donkey backwards.",
                    "The pool water was historically refreshed by the ancient Shahrood canal."
                }),
                Latitude = 39.7731,
                Longitude = 64.4206,
                Address = "B. Nakshbandi St, Bukhara",
                ImageUrl = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 0,
                OpeningHours = "24 Hours Open",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.92,
                ReviewCount = 265,
                AudioGuideScript = "Welcome to Lyabi-Khauz, the relaxing living room of Bukhara. Sit beneath these ancient mulberry trees, order fragrant green tea with saffron sweets, and take in the shimmering reflection of Nadir Divan-begi Madrasah.",
                VisionRecognitionTags = "lyabikhauz,labihovuz,pool,square,nasreddin,bukhara",
                IsMustVisit = true
            },

            // --- KHIVA PLACES ---
            new Place
            {
                Name = "Ichan-Kala Ancient Fortress City",
                LocalName = "Ichan Qal'a Tarixiy Majmuasi",
                DestinationId = khiva.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Uzbekistan's first UNESCO World Heritage site, a complete walled medieval oasis city preserved entirely intact.",
                DetailedHistory = "Ichan-Kala is the inner fortified town of ancient Khiva, surrounded by 2.2-kilometer-long clay brick walls over 10 meters high with 50 historic monuments.",
                ArchitectureDetails = "Sun-dried adobe architecture, crenellated defense towers, turquoise tiled minarets, and carved elm wood pillars.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Ichan-Kala is a living city where more than 300 families still inhabit historic courtyard homes inside the ancient walls.",
                    "More than 50 historic madrasahs, mosques, and palaces are packed into less than one square kilometer."
                }),
                Latitude = 41.3783,
                Longitude = 60.3639,
                Address = "Ichan Kala, Khiva",
                ImageUrl = "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 50000,
                OpeningHours = "08:00 - 20:00",
                RecommendedVisitDurationMinutes = 180,
                Rating = 4.97,
                ReviewCount = 380,
                AudioGuideScript = "Step through the West Gate of Ichan-Kala and travel back in time. Every brick, minaret, and alleyway around you has stood in the desert sands for centuries.",
                VisionRecognitionTags = "ichan kala,ichanqala,khiva fortress,desert city,ancient khiva",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Kalta Minor Minaret",
                LocalName = "Kalta Minor Minorasi",
                DestinationId = khiva.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "The iconic turquoise-glazed cylindrical minaret intended to be the tallest in the East before construction halted in 1855.",
                DetailedHistory = "Commissioned in 1851 by Khan Muhammad Amin Khan to soar 70 meters high, allowing observers to see Bukhara 400 km away. When the Khan was killed in battle in 1855, construction ceased at 29 meters.",
                ArchitectureDetails = "Completely clad from base to top in vivid glazed turquoise, azure, and green Majolica tiles with geometric calligraphy bands.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "It is the only minaret in the entire Islamic world completely covered in glazed ceramic tilework across its entire exterior.",
                    "Its diameter is an astonishing 14.2 meters at the base."
                }),
                Latitude = 41.3780,
                Longitude = 60.3585,
                Address = "A. Boltayev St, Ichan Kala, Khiva",
                ImageUrl = "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 25000,
                OpeningHours = "08:00 - 20:00",
                RecommendedVisitDurationMinutes = 30,
                Rating = 4.95,
                ReviewCount = 295,
                AudioGuideScript = "You are admiring Kalta Minor, meaning 'Short Minaret'. Despite remaining unfinished, its rich turquoise ceramic shell makes it one of the most photographed monuments in Central Asia.",
                VisionRecognitionTags = "kaltaminor,short minaret,turquoise cylinder,khiva",
                IsMustVisit = true
            },

            // --- TASHKENT CITY PLACES ---
            new Place
            {
                Name = "Hazrati Imam Complex (Hast Imam)",
                LocalName = "Hazrati Imom Majmuasi",
                DestinationId = tashkent.Id,
                CategoryId = catReligious.Id,
                ShortDescription = "The spiritual center of Tashkent housing the holy 7th-century Holy Quran of Caliph Uthman.",
                DetailedHistory = "Built around the tomb of Tashkent's 10th-century patron saint, Abu Bakr Kaffal Shashi. The Muyi Mubarak Madrasah preserves the ancient deer-skin parchment Quran of Uthman, stained with the blood of the third Caliph in 656 AD.",
                ArchitectureDetails = "Majestic blue-tiled domes, expansive carved sandalwood porticoes, and grand open plaza reconstructed in traditional Islamic renaissance style.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The Uthman Quran kept here is one of the world's oldest surviving written copies of the Quran, inscribed in early Hijazi script.",
                    "Sandalwood columns were hand-carved by master woodworkers from Kokand and Samarkand."
                }),
                Latitude = 41.3375,
                Longitude = 69.2415,
                Address = "Zarkaynar St, Tashkent",
                ImageUrl = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 35000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.94,
                ReviewCount = 275,
                AudioGuideScript = "Welcome to Hazrati Imam, the spiritual heart of Tashkent. Here in the central pavilion rests one of humanity's most sacred relics: the 7th-century deer parchment Quran of Caliph Uthman.",
                VisionRecognitionTags = "hastimam,hazratiimam,uthman quran,tashkent,mosque",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Chorsu Bazaar",
                LocalName = "Chorsu Bozori",
                DestinationId = tashkent.Id,
                CategoryId = catShopping.Id,
                ShortDescription = "The monumental domed bazaar of Tashkent, operating continuously at the crossroads of the Silk Road for over a thousand years.",
                DetailedHistory = "Chorsu means 'four streams' or crossroads. Located at the historic Old City center of Tashkent, it has been the lively commercial hub where Silk Road merchants traded spices, silk, and livestock.",
                ArchitectureDetails = "Huge concrete modernist dome spanning over 50 meters, decorated with turquoise oriental tiles and multi-level spiral shopping tiers.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "You can sample dozens of varieties of dried melon rolls, Kurt salty cheese balls, and roasted Bukhara almonds from friendly vendors.",
                    "The lower ring houses Tashkent's legendary 'Street Food Row' serving sizzling Norin, Tandir Kabob, and Lagman."
                }),
                Latitude = 41.3275,
                Longitude = 69.2347,
                Address = "Navoi Avenue, Tashkent",
                ImageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 0,
                OpeningHours = "07:00 - 19:00",
                RecommendedVisitDurationMinutes = 90,
                Rating = 4.89,
                ReviewCount = 390,
                AudioGuideScript = "Step under the giant turquoise dome of Chorsu Bazaar. The sights, sounds, and aromas of fresh spices, baked bread, and Central Asian fruits surround you.",
                VisionRecognitionTags = "chorsu,bazaar,market,dome,tashkent,spices",
                IsMustVisit = true
            },

            // --- TASHKENT REGION PLACES ---
            new Place
            {
                Name = "Amirsoy Mountain Resort",
                LocalName = "Amirsoy Tog' Kurorti",
                DestinationId = tashkentRegion.Id,
                CategoryId = catNature.Id,
                ShortDescription = "All-season alpine resort nestled in the Chatkal Range of Tian Shan mountains with world-class gondola cableways.",
                DetailedHistory = "Opened in 2019 as Central Asia's premier ski and mountain resort, featuring 22 km of ski slopes designed by top international experts and scenic gondola lifts rising up to 2,290 meters.",
                ArchitectureDetails = "Modern alpine chalet architecture with panoramic glass restaurants overlooking snowy mountain peaks and rocky valleys.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The gondola cableway takes you to the peak at 2,290 meters elevation in under 10 minutes.",
                    "Enjoyable in summer for hiking, mountain biking, and paragliding, and in winter for skiing."
                }),
                Latitude = 41.5372,
                Longitude = 70.0456,
                Address = "Bostanliq District, Tashkent Region",
                ImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 120000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 180,
                Rating = 4.93,
                ReviewCount = 210,
                AudioGuideScript = "Breathe in the crisp alpine air at Amirsoy. As your cable car ascends above the Chatkal mountain ridge, take in the 360-degree vistas of the Tian Shan ranges.",
                VisionRecognitionTags = "amirsoy,mountains,cablecar,ski resort,chimgan,tashkent region",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Charvak Reservoir",
                LocalName = "Chorvoq Suv Ombori",
                DestinationId = tashkentRegion.Id,
                CategoryId = catNature.Id,
                ShortDescription = "Stunning turquoise alpine lake surrounded by towering mountain peaks, ideal for water sports and mountain getaways.",
                DetailedHistory = "Formed in 1970 by damming the Chirchik River confluence. It has become Uzbekistan's most popular mountain lake retreat.",
                ArchitectureDetails = "Vast expanse of turquoise mountain water framed by the snow-dusted ridges of Greater and Lesser Chimgan peaks.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The lake covers over 37 square kilometers with water temperatures pleasant for swimming from June to September.",
                    "Paragliders launch from the ridges above Charvak for breathtaking aerial flights over the reservoir."
                }),
                Latitude = 41.6322,
                Longitude = 70.0211,
                Address = "Charvak, Bostanliq District, Tashkent Region",
                ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 0,
                OpeningHours = "24 Hours Open",
                RecommendedVisitDurationMinutes = 120,
                Rating = 4.88,
                ReviewCount = 315,
                AudioGuideScript = "Welcome to Charvak Lake, the turquoise pearl of the Tian Shan mountains. Relax by the scenic shores and watch the paragliders glide gracefully across the azure sky.",
                VisionRecognitionTags = "charvak,chorvoq,lake,reservoir,tashkent region",
                IsMustVisit = true
            },

            // --- FERGANA VALLEY PLACES ---
            new Place
            {
                Name = "Palace of Khudayar Khan",
                LocalName = "Xudoyorxon O'rdasi",
                DestinationId = fergana.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "The monumental 1871 palace citadel of the last ruler of the Kokand Khanate, famous for its multicolored ceramic facade.",
                DetailedHistory = "Completed in 1871 by Khudayar Khan, ruler of the Khanate of Kokand. The palace originally contained seven courtyards and 119 rooms adorned with intricate woodwork and gilded plaster.",
                ArchitectureDetails = "Extravagant entrance portal covered with yellow, green, and blue arabesque tile mosaics, flanked by high minaret-like ramparts.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "It was nicknamed 'The Pearl of Kokand' due to its sparkling glazed tiled facade that shimmers brightly in the morning sun.",
                    "Now houses the Kokand Regional Museum of Local Lore with over 30,000 historical artifacts."
                }),
                Latitude = 40.5342,
                Longitude = 70.9389,
                Address = "Istiqbol St, Kokand, Fergana Region",
                ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 30000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 75,
                Rating = 4.91,
                ReviewCount = 190,
                AudioGuideScript = "You are standing before the Palace of Khudayar Khan in historic Kokand. Look at the vibrant geometric patterns of the grand portal—each ceramic tile was fired with natural minerals by Kokand masters.",
                VisionRecognitionTags = "khudayarkhan,kokand palace,fergana,kokand khanate",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Rishtan Master Ceramics Center",
                LocalName = "Rishton Kulolchilik Markazi",
                DestinationId = fergana.Id,
                CategoryId = catNature.Id,
                ShortDescription = "The centuries-old pottery capital of Central Asia, world-renowned for turquoise-cobalt 'Iskor' herbal glazes.",
                DetailedHistory = "For more than 800 years, Rishtan artisans have crafted exquisite ceramics using local red clay and unique natural ash glazes extracted from desert plants.",
                ArchitectureDetails = "Traditional open-air master ateliers with clay kilns, potters' wheels, and galleries showcasing master ceramic plates (Lagans).",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The distinctive turquoise-blue color is produced from 'Iskor', a secret mineral glaze made from burning wild desert herbs.",
                    "Rishtan ceramics are displayed in the Hermitage, the Louvre, and museums across the world."
                }),
                Latitude = 40.3586,
                Longitude = 71.2842,
                Address = "Rishtan Center, Fergana Region",
                ImageUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 20000,
                OpeningHours = "08:30 - 18:30",
                RecommendedVisitDurationMinutes = 90,
                Rating = 4.95,
                ReviewCount = 220,
                AudioGuideScript = "Welcome to Rishtan, where clay transforms into works of art. Watch master potters spin clay on the wheel and paint intricate floral patterns by hand using pure mineral pigment.",
                VisionRecognitionTags = "rishtan,ceramics,pottery,fergana,lagan",
                IsMustVisit = true
            },

            // --- ANDIJAN PLACES ---
            new Place
            {
                Name = "Bogi Babur Memorial Heritage Park",
                LocalName = "Bog'i Bobur Majmuasi",
                DestinationId = andijan.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Lush hillside park and museum commemorating Zahiriddin Muhammad Babur, poet, ruler, and founder of the Mughal Empire.",
                DetailedHistory = "Created on the Bag-i Shamal hill where Babur spent his youth in Andijan before authoring the celebrated Baburnama epic and establishing the empire in India.",
                ArchitectureDetails = "Steep hillside memorial pavilion, marble tomb monument containing soil brought from Babur's tomb in Kabul, and panoramic cableway over Andijan.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Babur authored the world-famous autobiographical masterpiece 'Baburnama' in classical Chagatai Turkic.",
                    "The park features over 50 varieties of ornamental trees planted on the picturesque hillsides."
                }),
                Latitude = 40.7322,
                Longitude = 72.3911,
                Address = "Bogi Babur Park, Andijan",
                ImageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 25000,
                OpeningHours = "08:00 - 19:00",
                RecommendedVisitDurationMinutes = 90,
                Rating = 4.90,
                ReviewCount = 180,
                AudioGuideScript = "Welcome to Bogi Babur in Andijan. Look out across the green valleys of Fergana as Babur did five centuries ago before embarking on his legendary historical journey.",
                VisionRecognitionTags = "bogibabur,babur,andijan,memorial park",
                IsMustVisit = true
            },

            // --- NAMANGAN PLACES ---
            new Place
            {
                Name = "Afsonalar Vodiysi (Valley of Legends)",
                LocalName = "Afsonalar Vodiysi Bog'i",
                DestinationId = namangan.Id,
                CategoryId = catNature.Id,
                ShortDescription = "Central Asia's largest entertainment and theme park with musical fountains, water park, and craftsmen village.",
                DetailedHistory = "Spanning 155 hectares, this modern landmark has turned Namangan into a prime family tourism hub along with ancient craft traditions.",
                ArchitectureDetails = "Ultra-modern water cascades, vast theme park rides, landscaped flower gardens, and traditional eastern architectural pavilions.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Hosts the annual International Flower Festival of Namangan, featuring millions of blooming blossoms.",
                    "Includes an authentic craft street where Chust master knife-makers forge traditional Pichoq knives."
                }),
                Latitude = 40.9783,
                Longitude = 71.6433,
                Address = "Afsonalar Vodiysi Ave, Namangan",
                ImageUrl = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 40000,
                OpeningHours = "10:00 - 22:00",
                RecommendedVisitDurationMinutes = 120,
                Rating = 4.88,
                ReviewCount = 230,
                AudioGuideScript = "Welcome to the Valley of Legends in Namangan. Enjoy the musical fountains and discover why Namangan has been known for centuries as the City of Flowers.",
                VisionRecognitionTags = "afsonalarvodiysi,valley of legends,namangan,theme park",
                IsMustVisit = true
            },

            // --- KASHKADARYA / SHAHRISABZ PLACES ---
            new Place
            {
                Name = "Ak-Saray Palace Ruins",
                LocalName = "Oqsaroy Majmuasi",
                DestinationId = kashkadarya.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "The colossal entrance towers of Amir Timur's summer palace, one of the greatest architectural feats of the medieval world.",
                DetailedHistory = "Built between 1380 and 1404 in Timur's home town of Shahrisabz. Timur famously proclaimed on the facade: 'If you doubt our power and grandeur, look upon our buildings!'",
                ArchitectureDetails = "Gigantic 38-meter-tall brick gateway pylons covered with dazzling lapis lazuli and gold ceramic mosaics.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The original arch spanned over 22 meters wide and reached 65 meters high—larger than any medieval palace in Europe.",
                    "Features a colossal statue of Amir Timur standing majestically in the central park plaza."
                }),
                Latitude = 39.0592,
                Longitude = 66.8294,
                Address = "Amir Timur St, Shahrisabz, Kashkadarya Region",
                ImageUrl = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 35000,
                OpeningHours = "08:00 - 19:00",
                RecommendedVisitDurationMinutes = 75,
                Rating = 4.94,
                ReviewCount = 245,
                AudioGuideScript = "Stand beneath the towering pillars of Ak-Saray in Shahrisabz. Even in ruins, the sheer scale of Timur's palace is awe-inspiring.",
                VisionRecognitionTags = "aksaray,oqsaroy,shahrisabz,timur palace,kashkadarya",
                IsMustVisit = true
            },

            // --- SURKHANDARYA / TERMEZ PLACES ---
            new Place
            {
                Name = "Hakim at-Termizi Complex",
                LocalName = "Hakim at-Termiziy Majmuasi",
                DestinationId = surkhandarya.Id,
                CategoryId = catReligious.Id,
                ShortDescription = "Sacred memorial shrine of the revered 9th-century Islamic philosopher and Sufi scholar Abu Abdullah Muhammad ibn Ali.",
                DetailedHistory = "Built over the grave of the great thinker Hakim at-Termizi, who authored over 80 philosophical treatises. Extensively expanded by Timur and later rulers.",
                ArchitectureDetails = "Carved white marble headstone with exquisite Quranic inscriptions, brick cupolas, and serene courtyard gardens near the Amudarya River.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Situated right on the high bank overlooking the Amudarya River border with Afghanistan.",
                    "Pilgrims from across the Islamic world visit the complex for peace and spiritual solace."
                }),
                Latitude = 37.2917,
                Longitude = 67.1972,
                Address = "Termez District, Surkhandarya Region",
                ImageUrl = "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 25000,
                OpeningHours = "08:00 - 19:00",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.92,
                ReviewCount = 160,
                AudioGuideScript = "Welcome to the sacred shrine of Hakim at-Termizi. Observe the intricate white marble carvings that have stood for centuries on the banks of the ancient Oxus River.",
                VisionRecognitionTags = "hakimattermizi,termez,surkhandarya,sufi shrine",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Fayaz Tepe Buddhist Complex",
                LocalName = "Fayoztepa Buddaviylik Majmuasi",
                DestinationId = surkhandarya.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Ancient 1st–3rd century Kushan Empire Buddhist monastery and stupa complex along the Silk Road.",
                DetailedHistory = "Excavated near Termez, this monastery was a major center of Northern Buddhism where monks studied before Buddhism traveled along the Silk Road to China and Japan.",
                ArchitectureDetails = "Well-preserved central stupa encased in a modern protective dome, monastery living quarters, and sanctuary chapels.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Proves Termez was a key crossroads where Hellenistic Greek, Buddhist, and Persian cultures intertwined 2,000 years ago.",
                    "Gold-plated sculptures of the Buddha excavated here are world-renowned archaeological treasures."
                }),
                Latitude = 37.2858,
                Longitude = 67.1856,
                Address = "Old Termez, Surkhandarya Region",
                ImageUrl = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 30000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.89,
                ReviewCount = 140,
                AudioGuideScript = "You are walking through Fayaz Tepe, an ancient Buddhist monastery from the Kushan Empire. Here, pilgrims chanted sutras 2,000 years ago.",
                VisionRecognitionTags = "fayaztepe,fayoztepa,buddhist monastery,stupa,termez",
                IsMustVisit = true
            },

            // --- NAVOIY / NURATA PLACES ---
            new Place
            {
                Name = "Chashma Sacred Spring & Alexander's Fortress",
                LocalName = "Chashma Buloq va Nur Qal'asi",
                DestinationId = navoiy.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Natural holy spring teeming with sacred trout and the 4th-century BC fortress founded by Alexander the Great.",
                DetailedHistory = "Alexander the Great established the military fortress of Nur in 327 BC. Below the fortress hill lies the Chashma spring, formed according to legend by a fallen meteorite.",
                ArchitectureDetails = "Ancient stone fortress hill ramparts, Juma mosque with 40 pillars, and a crystal-clear spring basin filled with sacred Marinka fish.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The spring water maintains a constant temperature of 19.5°C year-round and contains healing minerals.",
                    "The fish swimming in the holy waters are considered sacred and protected by local custom."
                }),
                Latitude = 40.5639,
                Longitude = 65.6883,
                Address = "Nurata, Navoiy Region",
                ImageUrl = "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 20000,
                OpeningHours = "08:00 - 20:00",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.91,
                ReviewCount = 150,
                AudioGuideScript = "Look into the crystal waters of Chashma spring in Nurata. Above you loom the ancient stone battlements constructed by Alexander the Great over 2,300 years ago.",
                VisionRecognitionTags = "chashma,nurata,alexander fortress,spring,navoiy",
                IsMustVisit = true
            },

            // --- JIZZAKH / ZAAMIN PLACES ---
            new Place
            {
                Name = "Zaamin National Nature Reserve & Glass Bridge",
                LocalName = "Zomin Milliy Bog'i va Shisha Ko'prik",
                DestinationId = jizzakh.Id,
                CategoryId = catNature.Id,
                ShortDescription = "The pristine coniferous wonderland known as 'Uzbek Switzerland', featuring the spectacular 305-meter glass suspension bridge over Chortanga Canyon.",
                DetailedHistory = "Established in 1976 on the northern slopes of the Turkestan mountain range. In 2023, the record-breaking glass suspension canyon bridge and panoramic cableway opened to worldwide acclaim.",
                ArchitectureDetails = "Engineered glass-bottom suspension bridge suspended 150 meters above the canyon floor, surrounded by ancient relic juniper forests.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The air in Zaamin's juniper forests is naturally therapeutic and known for rejuvenating respiratory health.",
                    "The glass suspension bridge offers thrilling 360-degree vistas of the jagged Turkestan mountain ridges."
                }),
                Latitude = 39.6750,
                Longitude = 68.4528,
                Address = "Zaamin District, Jizzakh Region",
                ImageUrl = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 50000,
                OpeningHours = "08:00 - 19:00",
                RecommendedVisitDurationMinutes = 180,
                Rating = 4.96,
                ReviewCount = 280,
                AudioGuideScript = "Step onto the glass suspension bridge in Zaamin. Beneath your feet is a 150-meter drop into the emerald canyon, framed by the fragrant mountain pine forests of 'Uzbek Switzerland'.",
                VisionRecognitionTags = "zaamin,zomin,glass bridge,national park,jizzakh",
                IsMustVisit = true
            },

            // --- SYRDARYA / GULISTON PLACES ---
            new Place
            {
                Name = "Syr Darya Riverfront Eco-Park",
                LocalName = "Sirdaryo Qirg'oq Bo'yi Bog'i",
                DestinationId = syrdarya.Id,
                CategoryId = catNature.Id,
                ShortDescription = "Tranquil river esplanade and eco-park along Central Asia's great historic Jaxartes (Syr Darya) River.",
                DetailedHistory = "Syr Darya is one of the two legendary rivers that define Central Asia. The modern eco-park offers recreational boating, fishing, and sunset dining.",
                ArchitectureDetails = "Open-air riverwalk promenade, landscaped walking trails, and cozy riverside floating pavilions.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Known for the sweetest and juiciest melons in Uzbekistan, especially the Mirza and Obi-Navvat varieties.",
                    "A haven for migrating aquatic birds and serene river fishing."
                }),
                Latitude = 40.4933,
                Longitude = 68.7889,
                Address = "River Esplanade, Guliston, Syrdarya Region",
                ImageUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 0,
                OpeningHours = "24 Hours Open",
                RecommendedVisitDurationMinutes = 60,
                Rating = 4.81,
                ReviewCount = 110,
                AudioGuideScript = "Relax along the tranquil waters of the Syr Darya River. As the golden sunset reflects across the water, enjoy the peaceful breeze of the steppe oasis.",
                VisionRecognitionTags = "syrdarya,guliston,river,ecopark,melons",
                IsMustVisit = false
            },

            // --- KARAKALPAKSTAN / NUKUS & ARAL SEA PLACES ---
            new Place
            {
                Name = "Savitsky State Museum of Art",
                LocalName = "I.V. Savitskiy Nomidagi Qoraqalpog'iston Davlat San'at Muzeyi",
                DestinationId = karakalpakstan.Id,
                CategoryId = catMuseum.Id,
                ShortDescription = "The legendary 'Louvre of the Steppes', housing the world's second-largest collection of Russian Soviet Avant-Garde art.",
                DetailedHistory = "Founded by Igor Savitsky, who courageously rescued banned Russian avant-garde paintings from Stalinist persecution by hiding them in the remote desert city of Nukus.",
                ArchitectureDetails = "Modern museum complex housing over 90,000 exhibits, including priceless avant-garde masterpieces and Karakalpak folk embroidery.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "Described by The New York Times as 'one of the most remarkable collections in the world'.",
                    "Contains iconic masterpieces like 'The Bull' (Fascism is Advancing) by Vladimir Lysenko."
                }),
                Latitude = 42.4647,
                Longitude = 59.6103,
                Address = "Rzaev St, Nukus, Republic of Karakalpakstan",
                ImageUrl = "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 50000,
                OpeningHours = "09:00 - 18:00",
                RecommendedVisitDurationMinutes = 120,
                Rating = 4.98,
                ReviewCount = 310,
                AudioGuideScript = "Welcome to the Savitsky Museum in Nukus, the 'Louvre of the Steppes'. Wander through these halls to witness Russian avant-garde art that was saved from oblivion and preserved here in the desert.",
                VisionRecognitionTags = "savitsky,museum,nukus,art,karakalpakstan,avantgarde",
                IsMustVisit = true
            },
            new Place
            {
                Name = "Moynaq Ship Graveyard (Aral Sea)",
                LocalName = "Mo'ynoq Kemalar Qabristoni",
                DestinationId = karakalpakstan.Id,
                CategoryId = catHistorical.Id,
                ShortDescription = "Dramatic open-air desert memorial where rusted fishing trawlers stand stranded on the former seabed of the Aral Sea.",
                DetailedHistory = "Moynaq was once a thriving fishing port on the Aral Sea. Today, stranded ships rust on the desert floor of the Aralkum, serving as a powerful environmental reminder.",
                ArchitectureDetails = "Lighthouse viewpoint perched on the former shoreline cliff looking over the rusted armada of ships resting on desert sands.",
                InterestingFacts = JsonSerializer.Serialize(new List<string>
                {
                    "The shoreline was once right at the foot of Moynaq town; the water has now receded over 100 kilometers.",
                    "Host of the annual 'Stihia' Electronic Music & Environmental Festival in the desert."
                }),
                Latitude = 43.7667,
                Longitude = 59.0333,
                Address = "Moynaq, Republic of Karakalpakstan",
                ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                ImageGalleryJson = JsonSerializer.Serialize(new List<string> { "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" }),
                TicketPriceUzs = 20000,
                OpeningHours = "24 Hours Open",
                RecommendedVisitDurationMinutes = 90,
                Rating = 4.93,
                ReviewCount = 270,
                AudioGuideScript = "Stand atop the former sea cliff at Moynaq. Look down at the rusted silhouettes of fishing ships stranded on what was once the fourth-largest inland sea on Earth.",
                VisionRecognitionTags = "moynaq,aral sea,ship graveyard,karakalpakstan,aral",
                IsMustVisit = true
            }
        };

        context.Places.AddRange(places);
        await context.SaveChangesAsync();

        // 4. Seed Hotels & Restaurants
        var hotels = new List<Hotel>
        {
            new Hotel
            {
                Name = "Silk Road Samarkand Luxury Resort",
                DestinationId = samarkand.Id,
                Latitude = 39.6580,
                Longitude = 67.0520,
                Address = "Silk Road Samarkand Complex",
                PricePerNightUzs = 1200000,
                Rating = 4.95,
                Stars = 5,
                ImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
                AmenitiesJson = JsonSerializer.Serialize(new List<string> { "Infinity Pool", "Spa & Hamam", "Silk Road Views", "Gourmet Breakfast", "Free Shuttle" })
            },
            new Hotel
            {
                Name = "Registan Plaza Hotel",
                DestinationId = samarkand.Id,
                Latitude = 39.6520,
                Longitude = 66.9620,
                Address = "Shohrukh Mirzo St, Samarkand",
                PricePerNightUzs = 650000,
                Rating = 4.82,
                Stars = 4,
                ImageUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
                AmenitiesJson = JsonSerializer.Serialize(new List<string> { "Walking to Registan", "Free High-Speed WiFi", "Traditional Breakfast", "Airport Shuttle" })
            }
        };

        var restaurants = new List<Restaurant>
        {
            new Restaurant
            {
                Name = "Osh Markazi (Samarkand Plov Center)",
                DestinationId = samarkand.Id,
                Latitude = 39.6610,
                Longitude = 66.9720,
                Address = "Gagarin St, Samarkand",
                CuisineType = "Authentic Samarkand Osh / Plov",
                AverageCostUzs = 75000,
                Rating = 4.96,
                ImageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
                SignatureDishes = "Layered Samarkand Osh with yellow carrots & quail eggs, Kazi, Achichuk salad"
            },
            new Restaurant
            {
                Name = "Platan Fine Dining Restaurant",
                DestinationId = samarkand.Id,
                Latitude = 39.6495,
                Longitude = 66.9605,
                Address = "Pushkin St, Samarkand",
                CuisineType = "Uzbek & Silk Road Fusion",
                AverageCostUzs = 120000,
                Rating = 4.91,
                ImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
                SignatureDishes = "Lamb shanks in pomegranate glaze, Tandir somsa, Saffron rice, Baklava"
            }
        };

        context.Hotels.AddRange(hotels);
        context.Restaurants.AddRange(restaurants);
        await context.SaveChangesAsync();

        // 5. Seed Users (Admin, Demo Tourist, Business)
        var adminUser = new User
        {
            Name = "Safar AI Administrator",
            Email = "admin@safarai.uz",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Country = "Uzbekistan",
            PreferredLanguage = "en",
            Role = UserRole.Admin
        };

        var touristUser = new User
        {
            Name = "Alexander Miller",
            Email = "tourist@safarai.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Tourist123!"),
            Country = "Germany",
            PreferredLanguage = "en",
            Role = UserRole.User,
            PreferredInterests = "History, Architecture, Food, Photography",
            PreferredStyle = TravelStyle.Balanced,
            PreferredTransport = TransportMode.Walking
        };

        context.Users.AddRange(adminUser, touristUser);
        await context.SaveChangesAsync();

        // 6. Seed Sample Reviews
        var registanPlace = places.First(p => p.Name == "Registan Square");
        var gureAmirPlace = places.First(p => p.Name == "Gur-e-Amir Mausoleum");

        var sampleReviews = new List<Review>
        {
            new Review
            {
                PlaceId = registanPlace.Id,
                UserId = touristUser.Id,
                Rating = 5,
                Comment = "Standing in Registan Square at sunset is an unforgettable emotional experience. The tilework is unmatched anywhere in the world! Safar AI's audio guide made the history come alive.",
                TouristCountry = "Germany",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Review
            {
                PlaceId = registanPlace.Id,
                UserId = adminUser.Id,
                Rating = 5,
                Comment = "The Sher-Dor madrasah tigers and Tilla-Kori gilded dome are absolute masterpieces. Highly recommend visiting both in daylight and during the night illumination!",
                TouristCountry = "Uzbekistan",
                CreatedAt = DateTime.UtcNow.AddDays(-7)
            },
            new Review
            {
                PlaceId = gureAmirPlace.Id,
                UserId = touristUser.Id,
                Rating = 5,
                Comment = "The turquoise ribbed dome and dark jade stone of Timur are breathtaking. The AI camera recognized the landmark instantly from 50 meters away!",
                TouristCountry = "Germany",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            }
        };

        context.Reviews.AddRange(sampleReviews);
        await context.SaveChangesAsync();
    }
}
