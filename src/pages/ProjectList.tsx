import { FileText } from 'lucide-react';

interface AssignedProject {
  id: string;
  title: string;
  code: string;
  responsable: string;
}

interface ActiveProject {
  id: string;
  title: string;
  code: string;
  area: string;
}

interface FinalizedProject {
  id: string;
  title: string;
  code: string;
  area: string;
}

const assignedProjects: AssignedProject[] = [
  {
    id: '1',
    title: 'DISEÑO DE EXPERIENCIAS DE APRENDIZAJE STEAM (NIVEL TÉCNICO TECNOLÓGICO) CON ESTUDIANTES DE EDUCACIÓN MEDIA DEL DMQ - TICTECTALK',
    code: 'PSC-2026-PQ-082',
    responsable: 'NUNEZ MOSQUERA JOHANNA NATHALY',
  },
  {
    id: '2',
    title: 'FORTALECIMIENTO DE HABILIDADES SOCIOEMOCIONALES EN ADOLESCENTES',
    code: 'PSC-2026-PQ-091',
    responsable: 'GARCIA TORRES MARIO ALEJANDRO',
  },
];

const activeProjects: ActiveProject[] = [
  { id: '3', title: 'Implementación de Sistema de Gestión Documental', code: 'PRY-2026-001', area: 'Tecnología' },
  { id: '4', title: 'Modernización de Infraestructura de Red', code: 'PRY-2026-002', area: 'Infraestructura' },
];

const finalizedProjects: FinalizedProject[] = [
  { id: '5', title: 'Capacitación en Nuevas Tecnologías', code: 'PRY-2025-003', area: 'Recursos Humanos' },
  { id: '6', title: 'Programa de Alfabetización Digital', code: 'PRY-2025-007', area: 'Educación' },
];

interface ProjectListProps {
  onCreateReport: () => void;
  onEditReport: () => void;
}

export default function ProjectList({ onCreateReport, onEditReport }: ProjectListProps) {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <header className="bg-[#0A2540] px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-white text-xl font-bold">Ficha de Registro de Proyectos</h1>
          <p className="text-white/70 text-sm mt-0.5">Seleccione el formulario que requiere atención</p>
        </div>
        <button className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <FileText size={20} />
          <span>Manual</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Proyectos asignados ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#0056B3]" />
            <h2 className="text-[#003366] text-lg font-bold uppercase tracking-wide">Proyectos asignados</h2>
            <span className="bg-[#E6F0FF] text-[#0056B3] text-xs font-bold px-2 py-0.5 rounded-full">{assignedProjects.length}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {assignedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-[#C5D9F0] p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-3">
                  <h3 className="text-[#003366] font-bold text-sm leading-snug mb-2">{project.title}</h3>
                  <p className="text-[#0056B3] text-sm font-medium">{project.code}</p>
                  <p className="text-[#0056B3] text-sm">{project.responsable}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={onCreateReport}
                    className="bg-[#0A2540] hover:bg-[#003366] text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors"
                  >
                    Iniciar informe
                  </button>
                  <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wide">PROPUESTA</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Separador */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t-2 border-dashed border-[#D0D5DD]" />
          <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest whitespace-nowrap">En proceso</span>
          <div className="flex-1 border-t-2 border-dashed border-[#D0D5DD]" />
        </div>

        {/* ── Proyectos en curso ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#12B76A]" />
            <h2 className="text-[#003366] text-lg font-bold uppercase tracking-wide">Proyectos en curso</h2>
            <span className="bg-[#ECFDF3] text-[#12B76A] text-xs font-bold px-2 py-0.5 rounded-full border border-[#A6F4C5]">{activeProjects.length}</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-[#E1E4E8] p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-[#1F2937] font-semibold text-base mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-500">Código: {project.code}</p>
                    <p className="text-sm text-gray-500">Área: {project.area}</p>
                  </div>
                  <span className="bg-[#ECFDF3] text-[#12B76A] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border border-[#A6F4C5]">
                    EN CURSO
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={onEditReport}
                    className="flex-1 bg-[#0056B3] text-white px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#004494] transition-colors"
                  >
                    Modificar informe
                  </button>
                  <button className="flex-1 bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#E5E7EB] transition-colors">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Separador */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t-2 border-dashed border-[#D0D5DD]" />
          <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest whitespace-nowrap">Finalizados</span>
          <div className="flex-1 border-t-2 border-dashed border-[#D0D5DD]" />
        </div>

        {/* ── Proyectos finalizados ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#6B7280]" />
            <h2 className="text-[#6B7280] text-lg font-bold uppercase tracking-wide">Proyectos finalizados</h2>
            <span className="bg-[#F3F4F6] text-[#6B7280] text-xs font-bold px-2 py-0.5 rounded-full">{finalizedProjects.length}</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {finalizedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-[#E1E4E8] p-6 shadow-sm opacity-80"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-[#6B7280] font-semibold text-base mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400">Código: {project.code}</p>
                    <p className="text-sm text-gray-400">Área: {project.area}</p>
                  </div>
                  <span className="bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border border-[#D0D5DD]">
                    FINALIZADO
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-[#F3F4F6] text-[#6B7280] border border-[#D1D5DB] px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#E5E7EB] transition-colors">
                    Ver informe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
