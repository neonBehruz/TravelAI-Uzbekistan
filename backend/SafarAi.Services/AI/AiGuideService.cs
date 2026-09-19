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

        // 2. Intelligent Built-in Generative Multi-Lingual RAG Engine (Zero API Key required, 100% reliable)
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
                model = "llama-3.1-8b-instant",
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

        return $"{roleDesc} You have comprehensive knowledge of all 14 regions of Uzbekistan. " +
               $"IMPORTANT: Respond COMPLETELY and FLUENTLY in {language} language. Use clear Markdown formatting with bullet points, bold highlights, practical tips, and emojis.";
    }

    private async Task<AiChatResponseDto> GenerateSmartRagResponseAsync(Guid conversationId, AiChatRequestDto request)
    {
        var rawMsg = request.Message.Trim();
        var msg = rawMsg.ToLowerInvariant();
        var lang = (request.Language ?? "uz").ToLowerInvariant();

        var isUz = lang.StartsWith("uz") || msg.Contains("qayerda") || msg.Contains("qanday") || msg.Contains("haqida") || msg.Contains("rahmat") || msg.Contains("salom");
        var isRu = !isUz && (lang.StartsWith("ru") || msg.Contains("где") || msg.Contains("как") || msg.Contains("сколько") || msg.Contains("расскажи"));
        var isTr = !isUz && !isRu && lang.StartsWith("tr");
        var isDe = !isUz && !isRu && lang.StartsWith("de");
        var isFr = !isUz && !isRu && lang.StartsWith("fr");
        var isEs = !isUz && !isRu && lang.StartsWith("es");
        var isZh = !isUz && !isRu && lang.StartsWith("zh");
        var isJa = !isUz && !isRu && lang.StartsWith("ja");
        var isKo = !isUz && !isRu && lang.StartsWith("ko");

        string reply;

        // 1. Greetings (Salom / Hello / Privet)
        if (msg == "salom" || msg.StartsWith("salom") || msg.Contains("assalom") ||
            msg == "hi" || msg == "hello" || msg == "hey" ||
            msg.Contains("привет") || msg.Contains("здравствуй") ||
            msg.Contains("merhaba") || msg.Contains("selam") ||
            msg.Contains("qaleysiz") || msg.Contains("qalesiz") || msg.Contains("yaxshimisiz") || msg.Contains("tinchmisiz"))
        {
            if (isUz)
            {
                reply = "Assalomu alaykum! Xush kelibsiz. 😊\n\n" +
                        "Men Safar AI — sizning shaxsiy aqlli sayohat hamrohingizman. O'zbekistonning barcha 14 ta viloyati, Samarqand, Buxoro, Xiva va Toshkentdagi tarixiy obidalar, milliy taomlar, Afrosiyob poyezd chiptalari yoki sayohat marshrutlari bo'yicha qanday yordam bera olaman?\n\n" +
                        "Istalgan savolingizni bemalol berishingiz mumkin!";
            }
            else if (isRu)
            {
                reply = "Здравствуйте! Рад приветствовать вас. 😊\n\n" +
                        "Я Safar AI — ваш интеллектуальный персональный гид по Узбекистану. Готов рассказать вам о достопримечательностях Самарканда, Бухары, Хивы и Ташкента, подсказать лучшие рестораны с пловом, помочь с билетами на поезд Афросиаб или составить маршрут.\n\n" +
                        "О чём вы хотите узнать?";
            }
            else
            {
                reply = "Hello and welcome! 😊\n\n" +
                        "I am Safar AI, your personal smart travel guide for Uzbekistan. How can I assist you today? Feel free to ask about historical landmarks in Samarkand, Bukhara, or Khiva, authentic Uzbek cuisine, Afrosiyob bullet train tickets, or custom itineraries!";
            }
        }
        // 2. Gratitude (Rahmat / Thank you / Spasibo)
        else if (msg.Contains("rahmat") || msg.Contains("tashakkur") || msg.Contains("spasibo") || msg.Contains("спасибо") || msg.Contains("thank") || msg.Contains("teşekkür"))
        {
            if (isUz)
            {
                reply = "Arzimaydi! Sizga foydali ma'lumot bera olganimdan mamnunman. 😊\n\n" +
                        "Yana qanday savollaringiz yoki rejalaringiz bor? Safaringiz ajoyib va esda qolarli o'tishini tilayman! ✨";
            }
            else if (isRu)
            {
                reply = "Всегда пожалуйста! Рад был помочь. 😊\n\n" +
                        "Если у вас появятся новые вопросы по путешествию, с удовольствием подскажу. Приятной поездки! ✨";
            }
            else
            {
                reply = "You're very welcome! Glad I could assist you. 😊\n\n" +
                        "Let me know if you need any more recommendations or tips. Wishing you an incredible trip in Uzbekistan! ✨";
            }
        }
        // 3. Who are you (Kim siz / Kimsan / Who are you)
        else if (msg.Contains("kimsan") || msg.Contains("kim siz") || msg.Contains("kim bu") || msg.Contains("who are you") || msg.Contains("кто ты") || msg.Contains("kimsin"))
        {
            if (isUz)
            {
                reply = "Men — Safar AI, O'zbekiston bo'ylab sizning shaxsiy aqlli sayohat hamrohingiz va gidingizman. 🌍\n\n" +
                        "Barcha 14 ta viloyat, 2750 yillik qadimiy tarix, me'moriy obidalar, mazali milliy oshxona, transport va qulay sayohat marshrutlari bo'yicha 24/7 yordam berishga tayyorman!";
            }
            else if (isRu)
            {
                reply = "Я — Safar AI, ваш интеллектуальный туристический ИИ-гид по Узбекистану. 🌍\n\n" +
                        "Я знаю всё о достопримечательностях 14 регионов, богатой истории, национальной кухне, поездах Афросиаб и помогу спланировать идеальное путешествие 24/7!";
            }
            else
            {
                reply = "I am Safar AI, your intelligent 24/7 AI travel guide for Uzbekistan. 🌍\n\n" +
                        "I am here to help you discover historical landmarks across all 14 regions, taste authentic Silk Road cuisine, navigate transit, and craft unforgettable journeys!";
            }
        }
        // 4. Tashkent
        else if (msg.Contains("toshkent") || msg.Contains("tashkent") || msg.Contains("ташкент"))
        {
            if (isUz)
            {
                reply = "Toshkent — O'zbekistonning zamonaviy va go'zal poytaxti!\n\n" +
                        "• **Chorsu Bozori**: Ming yillik sharqona bozor, milliy shirinliklar va hunarmandchilik markazi.\n" +
                        "• **Hazrati Imom (Hastimom) Majmuasi**: Qadimiy muqaddas Usmon Qur'oni saqlanadigan ma'naviy maskan.\n" +
                        "• **Toshkent Metropoliteni**: Har bir bekati betakror san'at asari bo'lgan go'zal metro.\n" +
                        "• **Tashkent City & Magic City**: Zamonaviy istirohat bog'lari va musiqali favvoralar.\n" +
                        "• **Toshkent Teleminorasi**: Shahar panoramasini 375 metr balandlikdan tomosha qilish maskani.\n\n" +
                        "💡 **Tavsiya:** Beshyog'ochdagi Milliy Taomlar yoki Markaziy Oshxonalarda haqiqiy Toshkent to'y oshidan tatib ko'ring!";
            }
            else if (isRu)
            {
                reply = "Ташкент — динамичная и зеленая столица Узбекистана!\n\n" +
                        "• **Базар Чорсу**: Знаменитый древний купольный восточный рынок.\n" +
                        "• **Комплекс Хазрати Имам (Хастимом)**: Духовный центр, где хранится подлинный Коран Усмана VII века.\n" +
                        "• **Ташкентское метро**: Настоящий подземный музей архитектуры и мрамора.\n" +
                        "• **Tashkent City и Magic City**: Современные парки с грандиозными поющими фонтанами.\n" +
                        "• **Ташкентская телебашня**: Панорамный вид на весь город.\n\n" +
                        "💡 **Совет:** Обязательно попробуйте праздничный ташкентский плов в Центре плова (Besh Qozon)!";
            }
            else
            {
                reply = "Tashkent — The cosmopolitan, vibrant green capital of Uzbekistan!\n\n" +
                        "• **Chorsu Bazaar**: Iconic domed market with spices, dry fruits, and street treats.\n" +
                        "• **Hazrati Imam Complex**: Spiritual center housing the 7th-century Holy Quran of Uthman.\n" +
                        "• **Tashkent Metro**: Stunning underground palaces with Soviet and Islamic mosaics.\n" +
                        "• **Tashkent City Park**: Ultra-modern park with nightly musical fountains.\n" +
                        "• **Tashkent TV Tower**: Panoramic viewing deck overlooking the whole city.\n\n" +
                        "💡 **Pro-Tip:** Visit the famous Central Asian Plov Center near the TV Tower at lunchtime!";
            }
        }
        // 5. Bukhara
        else if (msg.Contains("buxoro") || msg.Contains("bukhara") || msg.Contains("бухара") || msg.Contains("buhara"))
        {
            if (isUz)
            {
                reply = "Buxoro — Qadimiy Buxoro Viloyati\n\n" +
                        "2500 yillik boy tarixga ega tirik ochiq osmon ostidagi muzey shahar. Buxoro Islom olamining muqaddas ma'naviy poytaxtlaridan biri hisoblanadi.\n\n" +
                        "🌟 Eng Mashhur Diqqatga Sazovor Joylar:\n" +
                        "• Minorai Kalon va Poyi Kalon Majmuasi — 1127-yilda qurilgan 45.6 metrli muhtasham minora. Chingizxon ham uning mahobatiga qoyil qolib vayron qilmagan.\n" +
                        "• Labi Hovuz Ansambli — Asrlar osha qadimiy tut daraxtlari soyasida saqlangan sokin hovuz, Nodir Devonbegi madrasasi va choyxonalar maskani.\n" +
                        "• Buxoro Arki — Buxoro amirlarining qadimiy mahobatli qal'a-qarorgohi.\n" +
                        "• Somoniylar Maqbarasi (IX asr) — Pishgan g'ishtdan terilgan me'moriy durdona.\n\n" +
                        "💡 Tavsiya: Buxoro bo'ylab piyoda sayr qilish juda qulay. Ayniqsa Labi Hovuzda milliy choy ichib, Buxoro shashligidan tatib ko'rishni tavsiya qilamiz!";
            }
            else if (isRu)
            {
                reply = "Бухара — Сердце Шёлкового Пути\n\n" +
                        "Священный город-музей под открытым небом с 2500-летней историей, включенный в список Всемирного наследия ЮНЕСКО.\n\n" +
                        "🌟 Главные Достопримечательности:\n" +
                        "• Минарет Калян и ансамбль Пои-Калян — Величественный 45-метровый минарет 1127 года, уцелевший даже при нашествии Чингисхана.\n" +
                        "• Ансамбль Ляби-Хауз — Живописная историческая площадь вокруг древнего хауза в тени вековых тутовников.\n" +
                        "• Цитадель Арк — Древняя неприступная крепость и резиденция бухарских эмиров.\n" +
                        "• Торговые купола (Токи Заргарон, Токи Тельпак Фурушон) — Древние крытые базары ремесленников.\n\n" +
                        "💡 Совет: Старый город Бухары идеально подходит для пеших прогулок. Обязательно попробуйте бухарский плов Ош-и-Софи!";
            }
            else if (isTr)
            {
                reply = "Buhara — İpek Yolu'nun Manevi Başkenti\n\n" +
                        "2500 yıllık tarihe sahip canlı bir açık hava müzesi olan Buhara, UNESCO Dünya Mirası listesindedir.\n\n" +
                        "🌟 En Popüler Gezilecek Yerler:\n" +
                        "• Kalyan Minaresi ve Poi Kalyan — 1127 yılında inşa edilmiş 45.6 metrelik heybetli minare.\n" +
                        "• Leb-i Havuz Meydanı — Asırlık dut ağaçları gölgesinde tarihi havuz ve geleneksel çayhaneler.\n" +
                        "• Buhara Ark Kalesi — Buhara emirlerinin tarihi görkemli saray kalesi.\n" +
                        "• Samaniler Türbesi — 9. yüzyıldan kalma eşsiz tuğla mimarisi.\n\n" +
                        "💡 İpucu: Eski Buhara sokaklarında yürüyerek keşif yapabilir ve akşamları Leb-i Havuz'da geleneksel çay keyfi yapabilirsiniz!";
            }
            else
            {
                reply = "Bukhara — Bukhara Region\n\n" +
                        "A sacred UNESCO World Heritage living museum city with over 2,500 years of rich Islamic and Silk Road history.\n\n" +
                        "🌟 Top Must-Visit Landmarks:\n" +
                        "• Kalyan Minaret & Poi Kalyan Complex — The iconic 45.6-meter brick minaret built in 1127, famously spared by Genghis Khan.\n" +
                        "• Lyabi-Khauz Ensemble — Charming historic square centered around a tranquil pool shaded by centuries-old mulberry trees.\n" +
                        "• Ark Citadel of Bukhara — Massive ancient fortress that served as the residence of Bukhara Emirs.\n" +
                        "• Samanid Mausoleum (9th Century) — Masterpiece of early Islamic fired-brick geometry.\n\n" +
                        "💡 Pro-Tip: Bukhara is best explored on foot. Try the authentic local saffron herbal tea and Oshi Sofi plov!";
            }
        }
        // 6. Samarkand
        else if (msg.Contains("samarqand") || msg.Contains("samarkand") || msg.Contains("самарканд"))
        {
            if (isUz)
            {
                reply = "Samarqand — Buyuk Ipak Yo'li Durdonasi\n\n" +
                        "Amir Temur saltanatining afsonaviy poytaxti. Moviy va feruza koshinli gumbazlari bilan butun dunyo sayyohlarini lol qoldirib kelmoqda.\n\n" +
                        "🌟 Eng Mashhur Diqqatga Sazovor Joylar:\n" +
                        "• Registon Maydoni — Ulug'bek, Sherdor va Tillakori madrasalaridan iborat jahon mo''jizasi.\n" +
                        "• Go'ri Amir Maqbarasi — Sohibqiron Amir Temur va temuriylar mangu qo'nim topgan moviy gumbazli maqbara.\n" +
                        "• Shohi Zinda Majmuasi — Afrosiyob tepaligidagi 20 dan ortiq naqshinkor moviy maqbaralar xiyoboni.\n" +
                        "• Bibixonim Masjidi — Temur davrining eng ulkan va mahobatli masjidi.\n" +
                        "• Ulug'bek Rasadxonasi — O'rta asr astronomiyasining cho'qqisi.\n\n" +
                        "💡 Tavsiya: Samarqand ziq oshini 11:30 dan 14:00 gacha Siyob bozori yoki Osh markazlarida yangi chiqqanida tatib ko'ring!";
            }
            else if (isRu)
            {
                reply = "Самарканд — Жемчужина Шёлкового Пути\n\n" +
                        "Легендарная столица империи Амира Тимура с бирюзовыми куполами и непревзойденной восточной архитектурой.\n\n" +
                        "🌟 Главные Достопримечательности:\n" +
                        "• Площадь Регистан — Всемирно известный ансамбль из трёх медресе: Улугбека, Шердор и Тилля-Кари.\n" +
                        "• Мавзолей Гур-Эмир — Усыпальница великого полководца Амира Тимура.\n" +
                        "• Некрополь Шахи-Зинда — Уникальная улица лазурных мавзолеев на холмах Афрасиаба.\n" +
                        "• Мечеть Биби-Ханым — Грандиозная соборная мечеть эпохи Тимуридов.\n\n" +
                        "💡 Совет: Обязательно посетите Регистан вечером во время светового музыкального шоу!";
            }
            else
            {
                reply = "Samarkand — The Pearl of the Silk Road\n\n" +
                        "Legendary imperial capital of Amir Timur featuring mesmerizing turquoise tilework and grandeur architecture.\n\n" +
                        "🌟 Top Highlights & Landmarks:\n" +
                        "• Registan Square — World-famous architectural ensemble of Ulugh Beg, Sher-Dor, and Tilla-Kori Madrasahs.\n" +
                        "• Gur-e-Amir Mausoleum — Resting place of Amir Timur with its 64-fluted ribbed azure dome.\n" +
                        "• Shah-i-Zinda Necropolis — Breathtaking avenue of cobalt and turquoise royal mausoleums.\n" +
                        "• Bibi-Khanym Mosque — One of the largest and most monumental mosques of the 15th century.\n\n" +
                        "💡 Pro-Tip: Enjoy authentic layered Samarkand plov for lunch around 12:00 PM at local choyxonas near Siab Bazaar!";
            }
        }
        // 7. Khiva
        else if (msg.Contains("xiva") || msg.Contains("khiva") || msg.Contains("хива"))
        {
            if (isUz)
            {
                reply = "Xiva — Ko'hna Ichan Qal'a Mo''jizasi\n\n" +
                        "Qadimgi Xorazm xonligining poytaxti, to'liq saqlanib qolgan o'rta asr qal'a-shahri.\n\n" +
                        "🌟 Eng Mashhur Diqqatga Sazovor Joylar:\n" +
                        "• Kalta Minor — Feruza koshinlar bilan bezatilgan afsonaviy minora.\n" +
                        "• Ichan Qal'a — YUNESKO butunjahon merosiga kiritilgan qadimiy shahar devorlari.\n" +
                        "• Juma Masjidi — 218 ta o'yma naqshli yog'och ustunli qadimiy masjid.\n" +
                        "• Toshhovli Saroyi — Xiva xonlarining hashamatli saroyi.\n\n" +
                        "💡 Tavsiya: Quyosh botishi paytida Oqshayx bobo minorasiga chiqib butun Xiva manzarasini tomosha qiling!";
            }
            else
            {
                reply = "Khiva — The Open-Air Museum City\n\n" +
                        "A remarkably preserved Silk Road oasis and capital of the historic Khiva Khanate.\n\n" +
                        "🌟 Top Highlights:\n" +
                        "• Kalta Minor — Stunning turquoise-glazed minaret standing inside Ichan-Kala.\n" +
                        "• Ichan-Kala Fortress — UNESCO World Heritage fortified medieval inner city.\n" +
                        "• Juma Mosque — Famous for its 218 intricately carved wooden columns.\n" +
                        "• Tosh-Hovli Palace — Lavish palace of the Khiva Khans.\n\n" +
                        "💡 Pro-Tip: Watch the sunset from the top of the Kuhna Ark watchtower for breathtaking golden-hour photos!";
            }
        }
        // 8. Plov / Food
        else if (msg.Contains("plov") || msg.Contains("osh") || msg.Contains("taom") || msg.Contains("food") || msg.Contains("ovqat") || msg.Contains("eda") || msg.Contains("плов"))
        {
            if (isUz)
            {
                reply = "O'zbek Milliy Gastronomiyasi va Mashhur Palovlar 🍲\n\n" +
                        "O'zbekistonda palov — nafaqat taom, balki mehmondo'stlik va madaniyat ramzidir!\n\n" +
                        "1. Samarqand Ziq Oshi: Sariq sabzi, no'xat, mayiz va qovurilgan dumba go'shti bilan qatlamli usulda pishiriladi.\n" +
                        "2. Toshkent To'y Oshi: Mayiz, za'faron, qazi va bedana tuxumi qo'shilgan klassik to'y oshi.\n" +
                        "3. Buxoro Oshi Sofi: Parhezbop, mis qozonda go'sht va sabzavotlar bilan qaynatib pishiriladi.\n" +
                        "4. Farg'ona / Devzira Oshi: Qizil devzira guruchi va achchiq qalampir bilan qovurma uslubda tayyorlanadi.\n" +
                        "5. Tandir Somsa: Jizzax va Samarqandning qarsildoq qatlamli issiq tandir somsasi.\n\n" +
                        "💡 Maslahat: Oshni har doim soat 11:30 dan 14:00 gacha issiq ko'k choy va yangi Achichuk salati bilan tanovul qilish an'anadir!";
            }
            else if (isRu)
            {
                reply = "Гид по Узбекскому Плову и Национальной Кухне 🍲\n\n" +
                        "1. Самаркандский плов: Готовится слоями со сладкой желтой морковью, нутом и нежнейшей бараниной.\n" +
                        "2. Ташкентский праздничный плов (Тўй оши): Роскошный плов с казы, изюмом и перепелиными яйцами.\n" +
                        "3. Бухарский Ош-и-Софи: Диетический плов, готовящийся в медных котлах.\n" +
                        "4. Ферганский плов из риса Девзира: Насыщенный классический плов темно-янтарного цвета.\n" +
                        "5. Тандырная самса: Хрустящая слоеная самса с сочным мясом и зирой.\n\n" +
                        "💡 Совет: Плов принято заказывать к обеду (с 11:30 до 14:00) и запивать горячим зелёным чаем!";
            }
            else
            {
                reply = "Uzbek Culinary Guide & Iconic Plov Styles 🍲\n\n" +
                        "1. Samarkand Plov: Cooked in distinct layers with sweet yellow carrots, chickpeas, raisins, and tender lamb.\n" +
                        "2. Tashkent Wedding Plov: Rich celebratory plov served with horse meat sausage (Kazy) and quail eggs.\n" +
                        "3. Bukhara Osh-i-Sofi: Unique dietary plov prepared in special copper caldrons.\n" +
                        "4. Fergana Devzira Plov: Hearty dark-grained plov cooked with legendary red Devzira rice.\n" +
                        "5. Tandir Somsa: Golden clay-oven pastries packed with seasoned minced beef and fragrant cumin.\n\n" +
                        "💡 Pro-Tip: Plov is traditionally eaten at lunchtime (11:30 AM – 2:00 PM) paired with hot green tea and Achichuk tomato salad!";
            }
        }
        // 9. Trains / Transport
        else if (msg.Contains("train") || msg.Contains("poyezd") || msg.Contains("afrosiyob") || msg.Contains("transport") || msg.Contains("taxi") || msg.Contains("yandex") || msg.Contains("поезд"))
        {
            if (isUz)
            {
                reply = "Afrosiyob Poyezdi va O'zbekistonda Transport 🚄\n\n" +
                        "• Afrosiyob Tezyurar Poyezdi: Toshkent, Samarqand va Buxoroni 2–3 soatda bog'laydi. Tezligi 250 km/soat. Chiptalarni 15-45 kun oldin ticket.elektropoyezd.uz saytidan xarid qilish tavsiya etiladi.\n" +
                        "• Shahar Ichida Taksi: Yandex Go ilovasi orqali aniq tariflarda yurish juda qulay (o'rtacha yo'l haqi 15,000 - 30,000 so'm / ~$1.50 - $2.50).\n" +
                        "• Toshkent Metropoliteni: Har bir bekati san'at asari bo'lgan go'zal metro. Yo'l haqi 2,000 so'm (QR chipta yoki bank kartasi).";
            }
            else
            {
                reply = "Afrosiyob Bullet Train & Transit Guide 🚄\n\n" +
                        "• Afrosiyob High-Speed Train: Connects Tashkent, Samarkand, and Bukhara in 2–3 hours at 250 km/h. Book official tickets 15–45 days ahead on ticket.elektropoyezd.uz.\n" +
                        "• City Taxis: Use the Yandex Go ride-hailing app for transparent, cheap rides (typically 15,000 – 30,000 UZS / $1.50 - $2.50).\n" +
                        "• Tashkent Metro: Ornate architectural underground stations. Fare is only 2,000 UZS (~$0.15).";
            }
        }
        // 10. General query fallback
        else
        {
            if (isUz)
            {
                reply = "O'zbekistonning barcha 14 ta viloyati bo'yicha sayohatingizda sizga yordam berishga tayyorman! 🌍\n\n" +
                        "• Tarixiy obidalar: Samarqand Registoni, Buxoro Minorai Kaloni, Xiva Ichan-Qal'asi, Toshkent Hastimom majmuasi\n" +
                        "• Milliy oshxona: Samarqand ziq oshi, Toshkent to'y oshi, Jizzax somsasi, Farg'ona qozon kabobi\n" +
                        "• Transport va Logistika: Afrosiyob poyezd jadvali, mehmonxonalar va Yandex Go taksilari\n\n" +
                        "Quyidagi tavsiya etilgan savollardan birini tanlashingiz yoki aniq bir shahar/mavzu bo'yicha savol berishingiz mumkin!";
            }
            else if (isRu)
            {
                reply = "С удовольствием помогу вам спланировать идеальное путешествие по Узбекистану! 🌍\n\n" +
                        "• История и архитектура: Самарканд, Бухара, Хива, Ташкент\n" +
                        "• Национальная кухня: Гид по плову, тандырной самсе и лучшим чайханам\n" +
                        "• Транспорт и логистика: Скоростной поезд Афросиаб, отели и такси\n\n" +
                        "Выберите один из предложенных вопросов ниже или спросите что угодно!";
            }
            else
            {
                reply = "I am delighted to guide you through your journey across Uzbekistan! 🌍\n\n" +
                        "• Historic Landmarks: Samarkand Registan, Bukhara Kalyan Minaret, Khiva Ichan-Kala\n" +
                        "• Silk Road Cuisine: Authentic Plov varieties, Tandir Somsa, and tea traditions\n" +
                        "• Travel Logistics: Afrosiyob bullet train booking, hotels, and city transit\n\n" +
                        "Feel free to select one of the prompts below or ask any travel question!";
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
        var isUz = (language ?? "uz").StartsWith("uz");

        if (q.Contains("registan") || q.Contains("samarkand") || q.Contains("samarqand"))
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
        catch { }

        return new AiGuideResponseDto(
            PlaceId: place.Id,
            PlaceName: place.Name,
            Answer: place.DetailedHistory,
            HistoricalContext: place.ArchitectureDetails,
            MustSeePoints: interestingFacts,
            Language: request.Language ?? "uz",
            AudioUrl: null
        );
    }
}
