# 🤖 SAFAR AI — AI Engine & Multimodal Architecture

SAFAR AI employs a modular provider pattern (`IAIService`, `IAITripPlannerService`, `IAIGuideService`, `IAITranslationService`, `IAIVoiceService`, `IAIVisionService`) designed to interface seamlessly with:
1. **Intelligent Knowledge Engine (Local & Offline Ready)** — Default local engine embedded with rich historical context, Uzbek cultural facts, and transit algorithms.
2. **OpenAI GPT-4o / GPT-4o-mini** — For generative dialogue and custom itinerary synthesis.
3. **Anthropic Claude 3.5 Sonnet** — For deep architectural and historical analysis.
4. **Google Gemini 2.0 Flash / Pro** — For multimodal vision recognition and live camera stream understanding.
5. **Ollama / Local LLMs** — For sovereign, on-premise deployments.

---

## AI Subsystems

### 1. AI Trip Planner (`IAITripPlannerService`)
- Dynamically allocates a tourist's target budget (in UZS) across:
  - **Monument Tickets** (~25%)
  - **Gastronomy & Dining** (~35%)
  - **Taxis & Transit** (~20%)
  - **Contingency Buffer** (~20%)
- Sequences landmark visits geographically using the Haversine distance matrix to minimize backtracking.

### 2. AI Tour Guide (`IAIGuideService`)
- Conversational assistant with localized domain expertise in:
  - Timurid Empire (Amir Timur, Ulugh Beg, Bibi-Khanym).
  - Islamic tile art (majolica, glazed terracotta, lapis lazuli).
  - Cultural etiquette and family-friendly advice.
  - Authentic culinary recommendations (Samarkand Osh, Tandir Somsa).

### 3. AI Voice Translator (`IAITranslationService`)
- 2-Way translation between 10 major global languages.
- Generates phonetic guides to assist tourists in pronouncing Uzbek phrases accurately.

### 4. AI Landmark Vision Scanner (`IAIVisionService`)
- Correlates user camera feeds, visual feature tags, and GPS coordinates to identify landmarks (such as Sher-Dor Madrasah's solar tigers or Gur-e-Amir's ribbed dome) and trigger automated audio guides.
