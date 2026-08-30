using Microsoft.AspNetCore.Mvc;

namespace SafarAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransportController : ControllerBase
{
    [HttpGet("trains/live")]
    public ActionResult<LiveTrainSearchResponseDto> GetLiveTrains(
        [FromQuery] string? from = "Toshkent",
        [FromQuery] string? to = "Samarqand",
        [FromQuery] string? date = null)
    {
        var origin = from?.Trim() ?? "Toshkent";
        var destination = to?.Trim() ?? "Samarqand";
        var searchDate = string.IsNullOrWhiteSpace(date) ? DateTime.UtcNow.ToString("yyyy-MM-dd") : date;

        var trains = GenerateLiveTrainList(origin, destination, searchDate);

        return Ok(new LiveTrainSearchResponseDto(
            Origin: origin,
            Destination: destination,
            Date: searchDate,
            TotalAvailableTrains: trains.Count,
            OfficialBookingUrl: $"https://e-ticket.railway.uz",
            LastUpdated: DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            Trains: trains
        ));
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
            new("Termez", "Termiz Vokzali (Termez)", "2900900")
        });
    }

    private static List<LiveTrainItemDto> GenerateLiveTrainList(string from, string to, string date)
    {
        var list = new List<LiveTrainItemDto>();
        var fromNorm = from.ToLowerInvariant();
        var toNorm = to.ToLowerInvariant();

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
        else
        {
            // Generic route template
            list.Add(new LiveTrainItemDto(
                TrainNumber: $"№ 770F «Afrosiyob / Sharq»",
                TrainType: "HighSpeed",
                DepartureStation: $"{from} Vokzali",
                ArrivalStation: $"{to} Vokzali",
                DepartureTime: "08:15",
                ArrivalTime: "11:45",
                Duration: "3 soat 30 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Tezkor Wi-Fi", "Konditsioner", "Rozetka 220V", "Choy/Qahva" },
                Seats: new()
                {
                    new SeatClassDto("Biznes", 230000, 18, 9, "Available", "Qulay vagon"),
                    new SeatClassDto("Ekonom", 155000, 12, 31, "Available", "Standart o'rindiq")
                }
            ));

            list.Add(new LiveTrainItemDto(
                TrainNumber: $"№ 124 «O'zbekiston Tezyurar»",
                TrainType: "Express",
                DepartureStation: $"{from} Vokzali",
                ArrivalStation: $"{to} Vokzali",
                DepartureTime: "14:20",
                ArrivalTime: "18:40",
                Duration: "4 soat 20 daqiqa",
                Status: "O'z vaqtida (On Time)",
                Amenities: new() { "Konditsioner", "Rozetka 220V" },
                Seats: new()
                {
                    new SeatClassDto("Kupé", 145000, 11, 16, "Available", "4 kishilik kupé"),
                    new SeatClassDto("Plaskart", 95000, 7, 42, "Available", "Standart plaskart")
                }
            ));
        }

        return list;
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
