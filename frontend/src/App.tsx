import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { IncidentList } from './pages/IncidentList';
import { IncidentDetail } from './pages/IncidentDetail';
import { InvestigationWorkspace } from './pages/InvestigationWorkspace';
import { MemoryExplorer } from './pages/MemoryExplorer';
import { IncidentHistory } from './pages/IncidentHistory';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Postmortem } from './pages/Postmortem';
import { SettingsPage } from './pages/SettingsPage';
import { AfterActionReports } from './pages/AfterActionReports';
import { ImprovementItems } from './pages/ImprovementItems';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { HelpModal } from './components/HelpModal';
import { UserHistoryModal } from './components/UserHistoryModal';
import { api } from './services/api';

export function App() {
  const { user, isSignedIn } = useUser();
  const [currentTab, setCurrentTab] = useState('landing');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isUserHistoryOpen, setIsUserHistoryOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Automatically record session login for authenticated Clerk account
  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress || 'commander@incidentmind.ai';
    const name = user?.fullName || user?.firstName || 'Incident Commander';
    const id = user?.id || 'unknown';

    const sessionKey = `im_session_${email}_${new Date().toISOString().slice(0, 13)}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      api.recordUserActivity({
        user_id: id,
        user_email: email,
        user_name: name,
        action_type: 'SESSION_START',
        details: `Active command session started (${isSignedIn ? 'Clerk SSO Verified' : 'SRE Sandbox'})`,
        metadata: { signed_in: isSignedIn, role: 'Incident Commander' }
      });
    }
  }, [user, isSignedIn]);

  // Navigate to Incident Detail Page
  const handleSelectIncidentDetail = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('incident-detail');
  };

  // Navigate directly to AI Investigation Studio
  const handleStartInvestigation = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('investigation');
  };

  const handleCreatedIncident = (newId: string) => {
    setSelectedIncidentId(newId);
    setCurrentTab('incident-detail');
  };

  const handleNavigateToResolve = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('postmortem');
  };

  // Standalone Landing Page View
  if (currentTab === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchConsole={() => setCurrentTab('dashboard')}
          onOpenInvestigation={() => setCurrentTab('investigation')}
          onOpenMemoryExplorer={() => setCurrentTab('memory-explorer')}
          onOpenHistory={() => setCurrentTab('history')}
          onOpenAnalytics={() => setCurrentTab('analytics')}
          onDeclareIncident={() => setIsCreateModalOpen(true)}
        />
        <CreateIncidentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleCreatedIncident}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F7FB] dark:bg-[#0B0D11] text-[#172033] dark:text-[#F1F5F9] overflow-hidden font-sans transition-colors">
      {/* Sidebar Desktop */}
      <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-40 h-full`}>
        <Sidebar 
          currentTab={currentTab === 'incident-detail' ? 'incidents' : currentTab} 
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setMobileSidebarOpen(false);
          }} 
          hindsightConnected={true} 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onOpenUserHistory={() => setIsUserHistoryOpen(true)}
        />
      </div>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          openCreateModal={() => setIsCreateModalOpen(true)} 
          currentTab={currentTab}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigateLanding={() => setCurrentTab('landing')}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onOpenUserHistory={() => setIsUserHistoryOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <Dashboard 
              onSelectIncident={handleSelectIncidentDetail} 
              onStartInvestigation={handleStartInvestigation}
              openCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}

          {currentTab === 'incidents' && (
            <IncidentList 
              onSelectIncident={handleSelectIncidentDetail} 
              openCreateModal={() => setIsCreateModalOpen(true)} 
            />
          )}

          {currentTab === 'after-action' && (
            <AfterActionReports 
              onSelectIncident={handleSelectIncidentDetail} 
            />
          )}

          {currentTab === 'improvements' && (
            <ImprovementItems />
          )}

          {currentTab === 'incident-detail' && (
            selectedIncidentId ? (
              <IncidentDetail
                incidentId={selectedIncidentId}
                onBack={() => setCurrentTab('incidents')}
                onStartInvestigation={handleStartInvestigation}
                onNavigateToResolve={handleNavigateToResolve}
              />
            ) : (
              <IncidentList 
                onSelectIncident={handleSelectIncidentDetail} 
                openCreateModal={() => setIsCreateModalOpen(true)} 
              />
            )
          )}

          {currentTab === 'investigation' && (
            <InvestigationWorkspace 
              selectedIncidentId={selectedIncidentId} 
              onNavigateToResolve={handleNavigateToResolve}
              onOpenExplorer={() => setCurrentTab('memory-explorer')}
            />
          )}

          {currentTab === 'memory-explorer' && (
            <MemoryExplorer />
          )}

          {currentTab === 'history' && (
            <IncidentHistory onSelectIncident={handleSelectIncidentDetail} />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage />
          )}

          {currentTab === 'postmortem' && (
            <Postmortem 
              selectedIncidentId={selectedIncidentId} 
              onDone={() => setCurrentTab('incidents')} 
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Declare Incident Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreatedIncident}
      />

      {/* Operational User Guide & Live Manual Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Account Activity History Modal */}
      <UserHistoryModal
        isOpen={isUserHistoryOpen}
        onClose={() => setIsUserHistoryOpen(false)}
        onSelectIncident={handleSelectIncidentDetail}
      />
    </div>
  );
}

export default App;
