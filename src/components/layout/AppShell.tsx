import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { TopNav } from './TopNav';
import { DashboardView } from '../views/DashboardView';
import { ApplicationsView } from '../views/ApplicationsView';
import { ApplicationDetailView } from '../views/ApplicationDetailView';
import { WorkflowEngineView } from '../views/WorkflowEngineView';
import { EvcSchedulingView } from '../views/EvcSchedulingView';
import { ComplianceView } from '../views/ComplianceView';
import { DocumentRegistryView } from '../views/DocumentRegistryView';
import { AlertsEscalationsView } from '../views/AlertsEscalationsView';
import { ReportsAnalyticsView } from '../views/ReportsAnalyticsView';
import { SettingsView } from '../views/SettingsView';
import { PublicHomeView } from '../views/PublicHomeView';
import { LoginView } from '../views/LoginView';
import { TrackApplicationView } from '../views/TrackApplicationView';
import { InstitutionRegisterView } from '../views/InstitutionRegisterView';
import { InstitutionPortalView } from '../views/InstitutionPortalView';
import { CreateApplicationModal } from '../modals/CreateApplicationModal';
import { useSakshamStore } from '../../hooks/useSakshamStore';
import type { Role } from '../../types';

export type MainView = 'home' | 'login' | 'track' | 'register' | 'portal';

