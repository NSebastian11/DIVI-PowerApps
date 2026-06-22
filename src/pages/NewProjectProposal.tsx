import { useState, useRef, useMemo } from 'react';
import { Save, Send, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { generateNextProjectCode } from '../lib/projectCode';
import { existingProjectCodes } from '../data/existingProjects';

/* ───────── Tipos ───────── */
type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'date' | 'select' | 'file';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: string[];
  colSpan?: 1 | 2;
}

interface SectionConfig {
  id: string;
  icon: string;
  title: string;
  fields: FieldConfig[];
}

interface NewProjectProposalProps {
  onBack?: () => void;
  onSave?: () => void;
}

/* ───────── Opciones de ejemplo para selects sin catálogo conocido ───────── */
const OPCIONES_PROGRAMA = ['Programa de Vinculación Social', 'Programa de Servicio Comunitario', 'Programa de Prácticas Pre-profesionales'];
const OPCIONES_TIPO = ['Proyecto', 'Programa', 'Actividad'];
const OPCIONES_ORIGEN = ['Docente', 'Estudiante', 'Comunidad', 'Convenio institucional'];
const OPCIONES_AMBITO = ['Local', 'Regional', 'Nacional', 'Internacional'];
const OPCIONES_EJE = ['Educación', 'Salud', 'Desarrollo Productivo', 'Medio Ambiente', 'Derechos Humanos'];
const OPCIONES_DOMINIO = ['Ciencias Sociales', 'Ciencias Exactas', 'Ciencias de la Salud', 'Tecnología', 'Humanidades'];
const OPCIONES_ARTICULACION_FUNCIONES = ['Docencia', 'Investigación', 'Vinculación', 'Docencia-Investigación', 'Docencia-Investigación-Vinculación'];
const OPCIONES_ESTADO = ['Propuesta', 'Aprobado', 'En ejecución', 'Finalizado', 'Suspendido'];
const OPCIONES_UNIDAD = ['Facultad de Ingeniería', 'Facultad de Ciencias Administrativas y Contables', 'Facultad de Ciencias de la Educación', 'Facultad de Psicología', 'Facultad de Jurisprudencia', 'Facultad de Ciencias Exactas y Naturales'];
const OPCIONES_SEDE = ['Quito - Matriz', 'Ibarra', 'Santo Domingo', 'Esmeraldas', 'Ambato', 'Manabí'];
const OPCIONES_CARRERA = ['Ingeniería en Sistemas', 'Administración de Empresas', 'Psicología', 'Derecho', 'Educación', 'Comunicación'];
const OPCIONES_GRUPO_INV = ['GI-Desarrollo Comunitario', 'GI-Educación Popular', 'GI-Salud Pública', 'GI-Sostenibilidad Ambiental'];
const OPCIONES_LINEA_INV = ['Salud y bienestar', 'Educación inclusiva', 'Desarrollo sostenible', 'Innovación social', 'Derechos humanos', 'Cultura y patrimonio'];
const OPCIONES_LINEA_ESTRATEGICA = ['Calidad educativa', 'Innovación social', 'Sostenibilidad', 'Internacionalización'];
const OPCIONES_TIPO_ACTORES = ['Gobierno local', 'Organización comunitaria', 'ONG', 'Sector privado', 'Sector académico'];
const OPCIONES_PROPIEDAD_INTELECTUAL = ['Marca', 'Patente', 'Derecho de autor', 'Secreto industrial', 'No aplica'];

