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
  firma: string;
}

interface StudentRow {
  id: string;
  semestre: string;
  hombres: number;
  mujeres: number;
}

interface PresupuestoRow {
  id: string;
  cuenta: string;
  monto: number;
}

type EstadoPresupuestario = 'estimado' | 'avance' | 'final';

interface Contraparte {
  id: string;
  nombre: string;
  ruc: string;
  telefono: string;
  direccion: string;
  representanteLegal: string;
  aportes: Record<string, boolean>;
}

interface MarcoLogicoRow {
  id: string;
  label: string;
  type: 'fin' | 'proposito' | 'resultado' | 'actividad';
  cadena: string;
  indicadores: string;
  fuentes: string;
  supuestos: string;
  responsable: string;
}

interface FollowUpNotification {
  id: string;
  mensaje: string;
  fecha: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
  leido: boolean;
}

interface FollowUpReportProps {
  onBack?: () => void;
  onSave?: (tipoInforme: 'avance' | 'cierre' | null) => void;
  mode?: 'create' | 'edit';
  isDivi?: boolean;
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

const COORDINADORES_POSGRADO = [
  'Dr. Carlos Andrade',
  'Dra. María Fernanda López',
  'Dr. Juan Pablo Ruiz',
  'Dra. Ana María Torres',
  'Dr. Pedro González',
  'Dra. Carmen Vásquez',
  'Dr. Fernando Mera',
  'Dra. Lucía Paredes',
];

const APORTES_OPCIONES = [
  'Materiales',
  'Infraestructura',
  'Hospedaje',
  'RREE (Relaciones Externas)',
  'Transporte',
  'Alimentación',
];

const UNIDADES_PUCE = [
  'Facultad de Ingeniería',
  'Facultad de Medicina',
  'Facultad de Arquitectura, Diseño y Artes',
  'Facultad de Ciencias Administrativas y Contables',
  'Facultad de Ciencias Humanas',
  'Facultad de Ciencias Exactas y Naturales',
  'Facultad de Comunicación, Lingüística y Literatura',
  'Facultad de Economía',
  'Facultad de Enfermería',
  'Facultad de Jurisprudencia',
  'Facultad de Psicología',
  'Facultad de Ciencias de la Educación',
  'Facultad de Ciencias Filosófico-Teológicas',
];

const CUENTAS_CONTABLES = [
  '530101 - Sueldos y Salarios',
  '530102 - Honorarios Profesionales',
  '530201 - Materiales de Oficina',
  '530202 - Insumos Didácticos',
  '530203 - Materiales de Construcción',
  '530301 - Transporte y Movilización',
  '530401 - Alimentación',
  '530402 - Hospedaje',
  '530501 - Servicios Básicos',
  '530502 - Arrendamientos',
  '530601 - Equipamiento',
  '530602 - Infraestructura',
  '530701 - Difusión y Publicaciones',
  '530702 - Capacitación',
  '530801 - Gastos Administrativos',
  '530802 - Imprevistos',
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
export default function FollowUpReport({ onBack, onSave, mode = 'create', isDivi = false }: FollowUpReportProps) {
  const [activeSection, setActiveSection] = useState(isDivi ? 'notificaciones' : 'datos');
  const [codigoProyecto, setCodigoProyecto] = useState('');
  const [formErrors] = useState<Record<string, string>>({});

  const getError = (field: string) => formErrors[field];

  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', tipo: '', nacionalidad: '', horas: '', fechaInicio: '', fechaFin: '', tipoDoc: '', numeroDoc: '', nombres: '', carrera: '', firma: '' },
  ]);

  const TIPOS_PARTICIPANTE = ['Docente', 'Administrativo', 'Alumni', 'Estudiante'] as const;
  const [activeParticipantTab, setActiveParticipantTab] = useState<string>('todos');

