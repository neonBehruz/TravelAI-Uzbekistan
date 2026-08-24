# 🏛️ SAFAR AI — System Architecture Document

> **“Your AI Guide. Your Language. Your Journey.”**

---

## 1. Executive Architectural Overview

SAFAR AI is architectured as a modern, decoupled full-stack tourism intelligence platform designed for high availability, low latency mobile execution, and multi-modal AI interactions (Vision, Voice, Chat, Translation, and Geospatial Navigation).

```mermaid
graph TB
    subgraph Client Layer
        Web["Web & Mobile App (React 19 + TypeScript)"]
        Sensors["Sensors: GPS Geolocation, Web Speech API, WebRTC Camera"]
    end

    subgraph API & Gateway Layer
        API["ASP.NET Core 10 Web API Gateway"]
        Auth["JWT Token Bearer & Role Authorization"]
        Rate["Rate Limiter & CORS Middleware"]
    end

    subgraph Service Abstraction Layer
        AiTrip["IAITripPlannerService"]
        AiGuide["IAIGuideService"]
        AiTrans["IAITranslationService"]
        AiVoice["IAIVoiceService"]
        AiVision["IAIVisionService"]
        MapSvc["IMapService (Geospatial & Haversine)"]
    end

    subgraph AI Provider Adapters
        LocalEng["Intelligent Knowledge Engine (Offline/Local)"]
        OpenAIAdapter["OpenAI / GPT-4o Adapter"]
        ClaudeAdapter["Anthropic / Claude 3.5 Adapter"]
        GeminiAdapter["Google Gemini 1.5/2.0 Adapter"]
    end

    subgraph Data & Storage Layer
        EF["Entity Framework Core 10"]
        Postgres[("PostgreSQL 18 Database")]
        Fallback[("InMemory Failover Storage")]
    end

    Web --> Sensors
    Web -->|HTTPS / REST + JWT| API
    API --> Auth
    API --> Rate
    API --> AiTrip
    API --> AiGuide
    API --> AiTrans
    API --> AiVoice
    API --> AiVision
    API --> MapSvc

    AiTrip --> LocalEng
    AiTrip -.-> OpenAIAdapter
    AiGuide --> LocalEng
    AiGuide -.-> ClaudeAdapter
    AiVision --> LocalEng
    AiVision -.-> GeminiAdapter

    API --> EF
    EF --> Postgres
    EF -.-> Fallback
```

---

## 2. Layer Descriptions

### 2.1 Presentation Layer (`/frontend`)
- **Technology**: Vite, React 19, TypeScript, Vanilla CSS design tokens with glassmorphic aesthetics.
- **Geospatial UI**: Leaflet & React-Leaflet with CartoDB Voyager tiles and custom SVG pulse pins.
- **Audio & Media**: Web Speech Synthesis API with custom progress soundwave visualizer, Web Speech Recognition for voice translation.
- **Computer Vision**: WebRTC camera stream analyzer with HUD target overlay.
- **Localization**: 10 distinct locales (Uzbek, English, Russian, Turkish, German, French, Spanish, Chinese, Japanese, Korean) with responsive RTL/LTR readiness.

### 2.2 API Layer (`/backend/SafarAi.Api`)
- **Framework**: ASP.NET Core 10 Web API (C# 13).
- **Controllers**:
  - `AuthController`: User registration, secure bcrypt authentication, token claims.
  - `DestinationsController` & `PlacesController`: Rich historical catalogs, nearby queries.
  - `TripsController`: User trip persistence and day-by-day activity tracking.
  - `AiController`: Planner, tour guide, translation, speech synthesis, vision scan.
  - `RoutesController`: Multi-modal transit time and cost estimator.
  - `AdminController`: Aggregated analytics, tourist country breakdown, system health metrics.

### 2.3 Domain Core (`/backend/SafarAi.Core`)
- Contains all pure domain entities, enums (`UserRole`, `TravelStyle`, `TransportMode`, `PlaceCategoryType`), DTO records, and decoupled service interfaces (`IAIService`, `IMapService`, etc.).
- Free of third-party infrastructure dependencies.

### 2.4 Infrastructure & Database (`/backend/SafarAi.Infrastructure`)
- **ORM**: Entity Framework Core with Npgsql driver for PostgreSQL.
- **Failover Resilience**: Graceful failover to in-memory storage if remote PostgreSQL service is offline during local development.
- **Seeding Engine**: `DbInitializer` populates complete Timurid architectural landmarks for Samarkand (Registan, Gur-e-Amir, Shah-i-Zinda, Bibi-Khanym, Siyob Bazaar, Konigil, etc.).

### 2.5 Services & AI Knowledge Engine (`/backend/SafarAi.Services`)
- Implements pluggable AI provider abstractions.
- Features an offline-ready **Intelligent Knowledge Engine** specifically calibrated with Samarkand historical facts, coordinates, pricing, and 10-language translations.
