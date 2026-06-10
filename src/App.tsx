import { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import FollowUpReport from './components/FollowUpReport';

interface Project {
  id: string;
  title: string;
  code: string;
  area: string;
  status: string;
  hasReport: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Implementación de Sistema de Gestión Documental',
    code: 'PRY-2026-001',
    area: 'Tecnología',
    status: 'PROPUESTA',
    hasReport: false
  },
  {
    id: '2',
    title: 'Modernización de Infraestructura de Red',
    code: 'PRY-2026-002',
    area: 'Infraestructura',
    status: 'PROPUESTA',
    hasReport: false
  },
  {
    id: '3',
    title: 'Capacitación en Nuevas Tecnologías',
    code: 'PRY-2026-003',
    area: 'Recursos Humanos',
    status: 'PROPUESTA',
    hasReport: true
  },
  {
    id: '4',
    title: 'Optimización de Procesos Administrativos',
    code: 'PRY-2026-004',
    area: 'Administración',
    status: 'PROPUESTA',
    hasReport: false
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'list' | 'report'>('list');

  if (currentView === 'report') {
    return <FollowUpReport onBack={() => setCurrentView('list')} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* Header */}
      <header className="bg-[#0A2540] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Ficha de Registro de Proyectos</h1>
        </div>
        <button className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <FileText size={20} />
          <span>Manual</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-[#E1E4E8] p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-[#1F2937] font-semibold text-base mb-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-600">Código: {project.code}</p>
                  <p className="text-sm text-gray-600">Área: {project.area}</p>
                </div>
                <span className="bg-[#E6F0FF] text-[#0056B3] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  {project.status}
                </span>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 mt-6">
                {!project.hasReport ? (
                  <button
                    onClick={() => setCurrentView('report')}
                    className="flex-1 bg-[#0056B3] text-white px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#004494] transition-colors"
                  >
                    Crear informe
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentView('report')}
                    className="flex-1 bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#E5E7EB] transition-colors"
                  >
                    Editar informe
                  </button>
                )}
                <button className="flex-1 bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#E5E7EB] transition-colors">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
