import { useState, useRef, useEffect } from 'react';
import { Save, Send, Plus, Trash2, FileText, Search, X, ChevronDown } from 'lucide-react';

/* ───────── Tipos ───────── */
interface Participant {
  id: string;
  tipo: string;
  nacionalidad: string;
  horas: string;
  fechaInicio: string;
  fechaFin: string;
  tipoDoc: string;
  numeroDoc: string;
  nombres: string;
  carrera: string;
}

interface FollowUpReportProps {
  onBack?: () => void;
  onSave?: () => void;
  mode?: 'create' | 'edit';
}

type SiNo = 'si' | 'no';

/* ───────── Datos estáticos ───────── */
const GRUPOS_PRIORITARIOS = [
  'Adultos mayores',
  'Personas con discapacidad',
  'Niñez y adolescencia',
  'Mujeres gestantes',
  'Pueblos indígenas',
  'Personas en movilidad humana',
  'Víctimas de violencia',
  'Personas privadas de libertad',
  'Comunidad LGBTQ+',
  'Personas en situación de calle',
  'Grupos étnicos minoritarios',
];

const LINEAS_INVESTIGACION = [
  'Salud y bienestar',
  'Educación inclusiva',
  'Desarrollo sostenible',
  'Innovación social',
  'Derechos humanos',
  'Cultura y patrimonio',
];

const REDES_ACADEMICAS = [
  'Red de Vinculación con la Sociedad',
  'Red de Investigación Aplicada',
  'Red de Innovación Social',
  'Red de Cooperación Internacional',
];

const GRUPOS_INVESTIGACION = [
  'GI-Desarrollo Comunitario',
  'GI-Educación Popular',
  'GI-Salud Pública',
  'GI-Sostenibilidad Ambiental',
];

const SEDES_PUCE = [
  'Quito - Matriz',
  'Ibarra',
  'Santo Domingo',
  'Esmeraldas',
  'Ambato',
  'Manabí',
];

const CONVENIOS_INTERNACIONALES = [
  'Convenio Marco PUCE-UNESCO',
  'Convenio PUCE-OEI',
  'Convenio PUCE-AECID',
  'Convenio Erasmus+',
];

const PAISES = [
  'España', 'México', 'Colombia', 'Argentina', 'Chile',
  'Perú', 'Brasil', 'Alemania', 'Francia', 'Italia',
];

const PROGRAMAS_POSGRADO = [
  'Maestría en Gestión Social',
  'Maestría en Educación',
  'Maestría en Salud Pública',
  'Especialización en Derechos Humanos',
  'Diplomado en Desarrollo Comunitario',
];

const APORTES_OPCIONES = [
  'Materiales',
  'Infraestructura',
  'Hospedaje',
  'RREE (Relaciones Externas)',
  'Transporte',
  'Alimentación',
];

