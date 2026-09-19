using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace SafarAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportController : ControllerBase
{
    private static readonly HttpClient _httpClient = new()
    {
        BaseAddress = new Uri("https://ticket.elektropoyezd.uz/api/"),
        Timeout = TimeSpan.FromSeconds(6)
    };

    private static DateTime _lastCacheTime = DateTime.MinValue;
    private static JsonElement? _cachedRoutesData = null;
    private static readonly SemaphoreSlim _cacheLock = new(1, 1);

    static TransportController()
    {
        try
        {
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) SafarAi/2.0");
            _httpClient.DefaultRequestHeaders.Accept.ParseAdd("application/json");
        }
        catch
        {
            // Ignore header parsing quirks
        }
    }

    [HttpGet("trains/live")]
    public async Task<ActionResult<LiveTrainSearchResponseDto>> GetLiveTrains(
        [FromQuery] string? from = "Toshkent",
        [FromQuery] string? to = "Samarqand",
        [FromQuery] string? date = null)
    {
        var origin = from?.Trim() ?? "Toshkent";
        var destination = to?.Trim() ?? "Samarqand";
        var searchDate = string.IsNullOrWhiteSpace(date) ? DateTime.UtcNow.ToString("yyyy-MM-dd") : date;

        var trains = await GenerateLiveTrainListAsync(origin, destination, searchDate);

        return Ok(new LiveTrainSearchResponseDto(
            Origin: origin,
            Destination: destination,
            Date: searchDate,
            TotalAvailableTrains: trains.Count,
            OfficialBookingUrl: "https://ticket.elektropoyezd.uz",
            LastUpdated: DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            Trains: trains
        ));
    }

    [HttpGet("elektropoyezd/routes")]
    public async Task<IActionResult> GetElektropoyezdRoutes()
    {
        var data = await GetElektropoyezdRoutesAsync();
        if (data.HasValue)
        {
            return Content(data.Value.GetRawText(), "application/json");
        }

        return StatusCode(503, new { message = "Elektropoyezd API vaqtinchalik javob bermadi." });
    }

    [HttpGet("elektropoyezd/trains/{id}")]
    public async Task<IActionResult> GetElektropoyezdTrainDetails(int id)
    {
        try
        {
            var res = await _httpClient.GetAsync($"trains/{id}");
            if (res.IsSuccessStatusCode)
            {
                var json = await res.Content.ReadAsStringAsync();
                return Content(json, "application/json");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TransportController] Failed to fetch train {id}: {ex.Message}");
        }

        return NotFound(new { message = $"Train {id} not found on ticket.elektropoyezd.uz" });
    }

    [HttpGet("trains/stations")]
    public ActionResult<List<StationDto>> GetStations()
    {
        return Ok(new List<StationDto>
        {
            new("Tashkent", "Toshkent Shimoliy / Markaziy (Tashkent Central)", "2900000"),
            new("Tashkent-South", "Toshkent Janubiy (Tashkent South)", "2900001"),
            new("Samarkand", "Samarqand Vokzali (Samarkand)", "2900100"),
            new("Bukhara", "Buxoro-1 Kogon (Bukhara 1)", "2900200"),
            new("Khiva", "Xiva Vokzali (Khiva)", "2900300"),
            new("Urgench", "Urganch Vokzali (Urgench)", "2900350"),
            new("Karshi", "Qarshi Vokzali (Karshi)", "2900400"),
            new("Navoiy", "Navoiy Vokzali (Navoiy)", "2900500"),
            new("Andijan", "Andijon-1 Vokzali (Andijan 1)", "2900600"),
            new("Kokand", "Qo'qon Vokzali (Kokand)", "2900700"),
            new("Margilan", "Marg'ilon Vokzali (Margilan)", "2900800"),
            new("Termez", "Termiz Vokzali (Termez)", "2900900"),
            new("Syrdarya", "Sirdaryo Vokzali (Syrdarya)", "2900950"),
            new("Guliston", "Guliston Vokzali (Guliston)", "2900960"),
            new("Nukus", "Nukus Vokzali (Nukus)", "2900970")
        });
    }

    private static async Task<JsonElement?> GetElektropoyezdRoutesAsync()
    {
        if (_cachedRoutesData.HasValue && DateTime.UtcNow - _lastCacheTime < TimeSpan.FromMinutes(5))
        {
            return _cachedRoutesData.Value;
        }

        await _cacheLock.WaitAsync();
        try
        {
            if (_cachedRoutesData.HasValue && DateTime.UtcNow - _lastCacheTime < TimeSpan.FromMinutes(5))
            {
                return _cachedRoutesData.Value;
            }

            var response = await _httpClient.GetAsync("routes");
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("data", out var dataProp))
                {
                    _cachedRoutesData = dataProp.Clone();
                    _lastCacheTime = DateTime.UtcNow;
                    return _cachedRoutesData.Value;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TransportController] Failed to connect to ticket.elektropoyezd.uz: {ex.Message}");
        }
        finally
        {
            _cacheLock.Release();
        }

        return _cachedRoutesData;
    }

    private static async Task<List<LiveTrainItemDto>> GenerateLiveTrainListAsync(string from, string to, string date)
    {
        var list = new List<LiveTrainItemDto>();
        var fromNorm = from.ToLowerInvariant().Trim();
        var toNorm = to.ToLowerInvariant().Trim();

        // Same station
        if (fromNorm == toNorm)
        {
            return list;
        }

        // 1. LIVE ELEKTROPOYEZD INTEGRATION (ticket.elektropoyezd.uz)
        try
        {
            var seenTrainIds = new HashSet<int>();
            var seenKeys = new HashSet<string>();

            var elektropoyezdData = await GetElektropoyezdRoutesAsync();
            if (elektropoyezdData.HasValue)
            {
                foreach (var regionItem in elektropoyezdData.Value.EnumerateArray())
                {
                    if (!regionItem.TryGetProperty("routes", out var routesArray)) continue;

                    foreach (var route in routesArray.EnumerateArray())
                    {
                        var originStationName = route.TryGetProperty("origin_station", out var oProp) && oProp.TryGetProperty("name", out var onProp) ? onProp.GetString() ?? "" : "";
                        var destStationName = route.TryGetProperty("destination_station", out var dProp) && dProp.TryGetProperty("name", out var dnProp) ? dnProp.GetString() ?? "" : "";
                        var routeName = route.TryGetProperty("name", out var rnProp) ? rnProp.GetString() ?? "" : "";

                        bool isOutboundMatch = StationMatchesCity(originStationName, fromNorm) && StationMatchesCity(destStationName, toNorm);
                        bool isInboundMatch = StationMatchesCity(destStationName, fromNorm) && StationMatchesCity(originStationName, toNorm);

                        if (!isOutboundMatch && !isInboundMatch) continue;

                        var adultPrice = route.TryGetProperty("adult_price", out var apProp) ? apProp.GetDecimal() : 15000;
                        var childPrice = route.TryGetProperty("child_price", out var cpProp) ? cpProp.GetDecimal() : 9000;

                        if (route.TryGetProperty("trains", out var trainsArray))
                        {
                            foreach (var train in trainsArray.EnumerateArray())
                            {
                                if (train.TryGetProperty("id", out var idProp) && idProp.TryGetInt32(out var tId))
                                {
                                    if (!seenTrainIds.Add(tId)) continue;
                                }

                                var dir = train.TryGetProperty("direction", out var dirProp) ? dirProp.GetString() : "outbound";
                                bool takeThisTrain = (isOutboundMatch && dir == "outbound") || (isInboundMatch && dir == "inbound");

                                if (!takeThisTrain) continue;

                                var trainNumber = train.TryGetProperty("train_number", out var tnProp) ? tnProp.GetString() : "6000";
                                var departsAt = train.TryGetProperty("departs_at", out var depProp) ? depProp.GetString() : "08:00";
                                var arrivesAt = train.TryGetProperty("arrives_at", out var arrProp) ? arrProp.GetString() : "10:00";
                                var duration = train.TryGetProperty("duration_label", out var durProp) ? durProp.GetString() : "1 soat 30 daqiqa";
                                var isCancelled = train.TryGetProperty("is_cancelled", out var cProp) && cProp.GetBoolean();
                                var status = isCancelled ? "Bekor qilingan (Cancelled)" : "O'z vaqtida (On Time)";

                                var actualDepStation = isOutboundMatch ? originStationName : destStationName;
                                var actualArrStation = isOutboundMatch ? destStationName : originStationName;

                                var key = $"{trainNumber}_{departsAt}_{actualDepStation}_{actualArrStation}";
                                if (!seenKeys.Add(key)) continue;

                                list.Add(new LiveTrainItemDto(
                                    TrainNumber: $"№ {trainNumber} «Elektropoyezd»",
                                    TrainType: "ElectricTrain",
                                    DepartureStation: actualDepStation,
                                    ArrivalStation: actualArrStation,
                                    DepartureTime: departsAt ?? "08:00",
                                    ArrivalTime: arrivesAt ?? "10:00",
                                    Duration: duration ?? "1 soat",
                                    Status: status,
                                    Amenities: new() { "ticket.elektropoyezd.uz rasmiy reysi", "Elektron chipta", "Konditsioner", "Qulay o'rindiq" },
                                    Seats: new()
                                    {
                                        new SeatClassDto("Katta (Adult)", adultPrice, Math.Round(adultPrice / 12900m, 2), 48, "Available", "ticket.elektropoyezd.uz rasmiy narxi"),
                                        new SeatClassDto("Bola (Child - 50%)", childPrice, Math.Round(childPrice / 12900m, 2), 24, "Available", "Bolalar uchun 50% imtiyozli narx")
                                    }
                                ));
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TransportController] Live parse error: {ex.Message}");
        }

        // 2. HIGH-SPEED RAILWAY CORRIDORS (Afrosiyob & Sharq)
        // Toshkent -> Samarqand
        if ((fromNorm.Contains("toshkent") || fromNorm.Contains("tashkent")) && (toNorm.Contains("samarqand") || toNorm.Contains("samarkand")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 762F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Toshkent-Markaziy (Severny)",
                ArrivalStation: "Samarqand Vokzali",
                DepartureTime: "07:30",
                ArrivalTime: "09:45",
                Duration: "2 soat 15 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Nonushta kiritilgan", "Rozetka 220V", "Qahva xizmati" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 360000, 28, 4, "Available", "Choy, qahva, shaxsiy monitor, keng charm o'rindiq"),
                    new SeatClassDto("Biznes", 245000, 19, 12, "Available", "Yumshoq kreslo, nonushta to'plami, keng oraliq"),
                    new SeatClassDto("Ekonom", 175000, 14, 28, "Available", "Ergonomik o'rindiq, bepul ichimlik suvi")
                }
            ));

            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 764F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Toshkent-Markaziy (Severny)",
                ArrivalStation: "Samarqand Vokzali",
                DepartureTime: "08:30",
                ArrivalTime: "10:45",
                Duration: "2 soat 15 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Nonushta kiritilgan", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 360000, 28, 1, "FewLeft", "Faqat 1 ta joy qoldi!"),
                    new SeatClassDto("Biznes", 245000, 19, 6, "Available", "Yumshoq kreslo, nonushta to'plami"),
                    new SeatClassDto("Ekonom", 175000, 14, 18, "Available", "Ergonomik o'rindiq")
                }
            ));

            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 10F «Sharq» Tezyurar",
                TrainType: "Express",
                DepartureStation: "Toshkent Janubiy",
                ArrivalStation: "Samarqand Vokzali",
                DepartureTime: "09:15",
                ArrivalTime: "12:35",
                Duration: "3 soat 20 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Konditsioner", "Restoran vagoni", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("Kupé (1-klass)", 165000, 13, 22, "Available", "4 kishilik qulay kupé"),
                    new SeatClassDto("Plaskart (2-klass)", 110000, 9, 45, "Available", "Keng standart vagon")
                }
            ));

            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 768F «Afrosiyob» (Kechki)",
                TrainType: "HighSpeed",
                DepartureStation: "Toshkent-Markaziy (Severny)",
                ArrivalStation: "Samarqand Vokzali",
                DepartureTime: "18:50",
                ArrivalTime: "21:05",
                Duration: "2 soat 15 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Nonushta/Kechki ovqat", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 360000, 28, 3, "Available", "Shaxsiy xizmat va keng o'rindiq"),
                    new SeatClassDto("Biznes", 245000, 19, 14, "Available", "Qulay biznes klass"),
                    new SeatClassDto("Ekonom", 175000, 14, 34, "Available", "Ekonom klass")
                }
            ));
        }
        // Samarqand -> Toshkent
        else if ((fromNorm.Contains("samarqand") || fromNorm.Contains("samarkand")) && (toNorm.Contains("toshkent") || toNorm.Contains("tashkent")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 761F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Samarqand Vokzali",
                ArrivalStation: "Toshkent-Markaziy (Severny)",
                DepartureTime: "06:30",
                ArrivalTime: "08:45",
                Duration: "2 soat 15 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 360000, 28, 2, "FewLeft", "Faqat 2 ta joy qoldi!"),
                    new SeatClassDto("Biznes", 245000, 19, 11, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 175000, 14, 25, "Available", "Ekonom klass")
                }
            ));

            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 763F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Samarqand Vokzali",
                ArrivalStation: "Toshkent-Markaziy (Severny)",
                DepartureTime: "17:00",
                ArrivalTime: "19:15",
                Duration: "2 soat 15 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 360000, 28, 5, "Available", "VIP klass"),
                    new SeatClassDto("Biznes", 245000, 19, 15, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 175000, 14, 40, "Available", "Ekonom klass")
                }
            ));
        }
        // Samarqand -> Buxoro
        else if ((fromNorm.Contains("samarqand") || fromNorm.Contains("samarkand")) && (toNorm.Contains("buxoro") || toNorm.Contains("bukhara")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 762F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Samarqand Vokzali",
                ArrivalStation: "Buxoro-1 (Kogon)",
                DepartureTime: "09:50",
                ArrivalTime: "11:20",
                Duration: "1 soat 30 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 275000, 21, 2, "FewLeft", "Faqat 2 ta joy qoldi!"),
                    new SeatClassDto("Biznes", 185000, 14, 8, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 130000, 10, 19, "Available", "Ekonom klass")
                }
            ));

            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 764F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Samarqand Vokzali",
                ArrivalStation: "Buxoro-1 (Kogon)",
                DepartureTime: "10:45",
                ArrivalTime: "12:15",
                Duration: "1 soat 30 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 275000, 21, 5, "Available", "VIP klass"),
                    new SeatClassDto("Biznes", 185000, 14, 11, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 130000, 10, 26, "Available", "Ekonom klass")
                }
            ));
        }
        // Buxoro -> Samarqand
        else if ((fromNorm.Contains("buxoro") || fromNorm.Contains("bukhara")) && (toNorm.Contains("samarqand") || toNorm.Contains("samarkand")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 761F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Buxoro-1 (Kogon)",
                ArrivalStation: "Samarqand Vokzali",
                DepartureTime: "15:20",
                ArrivalTime: "16:50",
                Duration: "1 soat 30 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 275000, 21, 4, "Available", "VIP klass"),
                    new SeatClassDto("Biznes", 185000, 14, 9, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 130000, 10, 22, "Available", "Ekonom klass")
                }
            ));
        }
        // Toshkent -> Buxoro
        else if ((fromNorm.Contains("toshkent") || fromNorm.Contains("tashkent")) && (toNorm.Contains("buxoro") || toNorm.Contains("bukhara")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 762F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Toshkent-Markaziy (Severny)",
                ArrivalStation: "Buxoro-1 (Kogon)",
                DepartureTime: "07:30",
                ArrivalTime: "11:20",
                Duration: "3 soat 50 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Nonushta kiritilgan", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 480000, 37, 3, "FewLeft", "VIP klass"),
                    new SeatClassDto("Biznes", 340000, 26, 10, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 240000, 18, 30, "Available", "Ekonom klass")
                }
            ));
        }
        // Buxoro -> Toshkent
        else if ((fromNorm.Contains("buxoro") || fromNorm.Contains("bukhara")) && (toNorm.Contains("toshkent") || toNorm.Contains("tashkent")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 761F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Buxoro-1 (Kogon)",
                ArrivalStation: "Toshkent-Markaziy (Severny)",
                DepartureTime: "15:20",
                ArrivalTime: "19:15",
                Duration: "3 soat 55 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 480000, 37, 2, "FewLeft", "Faqat 2 ta joy qoldi!"),
                    new SeatClassDto("Biznes", 340000, 26, 8, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 240000, 18, 28, "Available", "Ekonom klass")
                }
            ));
        }
        // Toshkent -> Qarshi
        else if ((fromNorm.Contains("toshkent") || fromNorm.Contains("tashkent")) && (toNorm.Contains("qarshi") || toNorm.Contains("karshi")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 760F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Toshkent-Markaziy (Severny)",
                ArrivalStation: "Qarshi Vokzali",
                DepartureTime: "07:00",
                ArrivalTime: "10:25",
                Duration: "3 soat 25 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Nonushta kiritilgan" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 420000, 32, 2, "FewLeft", "VIP klass"),
                    new SeatClassDto("Biznes", 290000, 22, 12, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 210000, 16, 32, "Available", "Ekonom klass")
                }
            ));
        }
        // Qarshi -> Toshkent
        else if ((fromNorm.Contains("qarshi") || fromNorm.Contains("karshi")) && (toNorm.Contains("toshkent") || toNorm.Contains("tashkent")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 759F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Qarshi Vokzali",
                ArrivalStation: "Toshkent-Markaziy (Severny)",
                DepartureTime: "17:30",
                ArrivalTime: "20:55",
                Duration: "3 soat 25 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 420000, 32, 3, "Available", "VIP klass"),
                    new SeatClassDto("Biznes", 290000, 22, 9, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 210000, 16, 25, "Available", "Ekonom klass")
                }
            ));
        }
        // Toshkent -> Andijon
        else if ((fromNorm.Contains("toshkent") || fromNorm.Contains("tashkent")) && (toNorm.Contains("andijon") || toNorm.Contains("andijan")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 60F «O'zbekiston Tezyurar»",
                TrainType: "Express",
                DepartureStation: "Toshkent-Janubiy",
                ArrivalStation: "Andijon-1 Vokzali",
                DepartureTime: "08:05",
                ArrivalTime: "13:40",
                Duration: "5 soat 35 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Konditsioner", "Kamchiq Tunneli Panoramasi", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("Biznes (1-klass)", 195000, 15, 8, "Available", "Qulay o'rindiqlar"),
                    new SeatClassDto("Ekonom (2-klass)", 135000, 10, 42, "Available", "Standart o'rindiq")
                }
            ));
        }
        // Andijon -> Toshkent
        else if ((fromNorm.Contains("andijon") || fromNorm.Contains("andijan")) && (toNorm.Contains("toshkent") || toNorm.Contains("tashkent")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 59F «O'zbekiston Tezyurar»",
                TrainType: "Express",
                DepartureStation: "Andijon-1 Vokzali",
                ArrivalStation: "Toshkent-Janubiy",
                DepartureTime: "15:10",
                ArrivalTime: "20:45",
                Duration: "5 soat 35 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Konditsioner", "Kamchiq Tunneli Panoramasi", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("Biznes (1-klass)", 195000, 15, 6, "Available", "Qulay o'rindiqlar"),
                    new SeatClassDto("Ekonom (2-klass)", 135000, 10, 38, "Available", "Standart o'rindiq")
                }
            ));
        }
        // Toshkent -> Qo'qon
        else if ((fromNorm.Contains("toshkent") || fromNorm.Contains("tashkent")) && (toNorm.Contains("qo'qon") || toNorm.Contains("kokand")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 60F «O'zbekiston Tezyurar»",
                TrainType: "Express",
                DepartureStation: "Toshkent-Janubiy",
                ArrivalStation: "Qo'qon Vokzali",
                DepartureTime: "08:05",
                ArrivalTime: "12:15",
                Duration: "4 soat 10 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Konditsioner", "Kamchiq Tunneli Panoramasi" },
                Seats: new()
                {
                    new SeatClassDto("Biznes (1-klass)", 175000, 14, 10, "Available", "Qulay o'rindiq"),
                    new SeatClassDto("Ekonom (2-klass)", 115000, 9, 36, "Available", "Standart o'rindiq")
                }
            ));
        }
        // Toshkent -> Xiva
        else if ((fromNorm.Contains("toshkent") || fromNorm.Contains("tashkent")) && (toNorm.Contains("xiva") || toNorm.Contains("khiva")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 126 «Jaloliddin Manguberdi»",
                TrainType: "Express",
                DepartureStation: "Toshkent-Janubiy",
                ArrivalStation: "Xiva Vokzali",
                DepartureTime: "20:30",
                ArrivalTime: "09:15",
                Duration: "12 soat 45 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Yotoq vagon", "Konditsioner", "Restoran vagoni", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("Lyuks (SV)", 450000, 35, 4, "FewLeft", "2 kishilik yumshoq SV vagon"),
                    new SeatClassDto("Kupé", 260000, 20, 18, "Available", "4 kishilik kupé"),
                    new SeatClassDto("Plaskart", 160000, 12, 40, "Available", "Standart plaskart")
                }
            ));
        }
        // Toshkent -> Navoiy
        else if ((fromNorm.Contains("toshkent") || fromNorm.Contains("tashkent")) && (toNorm.Contains("navoiy") || toNorm.Contains("navoi")))
        {
            list.Add(new LiveTrainItemDto(
                TrainNumber: "№ 762F «Afrosiyob»",
                TrainType: "HighSpeed",
                DepartureStation: "Toshkent-Markaziy (Severny)",
                ArrivalStation: "Navoiy Vokzali",
                DepartureTime: "07:30",
                ArrivalTime: "10:30",
                Duration: "3 soat 00 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("VIP", 390000, 30, 2, "FewLeft", "VIP klass"),
                    new SeatClassDto("Biznes", 270000, 21, 10, "Available", "Biznes klass"),
                    new SeatClassDto("Ekonom", 195000, 15, 26, "Available", "Ekonom klass")
                }
            ));
        }

        return list;
    }

    private static bool StationMatchesCity(string stationName, string cityName)
    {
        if (string.IsNullOrWhiteSpace(stationName) || string.IsNullOrWhiteSpace(cityName)) return false;

        var s = stationName.ToLowerInvariant().Trim();
        var c = cityName.ToLowerInvariant().Trim();

        // Special handling for Urganch Aerovokzal – Xiva route station
        if (s.Contains("urganch") && s.Contains("aerovokzal"))
        {
            return c.Contains("urganch") || c.Contains("urgench");
        }

        var sClean = s.Replace("'", "").Replace("`", "").Replace("‘", "").Replace("’", "").Replace("-", " ");
        var cClean = c.Replace("'", "").Replace("`", "").Replace("‘", "").Replace("’", "").Replace("-", " ");

        if (sClean == cClean || sClean.StartsWith(cClean + " ") || sClean.EndsWith(" " + cClean) || sClean.Contains(" " + cClean + " "))
            return true;

        if (c.Contains("toshkent") || c.Contains("tashkent")) return s.Contains("toshkent") || s.Contains("tashkent");
        if (c.Contains("samarqand") || c.Contains("samarkand")) return s.Contains("samarqand");
        if (c.Contains("urgut")) return s.Contains("urgut");
        if (c.Contains("buxoro") || c.Contains("bukhara")) return s.Contains("buxoro") || s.Contains("kogon");
        if (c.Contains("qarshi") || c.Contains("karshi")) return s.Contains("qarshi");
        if (c.Contains("shahrisabz")) return s.Contains("shahrisabz") || s.Contains("kitob");
        if (c.Contains("sirdaryo") || c.Contains("syrdarya")) return s.Contains("sirdaryo") || s.Contains("guliston") || s.Contains("xovos") || s.Contains("yangiyer") || s.Contains("baxt");
        if (c.Contains("guliston")) return s.Contains("guliston");
        if (c.Contains("xovos")) return s.Contains("xovos");
        if (c.Contains("bekobod") || c.Contains("bekabad")) return s.Contains("bekobod") || s.Contains("bekabad");
        if (c.Contains("andijon") || c.Contains("andijan")) return s.Contains("andijon") || s.Contains("asaka") || s.Contains("xonobod");
        if (c.Contains("qoqon") || c.Contains("kokand")) return s.Contains("qoqon");
        if (c.Contains("namangan")) return s.Contains("namangan") || s.Contains("chust") || s.Contains("pop");
        if (c.Contains("margilon") || c.Contains("margilan")) return s.Contains("margilon") || s.Contains("margilan");
        if (c.Contains("fargona") || c.Contains("fergana")) return s.Contains("fargona") || s.Contains("fergana") || s.Contains("margilon");
        if (c.Contains("termiz") || c.Contains("termez")) return s.Contains("termiz") || s.Contains("sariosiyo") || s.Contains("surxon");
        if (c.Contains("nukus")) return s.Contains("nukus") || s.Contains("qongirot") || s.Contains("miskin") || s.Contains("xojayli");
        if (c.Contains("urganch") || c.Contains("urgench")) return s.Contains("urganch") || s.Contains("urgench");
        if (c.Contains("xiva") || c.Contains("khiva")) return s.Contains("xiva") || s.Contains("khiva");
        if (c.Contains("navoiy") || c.Contains("navoi")) return s.Contains("navoiy") || s.Contains("uchquduq");
        if (c.Contains("jizzax") || c.Contains("jizzakh")) return s.Contains("jizzax") || s.Contains("dashtobod");

        return sClean.Contains(cClean) || cClean.Contains(sClean);
    }
}

public record LiveTrainSearchResponseDto(
    string Origin,
    string Destination,
    string Date,
    int TotalAvailableTrains,
    string OfficialBookingUrl,
    string LastUpdated,
    List<LiveTrainItemDto> Trains
);

public record LiveTrainItemDto(
    string TrainNumber,
    string TrainType,
    string DepartureStation,
    string ArrivalStation,
    string DepartureTime,
    string ArrivalTime,
    string Duration,
    string Status,
    List<string> Amenities,
    List<SeatClassDto> Seats
);

public record SeatClassDto(
    string ClassName,
    decimal PriceUzs,
    decimal PriceUsd,
    int AvailableSeats,
    string AvailabilityStatus,
    string Description
);

public record StationDto(string Code, string Name, string RailwayCode);
