# 🌍 SAFAR AI
> **“Your AI Guide. Your Language. Your Journey.”**

[![.NET 10](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SAFAR AI** is an AI-powered smart tourism platform engineered to transform how international and local tourists discover Uzbekistan. Launching with a deep MVP in **Samarkand**, SAFAR AI unites generative itinerary planning, real-time GPS smart maps, 24/7 conversational audio guides, camera vision landmark recognition, 10-language voice translation, and smart budget analytics into a single cohesive platform.

---

## 🌟 Core Features

- 🤖 **AI Trip Planner**: Generates personalized, day-by-day itineraries based on duration, budget in UZS/USD, travel style (Relaxed, Balanced, Fast-Paced), and interests (History, Gastronomy, Crafts, Photography).
- 📍 **GPS Nearby Radar**: Real-time geolocation geofence displaying nearby historical madrasahs, tea houses, and photo spots with walking transit estimates.
- 🗺️ **Interactive Smart Map**: Leaflet map with custom turquoise & gold landmark pins, user GPS location, and multi-modal route calculations (Walking, Taxi, Car).
- 🏛️ **24/7 AI Tour Guide**: Conversational guide answering questions about Timurid history, architecture, and food in the user's native language with natural speech synthesis.
- 📷 **AI Vision Landmark Scanner**: Uses your phone camera to identify historical buildings (e.g. Sher-Dor Madrasah, Gur-e-Amir) and immediately triggers narrated audio guides.
- 🎙️ **10-Language Voice Translator**: Real-time two-way voice translation between English, Uzbek, Russian, Turkish, German, French, Spanish, Chinese, Japanese, and Korean.
- 💰 **Smart Budget Planner**: Real-time itemized tracking across tickets, food/plov, taxis, and buffer contingencies.
- 🛡️ **Executive Admin Dashboard**: Real-time analytics, user growth charts, tourist country demographics, popular landmark rankings, and subsystem health monitoring.

---

## 🏗️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend API** | ASP.NET Core Web API 10.0 (C# 13), Clean Architecture |
| **Database** | PostgreSQL 18 with Entity Framework Core 10 + Npgsql (Auto-fallback to In-Memory DB) |
| **Authentication** | JWT Bearer Tokens, BCrypt password hashing, Role-Based Access Control (`User`, `Admin`, `Business`) |
| **AI System** | Pluggable Provider Architecture (`IAIService`, `IAITripPlannerService`, `IAIGuideService`, `IAITranslationService`, `IAIVisionService`) + Intelligent Knowledge Engine |
| **Frontend** | React 19, TypeScript, Vite, Vanilla CSS Design System, Lucide Icons, Leaflet & React-Leaflet |
| **Audio & Speech** | Web Speech API (Synthesis & Recognition) with dynamic waveform visualizers |
| **Vision & Sensors**| Geolocation API, WebRTC camera video stream |

---

## 🚀 Quick Setup & Run

### 1. Backend (.NET 10)
```bash
# From workspace root:
cd backend/SafarAi.Api
dotnet run
```
The API is live at `http://localhost:5000` with Swagger UI at `http://localhost:5000/swagger`.

### 2. Frontend (React 19 + TypeScript)
```bash
# From workspace root:
cd frontend
npm install
npm run dev
```
The web application is live at `http://localhost:5173`.

### Demo Credentials
- **Admin**: `admin@safarai.uz` / `Admin123!`
- **Tourist**: `tourist@safarai.com` / `Tourist123!` (or 1-click login on the auth screen)

---

## 📁 Repository Structure

```text
TravelAI Uzbekistan/
├── backend/
│   ├── SafarAi.Api/             # Controllers, Swagger, Middlewares, Program.cs
│   ├── SafarAi.Core/            # Entities, Enums, DTOs, Service Interfaces
│   ├── SafarAi.Infrastructure/  # EF Core DbContext, PostgreSQL, JWT, DbInitializer (Seed data)
│   └── SafarAi.Services/        # AI Engines, Map/GPS Service, Translations, Voice, Vision
├── frontend/
│   ├── src/
│   │   ├── components/          # Sidebar, Header, MobileNav, LeafletMap, AudioPlayerBar
│   │   ├── context/             # Auth, Language, Location, AudioGuide
│   │   ├── i18n/                # 10 Languages Translations
│   │   ├── pages/               # 16+ Startup Screens (Landing, Map, Planner, Vision, Guide, etc.)
│   │   ├── services/            # API client with offline resiliency
│   │   ├── styles/              # Design system & Glassmorphic variables
│   │   └── types/               # TypeScript models matching backend DTOs
├── database/
│   └── schema.sql               # Normalized PostgreSQL DDL Schema
├── docs/
│   ├── ARCHITECTURE.md          # Architectural diagrams & design decisions
│   ├── API.md                   # Complete REST API specification
│   ├── DATABASE.md              # Relational models & ER diagrams
│   ├── AI.md                    # AI engine & multimodal provider patterns
│   └── DEPLOYMENT.md            # Production deployment instructions
├── .env.example                 # Environment configuration template
├── .gitignore                   # Git ignore rules
└── README.md
```

---

## 🏆 Startup Demo Workflow

1. **Open SAFAR AI**: Choose your native language from 10 supported options (e.g. English 🇬🇧 or German 🇩🇪).
2. **GPS Detection**: App identifies your coordinates in Samarkand near Registan Square.
3. **Plan Trip**: Open the AI Trip Planner wizard, select 2 days + 1,000,000 UZS budget + History interests -> Generates an itemized day-by-day itinerary with budget charts.
4. **Smart Map & GPS Route**: Open the itinerary on the Smart Map to view pedestrian and taxi travel times.
5. **AI Audio Guide**: Tap “Listen to AI Guide” on Registan or Gur-e-Amir to hear natural voice narration.
6. **AI Vision Scan**: Open the Camera scanner to instantly recognize landmarks and reveal architectural secrets.
7. **Voice Translator**: Speak in English or German -> Instant translation to Uzbek with phonetic audio pronunciation.
8. **Admin Panel**: Sign in as admin to monitor platform traffic, tourist origins, and popular landmarks.

---

## 📜 License
Licensed under the [MIT License](LICENSE).
