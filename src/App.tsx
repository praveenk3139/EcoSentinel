import React from 'react';
import { AppProvider, useApp } from './services/appState';
import { Sidebar } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';

// Views
import { CommandCenter } from './components/dashboard/CommandCenter';
import { LiveMonitoringView } from './components/views/LiveMonitoringView';
import { DevicesManagementView } from './components/views/DevicesManagementView';
import { EnvironmentalView } from './components/views/EnvironmentalView';
import { DiseaseRiskView } from './components/views/DiseaseRiskView';
import { PredictiveHotspotsView } from './components/views/PredictiveHotspotsView';
import { IssuesManagementView } from './components/views/IssuesManagementView';
import { TeamsAssignmentView } from './components/views/TeamsAssignmentView';
import { FieldWorkerTasksView } from './components/views/FieldWorkerTasksView';
import { ResolutionVerificationView } from './components/views/ResolutionVerificationView';
import { CitizenReportingView } from './components/views/CitizenReportingView';
import { AlertCenterView } from './components/views/AlertCenterView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsView } from './components/views/ReportsView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { TechnicalArchitectureView } from './components/views/TechnicalArchitectureView';
import { LandingPage } from './components/views/LandingPage';
import { AdminSettingsView } from './components/views/AdminSettingsView';
import { LoginPage } from './components/views/LoginPage';
import { ProblemLocalizationView } from './components/views/ProblemLocalizationView';

const MainContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  // Render Login Page first if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 font-sans text-slate-100 antialiased">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CommandCenter />;
      case 'live-map':
        return <LiveMonitoringView />;
      case 'devices':
        return <DevicesManagementView />;
      case 'localization':
        return <ProblemLocalizationView />;
      case 'environment':
        return <EnvironmentalView />;
      case 'disease-risk':
        return <DiseaseRiskView />;
      case 'hotspots':
        return <PredictiveHotspotsView />;
      case 'issues':
        return <IssuesManagementView />;
      case 'teams':
        return <TeamsAssignmentView />;
      case 'field-tasks':
        return <FieldWorkerTasksView />;
      case 'verification':
        return <ResolutionVerificationView />;
      case 'citizen-report':
        return <CitizenReportingView />;
      case 'alerts':
        return <AlertCenterView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'digital-twin':
        return <DigitalTwinView />;
      case 'technical-architecture':
        return <TechnicalArchitectureView />;
      case 'landing':
        return <LandingPage />;
      case 'admin':
        return <AdminSettingsView />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Control Bar with Quick Scenario Simulators */}
        <Topbar />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative">
          {renderView()}
        </main>
      </div>

      {/* Global Notifications & Auth Modal */}
      <ToastContainer />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
