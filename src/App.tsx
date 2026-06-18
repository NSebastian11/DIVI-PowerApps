import { useState } from 'react';
import ProjectList from './pages/ProjectList';
import WelcomeScreen from './pages/WelcomeScreen';
import FollowUpReport from './pages/FollowUpReport';

type AppView = 'list' | 'welcome' | 'report';
type ReportMode = 'create' | 'edit';

export default function App() {
  const [view, setView] = useState<AppView>('list');
  const [reportMode, setReportMode] = useState<ReportMode>('create');

  if (view === 'welcome') {
    return (
      <WelcomeScreen
        subtitle="Informe de Proyectos de Servicio Comunitario"
        onBack={() => setView('list')}
        onNext={() => setView('report')}
      />
    );
  }

  if (view === 'report') {
    return (
      <FollowUpReport
        mode={reportMode}
        onBack={() => reportMode === 'create' ? setView('welcome') : setView('list')}
        onSave={() => setView('list')}
      />
    );
  }

  return (
    <ProjectList
      onCreateReport={() => { setReportMode('create'); setView('welcome'); }}
      onEditReport={() => { setReportMode('edit'); setView('welcome'); }}
    />
  );
}
