import { useState } from 'react';
import { FileText, FilePlus2, Lock } from 'lucide-react';
import type { Project } from '../data/projects';

const START_YEAR = 2024;
const CURRENT_YEAR = new Date().getFullYear();
// Genera el rango de años de forma dinámica: si ya es 2027, aparece 2027 aunque esté vacío.
const YEAR_OPTIONS = Array.from(
  { length: Math.max(CURRENT_YEAR - START_YEAR + 1, 1) },
  (_, i) => CURRENT_YEAR - i
);

interface ProjectListProps {
  projects: Project[];
  onStartReport: (id: string) => void;
  onModifyReport: (id: string) => void;
  onProposeProject: () => void;
}

export default function ProjectList({ projects, onStartReport, onModifyReport, onProposeProject }: ProjectListProps) {
  const [yearFilter, setYearFilter] = useState<'todos' | number>(CURRENT_YEAR);

  const byYear = (p: Project) => yearFilter === 'todos' || p.year === yearFilter;

  const asignados = projects.filter((p) => (p.status === 'asignado' || p.status === 'en-progreso') && byYear(p));
  const cierre = projects.filter((p) => (p.status === 'cierre' || p.status === 'finalizado') && byYear(p));

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <header className="bg-[#0A2540] px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-white text-xl font-bold">Ficha de Registro de Proyectos</h1>
          <p className="text-white/70 text-sm mt-0.5">Seleccione el formulario que requiere atención</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onProposeProject}
            className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <FilePlus2 size={18} />
            Proponer Proyecto de Vinculación
          </button>
          <button className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <FileText size={20} />
            <span>Manual</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Filtro por año ── */}
        <div className="flex items-center gap-3">
          <label className="text-[#344054] font-semibold text-sm">Filtrar por año:</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
            className="px-4 py-2 border border-[#D0D5DD] rounded-lg bg-white text-sm font-medium text-[#344054] focus:outline-none focus:ring-2 focus:ring-[#003366]"
          >
            <option value="todos">Todos los años</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* ── Proyectos asignados ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#0056B3]" />
            <h2 className="text-[#003366] text-lg font-bold uppercase tracking-wide">Proyectos asignados</h2>
            <span className="bg-[#E6F0FF] text-[#0056B3] text-xs font-bold px-2 py-0.5 rounded-full">{asignados.length}</span>
          </div>
          {asignados.length === 0 ? (
            <p className="text-sm text-[#6B7280]">Aún no se ha asignado ningún proyecto para el año seleccionado.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {asignados.map((project) => (
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
                    {project.status === 'asignado' ? (
                      <button
                        onClick={() => onStartReport(project.id)}
                        className="bg-[#0A2540] hover:bg-[#003366] text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors"
                      >
                        Iniciar informe
                      </button>
                    ) : (
                      <button
                        onClick={() => onModifyReport(project.id)}
                        className="bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors"
                      >
                        Modificar informe
                      </button>
                    )}
                    <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wide">
                      {project.status === 'asignado' ? 'PROPUESTA' : 'EN PROGRESO'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Separador */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t-2 border-dashed border-[#D0D5DD]" />
          <span className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest whitespace-nowrap">Cierre</span>
          <div className="flex-1 border-t-2 border-dashed border-[#D0D5DD]" />
        </div>

        {/* ── Cierre ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#6B7280]" />
            <h2 className="text-[#6B7280] text-lg font-bold uppercase tracking-wide">Cierre</h2>
            <span className="bg-[#F3F4F6] text-[#6B7280] text-xs font-bold px-2 py-0.5 rounded-full">{cierre.length}</span>
          </div>
          {cierre.length === 0 ? (
            <p className="text-sm text-[#6B7280]">Aún no hay proyectos en cierre o finalizados para el año seleccionado.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {cierre.map((project) => {
                const isFinalizado = project.status === 'finalizado';
                return (
                  <div
                    key={project.id}
                    className={`bg-white rounded-lg border p-6 shadow-sm ${isFinalizado ? 'border-[#E1E4E8] opacity-80' : 'border-[#FDE68A]'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-base mb-2 ${isFinalizado ? 'text-[#6B7280]' : 'text-[#1F2937]'}`}>{project.title}</h3>
                        <p className={`text-sm ${isFinalizado ? 'text-gray-400' : 'text-gray-500'}`}>Código: {project.code}</p>
                        <p className={`text-sm ${isFinalizado ? 'text-gray-400' : 'text-gray-500'}`}>Área: {project.area}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border flex items-center gap-1 ${
                          isFinalizado
                            ? 'bg-[#F3F4F6] text-[#6B7280] border-[#D0D5DD]'
                            : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                        }`}
                      >
                        {isFinalizado && <Lock size={12} />}
                        {isFinalizado ? 'FINALIZADO' : 'CIERRE'}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      {isFinalizado ? (
                        <button className="flex-1 bg-[#F3F4F6] text-[#6B7280] border border-[#D1D5DB] px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#E5E7EB] transition-colors">
                          Ver informe
                        </button>
                      ) : (
                        <button
                          onClick={() => onModifyReport(project.id)}
                          className="flex-1 bg-[#0056B3] text-white px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-[#004494] transition-colors"
                        >
                          Modificar informe
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