/* ───────── Componente: Combobox multiselección con búsqueda ───────── */
function GrupoSearchable({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = GRUPOS_PRIORITARIOS.filter(
    (g) => g.toLowerCase().includes(query.toLowerCase()) && !selected.includes(g)
  );

  const add = (val: string) => {
    if (selected.length < 3) {
      onChange([...selected, val]);
    }
    setQuery('');
  };

  const remove = (val: string) => onChange(selected.filter((s) => s !== val));

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#344054]" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar grupo de atención prioritaria..."
          className="w-full pl-10 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
        />
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054]" />
      </div>

      {open && (query || filtered.length > 0) && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {query && !GRUPOS_PRIORITARIOS.some((g) => g.toLowerCase() === query.toLowerCase()) && (
            <li
              className="px-4 py-2 text-sm text-[#003366] font-medium cursor-pointer hover:bg-[#F5F7FA]"
              onClick={() => add(query)}
            >
              + Agregar "{query}"
            </li>
          )}
          {filtered.map((g) => (
            <li
              key={g}
              className="px-4 py-2 text-sm text-[#344054] cursor-pointer hover:bg-[#F5F7FA]"
              onClick={() => add(g)}
            >
              {g}
            </li>
          ))}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((g) => (
            <span
              key={g}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#003366] text-white text-sm rounded-full"
            >
              {g}
              <button onClick={() => remove(g)} className="hover:bg-white/20 rounded-full p-0.5">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-[#344054] mt-1">Mínimo 1, máximo 3 — Seleccionados: {selected.length}/3</p>
    </div>
  );
}

/* ============================================================ */
/*  COMPONENTE PRINCIPAL                                         */
/* ============================================================ */
export default function FollowUpReport({ onBack, onSave, mode = 'create' }: FollowUpReportProps) {
  const [activeSection, setActiveSection] = useState('datos');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', tipo: '', nacionalidad: '', horas: '', fechaInicio: '', fechaFin: '', tipoDoc: '', numeroDoc: '', nombres: '', carrera: '' },
  ]);

  /* ── Sección 1: Articulación investigación ── */
  const [articulacionInv, setArticulacionInv] = useState<SiNo | null>(null);
  const [lineaInv, setLineaInv] = useState('');
  const [redAcademica, setRedAcademica] = useState('');
  const [grupoInv, setGrupoInv] = useState('');

  /* ── Sección 2: Grupos prioritarios ── */
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [hombres, setHombres] = useState<number>(0);
  const [mujeres, setMujeres] = useState<number>(0);
  const [totalReal, setTotalReal] = useState<number>(0);
  const totalEstimado = hombres + mujeres;

  /* ── Sección 3: Aporte al proyecto ── */
  const [aportes, setAportes] = useState<Record<string, boolean>>(
    Object.fromEntries(APORTES_OPCIONES.map((a) => [a, false]))
  );
  const aportesCount = Object.values(aportes).filter(Boolean).length;

  /* ── Sección 4: Componentes ── */
  const [interculturalidad, setInterculturalidad] = useState<SiNo | null>(null);
  const [interdisciplinariedad, setInterdisciplinariedad] = useState<SiNo | null>(null);
  const [intersedes, setIntersedes] = useState<SiNo | null>(null);
  const [sedePUCE, setSedePUCE] = useState('');
  const [carrerasIntersedes, setCarrerasIntersedes] = useState('');
  const [internacionalizacion, setInternacionalizacion] = useState<SiNo | null>(null);
  const [convenioInt, setConvenioInt] = useState('');
  const [instExtranjera, setInstExtranjera] = useState('');
  const [pais, setPais] = useState('');
  const [posgrados, setPosgrados] = useState<SiNo | null>(null);
  const [programaPosgrado, setProgramaPosgrado] = useState('');
  const [numEstPosgrado, setNumEstPosgrado] = useState<number>(0);
  const [coordPosgrado, setCoordPosgrado] = useState('');

  /* ── Tipo de informe ── */
  const [tipoInforme, setTipoInforme] = useState<'avance' | 'finalizacion' | null>(null);

  /* ── Sección 6: Articulación funciones sustantivas ── */
  const [articulacionF, setArticulacionF] = useState<SiNo | null>(null);
  const [lineaF, setLineaF] = useState('');
  const [redF, setRedF] = useState('');
  const [grupoF, setGrupoF] = useState('');

  /* ── Archivos adjuntos por sección ── */
  type SectionKey = 'alcance' | 'contraparte' | 'componentes' | 'estudiantes' | 'participantes' | 'firmas';
  const [sectionFiles, setSectionFiles] = useState<Record<SectionKey, { name: string; size: number }[]>>({
    alcance: [],
    contraparte: [],
    componentes: [],
    estudiantes: [],
    participantes: [],
    firmas: [],
  });

  const addFile = (section: SectionKey, file: File) => {
    setSectionFiles((prev) => ({
      ...prev,
      [section]: [...prev[section], { name: file.name, size: file.size }],
    }));
  };

  const removeFile = (section: SectionKey, index: number) => {
    setSectionFiles((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  /* Componente FileUpload inline */
  const FileUploadBtn = ({ section, label }: { section: SectionKey; label: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const files = sectionFiles[section];

    return (
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-[#F5F7FA] transition-colors"
          >
            <FileText size={16} /> {label}
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { addFile(section, f); }
              e.target.value = '';
            }}
          />
          {files.length > 0 && (
            <span className="text-xs text-[#12B76A] font-medium">{files.length} archivo(s) adjunto(s)</span>
          )}
        </div>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F5F7FA] border border-[#D0D5DD] rounded text-xs text-[#344054]">
                {f.name}
                <button onClick={() => removeFile(section, i)} className="text-red-500 hover:text-red-700">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sections = [
    { id: 'datos', icon: '📋', label: 'Datos' },
    { id: 'alcance', icon: '🎯', label: 'Alcance' },
    { id: 'contraparte', icon: '🏢', label: 'Contraparte' },
    { id: 'componentes', icon: '🔗', label: 'Comp.' },
    { id: 'diagnostico', icon: '🔍', label: 'Diagnóstico' },
    { id: 'estudiantes', icon: '👥', label: 'Est.' },
    { id: 'resultados', icon: '📊', label: 'Resultados' },
    { id: 'participantes', icon: '👤', label: 'Particip.' },
    { id: 'firmas', icon: '✍️', label: 'Firmas' },
    { id: 'anexos', icon: '📎', label: 'Anexos' },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addParticipant = () => {
    setParticipants([...participants, {
      id: Date.now().toString(),
      tipo: '', nacionalidad: '', horas: '', fechaInicio: '',
      fechaFin: '', tipoDoc: '', numeroDoc: '', nombres: '', carrera: '',
    }]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const RadioSiNo = ({ value, onChange, label }: { value: SiNo | null; onChange: (v: SiNo) => void; label?: string }) => (
    <div className="flex items-center gap-4">
      {label && <span className="text-sm text-[#344054] mr-2">{label}</span>}
      {(['si', 'no'] as SiNo[]).map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="w-4 h-4 text-[#003366] focus:ring-[#003366]"
          />
          <span className="text-sm text-[#344054]">{opt === 'si' ? 'Sí' : 'No'}</span>
        </label>
      ))}
    </div>
  );

  const SelectField = ({ label, value, onChange, options, placeholder, required }: {
    label: string; value: string; onChange: (v: string) => void;
    options: string[]; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label className="block text-[#344054] font-medium mb-2 text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white"
      >
        <option value="">{placeholder || `Seleccionar ${label.toLowerCase()}...`}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const InputField = ({ label, value, onChange, type, placeholder, required, className }: {
    label: string; value: string | number; onChange: (v: any) => void;
    type?: string; placeholder?: string; required?: boolean; className?: string;
  }) => (
    <div className={className}>
      <label className="block text-[#344054] font-medium mb-2 text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type || 'text'}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, rows, required, className, placeholder }: {
    label: string; value: string; onChange: (v: string) => void;
    rows?: number; required?: boolean; className?: string; placeholder?: string;
  }) => (
    <div className={className}>
      <label className="block text-[#344054] font-medium mb-2 text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 3}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] resize-none"
      />
    </div>
  );

  /* ═══════════════════════════════════════════════════ */
  /*  RENDER                                              */
  /* ═══════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col">
      {/* ─── HEADER ─── */}
      <header className="bg-[#003366] px-6 py-6 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center font-bold text-[#003366] text-xl">PUCE</div>
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">INFORMACIÓN PARCIAL DE SEGUIMIENTO</h1>
                <p className="text-white/90 text-lg">Proyectos de Servicio Comunitario</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <label className="text-white/80 text-sm mb-1">Código:</label>
              <input type="text" placeholder="XXXX-XXX" className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/50 w-40" />
            </div>
          </div>
        </div>
      </header>

      {/* ─── NAV ─── */}
      <nav className="bg-white border-b border-[#E1E4E8] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeSection === s.id ? 'bg-[#003366] text-white' : 'bg-[#F5F7FA] text-[#344054] hover:bg-[#E1E4E8]'
                }`}
              >
                <span>{s.icon}</span>
                <span className="text-sm">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── MAIN ─── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {/* ═══════════════ SECCIÓN 1 — DATOS GENERALES ═══════════════ */}
          <section id="datos" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">📋 DATOS GENERALES</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[#344054] font-medium mb-2 text-sm">Proyecto <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Estado <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                  <option value="">Seleccionar estado</option>
                  <option>En ejecución</option>
                  <option>Finalizado</option>
                  <option>Suspendido</option>
                </select>
              </div>

              {/* Tipo de informe — solo al editar */}
              {mode === 'edit' && (
                <div>
                  <label className="block text-[#344054] font-medium mb-3 text-sm">Tipo de informe <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    {([
                      { value: 'avance', icon: '📈', label: 'Avance' },
                      { value: 'finalizacion', icon: '✅', label: 'Finalización' },
                    ] as const).map(({ value, icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTipoInforme(value)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                          tipoInforme === value
                            ? 'border-[#003366] bg-[#003366] text-white'
                            : 'border-[#D0D5DD] bg-white text-[#344054] hover:border-[#003366]'
                        }`}
                      >
                        <span>{icon}</span> {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Unidad responsable <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Carrera <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Docente responsable <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Correo <span className="text-red-500">*</span></label>
                <input type="email" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Teléfono <span className="text-red-500">*</span></label>
                <input type="tel" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Año de ejecución <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Fecha de inicio <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Fecha de cierre <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Fecha del informe <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#344054] font-medium mb-2 text-sm">Programa</label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              {/* Articulación con investigación */}
              <div className="md:col-span-2 bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <label className="block text-[#344054] font-medium mb-3 text-sm">
                  ¿Articulación con investigación PUCE? <span className="text-red-500">*</span>
                </label>
                <RadioSiNo value={articulacionInv} onChange={setArticulacionInv} />
                {articulacionInv === 'si' && (
                  <div className="mt-4 grid md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[#D0D5DD]">
                    <SelectField label="Línea de investigación" value={lineaInv} onChange={setLineaInv} options={LINEAS_INVESTIGACION} required />
                    <SelectField label="Red académica articulada" value={redAcademica} onChange={setRedAcademica} options={REDES_ACADEMICAS} required />
                    <SelectField label="Grupo de investigación" value={grupoInv} onChange={setGrupoInv} options={GRUPOS_INVESTIGACION} required />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ═══════════════ SECCIÓN 2 — ALCANCE, GRUPOS PRIORITARIOS Y PRESUPUESTO ═══════════════ */}
          <section id="alcance" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">🎯 ALCANCE, GRUPOS PRIORITARIOS Y PRESUPUESTO</h2>
            <div className="space-y-6">
              <InputField label="Comunidad alcanzada" value="" onChange={() => {}} required />

              <div className="grid md:grid-cols-2 gap-6">
                <InputField label="Tipo de actores" value="" onChange={() => {}} required />
                <InputField label="Beneficiarios" value="" onChange={() => {}} required />
              </div>

              {/* Grupos de atención prioritaria */}
              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2 text-sm">🏷️ GRUPOS DE ATENCIÓN PRIORITARIA</h3>
                <GrupoSearchable selected={selectedGroups} onChange={setSelectedGroups} />
              </div>

              {/* N° personas atendidas */}
              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2 text-sm">👥 NÚMERO DE PERSONAS ATENDIDAS</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Hombres (Estim.) <span className="text-red-500">*</span></label>
                    <input type="number" min={0} value={hombres || ''} onChange={(e) => setHombres(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Mujeres (Estim.) <span className="text-red-500">*</span></label>
                    <input type="number" min={0} value={mujeres || ''} onChange={(e) => setMujeres(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Total Estimado</label>
                    <div className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg bg-gray-100 text-[#344054] font-semibold flex items-center h-[50px]">
                      {totalEstimado}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Total Real</label>
                    <input type="number" min={0} value={totalReal || ''} onChange={(e) => setTotalReal(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                </div>
              </div>

              <InputField label="Institución contraparte" value="" onChange={() => {}} />

              {/* Presupuesto */}
              <div className="bg-[#F5F7FA] rounded-lg p-6 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2">💰 PRESUPUESTO</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {['Planificado', 'Interno ejecutado', 'Externo asignado', 'Externo ejecutado', 'Gasto no contemplado'].map((label) => (
                    <div key={label}>
                      <label className="block text-[#344054] font-medium mb-2 text-sm">{label}</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[#344054]">$</span>
                        <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <FileUploadBtn section="alcance" label="📎 Adjuntar acta de entrega-recepción de productos" />
            </div>
          </section>

          {/* ═══════════════ SECCIÓN 3 — ORGANIZACIÓN CONTRAPARTE ═══════════════ */}
          <section id="contraparte" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">🏢 INFORMACIÓN GENERAL DE LA ORGANIZACIÓN O INSTITUCIÓN CONTRAPARTE DE LA PUCE</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField label="Nombre de la institución" value="" onChange={() => {}} required />
              </div>
              <InputField label="RUC" value="" onChange={() => {}} required />
              <InputField label="Teléfono" value="" onChange={() => {}} required />
              <div className="md:col-span-2">
                <InputField label="Dirección" value="" onChange={() => {}} required />
              </div>
              <div className="md:col-span-2">
                <InputField label="Representante legal" value="" onChange={() => {}} required />
              </div>
            </div>

            {/* Aporte al proyecto */}
            <div className="mt-6 bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
              <h3 className="text-[#003366] font-semibold mb-3 flex items-center gap-2 text-sm">📦 APORTE AL PROYECTO (mínimo 1 obligatorio)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {APORTES_OPCIONES.map((a) => (
                  <label key={a} className="flex items-center gap-3 p-3 border border-[#D0D5DD] rounded-lg bg-white hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={aportes[a]}
                      onChange={() => setAportes({ ...aportes, [a]: !aportes[a] })}
                      className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]"
                    />
                    <span className="text-[#344054] text-sm">{a}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {APORTES_OPCIONES.filter((a) => aportes[a]).map((a) => (
                  <span key={a} className="px-3 py-1.5 bg-[#003366] text-white text-sm rounded-full">{a}</span>
                ))}
              </div>
              <p className="text-xs text-[#344054] mt-2">Seleccionados: {aportesCount} {aportesCount === 0 && <span className="text-red-500">(mínimo 1 requerido)</span>}</p>
            </div>

            <FileUploadBtn section="contraparte" label="📎 Adjuntar convenio / carta de compromiso" />
          </section>

          {/* ═══════════════ SECCIÓN 4 — COMPONENTES ═══════════════ */}
          <section id="componentes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">🔗 COMPONENTES</h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 border border-[#D0D5DD] rounded-lg bg-[#F5F7FA]">
                <span className="text-sm font-medium text-[#344054] w-72">Componente de interculturalidad</span>
                <RadioSiNo value={interculturalidad} onChange={setInterculturalidad} />
              </div>

              <div className="flex items-center gap-4 p-4 border border-[#D0D5DD] rounded-lg bg-[#F5F7FA]">
                <span className="text-sm font-medium text-[#344054] w-72">Componente de interdisciplinariedad</span>
                <RadioSiNo value={interdisciplinariedad} onChange={setInterdisciplinariedad} />
              </div>

              {/* Intersedes */}
              <div className="p-4 border border-[#D0D5DD] rounded-lg bg-[#F5F7FA]">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#344054] w-72">Componente Intersedes</span>
                  <RadioSiNo value={intersedes} onChange={setIntersedes} />
                </div>
                {intersedes === 'si' && (
                  <div className="mt-4 grid md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-[#D0D5DD]">
                    <SelectField label="Sede PUCE participante" value={sedePUCE} onChange={setSedePUCE} options={SEDES_PUCE} required />
                    <InputField label="Carreras intersedes vinculadas" value={carrerasIntersedes} onChange={setCarrerasIntersedes} required />
                  </div>
                )}
              </div>

              {/* Internacionalización */}
              <div className="p-4 border border-[#D0D5DD] rounded-lg bg-[#F5F7FA]">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#344054] w-72">Componente de Internacionalización</span>
                  <RadioSiNo value={internacionalizacion} onChange={setInternacionalizacion} />
                </div>
                {internacionalizacion === 'si' && (
                  <div className="mt-4 grid md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[#D0D5DD]">
                    <SelectField label="Convenio internacional" value={convenioInt} onChange={setConvenioInt} options={CONVENIOS_INTERNACIONALES} required />
                    <InputField label="Institución extranjera" value={instExtranjera} onChange={setInstExtranjera} required />
                    <SelectField label="País" value={pais} onChange={setPais} options={PAISES} required />
                  </div>
                )}
              </div>

              {/* Posgrados */}
              <div className="p-4 border border-[#D0D5DD] rounded-lg bg-[#F5F7FA]">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#344054] w-72">Componente de Posgrados</span>
                  <RadioSiNo value={posgrados} onChange={setPosgrados} />
                </div>
                {posgrados === 'si' && (
                  <div className="mt-4 grid md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[#D0D5DD]">
                    <SelectField label="Programa de posgrado vinculado" value={programaPosgrado} onChange={setProgramaPosgrado} options={PROGRAMAS_POSGRADO} required />
                    <InputField label="N° estudiantes de posgrado" value={numEstPosgrado} onChange={setNumEstPosgrado} type="number" required />
                    <InputField label="Coordinador del posgrado" value={coordPosgrado} onChange={setCoordPosgrado} required />
                  </div>
                )}
              </div>
            </div>

            {internacionalizacion === 'si' && (
              <div className="mt-4">
                <FileUploadBtn section="componentes" label="📎 Adjuntar documento del convenio internacional" />
              </div>
            )}
          </section>

          {/* ═══════════════ SECCIÓN 5 — DIAGNÓSTICO, PROBLEMA Y ACTORES ═══════════════ */}
          <section id="diagnostico" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">🔍 DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS</h2>
            <div className="space-y-6">
              <TextAreaField label="Descripción del problema" value="" onChange={() => {}} rows={4} required />
              <TextAreaField label="Actores involucrados" value="" onChange={() => {}} rows={3} required />

              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2 text-sm">📊 VARIABLES CUANTITATIVAS (7)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="1. Población total afectada (personas)" value={0} onChange={() => {}} type="number" required />
                  <InputField label="2. N° de familias beneficiarias" value={0} onChange={() => {}} type="number" required />
                  <InputField label="3. Índice de pobreza NBI (%)" value={0} onChange={() => {}} type="number" required />
                  <InputField label="4. Tasa de desempleo local (%)" value={0} onChange={() => {}} type="number" required />
                  <InputField label="5. N° de organizaciones comunitarias" value={0} onChange={() => {}} type="number" required />
                  <InputField label="6. Cobertura de servicios básicos (%)" value={0} onChange={() => {}} type="number" required />
                  <InputField label="7. Tasa de escolaridad (%)" value={0} onChange={() => {}} type="number" required />
                </div>
              </div>

              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2 text-sm">📝 VARIABLES CUALITATIVAS (2)</h3>
                <div className="space-y-4">
                  <TextAreaField label="1. Percepción de la comunidad sobre la problemática" value="" onChange={() => {}} rows={3} required />
                  <TextAreaField label="2. Factores socio-culturales que inciden en el problema" value="" onChange={() => {}} rows={3} required />
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════ SECCIÓN 6 — ESTUDIANTES E IMPACTO ═══════════════ */}
          <section id="estudiantes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">👥 ESTUDIANTES E IMPACTO</h2>
            <div className="space-y-6">
              <InputField label="N° de estudiantes vinculados" value={0} onChange={() => {}} type="number" required />

              {/* Articulación de funciones sustantivas */}
              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <label className="block text-[#344054] font-medium mb-3 text-sm">Articulación de funciones sustantivas</label>
                <RadioSiNo value={articulacionF} onChange={setArticulacionF} />

                {articulacionF === 'si' && (
                  <div className="mt-4 grid md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[#D0D5DD]">
                    <SelectField label="Línea de investigación" value={lineaF} onChange={setLineaF} options={LINEAS_INVESTIGACION} required />
                    <SelectField label="Red académica articulada" value={redF} onChange={setRedF} options={REDES_ACADEMICAS} required />
                    <SelectField label="Grupo de investigación" value={grupoF} onChange={setGrupoF} options={GRUPOS_INVESTIGACION} required />
                  </div>
                )}
              </div>

              <TextAreaField label="Impactos del proyecto" value="" onChange={() => {}} rows={5} placeholder="Describa los impactos generados por el proyecto..." />

              <FileUploadBtn section="estudiantes" label="📎 Adjuntar reporte banner de estudiantes" />
            </div>
          </section>

          {/* ═══════════════ SECCIÓN 7 — MATRIZ DE RESULTADOS ═══════════════ */}
          <section id="resultados" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">📊 RESULTADOS DEL PROYECTO</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[30%]">Cadena de Resultados</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Indicadores</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Fuentes y Medios de Verificación</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Avance de la Actividad y Actores Participantes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'OBJETIVO GENERAL', extra: null },
                    { label: 'OBJETIVO ESPECÍFICO', extra: null },
                    { label: 'RESULTADOS', extra: null },
                    { label: 'ACTIVIDADES', extra: 'Ejecución' },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}>
                      <td className="border border-[#D0D5DD] px-4 py-3">
                        <div className="font-semibold text-[#003366] mb-2 text-sm">{row.label}</div>
                        <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                      </td>
                      <td className="border border-[#D0D5DD] px-4 py-3">
                        <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                      </td>
                      <td className="border border-[#D0D5DD] px-4 py-3">
                        <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                      </td>
                      <td className="border border-[#D0D5DD] px-4 py-3">
                        {row.extra && <div className="font-medium text-[#344054] mb-2 text-sm">{row.extra}</div>}
                        <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ═══════════════ SECCIÓN 8 — PARTICIPANTES ═══════════════ */}
          <section id="participantes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#003366] text-xl font-semibold flex items-center gap-2">👤 LISTA DE PARTICIPANTES</h2>
              <button onClick={addParticipant} className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002952] transition-colors">
                <Plus size={18} /> Agregar participante
              </button>
            </div>
            <p className="text-sm text-[#344054] mb-4">Docentes, Administrativos, Alumni</p>

            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="grid grid-cols-10 gap-2 mb-2 bg-[#003366] text-white p-3 rounded-t-lg">
                  <div className="text-sm font-semibold">Tipo</div>
                  <div className="text-sm font-semibold">Nacionalidad</div>
                  <div className="text-sm font-semibold">Horas</div>
                  <div className="text-sm font-semibold">Fecha inicio</div>
                  <div className="text-sm font-semibold">Fecha fin</div>
                  <div className="text-sm font-semibold">Tipo doc.</div>
                  <div className="text-sm font-semibold">N° doc.</div>
                  <div className="text-sm font-semibold col-span-2">Apellidos y nombres</div>
                  <div className="text-sm font-semibold">Acciones</div>
                </div>

                {participants.map((p, i) => (
                  <div key={p.id} className={`grid grid-cols-10 gap-2 p-3 border-b border-[#E1E4E8] ${i % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}`}>
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Tipo" />
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="País" />
                    <input type="number" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="0" />
                    <input type="date" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    <input type="date" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="CI/Pasap." />
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Número" />
                    <input type="text" className="col-span-2 px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Nombre completo" />
                    <button onClick={() => removeParticipant(p.id)} className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-[#344054] mt-3 flex items-center gap-1">💡 Deslizar horizontalmente para ver más columnas</p>

            <FileUploadBtn section="participantes" label="📎 Adjuntar listado firmado de participantes" />
          </section>

          {/* ═══════════════ SECCIÓN 9 — FIRMAS ═══════════════ */}
          <section id="firmas" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">✍️ FIRMAS</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'ELABORADO POR', subtitle: 'Docente Líder del Proyecto' },
                { title: 'REVISADO POR', subtitle: 'Decano de Unidad' },
                { title: 'APROBADO', subtitle: 'Dirección de Vinculación' },
              ].map((block) => (
                <div key={block.title} className="border border-[#D0D5DD] rounded-lg p-6">
                  <h3 className="font-semibold text-[#003366] mb-4">{block.title}</h3>
                  <p className="text-sm text-[#344054] mb-3">{block.subtitle}</p>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-3" placeholder="Nombre" />
                  <div>
                    <label className="block text-[#344054] text-sm mb-2">Fecha</label>
                    <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                </div>
              ))}
            </div>

            <FileUploadBtn section="firmas" label="📎 Adjuntar documento de firmas escaneado" />
          </section>

          {/* ═══════════════ SECCIÓN 10 — RESUMEN DE ANEXOS ═══════════════ */}
          <section id="anexos" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">📎 RESUMEN DE ANEXOS</h2>
            <p className="text-sm text-[#344054] mb-6">Verifique que todos los documentos requeridos hayan sido adjuntados en sus respectivas secciones.</p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Documento</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Sección asociada</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { doc: 'Acta de entrega-recepción de productos', section: 'alcance' as SectionKey, label: 'Alcance' },
                    { doc: 'Convenio / Carta de compromiso', section: 'contraparte' as SectionKey, label: 'Contraparte' },
                    ...(internacionalizacion === 'si'
                      ? [{ doc: 'Documento de convenio internacional', section: 'componentes' as SectionKey, label: 'Componentes' }]
                      : []),
                    { doc: 'Reporte banner de estudiantes', section: 'estudiantes' as SectionKey, label: 'Estudiantes' },
                    { doc: 'Listado firmado de participantes', section: 'participantes' as SectionKey, label: 'Participantes' },
                    { doc: 'Documento de firmas escaneado', section: 'firmas' as SectionKey, label: 'Firmas' },
                  ].map((row, i) => {
                    const hasFile = sectionFiles[row.section].length > 0;
                    return (
                      <tr key={row.doc} className={i % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}>
                        <td className="border border-[#D0D5DD] px-4 py-3 text-sm text-[#344054]">{row.doc}</td>
                        <td className="border border-[#D0D5DD] px-4 py-3 text-sm text-[#344054]">{row.label}</td>
                        <td className="border border-[#D0D5DD] px-4 py-3 text-center">
                          {hasFile ? (
                            <span className="inline-flex items-center gap-1 text-[#12B76A] font-medium text-sm">
                              ✅ Adjunto
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#D92D20] font-medium text-sm">
                              ⚠ Pendiente
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-[#F5F7FA] rounded-lg border border-[#D0D5DD]">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-[#003366]" />
                <div>
                  <p className="text-sm font-medium text-[#344054]">
                    Archivos adjuntos: {Object.values(sectionFiles).reduce((sum, files) => sum + files.length, 0)} en total
                  </p>
                  <p className="text-xs text-[#344054]/70">
                    {Object.values(sectionFiles).every((files) => files.length > 0)
                      ? '✅ Todos los documentos requeridos han sido adjuntados.'
                      : '⚠️ Faltan documentos por adjuntar en algunas secciones.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-[#E1E4E8] px-6 py-5 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={onBack} className="px-6 py-3 bg-white text-[#344054] border-2 border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#F5F7FA] transition-colors">
              Volver
            </button>
            <div className="flex gap-3">
              <button onClick={onSave} className="flex items-center gap-2 px-6 py-3 bg-[#F5F7FA] text-[#344054] border border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#E1E4E8] transition-colors">
                <Save size={20} /> Guardar borrador
              </button>
              <button onClick={onSave} className="flex items-center gap-2 px-6 py-3 bg-[#12B76A] text-white rounded-lg font-semibold hover:bg-[#0F9C5A] transition-colors">
                <Send size={20} /> Enviar informe
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-[#344054]/70 pt-4 border-t border-[#E1E4E8]">
            Pontificia Universidad Católica del Ecuador • Av. 12 de Octubre 1076 • Quito, Ecuador • {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>
      </footer>
    </div>
  );
}
