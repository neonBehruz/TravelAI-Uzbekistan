# 🚀 SAFAR AI — Deployment & Setup Guide

---

## 1. Prerequisites
- **.NET 10 SDK** or **.NET 9 SDK**
- **Node.js 18+** & **npm 9+**
- **PostgreSQL 15+** (Optional — the app includes automatic in-memory failover resilience)

---

## 2. Quick Start (Development)

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/your-org/safar-ai.git
cd safar-ai
cp .env.example .env
```

### Step 2: Run the Backend (.NET 10 Web API)
```bash
cd backend/SafarAi.Api
dotnet run
```
> The API starts at `http://localhost:5000` with Swagger UI at `http://localhost:5000/swagger`.  
> Database migrations and Samarkand seed data are applied automatically on startup!

### Step 3: Run the Frontend (React 19 + TypeScript)
```bash
cd frontend
npm install
npm run dev
```
> The web application starts at `http://localhost:5173`.

---

## 3. Production Deployment

### Backend Docker Container
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish backend/SafarAi.Api/SafarAi.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "SafarAi.Api.dll"]
```

### Frontend Production Build
```bash
cd frontend
npm run build
```
Deploy the resulting `frontend/dist/` directory to Vercel, Netlify, Cloudflare Pages, or Nginx.
