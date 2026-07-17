import { useEffect, useState } from 'react';
import ProjectList from './pages/ProjectList';
import WelcomeScreen from './pages/WelcomeScreen';
import FollowUpReport from './pages/FollowUpReport';
import NewProjectProposal from './pages/NewProjectProposal';
import { initialProjects, type Project } from './data/projects';
import { createProject, getProjects, updateProjectStatus } from './services/sharepointService';

type AppView = 'list' | 'welcome' | 'report' | 'propose';
type ReportMode = 'create' | 'edit';

const STORAGE_KEY = 'divi-projects-v1';

const readStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return initialProjects;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProjects;
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : initialProjects;
  } catch {
    return initialProjects;
  }
};

const persistProjects = (projects: Project[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
};

export default function App() {
  const [view, setView] = useState<AppView>('list');
  const [reportMode, setReportMode] = useState<ReportMode>('create');
  const [projects, setProjects] = useState<Project[]>(() => readStoredProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    persistProjects(projects);
  }, [projects]);

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        setDataError(null);
        const sharePointProjects = await getProjects();
        if (active) {
          setProjects(sharePointProjects);
          persistProjects(sharePointProjects);
        }
      } catch (error) {
        if (active) {
          const storedProjects = readStoredProjects();
          if (storedProjects.length > 0) {
            setProjects(storedProjects);
          }
          setDataError(error instanceof Error ? error.message : 'No se pudieron cargar los proyectos.');
        }
      }
    };

    void loadProjects();
    return () => { active = false; };
  }, []);

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

  const handleReportSave = async (tipoInforme: 'avance' | 'cierre' | null) => {
    if (!activeProjectId) return;

    const nextStatus = reportMode === 'create' || tipoInforme !== 'cierre'
      ? 'en-progreso'
      : 'cierre';

    try {
      setDataError(null);
      const updatedProject = await updateProjectStatus(activeProjectId, nextStatus);
      setProjects((prev) => prev.map((project) => (
        project.id === updatedProject.id ? updatedProject : project
      )));
      setActiveProjectId(null);
      setView('list');
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'No se pudo guardar el informe.');
    }
  };

  const handleProposalSave = async (
    formData: Record<string, unknown>,
    mode: 'draft' | 'submitted',
  ) => {
    const optimisticProject: Project = {
      id: `temp-${Date.now()}`,
      title: String(formData.nombreProyecto ?? 'Proyecto sin nombre'),
      code: String(formData.codigoProyecto ?? ''),
      responsable: String(formData.coordinadorResponsable ?? ''),
      area: String(formData.unidadResponsable ?? ''),
      year: new Date().getFullYear(),
      status: 'asignado',
    };

    setProjects((prev) => [optimisticProject, ...prev]);
    setView('list');

    try {
      const project = await createProject({
        title: optimisticProject.title,
        code: optimisticProject.code,
        responsable: optimisticProject.responsable,
        email: String(formData.correoCoordinador ?? ''),
        unidadResponsable: String(formData.unidadResponsable ?? ''),
        status: 'asignado',
        formData: { ...formData, saveMode: mode },
      });

      setProjects((prev) => [project, ...prev.filter((item) => item.id !== optimisticProject.id)]);
      setDataError(null);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'No se pudo guardar la propuesta en SharePoint.');
    }
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
        onSave={handleProposalSave}
      />
    );
  }

  return (
    <>
      {dataError && (
        <div className="bg-amber-50 px-6 py-3 text-sm text-amber-900">
          {dataError}
        </div>
      )}
      <ProjectList
        projects={projects}
        onStartReport={startReport}
        onModifyReport={modifyReport}
        onProposeProject={() => setView('propose')}
      />
    </>
  );
}
