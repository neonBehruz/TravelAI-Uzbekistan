# 📡 SAFAR AI — REST API Documentation

Base URL: `http://localhost:5000/api`  
Swagger UI: `http://localhost:5000/swagger`

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new tourist or business user account.
```json
{
  "name": "Alexander Miller",
  "email": "tourist@safarai.com",
  "password": "Password123!",
  "country": "Germany",
  "language": "en",
  "role": "User"
}
```

### `POST /api/auth/login`
Authenticates a user and issues a JWT token.
```json
{
  "email": "tourist@safarai.com",
  "password": "Tourist123!"
}
```

### `GET /api/auth/me` *(Authorized)*
Returns the current user profile with saved trips and bookmarks count.

---

## 2. Destinations & Places Endpoints

### `GET /api/destinations`
Returns all active tourist cities in Uzbekistan (Samarkand, Bukhara, Khiva, Tashkent).

### `GET /api/places?city=Samarkand&category=Historical`
Retrieves places with optional city, category, or keyword search filters.

### `GET /api/places/{id}`
Returns high-resolution details, detailed history, architectural breakdown, interesting facts, and opening hours for a specific landmark.

### `POST /api/places/nearby`
Calculates nearby landmarks from GPS coordinates.
```json
{
  "latitude": 39.6547,
  "longitude": 66.9758,
  "radiusKm": 5.0
}
```

### `GET /api/places/{id}/reviews`
Returns verified visitor reviews.

### `POST /api/places/{id}/reviews` *(Authorized)*
Submits a visitor rating and review.

---

## 3. AI Services Endpoints

### `POST /api/ai/plan-trip`
Generates a multi-day personalized itinerary and budget breakdown.
```json
{
  "destination": "Samarkand",
  "days": 2,
  "budgetUzs": 1000000,
  "interests": "History, Uzbek Food, Photography",
  "language": "en",
  "travelStyle": "Balanced",
  "transportation": "Walking & Taxi",
  "travelersCount": 1
}
```

### `POST /api/ai/chat`
Conversational AI tour guide agent with contextual historical knowledge.
```json
{
  "message": "What is the history of Registan Square?",
  "language": "en",
  "contextPlaceName": "Samarkand"
}
```

### `POST /api/ai/translate`
2-Way voice and text translation engine supporting 10 languages.
```json
{
  "text": "Where is the nearest traditional restaurant?",
  "sourceLanguage": "en",
  "targetLanguage": "uz"
}
```

### `POST /api/ai/vision`
Camera vision landmark identifier matching GPS and visual tags.
```json
{
  "userLatitude": 39.6547,
  "userLongitude": 66.9758,
  "language": "en"
}
```

---

## 4. Routes & Navigation Endpoints

### `POST /api/routes/calculate`
Calculates walking, taxi, and car transit times, distances, and local taxi fares in UZS.
```json
{
  "startLatitude": 39.6547,
  "startLongitude": 66.9758,
  "endLatitude": 39.6644,
  "endLongitude": 66.9877,
  "mode": "Walking"
}
```

---

## 5. Admin Analytics Endpoints

### `GET /api/admin/dashboard`
Returns live platform KPIs, tourist countries breakdown, top visited landmarks, and system health status.
