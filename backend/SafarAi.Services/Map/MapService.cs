using SafarAi.Core.DTOs;
using SafarAi.Core.Interfaces;

namespace SafarAi.Services.Map;

public class MapService : IMapService
{
    private const double EarthRadiusKm = 6371.0;

    public double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return Math.Round(EarthRadiusKm * c, 2);
    }

    public (int walkMins, int carMins, int taxiMins, decimal taxiCostUzs) EstimateTransit(double distanceKm)
    {
        // Street routing factor (roads aren't straight lines)
        var roadDistanceKm = distanceKm * 1.25;

        // Walking speed: ~4.5 km/h -> 13.3 mins per km
        var walkMins = Math.Max(2, (int)Math.Ceiling(roadDistanceKm * 13.3));

        // City driving speed: ~30 km/h + traffic/signals -> ~2.5 mins per km
        var carMins = Math.Max(3, (int)Math.Ceiling(roadDistanceKm * 2.5));

        // Taxi is similar to car + 2 mins pickup
        var taxiMins = carMins + 2;

        // Yandex / local taxi fare in Samarkand: 6,000 UZS base + 2,500 UZS/km
        var taxiCost = 6000m + (decimal)(roadDistanceKm * 2500);
        var roundedTaxiCost = Math.Round(taxiCost / 100m, 0) * 100m;

        return (walkMins, carMins, taxiMins, roundedTaxiCost);
    }

    public Task<RouteCalculationResponseDto> CalculateRouteAsync(CalculateRouteRequestDto request)
    {
        var directDistance = CalculateHaversineDistance(request.StartLatitude, request.StartLongitude, request.EndLatitude, request.EndLongitude);
        var roadDistance = Math.Round(directDistance * 1.25, 2);

        var (walkMins, carMins, taxiMins, taxiCost) = EstimateTransit(directDistance);

        var options = new List<RouteOptionDto>
        {
            new RouteOptionDto(
                Mode: "Walking",
                DistanceKm: roadDistance,
                FormattedDistance: roadDistance < 1.0 ? $"{(int)(roadDistance * 1000)} m" : $"{roadDistance:F1} km",
                DurationMinutes: walkMins,
                FormattedDuration: $"{walkMins} min",
                EstimatedCostUzs: 0,
                RecommendationReason: directDistance <= 1.5 ? "Recommended: Enjoy the scenic Silk Road pedestrian boulevards." : "Good for exercise and sightseeing."
            ),
            new RouteOptionDto(
                Mode: "Taxi",
                DistanceKm: roadDistance,
                FormattedDistance: $"{roadDistance:F1} km",
                DurationMinutes: taxiMins,
                FormattedDuration: $"{taxiMins} min",
                EstimatedCostUzs: taxiCost,
                RecommendationReason: directDistance > 2.0 ? "Recommended: Fast & affordable with Yandex Go or local taxis." : "Quick option if carrying bags or in warm weather."
            ),
            new RouteOptionDto(
                Mode: "Car",
                DistanceKm: roadDistance,
                FormattedDistance: $"{roadDistance:F1} km",
                DurationMinutes: carMins,
                FormattedDuration: $"{carMins} min",
                EstimatedCostUzs: 10000,
                RecommendationReason: "Convenient if you have a rented vehicle or private driver."
            )
        };

        var bestMode = directDistance <= 1.8 ? "Walking" : "Taxi";

        // Generate synthetic route waypoints between start and end
        var waypoints = new List<RouteCoordinateDto>
        {
            new RouteCoordinateDto(request.StartLatitude, request.StartLongitude, "Start Location"),
            new RouteCoordinateDto(
                (request.StartLatitude * 2 + request.EndLatitude) / 3 + 0.0005,
                (request.StartLongitude * 2 + request.EndLongitude) / 3 + 0.0005,
                "Way point 1"
            ),
            new RouteCoordinateDto(
                (request.StartLatitude + request.EndLatitude * 2) / 3 - 0.0003,
                (request.StartLongitude + request.EndLongitude * 2) / 3 + 0.0002,
                "Way point 2"
            ),
            new RouteCoordinateDto(request.EndLatitude, request.EndLongitude, "Destination")
        };

        var response = new RouteCalculationResponseDto(
            DistanceKm: roadDistance,
            BestMode: bestMode,
            Options: options,
            Waypoints: waypoints
        );

        return Task.FromResult(response);
    }

    private static double ToRadians(double angle) => (Math.PI / 180.0) * angle;
}
