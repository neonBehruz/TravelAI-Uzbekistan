import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import { AudioGuideProvider } from './context/AudioGuideContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { AudioPlayerBar } from './components/AudioPlayerBar';

import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { TripResultPage } from './pages/TripResultPage';
import { SmartMapPage } from './pages/SmartMapPage';
import { AiGuidePage } from './pages/AiGuidePage';
import { ScanPlacePage } from './pages/ScanPlacePage';
import { TranslatorPage } from './pages/TranslatorPage';
import { NearbyPage } from './pages/NearbyPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

import { BazaarCalculatorPage } from './pages/BazaarCalculatorPage';
import { GastronomyPlovPage } from './pages/GastronomyPlovPage';
import { TransportTrainPage } from './pages/TransportTrainPage';
import { EmergencySosPage } from './pages/EmergencySosPage';
import { HotelsStaysPage } from './pages/HotelsStaysPage';
import { BudgetTrackerPage } from './pages/BudgetTrackerPage';
import { WeatherSeasonsPage } from './pages/WeatherSeasonsPage';
import { TravelPracticalGuidePage } from './pages/TravelPracticalGuidePage';
import { VirtualTour360Page } from './pages/VirtualTour360Page';
import { ArtisanSouvenirsPage } from './pages/ArtisanSouvenirsPage';

import { MobileSimulatorShell } from './components/MobileSimulatorShell';
import { StartupAnimation } from './components/StartupAnimation';
import { AiTripPlan, AiTripActivity } from './types';

const parseHash = () => {
  const hash = (typeof window !== 'undefined' ? window.location.hash : '').replace(/^#\/?/, '');
  if (!hash) return { tab: '', params: {} as Record<string, string> };
  const [tabPart, queryPart] = hash.split('?');
  const params: Record<string, string> = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }
  return { tab: tabPart || '', params };
};

const MainLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('safar_intro_shown');
  });

  const [currentTab, setCurrentTab] = useState<string>(() => {
    const initial = parseHash();
    if (initial.tab) return initial.tab;
    return 'landing';
  });

  const [activePlan, setActivePlan] = useState<AiTripPlan | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(() => {
    return parseHash().params.id || 'p1';
  });
  const [routeActivities, setRouteActivities] = useState<AiTripActivity[] | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = useCallback((tab: string, params?: any, replace = false) => {
    let targetTab = tab;
    if (targetTab === 'admin' && user?.role !== 'Admin') {
      targetTab = 'dashboard';
    }
    if (params?.id) {
      setSelectedPlaceId(params.id);
    }
    setCurrentTab(targetTab);

    const queryStr = params?.id ? `?id=${params.id}` : '';
    const newHash = `#${targetTab}${queryStr}`;
    if (window.location.hash !== newHash) {
      if (replace) {
        window.history.replaceState({ tab: targetTab, params }, '', newHash);
      } else {
        window.history.pushState({ tab: targetTab, params }, '', newHash);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user?.role]);

  useEffect(() => {
    const onLocationChange = () => {
      const { tab, params } = parseHash();
      if (tab) {
        if (params.id) {
          setSelectedPlaceId(params.id);
        }
        setCurrentTab(tab);
      } else {
        setCurrentTab('landing');
      }
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);

    // If no hash currently exists (initial visit via root link), default to #landing
    if (!window.location.hash) {
      window.history.replaceState({ tab: 'landing' }, '', '#landing');
    }

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('safar_intro_shown', 'true');
    setShowIntro(false);
  };

  const handlePlanGenerated = (plan: AiTripPlan) => {
    setActivePlan(plan);
    handleNavigate('trip-result');
  };

  const handleOpenMapWithRoute = (activities: AiTripActivity[]) => {
    setRouteActivities(activities);
    handleNavigate('map');
  };

  if (currentTab === 'landing') {
    return (
      <>
        {showIntro && <StartupAnimation onComplete={handleIntroComplete} />}
        <LandingPage
          onStartPlanning={() => handleNavigate(isAuthenticated ? 'dashboard' : 'login')}
          onExploreMap={() => handleNavigate(isAuthenticated ? 'map' : 'login')}
          onOpenLogin={() => handleNavigate('login')}
          onOpenRegister={() => handleNavigate('register')}
        />
      </>
    );
  }

  if (currentTab === 'login') {
    return (
      <AuthPages
        mode="login"
        onSwitchMode={(m) => handleNavigate(m)}
        onSuccess={() => handleNavigate('dashboard')}
        onBack={() => handleNavigate('landing')}
      />
    );
  }

  if (currentTab === 'register') {
    return (
      <AuthPages
        mode="register"
        onSwitchMode={(m) => handleNavigate(m)}
        onSuccess={() => handleNavigate('onboarding')}
        onBack={() => handleNavigate('landing')}
      />
    );
  }

  if (currentTab === 'forgot-password') {
    return (
      <AuthPages
        mode="forgot-password"
        onSwitchMode={(m) => handleNavigate(m)}
        onSuccess={() => handleNavigate('dashboard')}
        onBack={() => handleNavigate('landing')}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthPages
        mode="login"
        onSwitchMode={(m) => handleNavigate(m)}
        onSuccess={() => handleNavigate('dashboard')}
        onBack={() => handleNavigate('landing')}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Desktop Left Sidebar & Mobile Drawer */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Sticky Header */}
        <Header
          onOpenPlanner={() => handleNavigate('plan-trip')}
          onOpenTranslator={() => handleNavigate('translator')}
          onOpenAdmin={() => handleNavigate('admin')}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Viewport Content */}
        <main className="app-content">
          {currentTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}

          {currentTab === 'onboarding' && (
            <OnboardingPage onComplete={() => setCurrentTab('dashboard')} />
          )}

          {currentTab === 'plan-trip' && (
            <TripPlannerPage onPlanGenerated={handlePlanGenerated} />
          )}

          {currentTab === 'trip-result' && activePlan && (
            <TripResultPage
              plan={activePlan}
              onOpenMapWithRoute={handleOpenMapWithRoute}
              onSaveTrip={() => {}}
              onNavigatePlace={(placeId) => handleNavigate('place-detail', { id: placeId })}
            />
          )}

          {currentTab === 'map' && (
            <SmartMapPage
              onNavigatePlace={(placeId) => handleNavigate('place-detail', { id: placeId })}
              initialRoutePlaces={routeActivities}
            />
          )}

          {currentTab === 'ai-guide' && <AiGuidePage onNavigate={handleNavigate} />}

          {currentTab === 'scan-place' && (
            <ScanPlacePage onNavigatePlace={(placeId) => handleNavigate('place-detail', { id: placeId })} />
          )}

          {currentTab === 'translator' && <TranslatorPage />}

          {currentTab === 'bazaar-calculator' && <BazaarCalculatorPage />}

          {currentTab === 'gastronomy' && <GastronomyPlovPage onOpenMap={() => handleNavigate('map')} />}

          {currentTab === 'hotels' && <HotelsStaysPage />}

          {currentTab === 'transport' && <TransportTrainPage />}

          {currentTab === 'sos' && <EmergencySosPage />}

          {currentTab === 'nearby' && (
            <NearbyPage
              onNavigatePlace={(placeId) => handleNavigate('place-detail', { id: placeId })}
              onOpenMap={() => handleNavigate('map')}
            />
          )}

          {currentTab === 'destinations' && (
            <DestinationsPage onSelectCity={() => handleNavigate('dashboard')} />
          )}

          {currentTab === 'place-detail' && (
            <PlaceDetailPage
              placeId={selectedPlaceId}
              onBack={() => handleNavigate('dashboard')}
              onOpenMapToPlace={() => handleNavigate('map')}
            />
          )}

          {currentTab === 'my-trips' && (
            <MyTripsPage
              onPlanNew={() => handleNavigate('plan-trip')}
              onViewPlan={(p) => {
                setActivePlan(p);
                setCurrentTab('trip-result');
              }}
            />
          )}

          {currentTab === 'budget-tracker' && <BudgetTrackerPage />}
          {currentTab === 'weather-seasons' && <WeatherSeasonsPage />}
          {currentTab === 'practical-guide' && <TravelPracticalGuidePage />}
          {currentTab === 'virtual-tour' && <VirtualTour360Page />}
          {currentTab === 'artisan-crafts' && <ArtisanSouvenirsPage />}

          {currentTab === 'profile' && <ProfilePage />}

          {currentTab === 'admin' && <AdminPage />}
        </main>
      </div>

      {/* Floating Audio Guide Soundwave Player */}
      <AudioPlayerBar />

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} onSelectTab={(tab) => handleNavigate(tab)} />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <LocationProvider>
          <AudioGuideProvider>
            <MobileSimulatorShell>
              <MainLayout />
            </MobileSimulatorShell>
          </AudioGuideProvider>
        </LocationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
