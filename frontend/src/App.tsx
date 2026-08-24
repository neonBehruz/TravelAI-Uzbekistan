import React, { useState } from 'react';
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

import { MobileSimulatorShell } from './components/MobileSimulatorShell';
import { AiTripPlan, AiTripActivity } from './types';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('login');
  const [activePlan, setActivePlan] = useState<AiTripPlan | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('p1');
  const [routeActivities, setRouteActivities] = useState<AiTripActivity[] | undefined>(undefined);

  const handleNavigate = (tab: string, params?: any) => {
    if (params?.id) {
      setSelectedPlaceId(params.id);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanGenerated = (plan: AiTripPlan) => {
    setActivePlan(plan);
    setCurrentTab('trip-result');
  };

  const handleOpenMapWithRoute = (activities: AiTripActivity[]) => {
    setRouteActivities(activities);
    setCurrentTab('map');
  };

  // If user is not authenticated, ALWAYS render Login / Register page first
  if (!isAuthenticated || currentTab === 'login') {
    return (
      <AuthPages
        mode="login"
        onSwitchMode={(m) => setCurrentTab(m)}
        onSuccess={() => setCurrentTab('dashboard')}
      />
    );
  }

  if (currentTab === 'register') {
    return (
      <AuthPages
        mode="register"
        onSwitchMode={(m) => setCurrentTab(m)}
        onSuccess={() => setCurrentTab('onboarding')}
      />
    );
  }

  if (currentTab === 'landing') {
    return (
      <LandingPage
        onStartPlanning={() => handleNavigate('dashboard')}
        onExploreMap={() => handleNavigate('map')}
        onOpenScan={() => handleNavigate('scan-place')}
        onOpenTranslator={() => handleNavigate('translator')}
        onOpenLogin={() => handleNavigate('login')}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Desktop Left Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={(tab) => handleNavigate(tab)} />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Sticky Header */}
        <Header
          onOpenScan={() => handleNavigate('scan-place')}
          onOpenPlanner={() => handleNavigate('plan-trip')}
          onOpenTranslator={() => handleNavigate('translator')}
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

          {currentTab === 'ai-guide' && <AiGuidePage />}

          {currentTab === 'scan-place' && (
            <ScanPlacePage onNavigatePlace={(placeId) => handleNavigate('place-detail', { id: placeId })} />
          )}

          {currentTab === 'translator' && <TranslatorPage />}

          {currentTab === 'bazaar-calculator' && <BazaarCalculatorPage />}

          {currentTab === 'gastronomy' && <GastronomyPlovPage onOpenMap={() => handleNavigate('map')} />}

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
