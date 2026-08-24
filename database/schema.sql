-- ============================================================================
-- SAFAR AI: PostgreSQL Relational Database Schema (v1.0)
-- Slogan: "Your AI Guide. Your Language. Your Journey."
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(150) UNIQUE NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Country" VARCHAR(100) DEFAULT 'Uzbekistan',
    "PreferredLanguage" VARCHAR(10) DEFAULT 'en',
    "Role" INT NOT NULL DEFAULT 1, -- 1: User, 2: Admin, 3: Business
    "PreferredInterests" TEXT,
    "PreferredStyle" INT NOT NULL DEFAULT 2, -- 1: Relaxed, 2: Balanced, 3: FastPaced
    "PreferredTransport" INT NOT NULL DEFAULT 1, -- 1: Walking, 2: Taxi, 3: Car, 4: PublicTransit
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "LastLoginAt" TIMESTAMP WITH TIME ZONE
);

-- 2. Destinations Table
CREATE TABLE IF NOT EXISTS "Destinations" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(100) NOT NULL,
    "Region" VARCHAR(100) NOT NULL,
    "Description" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "PopularityScore" INT DEFAULT 100
);

-- 3. Place Categories Table
CREATE TABLE IF NOT EXISTS "PlaceCategories" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(50) NOT NULL,
    "Icon" VARCHAR(50) NOT NULL,
    "Type" INT NOT NULL
);

-- 4. Places Table
CREATE TABLE IF NOT EXISTS "Places" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(150) NOT NULL,
    "LocalName" VARCHAR(150),
    "DestinationId" UUID NOT NULL REFERENCES "Destinations"("Id") ON DELETE CASCADE,
    "CategoryId" UUID NOT NULL REFERENCES "PlaceCategories"("Id") ON DELETE RESTRICT,
    "ShortDescription" TEXT NOT NULL,
    "DetailedHistory" TEXT NOT NULL,
    "ArchitectureDetails" TEXT,
    "InterestingFacts" TEXT, -- JSON Array
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "Address" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "ImageGalleryJson" TEXT DEFAULT '[]',
    "TicketPriceUzs" DECIMAL(18, 2) DEFAULT 0,
    "OpeningHours" VARCHAR(50) DEFAULT '09:00 - 18:00',
    "RecommendedVisitDurationMinutes" INT DEFAULT 60,
    "Rating" DOUBLE PRECISION DEFAULT 4.9,
    "ReviewCount" INT DEFAULT 0,
    "AudioGuideScript" TEXT,
    "AudioGuideUrl" TEXT,
    "VisionRecognitionTags" TEXT,
    "IsMustVisit" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Hotels Table
CREATE TABLE IF NOT EXISTS "Hotels" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(150) NOT NULL,
    "DestinationId" UUID NOT NULL REFERENCES "Destinations"("Id") ON DELETE CASCADE,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "Address" TEXT NOT NULL,
    "PricePerNightUzs" DECIMAL(18, 2) NOT NULL,
    "Rating" DOUBLE PRECISION DEFAULT 4.8,
    "Stars" INT DEFAULT 4,
    "ImageUrl" TEXT NOT NULL,
    "AmenitiesJson" TEXT DEFAULT '[]'
);

-- 6. Restaurants Table
CREATE TABLE IF NOT EXISTS "Restaurants" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(150) NOT NULL,
    "DestinationId" UUID NOT NULL REFERENCES "Destinations"("Id") ON DELETE CASCADE,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "Address" TEXT NOT NULL,
    "CuisineType" VARCHAR(100) NOT NULL,
    "AverageCostUzs" DECIMAL(18, 2) DEFAULT 80000,
    "Rating" DOUBLE PRECISION DEFAULT 4.9,
    "ImageUrl" TEXT NOT NULL,
    "SignatureDishes" TEXT NOT NULL
);

-- 7. Trips Table
CREATE TABLE IF NOT EXISTS "Trips" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserId" UUID NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "Title" VARCHAR(150) NOT NULL,
    "DestinationName" VARCHAR(100) NOT NULL,
    "NumberOfDays" INT NOT NULL DEFAULT 2,
    "TotalBudgetUzs" DECIMAL(18, 2) NOT NULL,
    "EstimatedSpentUzs" DECIMAL(18, 2) NOT NULL,
    "TotalDistanceKm" DOUBLE PRECISION DEFAULT 0,
    "Interests" TEXT,
    "Style" INT DEFAULT 2,
    "PreferredTransport" INT DEFAULT 1,
    "Language" VARCHAR(10) DEFAULT 'en',
    "AiSummary" TEXT,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Trip Days Table
CREATE TABLE IF NOT EXISTS "TripDays" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "TripId" UUID NOT NULL REFERENCES "Trips"("Id") ON DELETE CASCADE,
    "DayNumber" INT NOT NULL,
    "Title" VARCHAR(150) NOT NULL,
    "Summary" TEXT
);

-- 9. Trip Activities Table
CREATE TABLE IF NOT EXISTS "TripActivities" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "TripDayId" UUID NOT NULL REFERENCES "TripDays"("Id") ON DELETE CASCADE,
    "Order" INT NOT NULL,
    "TimeSlot" VARCHAR(50) NOT NULL,
    "PlaceId" UUID REFERENCES "Places"("Id") ON DELETE SET NULL,
    "ActivityTitle" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "DurationMinutes" INT DEFAULT 60,
    "DistanceFromPreviousKm" DOUBLE PRECISION DEFAULT 0,
    "EstimatedCostUzs" DECIMAL(18, 2) DEFAULT 0,
    "TransitMode" INT DEFAULT 1
);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS "Reviews" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "PlaceId" UUID NOT NULL REFERENCES "Places"("Id") ON DELETE CASCADE,
    "UserId" UUID NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "Rating" INT NOT NULL CHECK ("Rating" >= 1 AND "Rating" <= 5),
    "Comment" TEXT NOT NULL,
    "TouristCountry" VARCHAR(100),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Saved Places Table
CREATE TABLE IF NOT EXISTS "SavedPlaces" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserId" UUID NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "PlaceId" UUID NOT NULL REFERENCES "Places"("Id") ON DELETE CASCADE,
    "SavedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("UserId", "PlaceId")
);

-- 12. AI Conversations Table
CREATE TABLE IF NOT EXISTS "AIConversations" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserId" UUID REFERENCES "Users"("Id") ON DELETE CASCADE,
    "SessionTitle" VARCHAR(150),
    "ContextPlaceName" VARCHAR(150),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. AI Messages Table
CREATE TABLE IF NOT EXISTS "AIMessages" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ConversationId" UUID NOT NULL REFERENCES "AIConversations"("Id") ON DELETE CASCADE,
    "IsUser" BOOLEAN NOT NULL,
    "Content" TEXT NOT NULL,
    "Language" VARCHAR(10) DEFAULT 'en',
    "AudioUrl" TEXT,
    "Timestamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
