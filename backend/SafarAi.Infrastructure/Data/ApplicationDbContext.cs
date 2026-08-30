using Microsoft.EntityFrameworkCore;
using SafarAi.Core.Entities;

namespace SafarAi.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<PlaceCategory> PlaceCategories => Set<PlaceCategory>();
    public DbSet<Place> Places => Set<Place>();
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<Restaurant> Restaurants => Set<Restaurant>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripDay> TripDays => Set<TripDay>();
    public DbSet<TripActivity> TripActivities => Set<TripActivity>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<SavedPlace> SavedPlaces => Set<SavedPlace>();
    public DbSet<AIConversation> AIConversations => Set<AIConversation>();
    public DbSet<AIMessage> AIMessages => Set<AIMessage>();
    public DbSet<UserLocation> UserLocations => Set<UserLocation>();
    public DbSet<TranslationHistory> TranslationHistories => Set<TranslationHistory>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Relationships
        modelBuilder.Entity<Place>()
            .HasOne(p => p.Destination)
            .WithMany(d => d.Places)
            .HasForeignKey(p => p.DestinationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Place>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Places)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Trip>()
            .HasOne(t => t.User)
            .WithMany(u => u.Trips)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TripDay>()
            .HasOne(td => td.Trip)
            .WithMany(t => t.Days)
            .HasForeignKey(td => td.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TripActivity>()
            .HasOne(ta => ta.TripDay)
            .WithMany(td => td.Activities)
            .HasForeignKey(ta => ta.TripDayId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Place)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.PlaceId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SavedPlace>()
            .HasOne(sp => sp.User)
            .WithMany(u => u.SavedPlaces)
            .HasForeignKey(sp => sp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SavedPlace>()
            .HasOne(sp => sp.Place)
            .WithMany(p => p.SavedByUsers)
            .HasForeignKey(sp => sp.PlaceId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AIConversation>()
            .HasOne(c => c.User)
            .WithMany(u => u.AIConversations)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AIMessage>()
            .HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
