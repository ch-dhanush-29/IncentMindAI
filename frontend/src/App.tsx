import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { IncidentList } from './pages/IncidentList';
import { InvestigationWorkspace } from './pages/InvestigationWorkspace';
import { MemoryExplorer } from './pages/MemoryExplorer';
import { Postmortem } from './pages/Postmortem';
import { SettingsPage } from './pages/SettingsPage';
import { CreateIncidentModal } from './components/CreateIncidentModal';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('investigation');
  };

  const handleCreatedIncident = (newId: string) => {
    setSelectedIncidentId(newId);
    setCurrentTab('investigation');
  };

  const handleNavigateToResolve = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('postmortem');
  };

  return (
    <div className="flex h-screen bg-background text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        hindsightConnected={true} 
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          openCreateModal={() => setIsCreateModalOpen(true)} 
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentTab === 'dashboard' && (
            <Dashboard onSelectIncident={handleSelectIncident} />
          )}

          {currentTab === 'incidents' && (
            <IncidentList 
              onSelectIncident={handleSelectIncident} 
              openCreateModal={() => setIsCreateModalOpen(true)} 
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

      {/* Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreatedIncident}
      />
    </div>
  );
}

export default App;