/* ───────── 15 secciones / 115 campos (fiel al formulario SharePoint) ───────── */
const SECTIONS: SectionConfig[] = [
  {
    id: 'identificacion', icon: '📋', title: 'Identificación del Proyecto',
    fields: [
      { key: 'nombreProyecto', label: 'NOMBRE DEL PROYECTO', type: 'text', required: true, colSpan: 2, help: 'El título deberá expresar la idea principal del proyecto que se propone.' },
      { key: 'codigoPrograma', label: 'CODIGO_PROGRAMA', type: 'text' },
      { key: 'programa', label: 'PROGRAMA', type: 'select', options: OPCIONES_PROGRAMA },
      { key: 'tipo', label: 'TIPO', type: 'select', options: OPCIONES_TIPO },
      { key: 'origenProyecto', label: 'ORIGEN DEL PROYECTO', type: 'select', required: true, options: OPCIONES_ORIGEN },
      { key: 'ambitoProyecto', label: 'Ámbito del Proyecto', type: 'select', required: true, options: OPCIONES_AMBITO },
      { key: 'ejeVinculacion', label: 'Eje de Vinculación', type: 'select', required: true, options: OPCIONES_EJE },
      { key: 'dominioAcademico', label: 'DOMINIO ACADÉMICO', type: 'select', required: true, options: OPCIONES_DOMINIO },
      { key: 'articulacionFuncionesSustantivas', label: 'ARTICULACIÓN DE FUNCIONES SUSTANTIVAS', type: 'select', required: true, options: OPCIONES_ARTICULACION_FUNCIONES },
      { key: 'estado', label: 'ESTADO', type: 'select', options: OPCIONES_ESTADO },
      { key: 'fechaInicio', label: 'FECHA INICIO', type: 'date' },
      { key: 'fechaFinPlaneado', label: 'FECHA DE FIN PLANEADO', type: 'date' },
      { key: 'fechaFinReal', label: 'FECHA DE FIN REAL', type: 'date' },
      { key: 'anioPresupuesto', label: 'AÑO DE PRESUPUESTO', type: 'number' },
      { key: 'unidadResponsable', label: 'UNIDAD RESPONSABLE', type: 'select', options: OPCIONES_UNIDAD },
      { key: 'sede', label: 'SEDE', type: 'select', options: OPCIONES_SEDE },
    ],
  },
  {
    id: 'coordinacion', icon: '🎓', title: 'Coordinación y Académico',
    fields: [
      { key: 'coordinadorResponsable', label: 'COORDINADOR / RESPONSABLE', type: 'text' },
      { key: 'correoCoordinador', label: 'CORREO ELECTRÓNICO COORDINADOR', type: 'email' },
      { key: 'telefonoCoordinador', label: 'TELÉFONO COORDINADOR', type: 'tel' },
      { key: 'carreraQueCoordina', label: 'CARRERA QUE COORDINA', type: 'text' },
      { key: 'carrera', label: 'Carrera', type: 'select', options: OPCIONES_CARRERA },
      { key: 'numeroCarrerasInvolucradas', label: 'NÚMERO DE CARRERAS INVOLUCRADAS EN EL PROYECTO', type: 'number' },
      { key: 'grupoInvestigacion', label: 'GRUPO DE INVESTIGACIÓN', type: 'select', options: OPCIONES_GRUPO_INV },
      { key: 'lineaInvestigacion', label: 'LÍNEA DE INVESTIGACIÓN', type: 'select', options: OPCIONES_LINEA_INV },
      { key: 'lineaEstrategica', label: 'LÍNEA ESTRATÉGICA', type: 'select', options: OPCIONES_LINEA_ESTRATEGICA },
      { key: 'proyectoInvestigacion', label: 'PROYECTO INVESTIGACIÓN', type: 'text', help: '¿El proyecto de vinculación surge a partir del desarrollo de un proyecto de investigación previo?' },
      { key: 'articulaInvestigacionPuce', label: '¿El proyecto se articula con alguna investigación PUCE?', type: 'text' },
      { key: 'redAcademicaArticulada', label: 'RED ACADÉMICA ARTICULADA', type: 'text' },
      { key: 'identificacion', label: 'IDENTIFICACION', type: 'text', help: 'Número de cédula, pasaporte, etc.' },
    ],
  },
  {
    id: 'diagnostico', icon: '🔍', title: 'Diagnóstico y Justificación',
    fields: [
      { key: 'diagnosticoProblemaActores', label: 'DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS', type: 'textarea' },
      { key: 'objetivo', label: 'OBJETIVO', type: 'textarea' },
      { key: 'resumen', label: 'Resumen', type: 'textarea' },
      { key: 'problemaContraparteDiagnostico', label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE', type: 'textarea', help: 'Máximo 200 palabras' },
      { key: 'campoAmplio', label: 'CAMPO AMPLIO', type: 'text' },
      { key: 'campoDetallado', label: 'CAMPO DETALLADO', type: 'text' },
      { key: 'campoEspecifico', label: 'CAMPO ESPECÍFICO', type: 'text' },
      { key: 'ods', label: 'ODS', type: 'text' },
      { key: 'mapeoActores', label: 'Mapeo de Actores y responsabilidades', type: 'textarea' },
      { key: 'tipoActoresSociales', label: 'TIPO DE ACTORES SOCIALES', type: 'select', options: OPCIONES_TIPO_ACTORES },
      { key: 'descripcionTipoVinculacion', label: 'Descripción del Tipo de Vinculación', type: 'textarea' },
    ],
  },
  {
    id: 'contraparte', icon: '🤝', title: 'Contraparte y Convenio',
    fields: [
      { key: 'nombreContraparte', label: 'NOMBRE DE CONTRAPARTE', type: 'text' },
      { key: 'instrumentoLegalContraparte', label: 'Instrumento Legal de la Contraparte', type: 'text' },
      { key: 'convenio', label: 'CONVENIO', type: 'text' },
      { key: 'problemaContraparteConvenio', label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE', type: 'textarea', help: 'Máximo 200 palabras' },
    ],
  },
  {
    id: 'alcance', icon: '🌍', title: 'Alcance Territorial y Beneficiarios',
    fields: [
      { key: 'alcanceTerritorial', label: 'ALCANCE TERRITORIAL', type: 'text' },
      { key: 'ubicacionComunidad', label: 'Ubicación/es de la Comunidad/es o Grupo/s Alcanzado/s', type: 'text' },
      { key: 'nombreComunidadAlcanzada', label: 'NOMBRE DE COMUNIDAD ALCANZADA', type: 'text' },
      { key: 'criteriosSeleccionBeneficiarios', label: 'CRITERIOS DE SELECCIÓN DE BENEFICIARIOS ENTRE LA POBLACIÓN OBJETIVO', type: 'textarea' },
      { key: 'detalleCalculoComunidad', label: 'Detalle del cálculo de la comunidad participante', type: 'textarea' },
      { key: 'numeroPersonasAlcanzadas', label: 'NÚMERO DE PERSONAS ALCANZADAS', type: 'number' },
      { key: 'personasAlcanzadasFemeninos', label: 'personas_alcanzadas_femeninos', type: 'number' },
      { key: 'personasAlcanzadasMasculinos', label: 'personas_alcanzadas_masculinos', type: 'number' },
      { key: 'beneficiariosDirectosFemeninos', label: 'beneficiarios_directos_femeninos', type: 'number' },
      { key: 'beneficiariosDirectosMasculinos', label: 'beneficiarios_directos_masculinos', type: 'number' },
      { key: 'beneficiariosIndirectosFemeninos', label: 'beneficiarios_indirectos_femeninos', type: 'number' },
      { key: 'beneficiariosIndirectosMasculinos', label: 'beneficiarios_indirectos_masculinos', type: 'number' },
      { key: 'numComunidad1f', label: 'num_comunidad_1f', type: 'number' },
      { key: 'numComunidad1m', label: 'num_comunidad_1m', type: 'number', help: 'Número de personas alcanzadas en la comunidad participante. Primer semestre: Masculino.' },
      { key: 'numComunidad2f', label: 'num_comunidad_2f', type: 'number' },
      { key: 'numComunidad2m', label: 'num_comunidad_2m', type: 'number' },
    ],
  },
  {
    id: 'componentes', icon: '🧩', title: 'Componentes Especiales',
    fields: [
      { key: 'componenteInterculturalidad', label: 'COMPONENTE DE INTERCULTURALIDAD', type: 'text' },
      { key: 'detalleInterculturalidad', label: 'DETALLE_INTERCULTURALIDAD', type: 'text' },
      { key: 'componenteInterdisciplinariedad', label: 'COMPONENTE DE INTERDISCIPLINARIEDAD', type: 'text' },
      { key: 'detalleInterdisciplinariedad', label: 'DETALLE_INTERDISCIPLINARIEDAD', type: 'text' },
      { key: 'componenteInternacionalizacion', label: 'COMPONENTE DE INTERNACIONALIZACIÓN', type: 'text' },
      { key: 'componentePosgrados', label: 'COMPONENTE DE POSGRADOS', type: 'text', required: true },
      { key: 'detallePosgrados', label: 'DETALLE_POSGRADOS', type: 'text' },
      { key: 'componenteIntersedes', label: 'COMPONENTE INTERSEDES', type: 'text', required: true },
    ],
  },
  {
    id: 'participantes', icon: '👥', title: 'Participantes (Docentes/Estudiantes/Otros)',
    fields: [
      { key: 'numeroDocentesVinculados', label: 'NÚMERO DE DOCENTES VINCULADOS', type: 'number' },
      { key: 'numeroDocentesVinculados2do', label: 'NÚMERO DE DOCENTES VINCULADOS 2DO SEMESTRE', type: 'number' },
      { key: 'numeroEstudiantesVinculados', label: 'NÚMERO DE ESTUDIANTES VINCULADOS', type: 'number' },
      { key: 'numeroEstudiantesVinculados2do', label: 'NÚMERO DE ESTUDIANTES VINCULADOS 2DO SEMESTRE', type: 'number' },
      { key: 'numeroAdministrativosVinculados', label: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS', type: 'number' },
      { key: 'numeroAlumniVinculados', label: 'NÚMERO DE ALUMNI VINCULADOS', type: 'number' },
      { key: 'resultadosAprendizaje', label: 'RESULTADOS DE APRENDIZAJE', type: 'textarea' },
      { key: 'asesoria', label: 'ASESORÍA', type: 'text' },
    ],
  },
  {
    id: 'marcoLogicoOG', icon: '🎯', title: 'Marco Lógico - Objetivo General (OG)',
    fields: [
      { key: 'ogAvance', label: 'OG_Avance', type: 'text' },
      { key: 'ogFuentes', label: 'OG_Fuentes', type: 'text' },
      { key: 'ogIndicadores', label: 'OG_Indicadores', type: 'text' },
      { key: 'ogResultados', label: 'OG_Resultados', type: 'text' },
      { key: 'ogSupuestos', label: 'OG_SUPUESTOS', type: 'text' },
    ],
  },
  {
    id: 'marcoLogicoOE', icon: '🎯', title: 'Marco Lógico - Objetivo Específico (OE)',
    fields: [
      { key: 'oeAvance', label: 'OE_Avance', type: 'text' },
      { key: 'oeFuentes', label: 'OE_Fuentes', type: 'text' },
      { key: 'oeIndicadores', label: 'OE_Indicadores', type: 'text' },
      { key: 'oeResultados', label: 'OE_Resultados', type: 'text' },
      { key: 'oeSupuestos', label: 'OE_Supuestos', type: 'text' },
    ],
  },
  {
    id: 'marcoLogicoA', icon: '🛠️', title: 'Marco Lógico - Actividades (A)',
    fields: [
      { key: 'aFuentes', label: 'A_Fuentes', type: 'text' },
      { key: 'aIndicadores', label: 'A_Indicadores', type: 'text' },
      { key: 'aResultados', label: 'A_Resultados', type: 'text' },
      { key: 'aSupuestos', label: 'A_Supuestos', type: 'text' },
    ],
  },
  {
    id: 'marcoLogicoR', icon: '📊', title: 'Marco Lógico - Resultados (R)',
    fields: [
      { key: 'rEtapa', label: 'R_Etapa', type: 'text' },
      { key: 'rFuentes', label: 'R_Fuentes', type: 'text' },
      { key: 'rIndicadores', label: 'R_Indicadores', type: 'text' },
      { key: 'rResponsable', label: 'R_Responsable', type: 'text' },
      { key: 'rResultados', label: 'R_Resultados', type: 'text' },
      { key: 'rSupuestos', label: 'R_Supuestos', type: 'text' },
    ],
  },
  {
    id: 'presupuesto', icon: '💰', title: 'Presupuesto',
    fields: [
      { key: 'fuenteFinanciamiento', label: 'FUENTE DE FINANCIAMIENTO', type: 'text' },
      { key: 'presupuestoPlanificado', label: 'PRESUPUESTO PLANIFICADO', type: 'number' },
      { key: 'presupuestoEjecutado', label: 'PRESUPUESTO EJECUTADO', type: 'number' },
      { key: 'presupuestoExterno', label: 'PRESUPUESTO EXTERNO', type: 'number' },
      { key: 'presupuestoExternoAsignado', label: 'PRESUPUESTO EXTERNO ASIGNADO', type: 'number' },
      { key: 'gastoNoContemplado', label: 'GASTO NO CONTEMPLADO', type: 'text' },
      { key: 'parametroCumplimiento', label: 'PARÁMETRO DE CUMPLIMIENTO', type: 'text' },
    ],
  },
  {
    id: 'impactos', icon: '🌱', title: 'Impactos del Proyecto',
    fields: [
      { key: 'impactosProyecto', label: 'IMPACTOS DEL PROYECTO', type: 'textarea' },
      { key: 'impactoSocial', label: 'IMPACTO SOCIAL', type: 'textarea' },
      { key: 'impactoEconomico', label: 'IMPACTO ECONÓMICO', type: 'textarea' },
      { key: 'impactoAmbiental', label: 'IMPACTO AMBIENTAL', type: 'textarea' },
      { key: 'impactoPolitico', label: 'IMPACTO POLÍTICO', type: 'textarea' },
      { key: 'impactoCientificoAcademico', label: 'IMPACTO CIENTÍFICO-ACADÉMICO', type: 'textarea' },
      { key: 'otroImpacto', label: 'OTRO_IMPACTO', type: 'textarea' },
    ],
  },
  {
    id: 'propiedadIntelectual', icon: '📜', title: 'Propiedad Intelectual y Evidencias',
    fields: [
      { key: 'propiedadIntelectual', label: 'PROPIEDAD INTELECTUAL', type: 'text' },
      { key: 'tipoPropiedadIntelectual', label: 'Tipo Propiedad Intelectual', type: 'select', options: OPCIONES_PROPIEDAD_INTELECTUAL },
      { key: 'evidencia', label: 'EVIDENCIA', type: 'text' },
      { key: 'datosAdjuntos', label: 'Datos adjuntos', type: 'file' },
    ],
  },
  {
    id: 'seguimiento', icon: '🗂️', title: 'Seguimiento / Informe (estado interno)',
    fields: [
      { key: 'estadoInforme', label: 'ESTADO_INFORME', type: 'text' },
    ],
  },
];

const ALL_REQUIRED_FIELDS = SECTIONS.flatMap((s) => s.fields.filter((f) => f.required));

/* ───────── Campo de archivo adjunto (mock local) ───────── */
function FileField({ value, onChange }: { value: string[] | undefined; onChange: (v: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const files = value || [];

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-[#F5F7FA] transition-colors"
        >
          <FileText size={16} /> Adjuntar archivo
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onChange([...files, f.name]);
            e.target.value = '';
          }}
        />
        {files.length > 0 && <span className="text-xs text-[#12B76A] font-medium">{files.length} archivo(s) adjunto(s)</span>}
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F5F7FA] border border-[#D0D5DD] rounded text-xs text-[#344054]">
              {name}
              <button onClick={() => onChange(files.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── Renderizador genérico de campos ───────── */
function FieldRenderer({ field, value, onChange, showError }: {
  field: FieldConfig;
  value: any;
  onChange: (v: any) => void;
  showError: boolean;
}) {
  const isWide = field.type === 'textarea' || field.type === 'file' || field.colSpan === 2;
  const inputCls = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] ${
    showError ? 'border-red-400 bg-red-50' : 'border-[#D0D5DD]'
  }`;

  return (
    <div className={isWide ? 'md:col-span-2' : ''}>
      <label className="block text-[#344054] font-medium mb-2 text-sm">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {field.help && <p className="text-xs text-[#6B7280] mb-2">{field.help}</p>}

      {field.type === 'textarea' && (
        <textarea rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-none`} />
      )}

      {field.type === 'select' && (
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} bg-white`}>
          <option value="">Seleccionar...</option>
          {(field.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {field.type === 'file' && <FileField value={value} onChange={onChange} />}

      {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' || field.type === 'date') && (
        <input
          type={field.type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </div>
  );
}

/* ============================================================ */
/*  COMPONENTE PRINCIPAL                                         */
/* ============================================================ */
export default function NewProjectProposal({ onBack, onSave }: NewProjectProposalProps) {
  const [codigoProyecto] = useState(() => generateNextProjectCode(existingProjectCodes));
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const updateField = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));

  const missingKeys = useMemo(
    () => ALL_REQUIRED_FIELDS.filter((f) => !formData[f.key]).map((f) => f.key),
    [formData]
  );

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmitClick = () => {
    if (missingKeys.length > 0) {
      setShowErrors(true);
      const firstMissingSection = SECTIONS.find((s) => s.fields.some((f) => missingKeys.includes(f.key)));
      if (firstMissingSection) scrollToSection(firstMissingSection.id);
      return;
    }
    setShowSummary(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col">
      {/* ─── HEADER ─── */}
      <header className="bg-[#003366] px-6 py-6 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center font-bold text-[#003366] text-xl">PUCE</div>
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">NUEVO PROYECTO DE VINCULACIÓN</h1>
                <p className="text-white/90 text-lg">Propuesta de Proyecto de Servicio Comunitario</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <label className="text-white/80 text-sm mb-1">Título (automático)</label>
              <div className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white font-mono w-48 text-center">
                {codigoProyecto}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── NAV ─── */}
      <nav className="bg-white border-b border-[#E1E4E8] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {SECTIONS.map((s) => {
              const sectionHasError = showErrors && s.fields.some((f) => missingKeys.includes(f.key));
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeSection === s.id
                      ? 'bg-[#003366] text-white'
                      : sectionHasError
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-[#F5F7FA] text-[#344054] hover:bg-[#E1E4E8]'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="text-sm">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ─── Banner de errores ─── */}
      {showErrors && missingKeys.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700 font-medium">
              Faltan {missingKeys.length} campo(s) obligatorio(s) por completar. Revise las pestañas marcadas en rojo.
            </p>
          </div>
        </div>
      )}

      {/* ─── MAIN ─── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
              <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
                {section.icon} {section.title.toUpperCase()}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <FieldRenderer
                    key={field.key}
                    field={field}
                    value={formData[field.key]}
                    onChange={(v) => updateField(field.key, v)}
                    showError={showErrors && missingKeys.includes(field.key)}
                  />
                ))}
              </div>
            </section>
          ))}
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
              <button onClick={handleSubmitClick} className="flex items-center gap-2 px-6 py-3 bg-[#12B76A] text-white rounded-lg font-semibold hover:bg-[#0F9C5A] transition-colors">
                <Send size={20} /> Enviar propuesta
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-[#344054]/70 pt-4 border-t border-[#E1E4E8]">
            Pontificia Universidad Católica del Ecuador • Av. 12 de Octubre 1076 • Quito, Ecuador • {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>
      </footer>

      {/* ─── MODAL DE RESUMEN / CONFIRMACIÓN (local, sin envío a servidor) ─── */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8">
            <div className="flex items-center gap-3 mb-4 text-[#12B76A]">
              <CheckCircle2 size={28} />
              <h3 className="text-lg font-bold text-[#003366]">Propuesta lista para enviar</h3>
            </div>
            <div className="space-y-2 text-sm text-[#344054] mb-6">
              <p><span className="font-semibold">Título:</span> {codigoProyecto}</p>
              <p><span className="font-semibold">Nombre del proyecto:</span> {formData.nombreProyecto || '(sin nombre)'}</p>
              <p><span className="font-semibold">Estado:</span> {formData.estado || 'Propuesta'}</p>
              <p><span className="font-semibold">Unidad responsable:</span> {formData.unidadResponsable || '-'}</p>
            </div>
            <p className="text-xs text-[#6B7280] mb-6">Esta es una simulación local. No se envía información a ningún servidor.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSummary(false)} className="px-5 py-2.5 border border-[#D0D5DD] rounded-lg text-[#344054] font-semibold hover:bg-[#F5F7FA] transition-colors">
                Seguir editando
              </button>
              <button onClick={onSave} className="px-5 py-2.5 bg-[#003366] text-white rounded-lg font-semibold hover:bg-[#002952] transition-colors">
                Confirmar y guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
