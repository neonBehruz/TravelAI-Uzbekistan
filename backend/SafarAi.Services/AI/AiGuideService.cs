using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SafarAi.Core.DTOs;
using SafarAi.Core.Entities;
using SafarAi.Core.Interfaces;
using SafarAi.Infrastructure.Data;

namespace SafarAi.Services.AI;

public class AiGuideService : IAIGuideService
{
    private readonly ApplicationDbContext _dbContext;

    public AiGuideService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AiChatResponseDto> ChatAsync(AiChatRequestDto request, Guid? userId = null)
    {
        var conversationId = request.ConversationId ?? Guid.NewGuid();
        var userMsg = request.Message.ToLower();

        string reply;
        List<string> followUps = new();

        if (userMsg.Contains("registan") || userMsg.Contains("registon"))
        {
            reply = "Registan Square is the architectural crown jewel of Central Asia, framed by three magnificent madrasahs: Ulugh Beg (1420), Sher-Dor (1636), and Tilla-Kori (1660). Be sure to notice the unique tiger-sun mosaics on Sher-Dor and the shimmering 5 kg leaf-gold dome interior inside Tilla-Kori. It is illuminated spectacularly every evening from 20:00!";
            followUps.AddRange(new[] { "What are the ticket prices for Registan?", "Where can I eat nearby?", "Tell me about Sher-Dor Madrasah" });
        }
        else if (userMsg.Contains("eat") || userMsg.Contains("food") || userMsg.Contains("plov") || userMsg.Contains("restaurant"))
        {
            reply = "In Samarkand, you must try authentic Samarkand Osh (layered plov cooked with sweet yellow carrots, chickpeas, and tender lamb), served from 11:30 to 14:00 at Osh Markazi. Also try Tandir Somsa at Labi G'or and freshly baked hot Samarkand Non flatbread at Siyob Bazaar!";
            followUps.AddRange(new[] { "What is in Samarkand Osh?", "Where is Siyob Bazaar?", "Is tap water drinkable?" });
        }
        else if (userMsg.Contains("3 hours") || userMsg.Contains("short time") || userMsg.Contains("limited time"))
        {
            reply = "If you only have 3 hours in Samarkand, take this express golden triangle route: 1) Start at Registan Square (60 mins), 2) Walk 10 minutes along the pedestrian alley to Bibi-Khanym Mosque (30 mins), and 3) Grab hot tea and dried fruits at Siyob Bazaar (30 mins)!";
            followUps.AddRange(new[] { "How do I take a taxi?", "Can I visit Gur-e-Amir instead?", "What language is spoken here?" });
        }
        else if (userMsg.Contains("child") || userMsg.Contains("kids") || userMsg.Contains("family"))
        {
            reply = "Samarkand is very family-friendly! Children especially love the open craft workshops and waterwheels at Konigil Meros Silk Paper Mill, watching bread baking at Siyob Bazaar, and the evening laser fountain show at Silk Road Samarkand Eternal City!";
            followUps.AddRange(new[] { "How far is Konigil Village?", "What are child ticket policies?", "Show child-friendly restaurants" });
        }
        else if (userMsg.Contains("shah-i-zinda") || userMsg.Contains("shohi zinda"))
        {
            reply = "Shah-i-Zinda ('The Living King') is a breathtaking sacred avenue of cobalt and lapis-lazuli domed royal mausoleums from the 11th-15th centuries. Remember to wear modest clothing with shoulders and knees covered as it is an active pilgrimage sanctuary.";
            followUps.AddRange(new[] { "What is the legend of the steps?", "How much is entry?", "Who is buried in Shah-i-Zinda?" });
        }
        else
        {
            reply = $"As your personal SAFAR AI guide in Samarkand, I can assist you with history, navigation, hidden photo spots, traditional dining, or etiquette. Uzbekistan welcomes you with timeless hospitality! What would you like to explore next?";
            followUps.AddRange(new[] { "What are the top 5 places to visit?", "How much budget do I need per day?", "Teach me basic Uzbek phrases" });
        }

        return new AiChatResponseDto(
            ConversationId: conversationId,
            Reply: reply,
            Language: request.Language,
            SuggestedFollowUps: followUps
        );
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