  /* ── Marco Lógico ── */
  const createMlRows = (): MarcoLogicoRow[] => [
    { id: 'fin', label: 'FIN', type: 'fin', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'proposito', label: 'PROPÓSITO', type: 'proposito', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'r1', label: 'R1', type: 'resultado', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'a1r1', label: 'A1R1', type: 'actividad', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'r2', label: 'R2', type: 'resultado', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'a1r2', label: 'A1R2', type: 'actividad', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'r3', label: 'R3', type: 'resultado', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'a1r3', label: 'A1R3', type: 'actividad', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'r4', label: 'R4', type: 'resultado', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
    { id: 'a1r4', label: 'A1R4', type: 'actividad', cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '' },
  ];
  const [marcoLogicoRows, setMarcoLogicoRows] = useState<MarcoLogicoRow[]>(createMlRows);

  const addMlRow = (afterId: string, type: 'resultado' | 'actividad') => {
    const idx = marcoLogicoRows.findIndex(r => r.id === afterId);
    const nextR = marcoLogicoRows.filter(r => r.type === 'resultado').length + 1;
    const nextA = marcoLogicoRows.filter(r => r.type === 'actividad').length + 1;
    const newRow: MarcoLogicoRow = {
      id: Date.now().toString(),
      label: type === 'resultado' ? `R${nextR}` : `A1R${nextA}`,
      type,
      cadena: '', indicadores: '', fuentes: '', supuestos: '', responsable: '',
    };
    const copy = [...marcoLogicoRows];
    copy.splice(idx + 1, 0, newRow);
    setMarcoLogicoRows(copy);
  };
  const updateMlRow = (id: string, field: keyof Omit<MarcoLogicoRow, 'id' | 'label' | 'type'>, value: string) => {
    setMarcoLogicoRows(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  const removeMlRow = (id: string) => setMarcoLogicoRows(rows => rows.filter(r => r.id !== id));

  /* ── Notificaciones DIVI ── */
  const [notifications] = useState<FollowUpNotification[]>([
    { id: 'n1', mensaje: 'El proyecto requiere adjuntar el convenio internacional antes de la revisión.', fecha: '2026-07-10', tipo: 'warning', leido: false },
    { id: 'n2', mensaje: 'La sección de presupuesto tiene montos inconsistentes. Revise los totales.', fecha: '2026-07-09', tipo: 'error', leido: false },
    { id: 'n3', mensaje: 'El informe ha sido guardado como borrador correctamente.', fecha: '2026-07-08', tipo: 'success', leido: true },
  ]);

  /* ── Variables DIVI ── */
  const [diviObservaciones, setDiviObservaciones] = useState('');
  const [diviEstado, setDiviEstado] = useState<'pendiente' | 'aprobado' | 'rechazado'>('pendiente');
  const [diviFechaRevision, setDiviFechaRevision] = useState('');

  /* ── Sección 2: Grupos prioritarios ── */
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [hombres, setHombres] = useState<number>(0);
  const [mujeres, setMujeres] = useState<number>(0);
  const [totalReal, setTotalReal] = useState<number>(0);
  const totalEstimado = hombres + mujeres;

  /* ── Sección 2b: Presupuesto ── */
  const [estadoPresupuestario, setEstadoPresupuestario] = useState<EstadoPresupuestario>('estimado');
  const [presupuestoEstimado, setPresupuestoEstimado] = useState<PresupuestoRow[]>([
    { id: 'e1', cuenta: '', monto: 0 },
  ]);
  const [presupuestoAvance, setPresupuestoAvance] = useState<PresupuestoRow[]>([
    { id: 'a1', cuenta: '', monto: 0 },
  ]);
  const [presupuestoFinal, setPresupuestoFinal] = useState<PresupuestoRow[]>([
    { id: 'f1', cuenta: '', monto: 0 },
  ]);

  const totalEstimadoPresup = presupuestoEstimado.reduce((sum, r) => sum + (r.monto || 0), 0);
  const totalAvancePresup = presupuestoAvance.reduce((sum, r) => sum + (r.monto || 0), 0);
  const totalFinalPresup = presupuestoFinal.reduce((sum, r) => sum + (r.monto || 0), 0);

  const addCuentaEstimado = () => setPresupuestoEstimado([...presupuestoEstimado, { id: Date.now().toString(), cuenta: '', monto: 0 }]);
  const removeCuentaEstimado = (id: string) => setPresupuestoEstimado(presupuestoEstimado.filter((r) => r.id !== id));
  const updateCuentaEstimado = (id: string, field: 'cuenta' | 'monto', value: string | number) => {
    setPresupuestoEstimado(presupuestoEstimado.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const addCuentaAvance = () => setPresupuestoAvance([...presupuestoAvance, { id: Date.now().toString(), cuenta: '', monto: 0 }]);
  const removeCuentaAvance = (id: string) => setPresupuestoAvance(presupuestoAvance.filter((r) => r.id !== id));
  const updateCuentaAvance = (id: string, field: 'cuenta' | 'monto', value: string | number) => {
    setPresupuestoAvance(presupuestoAvance.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const addCuentaFinal = () => setPresupuestoFinal([...presupuestoFinal, { id: Date.now().toString(), cuenta: '', monto: 0 }]);
  const removeCuentaFinal = (id: string) => setPresupuestoFinal(presupuestoFinal.filter((r) => r.id !== id));
  const updateCuentaFinal = (id: string, field: 'cuenta' | 'monto', value: string | number) => {
    setPresupuestoFinal(presupuestoFinal.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  /* ── Sección 3b: Contrapartes dinámicas ── */
  const [contrapartes, setContrapartes] = useState<Contraparte[]>([
    { id: 'c1', nombre: '', ruc: '', telefono: '', direccion: '', representanteLegal: '', aportes: Object.fromEntries(APORTES_OPCIONES.map((a) => [a, false])) },
  ]);

  const addContraparte = () => {
    setContrapartes([...contrapartes, {
      id: Date.now().toString(),
      nombre: '', ruc: '', telefono: '', direccion: '', representanteLegal: '',
      aportes: Object.fromEntries(APORTES_OPCIONES.map((a) => [a, false])),
    }]);
  };

  const removeContraparte = (id: string) => setContrapartes(contrapartes.filter((c) => c.id !== id));

  const updateContraparte = (id: string, field: keyof Omit<Contraparte, 'aportes'>, value: string) => {
    setContrapartes(contrapartes.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const toggleAporteContraparte = (id: string, aporte: string) => {
    setContrapartes(contrapartes.map((c) => c.id === id ? {
      ...c,
      aportes: { ...c.aportes, [aporte]: !c.aportes[aporte] },
    } : c));
  };

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
  const [tipoInforme, setTipoInforme] = useState<'avance' | 'cierre' | null>(null);

  /* ── Sección 6: Articulación funciones sustantivas ── */
  const [articulacionF, setArticulacionF] = useState<SiNo | null>(null);
  const [lineaF, setLineaF] = useState('');
  const [redF, setRedF] = useState('');
  const [grupoF, setGrupoF] = useState('');

  /* ── Sección 6b: Estudiantes por semestre ── */
  const [studentRows, setStudentRows] = useState<StudentRow[]>([
    { id: 's1', semestre: '', hombres: 0, mujeres: 0 },
  ]);

  const addStudentRow = () => {
    setStudentRows([...studentRows, { id: Date.now().toString(), semestre: '', hombres: 0, mujeres: 0 }]);
  };
  const removeStudentRow = (id: string) => setStudentRows(studentRows.filter((r) => r.id !== id));
  const updateStudentRow = (id: string, field: keyof StudentRow, value: string | number) => {
    setStudentRows(studentRows.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };
  const totalEstudiantesVinculados = studentRows.reduce((sum, r) => sum + (r.hombres || 0) + (r.mujeres || 0), 0);

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

  const baseSections = [
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

  const diviSections = isDivi ? [
    { id: 'notificaciones', icon: '🔔', label: 'Notif.' },
    { id: 'divi-variables', icon: '🏛️', label: 'DIVI' },
  ] : [];

  const sections = [...diviSections, ...baseSections];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addParticipant = (tipo?: string) => {
    const defaultTipo = tipo || (activeParticipantTab !== 'todos' ? activeParticipantTab : 'Docente');
    setParticipants([...participants, {
      id: Date.now().toString(),
      tipo: defaultTipo, nacionalidad: '', horas: '', fechaInicio: '',
      fechaFin: '', tipoDoc: '', numeroDoc: '', nombres: '', carrera: '', firma: '',
    }]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const updateParticipant = (id: string, field: keyof Omit<Participant, 'id'>, value: string) => {
    setParticipants(participants.map((p) => p.id === id ? { ...p, [field]: value } : p));
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

  const ComboboxField = ({ label, value, onChange, options, placeholder, required }: {
    label: string; value: string; onChange: (v: string) => void;
    options: string[]; placeholder?: string; required?: boolean;
  }) => {
    const listId = `list-${label.replace(/\s+/g, '-').toLowerCase()}`;
    return (
      <div>
        <label className="block text-[#344054] font-medium mb-2 text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Escribir o seleccionar ${label.toLowerCase()}...`}
          list={listId}
          className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
        />
        <datalist id={listId}>
          {options.map((o) => <option key={o} value={o} />)}
        </datalist>
      </div>
    );
  };

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
                <h1 className="text-white text-2xl font-bold mb-1">INFORME PARCIAL DE SEGUIMIENTO</h1>
                <p className="text-white/90 text-lg">Proyectos de Servicio Comunitario</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <label className="text-white/80 text-sm mb-1">Código:</label>
              <input type="text" value={codigoProyecto} onChange={(e) => setCodigoProyecto(e.target.value)} placeholder="XXXX-XXX"
                className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/50 w-40" />
              {getError('codigo') && <p className="text-xs text-[#FF9B9B] mt-1">{getError('codigo')}</p>}
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

          {/* ═══════════════ NOTIFICACIONES — solo visible para DIVI, al inicio ═══════════════ */}
          {isDivi && notifications.length > 0 && (
            <section id="notificaciones" className="bg-white rounded-lg border border-[#FFD9A0] p-6 shadow-sm">
              <h2 className="text-[#003366] text-xl font-semibold mb-4 flex items-center gap-2">🔔 NOTIFICACIONES</h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      n.tipo === 'error' ? 'bg-red-50 border-red-200' :
                      n.tipo === 'warning' ? 'bg-amber-50 border-amber-200' :
                      n.tipo === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">
                      {n.tipo === 'error' ? '❌' : n.tipo === 'warning' ? '⚠️' : n.tipo === 'success' ? '✅' : 'ℹ️'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-[#344054]">{n.mensaje}</p>
                      <p className="text-xs text-[#6B7280] mt-1">{n.fecha}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${n.leido ? 'bg-gray-200 text-gray-600' : 'bg-[#003366] text-white'}`}>
                      {n.leido ? 'Leído' : 'Nuevo'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ═══════════════ VARIABLES DIVI — solo visible para DIVI ═══════════════ */}
          {isDivi && (
            <section id="divi-variables" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
              <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">🏛️ VARIABLES DIVI</h2>
              <div className="space-y-6">
                <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                  <label className="block text-[#344054] font-medium mb-2 text-sm">Estado de revisión DIVI</label>
                  <div className="flex gap-3">
                    {([
                      { value: 'pendiente' as const, label: 'Pendiente', color: 'bg-amber-500' },
                      { value: 'aprobado' as const, label: 'Aprobado', color: 'bg-green-500' },
                      { value: 'rechazado' as const, label: 'Rechazado', color: 'bg-red-500' },
                    ]).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDiviEstado(opt.value)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold text-sm transition-colors ${
                          diviEstado === opt.value
                            ? `${opt.color} text-white border-transparent`
                            : 'border-[#D0D5DD] bg-white text-[#344054] hover:border-[#003366]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <TextAreaField label="Observaciones DIVI" value={diviObservaciones} onChange={setDiviObservaciones} rows={4} placeholder="Observaciones de la Dirección de Vinculación..." />
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Fecha de revisión DIVI</label>
                    <input type="date" value={diviFechaRevision} onChange={(e) => setDiviFechaRevision(e.target.value)}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════ TIPO DE INFORME — al inicio del documento, solo al editar ═══════════════ */}
          {mode === 'edit' && (
            <section className="bg-[#003366] rounded-lg p-6 shadow-sm">
              <label className="block text-white font-semibold mb-3 text-sm">Tipo de informe <span className="text-red-300">*</span></label>
              <div className="flex gap-3 max-w-md">
                {([
                  { value: 'avance', icon: '📈', label: 'Avance' },
                  { value: 'cierre', icon: '✅', label: 'Cierre' },
                ] as const).map(({ value, icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTipoInforme(value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                      tipoInforme === value
                        ? 'border-white bg-white text-[#003366]'
                        : 'border-white/40 bg-transparent text-white hover:border-white'
                    }`}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </div>
            </section>
          )}

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
                  <option>Cierre</option>
                  <option>Suspendido</option>
                </select>
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Unidad responsable <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                  <option value="">Seleccionar unidad...</option>
                  {UNIDADES_PUCE.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
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
                <input type="email" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="correo@ejemplo.com" />
                {getError('correo') && <p className="text-xs text-[#D92D20] mt-1">{getError('correo')}</p>}
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">Teléfono <span className="text-red-500">*</span></label>
                <input type="tel" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="0999999999" />
                {getError('telefono') && <p className="text-xs text-[#D92D20] mt-1">{getError('telefono')}</p>}
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
                <InputField label="Programa" value="" onChange={() => {}} placeholder="Describa el programa..." />
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

              <InputField label="Beneficiarios directos" value="" onChange={() => {}} required placeholder="Describa los beneficiarios..." />

              {/* Presupuesto — Sistema de 3 estados */}
              <div className="bg-[#F5F7FA] rounded-lg p-6 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2">💰 PRESUPUESTO</h3>
                <p className="text-xs text-[#344054] mb-4">* = Campos obligatorios. Seleccione Avance o Final para habilitar edición.</p>

                {/* Selector de estado presupuestario */}
                <div className="mb-6">
                  <label className="block text-[#344054] font-medium mb-3 text-sm">Estado presupuestario:</label>
                  <div className="flex gap-3">
                    {([
                      { value: 'estimado' as EstadoPresupuestario, icon: '📋', label: 'Estimado' },
                      { value: 'avance' as EstadoPresupuestario, icon: '📈', label: 'Avance' },
                      { value: 'final' as EstadoPresupuestario, icon: '✅', label: 'Final' },
                    ]).map(({ value, icon, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setEstadoPresupuestario(value)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                          estadoPresupuestario === value
                            ? 'border-[#003366] bg-[#003366] text-white'
                            : value === 'estimado'
                              ? 'border-[#003366] bg-white text-[#003366]'
                              : 'border-[#D0D5DD] bg-white text-[#344054] hover:border-[#003366] opacity-60'
                        }`}
                      >
                        <span>{icon}</span> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Columnas de presupuesto */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Columna: Estimado (siempre activo) */}
                  <div className="bg-white rounded-lg border border-[#D0D5DD] p-4">
                    <h4 className="text-[#003366] font-semibold text-sm mb-3 flex items-center gap-1">📋 ESTIMADO</h4>
                    <p className="text-xs text-[#344054] mb-3">Siempre activo</p>
                    {presupuestoEstimado.map((row) => (
                      <div key={row.id} className="flex gap-2 mb-3">
                        <div className="flex-1">
                          <select
                            value={row.cuenta}
                            onChange={(e) => updateCuentaEstimado(row.id, 'cuenta', e.target.value)}
                            className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                          >
                            <option value="">▼ Cuenta contable</option>
                            {CUENTAS_CONTABLES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="w-32 relative">
                          <span className="absolute left-3 top-2 text-[#344054] text-sm">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            value={row.monto || ''}
                            onChange={(e) => updateCuentaEstimado(row.id, 'monto', Number(e.target.value))}
                            className="w-full pl-7 pr-2 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        {presupuestoEstimado.length > 1 && (
                          <button onClick={() => removeCuentaEstimado(row.id)} className="text-red-500 hover:bg-red-50 rounded p-1">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={addCuentaEstimado} className="flex items-center gap-1 text-xs text-[#003366] hover:text-[#0056B3] font-medium mt-2">
                      <Plus size={14} /> Agregar cuenta
                    </button>
                    <div className="mt-3 pt-3 border-t border-[#D0D5DD] flex justify-between">
                      <span className="text-sm font-semibold text-[#344054]">TOTAL:</span>
                      <span className="text-sm font-bold text-[#003366]">$ {totalEstimadoPresup.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Columna: Avance */}
                  <div className={`bg-white rounded-lg border p-4 ${estadoPresupuestario === 'avance' ? 'border-[#003366] ring-2 ring-[#003366]/20' : 'border-[#D0D5DD] opacity-60'}`}>
                    <h4 className="text-[#003366] font-semibold text-sm mb-3 flex items-center gap-1">📈 AVANCE</h4>
                    <p className="text-xs text-[#344054] mb-3">Se activa al elegir "Avance"</p>
                    {estadoPresupuestario === 'avance' ? (
                      <>
                        {presupuestoAvance.map((row) => (
                          <div key={row.id} className="flex gap-2 mb-3">
                            <div className="flex-1">
                              <select
                                value={row.cuenta}
                                onChange={(e) => updateCuentaAvance(row.id, 'cuenta', e.target.value)}
                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                              >
                                <option value="">▼ Cuenta contable</option>
                                {CUENTAS_CONTABLES.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div className="w-32 relative">
                              <span className="absolute left-3 top-2 text-[#344054] text-sm">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min={0}
                                value={row.monto || ''}
                                onChange={(e) => updateCuentaAvance(row.id, 'monto', Number(e.target.value))}
                                className="w-full pl-7 pr-2 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                                placeholder="0.00"
                              />
                            </div>
                            {presupuestoAvance.length > 1 && (
                              <button onClick={() => removeCuentaAvance(row.id)} className="text-red-500 hover:bg-red-50 rounded p-1">
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button onClick={addCuentaAvance} className="flex items-center gap-1 text-xs text-[#003366] hover:text-[#0056B3] font-medium mt-2">
                          <Plus size={14} /> Agregar cuenta
                        </button>
                        <div className="mt-3 pt-3 border-t border-[#D0D5DD] flex justify-between">
                          <span className="text-sm font-semibold text-[#344054]">TOTAL:</span>
                          <span className="text-sm font-bold text-[#003366]">$ {totalAvancePresup.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-[#344054] italic text-center py-8">Seleccione "Avance" para habilitar la edición</p>
                    )}
                  </div>

                  {/* Columna: Final */}
                  <div className={`bg-white rounded-lg border p-4 ${estadoPresupuestario === 'final' ? 'border-[#003366] ring-2 ring-[#003366]/20' : 'border-[#D0D5DD] opacity-60'}`}>
                    <h4 className="text-[#003366] font-semibold text-sm mb-3 flex items-center gap-1">✅ FINAL</h4>
                    <p className="text-xs text-[#344054] mb-3">Se activa al elegir "Final"</p>
                    {estadoPresupuestario === 'final' ? (
                      <>
                        {presupuestoFinal.map((row) => (
                          <div key={row.id} className="flex gap-2 mb-3">
                            <div className="flex-1">
                              <select
                                value={row.cuenta}
                                onChange={(e) => updateCuentaFinal(row.id, 'cuenta', e.target.value)}
                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                              >
                                <option value="">▼ Cuenta contable</option>
                                {CUENTAS_CONTABLES.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div className="w-32 relative">
                              <span className="absolute left-3 top-2 text-[#344054] text-sm">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min={0}
                                value={row.monto || ''}
                                onChange={(e) => updateCuentaFinal(row.id, 'monto', Number(e.target.value))}
                                className="w-full pl-7 pr-2 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                                placeholder="0.00"
                              />
                            </div>
                            {presupuestoFinal.length > 1 && (
                              <button onClick={() => removeCuentaFinal(row.id)} className="text-red-500 hover:bg-red-50 rounded p-1">
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button onClick={addCuentaFinal} className="flex items-center gap-1 text-xs text-[#003366] hover:text-[#0056B3] font-medium mt-2">
                          <Plus size={14} /> Agregar cuenta
                        </button>
                        <div className="mt-3 pt-3 border-t border-[#D0D5DD] flex justify-between">
                          <span className="text-sm font-semibold text-[#344054]">TOTAL:</span>
                          <span className="text-sm font-bold text-[#003366]">$ {totalFinalPresup.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-[#344054] italic text-center py-8">Seleccione "Final" para habilitar la edición</p>
                    )}
                  </div>
                </div>
              </div>

              <FileUploadBtn section="alcance" label="📎 Adjuntar acta de entrega-recepción de productos" />
            </div>
          </section>

          {/* ═══════════════ SECCIÓN 3 — ORGANIZACIÓN CONTRAPARTE ═══════════════ */}
          <section id="contraparte" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#003366] text-xl font-semibold flex items-center gap-2">🏢 ORGANIZACIÓN CONTRAPARTE</h2>
              <button onClick={addContraparte} className="flex items-center gap-1 px-4 py-2 bg-[#003366] text-white text-sm rounded-lg hover:bg-[#002952] transition-colors">
                <Plus size={16} /> Agregar contraparte
              </button>
            </div>

            {contrapartes.map((ct, idx) => (
              <div key={ct.id} className={`${idx > 0 ? 'mt-6 pt-6 border-t-2 border-dashed border-[#D0D5DD]' : ''}`}>
                {contrapartes.length > 1 && (
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#003366] font-semibold text-sm">Contraparte #{idx + 1}</h3>
                    <button onClick={() => removeContraparte(ct.id)} className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-colors">
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Nombre de la institución <span className="text-red-500">*</span></label>
                    <input type="text" value={ct.nombre} onChange={(e) => updateContraparte(ct.id, 'nombre', e.target.value)}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">RUC <span className="text-red-500">*</span></label>
                    <input type="text" value={ct.ruc} onChange={(e) => updateContraparte(ct.id, 'ruc', e.target.value)}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Teléfono <span className="text-red-500">*</span></label>
                    <input type="text" value={ct.telefono} onChange={(e) => updateContraparte(ct.id, 'telefono', e.target.value)}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Dirección <span className="text-red-500">*</span></label>
                    <input type="text" value={ct.direccion} onChange={(e) => updateContraparte(ct.id, 'direccion', e.target.value)}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#344054] font-medium mb-2 text-sm">Representante legal <span className="text-red-500">*</span></label>
                    <input type="text" value={ct.representanteLegal} onChange={(e) => updateContraparte(ct.id, 'representanteLegal', e.target.value)}
                      className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
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
                          checked={ct.aportes[a] || false}
                          onChange={() => toggleAporteContraparte(ct.id, a)}
                          className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]"
                        />
                        <span className="text-[#344054] text-sm">{a}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {APORTES_OPCIONES.filter((a) => ct.aportes[a]).map((a) => (
                      <span key={a} className="px-3 py-1.5 bg-[#003366] text-white text-sm rounded-full">{a}</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#344054] mt-2">
                    Seleccionados: {Object.values(ct.aportes).filter(Boolean).length}
                    {Object.values(ct.aportes).filter(Boolean).length === 0 && <span className="text-red-500"> (mínimo 1 requerido)</span>}
                  </p>
                </div>
              </div>
            ))}

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
                    <ComboboxField label="Programa de posgrado vinculado" value={programaPosgrado} onChange={setProgramaPosgrado} options={PROGRAMAS_POSGRADO} required />
                    <InputField label="N° estudiantes de posgrado" value={numEstPosgrado} onChange={setNumEstPosgrado} type="number" />
                    <ComboboxField label="Coordinador del posgrado" value={coordPosgrado} onChange={setCoordPosgrado} options={COORDINADORES_POSGRADO} />
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

              {/* Descripción del problema (obligatorio, ≥50 caracteres) */}
              <TextAreaField label="Descripción del problema" value="" onChange={() => {}} rows={4} required placeholder="Describa detalladamente el problema que aborda el proyecto (mín. 50 caracteres)..." />

              {/* Actores involucrados (obligatorio, ≥50 caracteres) */}
              <TextAreaField label="Actores involucrados" value="" onChange={() => {}} rows={4} required placeholder="Identifique los actores involucrados en el proyecto (mín. 50 caracteres)..." />

              {/* Variables cuantitativas — fijas (7 obligatorias) */}
              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2 text-sm">📊 VARIABLES CUANTITATIVAS (7) — obligatorias</h3>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    { id: 'v1', label: 'Población total afectada', unidad: 'personas', rango: false },
                    { id: 'v2', label: 'N° de familias beneficiarias', unidad: 'familias', rango: false },
                    { id: 'v3', label: 'Índice de pobreza (NBI)', unidad: '%', rango: true },
                    { id: 'v4', label: 'Tasa de desempleo local', unidad: '%', rango: true },
                    { id: 'v5', label: 'N° de organizaciones comunitarias', unidad: '', rango: false },
                    { id: 'v6', label: 'Cobertura servicios básicos', unidad: '%', rango: true },
                    { id: 'v7', label: 'Tasa de escolaridad', unidad: '%', rango: true },
                  ].map((v) => (
                    <div key={v.id} className="flex items-center gap-3 bg-white rounded-lg border border-[#D0D5DD] p-3">
                      <span className="text-xs font-medium text-[#344054] flex-1">{v.label}:</span>
                      <input
                        type="number"
                        min={0}
                        max={v.rango ? 100 : undefined}
                        placeholder="0"
                        className="w-24 px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm text-right"
                      />
                      {v.unidad && <span className="text-xs text-[#344054] w-14">{v.unidad}</span>}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#344054] mt-3">Los valores porcentuales (%) deben estar en el rango 0–100.</p>
              </div>

              {/* Resumen del problema */}
              <TextAreaField label="Resumen del problema" value="" onChange={() => {}} rows={3} placeholder="Sintetice el problema central del proyecto..." />
            </div>
          </section>

          {/* ═══════════════ SECCIÓN 6 — ESTUDIANTES E IMPACTO ═══════════════ */}
          <section id="estudiantes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">👥 ESTUDIANTES E IMPACTO</h2>
            <div className="space-y-6">
              {/* Estudiantes vinculados al proyecto — tabla dinámica */}
              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#003366] font-semibold text-sm flex items-center gap-2">🎓 ESTUDIANTES VINCULADOS AL PROYECTO</h3>
                  <button onClick={addStudentRow} className="flex items-center gap-1 px-3 py-2 bg-[#003366] text-white text-xs rounded-lg hover:bg-[#002952] transition-colors">
                    <Plus size={14} /> Agregar fila
                  </button>
                </div>
                <p className="text-xs text-[#344054] mb-4">* Por semestre, género y total</p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#003366] text-white">
                        <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[20%]">Semestre</th>
                        <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[25%]">Hombres</th>
                        <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[25%]">Mujeres</th>
                        <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[20%]">Total</th>
                        <th className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-semibold w-[10%]">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentRows.map((row, i) => {
                        const rowTotal = (row.hombres || 0) + (row.mujeres || 0);
                        return (
                          <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F7FA]'}>
                            <td className="border border-[#D0D5DD] px-3 py-2">
                              <input
                                type="text"
                                value={row.semestre}
                                onChange={(e) => updateStudentRow(row.id, 'semestre', e.target.value)}
                                placeholder="Ej: 2026-1"
                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                              />
                            </td>
                            <td className="border border-[#D0D5DD] px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                value={row.hombres || ''}
                                onChange={(e) => updateStudentRow(row.id, 'hombres', Number(e.target.value))}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                              />
                            </td>
                            <td className="border border-[#D0D5DD] px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                value={row.mujeres || ''}
                                onChange={(e) => updateStudentRow(row.id, 'mujeres', Number(e.target.value))}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                              />
                            </td>
                            <td className="border border-[#D0D5DD] px-3 py-2">
                              <div className="w-full px-3 py-2 bg-gray-100 rounded text-sm font-semibold text-[#003366] text-center">
                                {rowTotal}
                              </div>
                            </td>
                            <td className="border border-[#D0D5DD] px-3 py-2 text-center">
                              {studentRows.length > 1 && (
                                <button onClick={() => removeStudentRow(row.id)} className="text-red-500 hover:bg-red-50 rounded p-1.5">
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#E8EDF2]">
                        <td className="border border-[#D0D5DD] px-4 py-3 text-sm font-semibold text-[#003366]">TOTAL GENERAL</td>
                        <td className="border border-[#D0D5DD] px-4 py-3 text-sm font-semibold text-[#003366]">
                          {studentRows.reduce((sum, r) => sum + (r.hombres || 0), 0)}
                        </td>
                        <td className="border border-[#D0D5DD] px-4 py-3 text-sm font-semibold text-[#003366]">
                          {studentRows.reduce((sum, r) => sum + (r.mujeres || 0), 0)}
                        </td>
                        <td className="border border-[#D0D5DD] px-4 py-3 text-sm font-bold text-[#003366]">
                          {totalEstudiantesVinculados}
                        </td>
                        <td className="border border-[#D0D5DD]"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <p className="text-xs text-[#344054] mt-2">Total de estudiantes vinculados: <span className="font-semibold text-[#003366]">{totalEstudiantesVinculados}</span></p>
              </div>

              {/* Articulación funciones sustantivas — Investigación */}
              <div className="bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
                <div className="flex items-center gap-4 mb-3">
                  <label className="block text-[#344054] font-medium text-sm">¿Se articula con Investigación? <span className="text-red-500">*</span></label>
                  <RadioSiNo value={articulacionF} onChange={setArticulacionF} />
                </div>

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

          {/* ═══════════════ SECCIÓN 7 — MATRIZ DE MARCO LÓGICO ═══════════════ */}
          <section id="resultados" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#003366] text-xl font-semibold flex items-center gap-2">📊 MATRIZ DE MARCO LÓGICO</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const lastR = [...marcoLogicoRows].reverse().find(r => r.type === 'resultado');
                    addMlRow(lastR?.id || 'fin', 'resultado');
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-[#003366] text-white text-xs rounded-lg hover:bg-[#002952] transition-colors"
                >
                  <Plus size={14} /> Agregar resultado
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[22%]">Cadena de Resultados</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[22%]">Indicadores</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[22%]">Fuentes y Medios de Verificación</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[17%]">Supuestos</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold w-[17%]">Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {marcoLogicoRows.map((row, i) => (
                    <tr key={row.id} className={i % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}>
                      <td className="border border-[#D0D5DD] px-3 py-2 align-top">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                            row.type === 'fin' ? 'bg-[#003366] text-white' :
                            row.type === 'proposito' ? 'bg-[#0056B3] text-white' :
                            row.type === 'resultado' ? 'bg-[#E8EDF2] text-[#003366]' :
                            'bg-white text-[#6B7280] border border-[#D0D5DD]'
                          }`}>{row.label}</span>
                          <div className="flex gap-1">
                            {row.type === 'resultado' && (
                              <button
                                type="button"
                                onClick={() => addMlRow(row.id, 'actividad')}
                                className="text-[#003366] hover:bg-[#E8EDF2] rounded p-0.5"
                                title="Agregar actividad"
                              >
                                <Plus size={12} />
                              </button>
                            )}
                            {row.label !== 'FIN' && row.label !== 'PROPÓSITO' && (
                              <button
                                type="button"
                                onClick={() => removeMlRow(row.id)}
                                className="text-red-400 hover:text-red-600 rounded p-0.5"
                                title="Eliminar fila"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea
                          rows={3}
                          value={row.cadena}
                          onChange={(e) => updateMlRow(row.id, 'cadena', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#003366] resize-none"
                          placeholder={row.type === 'fin' ? 'Impacto esperado del proyecto...' : row.type === 'proposito' ? 'Propósito general...' : row.type === 'resultado' ? `Resultado ${row.label}...` : `Actividad ${row.label}...`}
                        />
                      </td>
                      <td className="border border-[#D0D5DD] px-3 py-2 align-top">
                        <textarea
                          rows={4}
                          value={row.indicadores}
                          onChange={(e) => updateMlRow(row.id, 'indicadores', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#003366] resize-none"
                          placeholder="Indicadores verificables..."
                        />
                      </td>
                      <td className="border border-[#D0D5DD] px-3 py-2 align-top">
                        <textarea
                          rows={4}
                          value={row.fuentes}
                          onChange={(e) => updateMlRow(row.id, 'fuentes', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#003366] resize-none"
                          placeholder="Fuentes documentales o evidencias..."
                        />
                      </td>
                      <td className="border border-[#D0D5DD] px-3 py-2 align-top">
                        <textarea
                          rows={4}
                          value={row.supuestos}
                          onChange={(e) => updateMlRow(row.id, 'supuestos', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#003366] resize-none"
                          placeholder="Supuestos externos..."
                        />
                      </td>
                      <td className="border border-[#D0D5DD] px-3 py-2 align-top">
                        <textarea
                          rows={4}
                          value={row.responsable}
                          onChange={(e) => updateMlRow(row.id, 'responsable', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#003366] resize-none"
                          placeholder="Persona o rol responsable..."
                        />
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
              <button onClick={() => addParticipant()} className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002952] transition-colors">
                <Plus size={18} /> Agregar participante
              </button>
            </div>

            {/* Tabs de categoría */}
            <div className="flex gap-2 mb-4 border-b border-[#D0D5DD] pb-2">
              {(['todos', ...TIPOS_PARTICIPANTE] as const).map((cat) => {
                const count = cat === 'todos'
                  ? participants.length
                  : participants.filter(p => p.tipo === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveParticipantTab(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeParticipantTab === cat
                        ? 'bg-[#003366] text-white'
                        : 'bg-[#F5F7FA] text-[#344054] hover:bg-[#E1E4E8]'
                    }`}
                  >
                    <span className="capitalize">{cat === 'todos' ? 'Todos' : cat}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeParticipantTab === cat
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E1E4E8] text-[#6B7280]'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {participants.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    <div className="grid grid-cols-11 gap-2 mb-2 bg-[#003366] text-white p-3 rounded-t-lg">
                      <div className="text-sm font-semibold">Tipo partic.</div>
                      <div className="text-sm font-semibold">Nacionalidad</div>
                      <div className="text-sm font-semibold">Horas (prog.)</div>
                      <div className="text-sm font-semibold">Fecha inicio</div>
                      <div className="text-sm font-semibold">Fecha fin</div>
                      <div className="text-sm font-semibold">Tipo doc.</div>
                      <div className="text-sm font-semibold">N° doc.</div>
                      <div className="text-sm font-semibold col-span-2">Apellidos y nombres</div>
                      <div className="text-sm font-semibold">Carrera</div>
                      <div className="text-sm font-semibold">Acciones</div>
                    </div>

                    {participants
                      .filter(p => activeParticipantTab === 'todos' || p.tipo === activeParticipantTab)
                      .map((p, i) => (
                      <div key={p.id} className={`grid grid-cols-11 gap-2 p-3 border-b border-[#E1E4E8] ${i % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}`}>
                        <select value={p.tipo} onChange={(e) => updateParticipant(p.id, 'tipo', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                          <option value="">Tipo</option>
                          {TIPOS_PARTICIPANTE.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input type="text" value={p.nacionalidad} onChange={(e) => updateParticipant(p.id, 'nacionalidad', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="País" />
                        <input type="number" value={p.horas} onChange={(e) => updateParticipant(p.id, 'horas', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="0" />
                        <input type="date" value={p.fechaInicio} onChange={(e) => updateParticipant(p.id, 'fechaInicio', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                        <input type="date" value={p.fechaFin} onChange={(e) => updateParticipant(p.id, 'fechaFin', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                        <input type="text" value={p.tipoDoc} onChange={(e) => updateParticipant(p.id, 'tipoDoc', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="CI/Pasap." />
                        <input type="text" value={p.numeroDoc} onChange={(e) => updateParticipant(p.id, 'numeroDoc', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Número" />
                        <input type="text" value={p.nombres} onChange={(e) => updateParticipant(p.id, 'nombres', e.target.value)}
                          className="col-span-2 px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Nombre completo" />
                        <input type="text" value={p.carrera} onChange={(e) => updateParticipant(p.id, 'carrera', e.target.value)}
                          className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Carrera" />
                        <button onClick={() => removeParticipant(p.id)} className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#344054] mt-3 flex items-center gap-1">💡 Deslizar horizontalmente para ver más columnas</p>
              </>
            ) : (
              <div className="bg-[#F5F7FA] rounded-lg p-6 border border-[#D0D5DD] text-center">
                <p className="text-sm text-[#6B7280] mb-2">No hay participantes registrados manualmente.</p>
                <p className="text-xs text-[#6B7280]">Adjunte el listado descargado del Banner o agregue participantes manualmente.</p>
              </div>
            )}

            <FileUploadBtn section="participantes" label="📎 Adjuntar listado firmado de participantes (descargado del Banner)" />
          </section>

          {/* ═══════════════ SECCIÓN 9 — FIRMAS ═══════════════ */}
          <section id="firmas" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">✍️ FIRMAS</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'ELABORADO POR', subtitle: 'Docente Líder del Proyecto' },
                { title: 'REVISADO POR', subtitle: 'Decano de Unidad' },
                { title: 'APROBADO POR', subtitle: 'Dirección de Vinculación' },
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

          {/* ═══════════════ SECCIÓN 10 — ANEXOS ═══════════════ */}
          <section id="anexos" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">📎 ANEXOS</h2>
            <p className="text-xs text-[#D92D20] mb-4">* Documentos obligatorios</p>

            <div className="space-y-3">
              {/* Documentos anexos checklist */}
              {[
                { id: 'acta', label: 'Acta de entrega-recepción de productos', obligatorio: true },
                { id: 'banner', label: 'Reporte banner de estudiantes', obligatorio: true },
                ...(internacionalizacion === 'si'
                  ? [{ id: 'convenio-int', label: 'Convenio internacional (requerido por internacionalización)', obligatorio: true }]
                  : []),
                { id: 'convenio', label: 'Convenio / Carta de compromiso', obligatorio: false },
                { id: 'listado', label: 'Listado firmado de participantes', obligatorio: false },
                { id: 'firmas-doc', label: 'Documento de firmas escaneado', obligatorio: false },
                { id: 'otros', label: 'Otros documentos', obligatorio: false },
              ].map((doc) => (
                <label key={doc.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                  doc.obligatorio
                    ? 'border-[#D0D5DD] bg-[#F5F7FA] hover:bg-[#EEF1F5]'
                    : 'border-[#D0D5DD] bg-white hover:bg-[#F5F7FA]'
                }`}>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]"
                  />
                  <span className="flex-1 text-sm text-[#344054]">
                    {doc.obligatorio && <span className="text-[#D92D20] mr-1">*</span>}
                    {doc.label}
                  </span>
                  {doc.obligatorio && <span className="text-xs text-[#D92D20] font-medium">Obligatorio</span>}
                </label>
              ))}
            </div>

            {/* Adjuntar archivos */}
            <FileUploadBtn section="alcance" label="📎 Adjuntar archivos..." />

            <div className="mt-6 p-4 bg-[#FFF9F0] rounded-lg border border-[#FFD9A0] flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <p className="text-sm text-[#344054]">
                Los documentos marcados con <span className="text-[#D92D20] font-medium">*</span> son obligatorios.
                {internacionalizacion === 'si' && ' El convenio internacional es requerido porque el componente de internacionalización está activo.'}
              </p>
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
              <button onClick={() => onSave?.(tipoInforme)} className="flex items-center gap-2 px-6 py-3 bg-[#F5F7FA] text-[#344054] border border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#E1E4E8] transition-colors">
                <Save size={20} /> Guardar borrador
              </button>
              <button onClick={() => onSave?.(tipoInforme)} className="flex items-center gap-2 px-6 py-3 bg-[#12B76A] text-white rounded-lg font-semibold hover:bg-[#0F9C5A] transition-colors">
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
