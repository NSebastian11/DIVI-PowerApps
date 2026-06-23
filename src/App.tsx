import { useState } from 'react';
import ProjectList from './pages/ProjectList';
import WelcomeScreen from './pages/WelcomeScreen';
import FollowUpReport from './pages/FollowUpReport';
import NewProjectProposal from './pages/NewProjectProposal';
import { initialProjects, type Project } from './data/projects';

type AppView = 'list' | 'welcome' | 'report' | 'propose';
type ReportMode = 'create' | 'edit';

export default function App() {
  const [view, setView] = useState<AppView>('list');
  const [reportMode, setReportMode] = useState<ReportMode>('create');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const startReport = (id: string) => {
    setActiveProjectId(id);
    setReportMode('create');
    setView('welcome');
  };

  const modifyReport = (id: string) => {
    setActiveProjectId(id);
    setReportMode('edit');
    setView('welcome');
  };

  const handleReportSave = (tipoInforme: 'avance' | 'cierre' | null) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        if (reportMode === 'create') return { ...p, status: 'en-progreso' };
        if (tipoInforme === 'cierre') return { ...p, status: 'cierre' };
        return { ...p, status: 'en-progreso' };
      })
    );
    setActiveProjectId(null);
    setView('list');
  };

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
        onBack={() => (reportMode === 'create' ? setView('welcome') : setView('list'))}
        onSave={handleReportSave}
      />
    );
  }

  if (view === 'propose') {
    return (
      <NewProjectProposal
        onBack={() => setView('list')}
        onSave={() => setView('list')}
      />
    );
  }

  return (
    <ProjectList
      projects={projects}
      onStartReport={startReport}
      onModifyReport={modifyReport}
      onProposeProject={() => setView('propose')}
    />
  );
}
