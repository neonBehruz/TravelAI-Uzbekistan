export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  language: string;
  role: 'User' | 'Admin' | 'Business';
  preferredInterests?: string;
  preferredStyle?: string;
  preferredTransport?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  name: string;
  email: string;
  country: string;
  language: string;
  role: string;
  avatarUrl?: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PlaceFilterRequest {
  city?: string;
  search?: string;
  categoryType?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'rating_desc' | 'price_asc' | 'price_desc' | 'name_asc' | 'popular';
  pageNumber?: number;
  pageSize?: number;
}

export interface FileUploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

export interface LiveTouristSignal {
  activeTouristsCount: number;
  city: string;
  action: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  preferredLanguage: string;
  role: string;
  preferredInterests?: string;
  preferredStyle?: string;
  preferredTransport?: string;
  savedPlacesCount: number;
  tripsCount: number;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Place {
  id: string;
  name: string;
  localName: string;
  destinationName: string;
  categoryName: string;
  categoryType: number;
  shortDescription: string;
  detailedHistory: string;
  architectureDetails: string;
  interestingFacts: string[];
  latitude: number;
  longitude: number;
  address: string;
  imageUrl: string;
  imageGallery: string[];
  ticketPriceUzs: number;
  openingHours: string;
  recommendedVisitDurationMinutes: number;
  rating: number;
  reviewCount: number;
  audioGuideScript: string;
  audioGuideUrl?: string;
  isMustVisit: boolean;
  distanceFromUserKm?: number;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  placesCount: number;
  popularityScore: number;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  icon: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  formattedDistance: string;
  imageUrl: string;
  rating: number;
  ticketPriceUzs: number;
  estimatedWalkTime: string;
}

export interface Review {
  id: string;
  placeId: string;
  userName: string;
  touristCountry: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AiTripActivity {
  order: number;
  timeSlot: string;
  placeId?: string;
  activityTitle: string;
  description: string;
  latitude: number;
  longitude: number;
  durationMinutes: number;
  distanceFromPreviousKm: number;
  estimatedCostUzs: number;
  transitMode: string;
  imageUrl: string;
}

export interface AiTripDay {
  dayNumber: number;
  title: string;
  summary: string;
  activities: AiTripActivity[];
}

export interface AiBudgetBreakdown {
  transportUzs: number;
  foodUzs: number;
  ticketsUzs: number;
  otherUzs: number;
  totalEstimatedUzs: number;
  remainingUzs: number;
}

export interface AiTripPlan {
  tripId?: string;
  title: string;
  destinationName: string;
  numberOfDays: number;
  totalBudgetUzs: number;
  estimatedSpentUzs: number;
  totalDistanceKm: number;
  aiSummary: string;
  budgetBreakdown: AiBudgetBreakdown;
  days: AiTripDay[];
}

export interface RouteOption {
  mode: string;
  distanceKm: number;
  formattedDistance: string;
  durationMinutes: number;
  formattedDuration: string;
  estimatedCostUzs: number;
  recommendationReason: string;
}

export interface RouteCalculation {
  distanceKm: number;
  bestMode: string;
  options: RouteOption[];
  waypoints: { latitude: number; longitude: number; label?: string }[];
}

export interface AdminStats {
  totalUsers: number;
  activeTourists: number;
  totalTripsGenerated: number;
  totalAiRequests: number;
  totalDestinations: number;
  totalPlaces: number;
  totalRevenueUzs: number;
  touristCountries: { country: string; count: number; percentage: number }[];
  topVisitedPlaces: { name: string; city: string; visitCount: number; rating: number }[];
  languageDistribution: { language: string; code: string; requestCount: number }[];
  activityTimeline: { month: string; users: number; trips: number; aiCalls: number }[];
}
