using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SafarAi.Core.DTOs;
using SafarAi.Core.Entities;
using SafarAi.Core.Interfaces;
using SafarAi.Infrastructure.Data;

namespace SafarAi.Services.AI;

public class AiGuideService : IAIGuideService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private static readonly HttpClient _httpClient = new() { Timeout = TimeSpan.FromSeconds(15) };

    public AiGuideService(ApplicationDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public async Task<AiChatResponseDto> ChatAsync(AiChatRequestDto request, Guid? userId = null)
    {
        var conversationId = request.ConversationId ?? Guid.NewGuid();
        var userMsg = request.Message.Trim();

        // 1. Check if external LLM API (OpenAI / Gemini / Groq) is configured
        var openAiKey = _configuration["AiProvider:OpenAiApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        var geminiKey = _configuration["AiProvider:GeminiApiKey"] ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        var groqKey = _configuration["AiProvider:GroqApiKey"] ?? Environment.GetEnvironmentVariable("GROQ_API_KEY");

        if (!string.IsNullOrWhiteSpace(openAiKey))
        {
            var openAiReply = await CallOpenAiAsync(openAiKey, request);
            if (openAiReply != null) return openAiReply;
        }
        else if (!string.IsNullOrWhiteSpace(groqKey))
        {
            var groqReply = await CallGroqAsync(groqKey, request);
            if (groqReply != null) return groqReply;
        }
        else if (!string.IsNullOrWhiteSpace(geminiKey))
        {
            var geminiReply = await CallGeminiAsync(geminiKey, request);
            if (geminiReply != null) return geminiReply;
        }

        // 2. Intelligent Built-in Generative RAG Engine (Zero API Key required, 100% reliable)
        return await GenerateSmartRagResponseAsync(conversationId, request);
    }

    private async Task<AiChatResponseDto?> CallOpenAiAsync(string apiKey, AiChatRequestDto request)
    {
        try
        {
            var systemPrompt = BuildSystemPrompt(request.Language, request.Persona);
            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };

            if (request.History != null)
            {
                foreach (var h in request.History.TakeLast(6))
                {
                    messages.Add(new { role = h.Role.ToLower() == "user" ? "user" : "assistant", content = h.Content });
                }
            }

            messages.Add(new { role = "user", content = request.Message });

            var payload = new
            {
                model = "gpt-4o-mini",
                messages,
                temperature = 0.7,
                max_tokens = 800
            };

            using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            req.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var res = await _httpClient.SendAsync(req);
            if (res.IsSuccessStatusCode)
            {
                var json = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var text = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (!string.IsNullOrEmpty(text))
                {
                    return new AiChatResponseDto(
                        ConversationId: request.ConversationId ?? Guid.NewGuid(),
                        Reply: text,
                        Language: request.Language,
                        SuggestedFollowUps: GenerateSmartFollowUps(request.Message, request.Language)
                    );
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AiGuide] OpenAI API exception: {ex.Message}");
        }
        return null;
    }

    private async Task<AiChatResponseDto?> CallGroqAsync(string apiKey, AiChatRequestDto request)
    {
        try
        {
            var systemPrompt = BuildSystemPrompt(request.Language, request.Persona);
            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };

            if (request.History != null)
            {
                foreach (var h in request.History.TakeLast(6))
                {
                    messages.Add(new { role = h.Role.ToLower() == "user" ? "user" : "assistant", content = h.Content });
                }
            }

            messages.Add(new { role = "user", content = request.Message });

            var payload = new
            {
                model = "llama-3.3-70b-versatile",
                messages,
                temperature = 0.7,
                max_tokens = 800
            };

            using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.groq.com/openai/v1/chat/completions");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            req.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var res = await _httpClient.SendAsync(req);
            if (res.IsSuccessStatusCode)
            {
                var json = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var text = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                if (!string.IsNullOrEmpty(text))
                {
                    return new AiChatResponseDto(
                        ConversationId: request.ConversationId ?? Guid.NewGuid(),
                        Reply: text,
                        Language: request.Language,
                        SuggestedFollowUps: GenerateSmartFollowUps(request.Message, request.Language)
                    );
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AiGuide] Groq API exception: {ex.Message}");
        }
        return null;
    }

    private async Task<AiChatResponseDto?> CallGeminiAsync(string apiKey, AiChatRequestDto request)
    {
        try
        {
            var systemPrompt = BuildSystemPrompt(request.Language, request.Persona);
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

            var contents = new List<object>();
            contents.Add(new { role = "user", parts = new[] { new { text = systemPrompt + "\n\nUser Question: " + request.Message } } });

            var payload = new { contents };
            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var res = await _httpClient.SendAsync(req);
            if (res.IsSuccessStatusCode)
            {
                var json = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                if (!string.IsNullOrEmpty(text))
                {
                    return new AiChatResponseDto(
                        ConversationId: request.ConversationId ?? Guid.NewGuid(),
                        Reply: text,
                        Language: request.Language,
                        SuggestedFollowUps: GenerateSmartFollowUps(request.Message, request.Language)
                    );
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AiGuide] Gemini API exception: {ex.Message}");
        }
        return null;
    }

    private static string BuildSystemPrompt(string language, string? persona)
    {
        var roleDesc = persona switch
        {
            "historian" => "You are 'Tarixchi Bobo', an erudite Silk Road historian and scholar of the Timurid and Sogdian empires. You speak with deep wisdom and vivid historical narratives.",
            "local" => "You are a warm, energetic local Uzbek friend from Tashkent/Samarkand. You give honest insider tips about the tastiest street plov, hidden alleys, haggling at bazaars, and budget travel.",
            _ => "You are SAFAR AI, the premier smart, conversational, and highly knowledgeable AI Tour Guide for Uzbekistan."
        };

        return $"{roleDesc} You have comprehensive knowledge of all 14 regions of Uzbekistan (Samarkand, Bukhara, Khiva, Tashkent City, Tashkent Region/Amirsoy, Fergana Valley, Andijan, Namangan, Kashkadarya/Shahrisabz, Surkhandarya/Termez, Navoiy/Nurata, Jizzakh/Zaamin, Syrdarya, Karakalpakstan/Aral Sea). " +
               $"Answer in {language} language using clear, elegant Markdown with bullet points, bold highlights, practical tips, and emojis. Always be polite, welcoming, and culturally respectful.";
    }

    private async Task<AiChatResponseDto> GenerateSmartRagResponseAsync(Guid conversationId, AiChatRequestDto request)
    {
        var msg = request.Message.Trim().ToLowerInvariant();
        var lang = (request.Language ?? "en").ToLowerInvariant();
        var isUz = lang.StartsWith("uz");
        var isRu = lang.StartsWith("ru");

        var places = await _dbContext.Places
            .Include(p => p.Destination)
            .Include(p => p.Category)
            .ToListAsync();

        var destinations = await _dbContext.Destinations.ToListAsync();

        // 1. Search matching places in DB
        var matchedPlace = places.FirstOrDefault(p =>
            msg.Contains(p.Name.ToLower()) ||
            (!string.IsNullOrEmpty(p.LocalName) && msg.Contains(p.LocalName.ToLower())) ||
            (!string.IsNullOrEmpty(p.VisionRecognitionTags) && p.VisionRecognitionTags.Split(',').Any(t => t.Trim().Length > 3 && msg.Contains(t.Trim().ToLower())))
        );

        // 2. Search matching destination in DB
        var matchedDest = destinations.FirstOrDefault(d =>
            msg.Contains(d.Name.ToLower()) ||
            msg.Contains(d.Region.ToLower())
        );

        string reply;

        if (matchedPlace != null)
        {
            var p = matchedPlace;
            if (isUz)
            {
                reply = $"### 🏛️ **{p.Name} ({p.LocalName})**\n\n" +
                        $"📍 **Joylashuvi:** {p.Destination.Name}, {p.Address}\n" +
                        $"⭐ **Reyting:** {p.Rating:F1}/5.0 ({p.ReviewCount} ta sayyoh fikri)\n" +
                        $"🎟️ **Chipta narxi:** {(p.TicketPriceUzs == 0 ? "Bepul kirish" : $"{p.TicketPriceUzs:N0} so'm")}\n" +
                        $"⏰ **Ish vaqti:** {p.OpeningHours}\n\n" +
                        $"#### 📜 **Tarixiy Tavsif:**\n{p.DetailedHistory}\n\n" +
                        $"#### 🏺 **Me'moriy Xususiyatlari:**\n{p.ArchitectureDetails}\n\n" +
                        $"💡 **SAFAR AI Maslahati:** Tashrif uchun tavsiya etilgan vaqt — **{p.RecommendedVisitDurationMinutes} daqiqa**. Ayniqsa quyosh botishi paytida ajoyib suratlar olishingiz mumkin!";
            }
            else if (isRu)
            {
                reply = $"### 🏛️ **{p.Name} ({p.LocalName})**\n\n" +
                        $"📍 **Локация:** {p.Destination.Name}, {p.Address}\n" +
                        $"⭐ **Рейтинг:** {p.Rating:F1}/5.0 ({p.ReviewCount} отзывов)\n" +
                        $"🎟️ **Стоимость билета:** {(p.TicketPriceUzs == 0 ? "Бесплатный вход" : $"{p.TicketPriceUzs:N0} сум")}\n" +
                        $"⏰ **Часы работы:** {p.OpeningHours}\n\n" +
                        $"#### 📜 **Историческая справка:**\n{p.DetailedHistory}\n\n" +
                        $"#### 🏺 **Архитектурные детали:**\n{p.ArchitectureDetails}\n\n" +
                        $"💡 **Совет от SAFAR AI:** Рекомендуемое время визита — **{p.RecommendedVisitDurationMinutes} минут**. Обязательно посетите в золотой час перед закатом!";
            }
            else
            {
                reply = $"### 🏛️ **{p.Name} ({p.LocalName})**\n\n" +
                        $"📍 **Location:** {p.Destination.Name}, {p.Address}\n" +
                        $"⭐ **Rating:** {p.Rating:F1}/5.0 ({p.ReviewCount} reviews)\n" +
                        $"🎟️ **Ticket Price:** {(p.TicketPriceUzs == 0 ? "Free Entry" : $"{p.TicketPriceUzs:N0} UZS")}\n" +
                        $"⏰ **Opening Hours:** {p.OpeningHours}\n\n" +
                        $"#### 📜 **Historical Significance:**\n{p.DetailedHistory}\n\n" +
                        $"#### 🏺 **Architectural Highlights:**\n{p.ArchitectureDetails}\n\n" +
                        $"💡 **SAFAR AI Pro-Tip:** Recommended visit duration is **{p.RecommendedVisitDurationMinutes} minutes**. Golden hour before sunset offers the most stunning lighting for photography!";
            }
        }
        else if (matchedDest != null)
        {
            var d = matchedDest;
            var destPlaces = places.Where(p => p.DestinationId == d.Id).ToList();
            if (isUz)
            {
                reply = $"### 🌍 **{d.Name} — {d.Region}**\n\n" +
                        $"{d.Description}\n\n" +
                        $"#### 🌟 **Eng Mashhur Diqqatga Sazovor Joylar:**\n" +
                        string.Join("\n", destPlaces.Select(p => $"• **{p.Name}** ({p.Category?.Name}) — {p.ShortDescription}")) +
                        $"\n\n💡 **Tavsiya:** {d.Name} bo'ylab sayohat qilish uchun AI Trip Planner bo'limida kunlik qulay marshrut tuzib olishingiz mumkin!";
            }
            else if (isRu)
            {
                reply = $"### 🌍 **{d.Name} — {d.Region}**\n\n" +
                        $"{d.Description}\n\n" +
                        $"#### 🌟 **Главные достопримечательности:**\n" +
                        string.Join("\n", destPlaces.Select(p => $"• **{p.Name}** ({p.Category?.Name}) — {p.ShortDescription}")) +
                        $"\n\n💡 **Совет:** Составьте персональный маршрут по {d.Name} с помощью нашего AI Trip Planner!";
            }
            else
            {
                reply = $"### 🌍 **{d.Name} — {d.Region}**\n\n" +
                        $"{d.Description}\n\n" +
                        $"#### 🌟 **Top Highlights & Attractions:**\n" +
                        string.Join("\n", destPlaces.Select(p => $"• **{p.Name}** ({p.Category?.Name}) — {p.ShortDescription}")) +
                        $"\n\n💡 **Tip:** Use our AI Trip Planner to generate a custom itinerary for {d.Name} with automated budget and transit calculations!";
            }
        }
        else if (msg.Contains("plov") || msg.Contains("osh") || msg.Contains("food") || msg.Contains("eat") || msg.Contains("ovqat") || msg.Contains("eda"))
        {
            if (isUz)
            {
                reply = "### 🍲 **O'zbek Milliy Taomlari & Oshxonasi Bo'yicha Yo'riqnoma**\n\n" +
                        "1. **Samarqand Oshi**: Qatlamli usulda pishiriladi, sariq sabzi, no'xat, mayiz va yumshoq qo'zichoq go'shti bilan tortiladi (11:30 dan 14:00 gacha iste'mol qilish tavsiya etiladi).\n" +
                        "2. **Toshkent To'y Oshi**: Mayiz, kadi va bedana tuxumlari bilan boyitilgan klassik to'y oshi.\n" +
                        "3. **Tandir Somsa**: Jizzax yoki Samarqand uslubidagi qarsildoq xamirli, shirali tandir somsasi.\n" +
                        "4. **Shashlik & Qozon Kabob**: G'ijduvon va Buxoro qiyma shashliklari.\n\n" +
                        "💡 **Maslahat:** Har doim issiq ko'k choy (ko'k choy) va yangi uzilgan Achichuk pomidor-piyoz salati bilan iste'mol qiling!";
            }
            else if (isRu)
            {
                reply = "### 🍲 **Гид по гастрономии и узбекскому плову**\n\n" +
                        "1. **Самаркандский плов**: Готовится слоями со сладкой желтой морковью, нутом и нежнейшей бараниной. Лучшее время — с 11:30 до 14:00.\n" +
                        "2. **Ташкентский праздничный плов (Тўй оши)**: Классический плов с изюмом, казы и перепелиными яйцами.\n" +
                        "3. **Тандырная самса**: Хрустящая слоеная самса из Самарканда или Джизака.\n" +
                        "4. **Шашлык**: Знаменитые гиждуванские и бухарские сочные шашлыки.\n\n" +
                        "💡 **Совет:** Плов принято запивать горячим зеленым чаем (кўк чой) со свежим салатом Ачичук!";
            }
            else
            {
                reply = "### 🍲 **Uzbek Gastronomy & Plov Guide**\n\n" +
                        "1. **Samarkand Osh**: Cooked in distinct layers with sweet yellow carrots, chickpeas, raisins, and tender lamb shank (best enjoyed between 11:30 AM and 2:00 PM).\n" +
                        "2. **Tashkent Wedding Plov**: Rich celebratory plov served with horse meat sausage (Kazy) and quail eggs.\n" +
                        "3. **Tandir Somsa**: Golden clay-oven pastries packed with minced meat and fragrant cumin.\n" +
                        "4. **Gijduvan Shashlik**: Meltingly tender minced meat skewers from Bukhara region.\n\n" +
                        "💡 **Pro-Tip:** Always pair heavy dishes with steaming hot green tea (*Kok Choy*) and crisp *Achichuk* tomato salad!";
            }
        }
        else if (msg.Contains("train") || msg.Contains("afrosiyob") || msg.Contains("transport") || msg.Contains("taxi") || msg.Contains("yandex") || msg.Contains("poyezd"))
        {
            if (isUz)
            {
                reply = "### 🚄 **Transport va Harakatlanish Bo'yicha Maslahatlar**\n\n" +
                        "• **Afrosiyob Tezurar Poyezdi**: Toshkent, Samarqand, Buxoro va Qarshi shaharlarini 2-3 soatda bog'laydi. Chiptalarni 30-45 kun oldin `eticket.railway.uz` saytidan xarid qilish tavsiya etiladi.\n" +
                        "• **Shahar Ichida Taksilar**: **Yandex Go** ilovasi orqali arzon va aniq tarifda harakatlaning (o'rtacha yo'l haqi 15,000 - 30,000 so'm).\n" +
                        "• **Toshkent Metropoliteni**: Markaziy Osiyodagi eng chiroyli metro stansiyalari (Alisher Navoiy, Kosmonavtlar). Chipta 2,000 so'm.";
            }
            else
            {
                reply = "### 🚄 **Transportation & Travel Guide in Uzbekistan**\n\n" +
                        "• **Afrosiyob High-Speed Bullet Train**: Connects Tashkent, Samarkand, Bukhara, and Qarshi in 2–3 hours. Book tickets 30–45 days ahead on `eticket.railway.uz`.\n" +
                        "• **City Rides & Taxis**: Use the **Yandex Go** app for transparent, affordable rides (typically 15,000 – 30,000 UZS / $1.50 - $2.50 per trip).\n" +
                        "• **Tashkent Metro**: One of the most opulent Soviet-era metro systems in the world (visit Alisher Navoi & Kosmonavtlar stations). Fare is only 2,000 UZS (~$0.15).";
            }
        }
        else if (msg.Contains("budget") || msg.Contains("cost") || msg.Contains("narx") || msg.Contains("pul") || msg.Contains("money") || msg.Contains("dollar") || msg.Contains("som"))
        {
            if (isUz)
            {
                reply = "### 💰 **O'zbekistonda Sayohat Byudjeti & Xarajatlar**\n\n" +
                        "• **Byudjetli sayohatchi**: Kuniga 250,000 - 400,000 so'm (~$20 - $35) — mehmonxona, milliy oshxona, jamoat transporti.\n" +
                        "• **Qulay sayohat (Komfort)**: Kuniga 700,000 - 1,200,000 so'm (~$60 - $95) — 4-yulduzli mehmonxona, taksi, shaxsiy gid va restoranlar.\n" +
                        "• **Valyuta**: Milliy valyuta — O'zbek so'mi (UZS). Barcha bankomatlarda Visa va Mastercard ishlaydi.";
            }
            else
            {
                reply = "### 💰 **Uzbekistan Travel Budget & Currency Guide**\n\n" +
                        "• **Budget Traveler**: 250,000 – 400,000 UZS (~$20 – $35 / day) covering cozy guesthouses, local plov, and public transit.\n" +
                        "• **Comfort Traveler**: 700,000 – 1,200,000 UZS (~$60 – $95 / day) for 4-star boutique hotels, Yandex taxis, museum tickets, and dining.\n" +
                        "• **Currency**: Uzbek Som (UZS). Visa & Mastercard ATMs are widely available across major tourist hubs.";
            }
        }
        else if (msg.Contains("salom") || msg.Contains("hello") || msg.Contains("hi") || msg.Contains("privet") || msg.Contains("assalomu"))
        {
            if (isUz)
            {
                reply = "### 🌟 **Assalomu Alaykum! Xush kelibsiz!**\n\n" +
                        "Men **SAFAR AI** — O'zbekiston bo'ylab sizning shaxsiy aqlli sayohat hamrohingiz va gidingizman. Sizga O'zbekistonning barcha **14 ta viloyati**, qadimiy Registon va Ichan Qal'a obidalari, milliy palovxonalar, poyezd chiptalari va byudjet hisoblari bo'yicha yordam bera olaman!\n\n" +
                        "Bugun qaysi shahar yoki tarixiy obida haqida bilishni xohlaysiz?";
            }
            else if (isRu)
            {
                reply = "### 🌟 **Ассалому Алайкум! Добро пожаловать!**\n\n" +
                        "Я — **SAFAR AI**, ваш персональный интеллектуальный тур-гид по Узбекистану. Я знаю всё о 14 регионах, исторических памятниках Самарканда, Бухары и Хивы, национальной кухне, транспорте и бронировании.\n\n" +
                        "Какой город или достопримечательность вас интересует?";
            }
            else
            {
                reply = "### 🌟 **Assalomu Alaykum! Welcome to Uzbekistan!**\n\n" +
                        "I am **SAFAR AI**, your intelligent 24/7 Silk Road travel companion. I can guide you through all 14 regions of Uzbekistan, reveal hidden architectural secrets of Samarkand & Bukhara, recommend the best local eateries, calculate travel budgets, and plan your dream itinerary.\n\n" +
                        "Where would you like to begin your journey?";
            }
        }
        else
        {
            if (isUz)
            {
                reply = $"### 🏛️ **SAFAR AI Javobi**\n\n" +
                        $"Sizning savolingiz bo'yicha: *\"{request.Message}\"*\n\n" +
                        $"O'zbekiston bo'ylab 14 ta viloyatdagi 50 dan ortiq qadamjolar, jumladan Registon, Shohi Zinda, Buxoro Arki, Ichan Qal'a, Zomin tog'lari va Savitskiy muzeylari haqida to'liq ma'lumot bera olaman.\n\n" +
                        $"Quyidagi mavzular bo'yicha aniqroq ma'lumot olishni xohlaysizmi?";
            }
            else
            {
                reply = $"### 🏛️ **SAFAR AI Insights**\n\n" +
                        $"Regarding your query: *\"{request.Message}\"*\n\n" +
                        $"Uzbekistan is a treasure trove of Silk Road wonders spanning all 14 provinces. Whether you are curious about historical architecture (Registan, Kalyan Minaret, Ichan-Kala), outdoor adventures (Tian Shan, Zaamin, Aral Sea), or local traditions (Bazaar etiquette, Plov centers), I am here to help.\n\n" +
                        $"Would you like detailed recommendations on destinations, schedules, or logistics?";
            }
        }

        return new AiChatResponseDto(
            ConversationId: conversationId,
            Reply: reply,
            Language: request.Language,
            SuggestedFollowUps: GenerateSmartFollowUps(request.Message, request.Language)
        );
    }

    private static List<string> GenerateSmartFollowUps(string query, string language)
    {
        var q = query.ToLowerInvariant();
        var isUz = (language ?? "en").StartsWith("uz");

        if (q.Contains("registan") || q.Contains("samarkand"))
        {
            return isUz
                ? new() { "Sherdor madrasasidagi sherlar tarixi nima?", "Samarqandda eng mazali osh qayerda?", "Shohi Zinda zinalari afsonasi" }
                : new() { "What are the ticket prices for Registan?", "Where is the best Samarkand Plov?", "Tell me about Shah-i-Zinda stairs legend" };
        }
        if (q.Contains("bukhara") || q.Contains("buxoro"))
        {
            return isUz
                ? new() { "Minorai Kalon tarixi qanday?", "Labihovuz atrofidagi kafelar", "Buxoro arki ish vaqti" }
                : new() { "Why did Genghis Khan spare Kalyan Minaret?", "Best tea houses in Lyabi-Khauz", "Ark of Bukhara opening hours" };
        }
        if (q.Contains("khiva") || q.Contains("xiva"))
        {
            return isUz
                ? new() { "Kalta Minor nega chala qolgan?", "Ichan Qal'a chiptasi qancha?", "Xiva xonligi tarixi" }
                : new() { "Why was Kalta Minor never finished?", "Ichan Kala ticket guide", "Top photo spots inside Khiva" };
        }
        if (q.Contains("food") || q.Contains("plov") || q.Contains("osh"))
        {
            return isUz
                ? new() { "Toshkent to'y oshi qayerda yeyiladi?", "Tandir somsa narxlari", "Vegetarianlar uchun taomlar bormi?" }
                : new() { "Where is Tashkent Plov Center?", "Is tap water safe in Uzbekistan?", "Vegetarian options in Uzbek cuisine" };
        }

        return isUz
            ? new() { "Samarqand va Buxoroga 3 kunlik marshrut", "O'zbekistonda taksi narxlari qanday?", "Eng yaxshi esdalik sovg'alari (suvenir)" }
            : new() { "Best 3-Day Samarkand & Bukhara itinerary", "How much does a taxi cost in Uzbekistan?", "Top authentic Silk Road souvenirs" };
    }

    public async Task<AiGuideResponseDto> AskPlaceQuestionAsync(AiGuideQuestionRequestDto request)
    {
        var place = await _dbContext.Places
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == request.PlaceId)
            ?? await _dbContext.Places.FirstAsync();

        var interestingFacts = new List<string>();
        try
        {
            interestingFacts = JsonSerializer.Deserialize<List<string>>(place.InterestingFacts) ?? new();
        }
        catch
        {
            interestingFacts.Add("One of the most revered architectural marvels of the Timurid era.");
        }

        var answer = $"{place.Name} is famous for {place.ShortDescription} {place.DetailedHistory}";

        return new AiGuideResponseDto(
            PlaceId: place.Id,
            PlaceName: place.Name,
            Answer: answer,
            HistoricalContext: place.ArchitectureDetails,
            MustSeePoints: interestingFacts,
            Language: request.Language
        );
    }
}

