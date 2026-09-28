import { useState } from 'react';
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
import { CreateIncidentModal } from './components/CreateIncidentModal';

export function App() {
  const [currentTab, setCurrentTab] = useState('landing');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-[#F5F7FB] text-[#172033] overflow-hidden font-sans">
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
        />
      </div>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          openCreateModal={() => setIsCreateModalOpen(true)} 
          currentTab={currentTab}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigateLanding={() => setCurrentTab('landing')}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentTab === 'dashboard' && (
            <Dashboard 
              onSelectIncident={handleSelectIncidentDetail} 
              onStartInvestigation={handleStartInvestigation}
            />
          )}

          {currentTab === 'incidents' && (
            <IncidentList 
              onSelectIncident={handleSelectIncidentDetail} 
              openCreateModal={() => setIsCreateModalOpen(true)} 
            />
          )}

          {currentTab === 'incident-detail' && selectedIncidentId && (
            <IncidentDetail
              incidentId={selectedIncidentId}
              onBack={() => setCurrentTab('incidents')}
              onStartInvestigation={handleStartInvestigation}
              onNavigateToResolve={handleNavigateToResolve}
            />
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
    </div>
  );
}

export default App;