export const AppShell: React.FC = () => {
  const { activeUser } = useSakshamStore();
  const [mainView, setMainView] = useState<MainView>('home');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [trackTargetAppId, setTrackTargetAppId] = useState<string | undefined>(undefined);
  const [isCreateAppOpen, setIsCreateAppOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Sync initial URL path
  useEffect(() => {
    const handleUrlSync = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/' || path === '') {
        setMainView('home');
      } else if (path.includes('/login')) {
        setMainView('login');
      } else if (path.includes('/institution/track') || path.includes('/track')) {
        setMainView('track');
      } else if (path.includes('/institution/register') || path.includes('/register')) {
        setMainView('register');
      } else if (path.includes('/institution')) {
        setMainView('portal');
        setCurrentTab('institution-portal');
      } else if (path.includes('/applications')) {
        setMainView('portal');
        setCurrentTab('applications');
      } else if (path.includes('/workflow')) {
        setMainView('portal');
        setCurrentTab('workflow');
      } else if (path.includes('/evc')) {
        setMainView('portal');
        setCurrentTab('evc');
      } else if (path.includes('/compliance')) {
        setMainView('portal');
        setCurrentTab('compliance');
      } else if (path.includes('/documents')) {
        setMainView('portal');
        setCurrentTab('documents');
      } else if (path.includes('/alerts')) {
        setMainView('portal');
        setCurrentTab('alerts');
      } else if (path.includes('/reports')) {
        setMainView('portal');
        setCurrentTab('reports');
      } else if (path.includes('/settings')) {
        setMainView('portal');
        setCurrentTab('settings');
      } else if (path.includes('/dashboard')) {
        setMainView('portal');
        setCurrentTab('dashboard');
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // When demo role changes, keep view in sync with role permissions
  useEffect(() => {
    if (activeUser.role === 'INSTITUTION_USER' && currentTab === 'dashboard') {
      setCurrentTab('institution-portal');
    } else if (
      activeUser.role !== 'INSTITUTION_USER' &&
      activeUser.role !== 'SUPER_ADMIN' &&
      currentTab === 'institution-portal'
    ) {
      setCurrentTab('dashboard');
    }
  }, [activeUser.role, currentTab]);

  const navigateTo = (view: MainView, urlPath: string) => {
    setMainView(view);
    if (window.location.pathname !== urlPath) {
      window.history.pushState({}, '', urlPath);
    }
  };

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    setSelectedApplicationId(null);
    setMainView('portal');
    setIsMobileNavOpen(false);

    const tabPathMap: Record<NavTab, string> = {
      dashboard: '/dashboard',
      applications: '/applications',
      workflow: '/workflow',
      evc: '/evc',
      compliance: '/compliance',
      documents: '/documents',
      alerts: '/alerts',
      reports: '/reports',
      settings: '/settings',
      'institution-portal': '/institution/dashboard',
    };

    const targetPath = tabPathMap[tab] || '/dashboard';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleSelectApplication = (appId: string) => {
    setSelectedApplicationId(appId);
    setCurrentTab('applications');
    setMainView('portal');
    window.history.pushState({}, '', `/applications/${appId}`);
  };

  const handleLoginSuccess = (role: Role) => {
    if (role === 'INSTITUTION_USER') {
      setCurrentTab('institution-portal');
      navigateTo('portal', '/institution/dashboard');
    } else {
      setCurrentTab('dashboard');
      navigateTo('portal', '/dashboard');
    }
  };

  // If in Public Views
  if (mainView === 'home') {
    return (
      <PublicHomeView
        onNavigateLogin={() => navigateTo('login', '/login')}
        onNavigatePortal={() => {
          if (activeUser.role === 'INSTITUTION_USER') {
            setCurrentTab('institution-portal');
            navigateTo('portal', '/institution/dashboard');
          } else {
            setCurrentTab('dashboard');
            navigateTo('portal', '/dashboard');
          }
        }}
        onNavigateTrack={(appId) => {
          setTrackTargetAppId(appId);
          navigateTo('track', '/institution/track-application');
        }}
        onNavigateRegister={() => navigateTo('register', '/institution/register')}
      />
    );
  }

  if (mainView === 'login') {
    return (
      <LoginView
        onSuccessLogin={handleLoginSuccess}
        onNavigateHome={() => navigateTo('home', '/')}
        onNavigateRegister={() => navigateTo('register', '/institution/register')}
      />
    );
  }

  if (mainView === 'track') {
    return (
      <TrackApplicationView
        initialAppId={trackTargetAppId}
        onNavigateHome={() => navigateTo('home', '/')}
        onNavigateLogin={() => navigateTo('login', '/login')}
      />
    );
  }

  if (mainView === 'register') {
    return (
      <InstitutionRegisterView
        onNavigateHome={() => navigateTo('home', '/')}
        onNavigateLogin={() => navigateTo('login', '/login')}
      />
    );
  }

  // Authenticated Portal Workspace
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F7F5] font-sans antialiased text-[#111111]">
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Dark Sidebar (#111111) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigateHome={() => navigateTo('home', '/')}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Area (Spacious Light Background #F7F7F5) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F7F7F5]">
        {/* Clean Top Navigation */}
        <TopNav
          currentTab={currentTab}
          onSelectApplication={handleSelectApplication}
          onNavigateTab={handleSelectTab}
          onNavigateHome={() => navigateTo('home', '/')}
          onOpenCreateApp={() => setIsCreateAppOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 scroll-smooth bg-[#F7F7F5]">
          <div className="max-w-6xl mx-auto">
            {selectedApplicationId ? (
              <ApplicationDetailView
                applicationId={selectedApplicationId}
                onBack={() => {
                  setSelectedApplicationId(null);
                  window.history.pushState({}, '', '/applications');
                }}
                onNavigateTab={handleSelectTab}
              />
            ) : (
              <>
                {currentTab === 'dashboard' && (
                  <DashboardView
                    onNavigateTab={handleSelectTab}
                    onSelectApplication={handleSelectApplication}
                    onOpenCreateApp={() => setIsCreateAppOpen(true)}
                  />
                )}
                {currentTab === 'institution-portal' && (
                  <InstitutionPortalView
                    onSelectApplication={handleSelectApplication}
                    onOpenCreateApp={() => setIsCreateAppOpen(true)}
                    onNavigateTab={handleSelectTab}
                  />
                )}
                {currentTab === 'applications' && (
                  <ApplicationsView
                    onSelectApplication={handleSelectApplication}
                    onOpenCreateApp={() => setIsCreateAppOpen(true)}
                  />
                )}
                {currentTab === 'workflow' && <WorkflowEngineView />}
                {currentTab === 'evc' && <EvcSchedulingView />}
                {currentTab === 'compliance' && <ComplianceView />}
                {currentTab === 'documents' && <DocumentRegistryView />}
                {currentTab === 'alerts' && (
                  <AlertsEscalationsView
                    onSelectApplication={handleSelectApplication}
                    onNavigateTab={handleSelectTab}
                  />
                )}
                {currentTab === 'reports' && <ReportsAnalyticsView />}
                {currentTab === 'settings' && <SettingsView />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global Application Creation Modal */}
      {isCreateAppOpen && (
        <CreateApplicationModal
          isOpen={isCreateAppOpen}
          onClose={() => setIsCreateAppOpen(false)}
          onSuccess={(newAppId) => {
            setSelectedApplicationId(newAppId);
            setCurrentTab('applications');
          }}
        />
      )}
    </div>
  );
};
