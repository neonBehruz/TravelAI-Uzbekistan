using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using SafarAi.Core.Interfaces;
using SafarAi.Infrastructure.Data;
using SafarAi.Infrastructure.Security;
using SafarAi.Services.AI;
using SafarAi.Services.Background;
using SafarAi.Services.Business;
using SafarAi.Services.Cache;
using SafarAi.Services.Hubs;
using SafarAi.Services.Map;
using SafarAi.Services.Storage;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();
builder.Services.AddDistributedMemoryCache();

// 2. Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SAFAR AI - API",
        Version = "v1",
        Description = "AI-powered Smart Tourism Platform API for Uzbekistan (Samarkand MVP)"
    });
});

// 3. Database Context (Check PostgreSQL availability or use In-Memory Db for seamless local execution)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
bool usePostgres = false;

if (!string.IsNullOrEmpty(connectionString))
{
    try
    {
        using var testConn = new Npgsql.NpgsqlConnection(connectionString);
        testConn.Open();
        usePostgres = true;
    }
    catch
    {
        usePostgres = false;
    }
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (usePostgres)
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseInMemoryDatabase("SafarAiDb");
    }
});

// 4. JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SafarAiSuperSecretProductionGradeEncryptionKey2026!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "SafarAiBackend";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SafarAiFrontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 5. CORS Policy with SignalR support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 6. Dependency Injections
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPlaceService, PlaceService>();
builder.Services.AddScoped<ITripService, TripService>();
builder.Services.AddScoped<IMapService, MapService>();
builder.Services.AddScoped<IAITripPlannerService, AiTripPlannerService>();
builder.Services.AddScoped<IAIGuideService, AiGuideService>();
builder.Services.AddScoped<IAITranslationService, AiTranslationService>();
builder.Services.AddScoped<IAIVoiceService, AiVoiceService>();
builder.Services.AddScoped<IAIVisionService, AiVisionService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// Enterprise Architecture Services
builder.Services.AddScoped<IStorageService, StorageService>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
builder.Services.AddSingleton<ISignalRNotificationService, SignalRNotificationService>();

// Hosted Background Services
builder.Services.AddHostedService<QueuedHostedService>();
builder.Services.AddHostedService<ScheduledMaintenanceService>();

var app = builder.Build();

// 7. Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var context = services.GetRequiredService<ApplicationDbContext>();
    await DbInitializer.SeedAsync(context);
    logger.LogInformation("Database initialized and seeded successfully (Provider: {Provider}).", usePostgres ? "PostgreSQL" : "InMemory");
}

// 8. Configure HTTP Pipeline
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SAFAR AI v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<SafarHub>("/hubs/safar");

app.Run();

