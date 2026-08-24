using Microsoft.EntityFrameworkCore;
using SafarAi.Core.DTOs;
using SafarAi.Core.Interfaces;
using SafarAi.Infrastructure.Data;

namespace SafarAi.Services.AI;

public class AiTripPlannerService : IAITripPlannerService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapService _mapService;

    public AiTripPlannerService(ApplicationDbContext dbContext, IMapService mapService)
    {
        _dbContext = dbContext;
        _mapService = mapService;
    }

    public async Task<AiTripPlanResponseDto> GenerateItineraryAsync(AiPlanTripRequestDto request)
    {
        var destination = await _dbContext.Destinations
            .Include(d => d.Places)
                .ThenInclude(p => p.Category)
            .FirstOrDefaultAsync(d => d.Name.ToLower() == request.Destination.ToLower())
            ?? await _dbContext.Destinations
                .Include(d => d.Places)
                    .ThenInclude(p => p.Category)
                .FirstAsync();

        var allPlaces = destination.Places.ToList();
        var numDays = Math.Clamp(request.Days, 1, 7);
        var budget = request.BudgetUzs <= 0 ? 1000000m : request.BudgetUzs;

        // Calculate smart budget distribution
        var ticketPortion = Math.Min(budget * 0.25m, allPlaces.Sum(p => p.TicketPriceUzs));
        var foodPortion = budget * 0.35m;
        var transportPortion = budget * 0.20m;
        var bufferPortion = budget - (ticketPortion + foodPortion + transportPortion);

        var budgetBreakdown = new AiBudgetBreakdown(
            TransportUzs: Math.Round(transportPortion / 1000m) * 1000m,
            FoodUzs: Math.Round(foodPortion / 1000m) * 1000m,
            TicketsUzs: Math.Round(ticketPortion / 1000m) * 1000m,
            OtherUzs: Math.Round(bufferPortion / 1000m) * 1000m,
            TotalEstimatedUzs: Math.Round((ticketPortion + foodPortion + transportPortion) / 1000m) * 1000m,
            RemainingUzs: Math.Max(0, Math.Round(bufferPortion / 1000m) * 1000m)
        );

        var days = new List<AiTripDayDto>();
        double totalDistance = 0;

        // Group places into day plans
        var orderedPlaces = allPlaces.OrderByDescending(p => p.IsMustVisit).ThenByDescending(p => p.Rating).ToList();
        var placesPerDay = (int)Math.Ceiling((double)orderedPlaces.Count / numDays);

        for (int day = 1; day <= numDays; day++)
        {
            var dayPlaces = orderedPlaces.Skip((day - 1) * placesPerDay).Take(placesPerDay).ToList();
            if (!dayPlaces.Any() && orderedPlaces.Any())
            {
                dayPlaces = orderedPlaces.Take(2).ToList();
            }

            var activities = new List<AiTripActivityDto>();
            var timeSlots = new[] { "09:00 - 10:30", "11:00 - 12:30", "14:00 - 15:30", "16:00 - 17:30", "18:30 - 20:00" };
            double prevLat = destination.Latitude;
            double prevLon = destination.Longitude;

            int actOrder = 1;
            foreach (var place in dayPlaces)
            {
                var distFromPrev = _mapService.CalculateHaversineDistance(prevLat, prevLon, place.Latitude, place.Longitude);
                totalDistance += distFromPrev;
                var (walkMins, carMins, taxiMins, taxiCost) = _mapService.EstimateTransit(distFromPrev);

                var slot = actOrder <= timeSlots.Length ? timeSlots[actOrder - 1] : $"{10 + actOrder * 2}:00 - {11 + actOrder * 2}:30";

                activities.Add(new AiTripActivityDto(
                    Order: actOrder,
                    TimeSlot: slot,
                    PlaceId: place.Id,
                    ActivityTitle: $"Explore {place.Name}",
                    Description: place.ShortDescription,
                    Latitude: place.Latitude,
                    Longitude: place.Longitude,
                    DurationMinutes: place.RecommendedVisitDurationMinutes,
                    DistanceFromPreviousKm: distFromPrev,
                    EstimatedCostUzs: place.TicketPriceUzs,
                    TransitMode: distFromPrev < 1.2 ? "Walking" : "Taxi",
                    ImageUrl: place.ImageUrl
                ));

                prevLat = place.Latitude;
                prevLon = place.Longitude;
                actOrder++;
            }

            // Add traditional meal activity
            if (day == 1)
            {
                activities.Insert(Math.Min(2, activities.Count), new AiTripActivityDto(
                    Order: activities.Count + 1,
                    TimeSlot: "12:45 - 14:00",
                    PlaceId: null,
                    ActivityTitle: "Authentic Samarkand Osh Lunch",
                    Description: "Enjoy authentic wood-fired Samarkand plov served with freshly baked non and green tea at Osh Markazi.",
                    Latitude: 39.6610,
                    Longitude: 66.9720,
                    DurationMinutes: 60,
                    DistanceFromPreviousKm: 0.8,
                    EstimatedCostUzs: 65000,
                    TransitMode: "Walking",
                    ImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                ));
            }

            days.Add(new AiTripDayDto(
                DayNumber: day,
                Title: day == 1 ? "Heart of the Timurid Empire & Silk Road Wonders" : $"Day {day}: Ancient Science, Crafts & Panorama",
                Summary: $"A curated route focusing on {request.Interests} designed at a {request.TravelStyle} pace with optimal {request.Transportation} transitions.",
                Activities: activities.OrderBy(a => a.TimeSlot).ToList()
            ));
        }

        var tripTitle = $"{numDays}-Day {destination.Name} {request.TravelStyle} Journey";
        var aiSummary = $"SAFAR AI customized this itinerary for {request.Days} day(s) in {destination.Name} with an estimated budget of {budget:N0} UZS. It balances iconic monuments (Registan, Gur-e-Amir, Shah-i-Zinda) with local gastronomical stops and cultural artisan workshops.";

        return new AiTripPlanResponseDto(
            TripId: Guid.NewGuid(),
            Title: tripTitle,
            DestinationName: destination.Name,
            NumberOfDays: numDays,
            TotalBudgetUzs: budget,
            EstimatedSpentUzs: budgetBreakdown.TotalEstimatedUzs,
            TotalDistanceKm: Math.Round(totalDistance, 1),
            AiSummary: aiSummary,
            BudgetBreakdown: budgetBreakdown,
            Days: days
        );
    }
}
