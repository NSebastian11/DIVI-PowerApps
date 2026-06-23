import { useState, useRef, useMemo, useEffect } from 'react';
import { Save, Send, FileText, CheckCircle2, AlertTriangle, X, Search, ChevronDown } from 'lucide-react';
import { generateNextProjectCode } from '../lib/projectCode';
import { existingProjectCodes } from '../data/existingProjects';

/* ───────── Tipos ───────── */
type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'date' | 'select' | 'multiselect' | 'file' | 'readonly';

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: string[];
  colSpan?: 1 | 2;
  showIf?: (data: Record<string, any>) => boolean;
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

interface ImpactoEntry {
  tipo: string;
  descripcion: string;
}

/* ───────── Opciones de catálogo real (PowerApps) ───────── */
const OPCIONES_TIPO = ['Vinculación'];
const OPCIONES_ORIGEN = ['Carta de pedido de la comunidad, grupo u organización', 'Convenio interinstitucional', 'Iniciativa PUCE'];
const OPCIONES_AMBITO = ['ARTES', 'CIENCIAS', 'CONOCIMIENTOS', 'LENGUAS, ONTOLOGÍAS Y CULTURAS', 'PEDAGOGÍAS', 'SABERES', 'TECNOLOGÍAS', 'OTROS'];
const OPCIONES_EJE = ['Cultura de paz', 'Economía Popular y Solidaria', 'Hábitat digno', 'Movilidad Humana', 'Sostenibilidad', 'Salud Integral'];
const OPCIONES_DOMINIO = [
  'HÁBITAT INFRAESTRUCTURA Y MOVILIDAD',
  'IDENTIDADES, EDUCACIÓN, CULTURAS, COMUNICACIÓN Y VALORES',
  'MANEJO SOSTENIBLE DE RECURSOS NATURALES',
  'POLÍTICA ECONÓMICA, COMPETITIVIDAD INSTITUCIONAL, INNOVACIÓN, EMPRENDIMIENTO, PRODUCTIVIDAD Y LIDERAZGO',
  'POLÍTICA Y DERECHO PARA LA PARTICIPACIÓN SOCIAL Y EL ESTABLECIMIENTO DE RELACIONES JUSTAS',
  'VIDA DIGNA Y SALUD INTEGRAL',
];
const OPCIONES_ARTICULACION_FUNCIONES = ['VINCULACIÓN / INVESTIGACIÓN', 'VINCULACIÓN / INVESTIGACIÓN / DOCENCIA', 'VINCULACIÓN / DOCENCIA'];
const OPCIONES_UNIDAD = [
  'CENTRO CULTURAL',
  'DIRECCIÓN DE IDENTIDAD Y MISIÓN',
  'DIRECCIÓN DE INVESTIGACIÓN',
  'DIRECCIÓN DE INVESTIGACIÓN, VINCULACIÓN E INNOVACIÓN',
  'DIRECCIÓN DE VINCULACIÓN CON LA COLECTIVIDAD',
  'ESTACIÓN CIENTÍFICA YASUNÍ',
  'FACULTAD DE APRENDIZAJE, LENGUAS Y COMUNICACIÓN',
  'FACULTAD DE ARQUITECTURA, DISEÑO Y ARTES',
  'FACULTAD DE CIENCIAS ADMINISTRATIVAS Y CONTABLES',
  'FACULTAD DE CIENCIAS DE LA EDUCACIÓN',
  'FACULTAD DE CIENCIAS EXACTA, NATURALES Y AMBIENTALES',
  'FACULTAD DE CIENCIAS EXACTAS Y NATURALES',
  'FACULTAD DE CIENCIAS FILOSÓFICO Y TEOLÓGICAS',
  'FACULTAD DE CIENCIAS HUMANAS',
  'FACULTAD DE COMUNICACIÓN, LINGÜÍSTICA Y LITERATURA',
  'FACULTAD DE DERECHO Y SOCIEDAD',
  'FACULTAD DE ECONOMÍA',
  'FACULTAD DE ECONOMÍA Y GESTIÓN EMPRESARIAL',
  'FACULTAD DE ENFERMERÍA',
  'FACULTAD DE HÁBITAT, INFRAESTRUCTURA Y CREATIVIDAD',
  'FACULTAD DE INGENIERIA',
  'FACULTAD DE JURISPRUDENCIA',
  'FACULTAD DE MEDICINA',
  'FACULTAD DE PSICOLOGÍA',
  'FACULTAD DE SALUD Y BIENESTAR',
  'FACULTAD ECLESIÁSTICA DE CIENCIAS FILOSÓFICO TEOLÓGICAS',
  'FACULTAD INTERNACIONAL DE INNOVACIÓN PUCE-ICAM',
  'ICAM',
  'PUCETEC',
  'RECTORADO',
];
const OPCIONES_SEDE = ['Quito - Matriz', 'Ibarra', 'Santo Domingo', 'Esmeraldas', 'Ambato', 'Manabí'];
const OPCIONES_CARRERA = ['Ingeniería en Sistemas', 'Administración de Empresas', 'Psicología', 'Derecho', 'Educación', 'Comunicación'];
const OPCIONES_GRUPO_INV = [
  'ACCIÓN EDUCATIVA POR LA PRESERVACIÓN DEL MEDIO AMBIENTE',
  'Actividad Física y Salud',
  'Adulto mayor y cuidados paliativos',
  'AGROINNOVA',
  'Aprendizaje Servicio en la Educación Superior',
  'Aprendizaje-Servicio',
  'Autismo, desarrollo psíquico, psicoanálisis, arte y sociedad.',
  'AUTOCONCEPTO Y APRENDIZAJE',
  'Autocuidado Personal para la Salud y Bienestar. PUCESE',
  'Automática e Ingeniería Informática en la Industria.',
  'Biocolecciones PUCE',
  'Biodiversidad y Sociedad',
  'Biodiversidad, Salud y Conservación de ecosistemas marinos',
  'BIODIVERSIDAD, SALUD Y CONSERVACIÓN DE LOS ECOSISTEMAS MARINOS',
  'Calidad e inocuidad alimentaria y gestión ambiental',
  'Centro de ciencia experimental e innovación',
  'Centro Neotropical para Investigación de la Biomasa',
  'Cerebro y Mente: Grupo de investigación en Neuropsicología Clínica',
  'Ciencia, Sociología y Conocimiento',
  'Ciencias Computacionales Aplicadas',
  'Ciudad y Paisaje',
  'Colectivo de Investigación de Ingeniería y Arquitectura',
  'Comciencia',
  'Community and Primary Care Research Group Ecuador',
  'COMUNICACIÓN INSTITUCIONAL',
  'Con Lo Que Hay: Investigación aplicada a proyectos de bien común.',
  'Contextos',
  'CONTEXTOS: Laboratorio de Cultura y Espacio Urbano',
  'Creación artística, imagen y contexto',
  'Creación, Educación, Pensamiento en las Artes y Arquitectura',
  'Cuidado Integral al Adulto',
  'Cuidado Responsable, Equidad, Ciencia, Educación y Respeto',
  'Cultura y Patrimonio',
  'Cultura, Innovación, Tecnología y Diseño',
  'Cultura, memoria y territorio',
  'Cultura, Territorio y Salud',
];
const OPCIONES_RED_ACADEMICA = [
  'ALLIANCE FOR TROPICAL FOREST SCIENCE',
  'ASOCIACIÓN LACANIANA INTERNACIONAL',
  'ASOCIACIÓN LATINOAMERICANA DE INVESTIGADORES DE LA COMUNICACIÓN',
  'ATELOPUS SURVIVAL INITIATIVE',
  'CÁTEDRAS ESCHOLAS',
  'CENTRE DE RECHERCHES IBÉRIQUES ET IBÉRO-AMÉRICAINES - CRIIA',
  'CENTRO INTERNACIONAL DE ESTUDIOS SUPERIORES DE COMUNICACIÓN PARA AMERICA LATINA',
  'CONSORCIO EUROPEO DE GENÓMICA DE LA POBLACIÓN DE DROSOPHILA - DROSEU',
  'COVID-HL NETWORK',
  'DRYFLOR LATIN AMERICAN SEASONALLY DRY TROPICAL FOREST FLORISTIC NETWORK',
  'FEDERACIÓN LATINOAMERICANA DE COLECCIONES DE CULTIVOS (FELACC)',
  'FUNDACIÓN PARA EL ANÁLISIS ESTRATÉGICO Y DESARROLLO DE LA PEQUEÑA Y MEDIANA EMPRESA - FAEDPYME',
  'GEI ROUSSEAU-Grupo de Estudios Iberoamericanos Rousseau',
  'GLOBAL ASSESSMENT OF REPTILE DISTRIBUTIONS - GARD',
  'GLOBAL CONSERVATION CONSORTIUM FOR MAGNOLIA',
  'GLOBAL GENOME BIODIVERSITY NETWORK - GGBN',
  'GRUPO DE TRABAJO: ENERGÍA Y DESARROLLO SUSTENTABLE (CLACSO)',
  "GRUPS DE RECERCA D' AMÈRICA I ÀFRICA LLATINES GRAAL, NODO ECUADOR",
  'INTERNACIONAL POLITICAL SCIENCE ASSOCIATIN (IPSA)',
  'INTERNATIONAL COMMISSION ON YEAST (ICY)',
];
const OPCIONES_LINEA_INV = [
  'Administración eficiente y eficaz de las organizaciones para la competitividad sostenible local y global',
  'Artes, diseño, lenguaje, literatura y oralidad',
  'Conservación de la biodiversidad',
  'Derecho, participación, gobernanza, regímenes políticos e institucionalidad',
  'Didáctica y aplicación de las ciencias físicas y matemáticas',
  'Diseño, infraestructura y sistemas sociales y ambientales para un hábitat sostenible',
  'Educación, comunicación, culturas, sociedad y valores',
  'Gestión sostenible y aprovechamiento de los recursos naturales',
  'Inequidades, exclusiones, desigualdades y derechos humanos',
  'Investigación histórica de hechos, procesos y ciencias',
  'Salud integral, determinación social de la salud y desarrollo humano',
  'Salud y grupos vulnerables',
  'Tecnologías de la información y la comunicación',
];
const OPCIONES_LINEA_ESTRATEGICA = ['OE7 FOMENTAR LA VINCULACIÓN SOCIAL TRANSFORMADORA'];
const OPCIONES_TIPO_ACTORES = ['Gobierno local', 'Organización comunitaria', 'ONG', 'Sector privado', 'Sector académico'];
const OPCIONES_SI_NO = ['SI', 'NO'];
const OPCIONES_ALCANCE_TERRITORIAL = ['CANTONAL2', 'INSTITUCIONAL', 'INTERNACIONAL', 'NACIONAL', 'PARROQUIAL', 'PROVINCIAL'];
const OPCIONES_FUENTE_FINANCIAMIENTO = ['Interno', 'Externo'];
const OPCIONES_INSTRUMENTO_LEGAL = ['Carta de Solicitud o Pedido', 'Convenio Marco', 'Convenio Específico de Cooperación Interinstitucional', 'No Aplica'];
const OPCIONES_TIPO_IMPACTO = ['SOCIAL', 'ECONÓMICO', 'AMBIENTAL', 'CIENTÍFICO-ACADÉMICO', 'OTRO'];
const OPCIONES_PROPIEDAD_INTELECTUAL = ['Derechos de Autor', 'Diseños Industriales', 'Indicaciones Geográficas', 'Marca', 'Modelos de Utilidad', 'Obtenciones Vegetales', 'Patentes de Invención', 'Secretos Empresariales'];
const OPCIONES_OBJETIVO = [
  'Objetivo 1: Mejorar las condiciones de vida de la población de forma integral, promoviendo el acceso equitativo a salud, vivienda y bienestar social',
  'Objetivo 2: Impulsar las capacidades de la ciudadanía con educación equitativa e inclusiva de calidad y promoviendo espacios de intercambio cultural',
  'Objetivo 3: Garantizar la seguridad integral, la paz ciudadana y transformar el sistema de justicia respetando los derechos humanos',
  'Objetivo 4: Estimular el sistema económico y de finanzas públicas para dinamizar la inversión y las relaciones comerciales',
  'Objetivo 5: Fomentar de manera sustentable la producción mejorando los niveles de productividad',
  'Objetivo 6: Incentivar la generación de empleo digno',
  'Objetivo 7: Precautelar el uso responsable de los recursos naturales con un entorno ambientalmente sostenible',
  'Objetivo 8: Impulsar la conectividad como fuente de desarrollo y crecimiento económico y sostenible',
  'Objetivo 9: Propender la construcción de un Estado eficiente, transparente y orientado al bienestar social.',
];
const OPCIONES_ODS = [
  '10: GARANTIZAR LA SOBERANÍA NACIONAL, INTEGRIDAD TERRITORIAL Y SEGURIDAD DEL ESTADO',
  '11. CIUDADES Y ASENTAMIENTOS HUMANOS INCLUSIVOS, SEGUROS, RESILIENTES Y SOSTENIBLES',
  '12. PRODUCCIÓN Y CONSUMO RESPONSABLES',
  '15. BOSQUES SOSTENIBLES, DETENER LA DESERTIFICACIÓN Y LA PÉRDIDA DE BIODIVERSIDAD',
  '16. PROMOVER SOCIEDADES JUSTAS, PACÍFICAS E INCLUSIVAS',
  '2. HAMBRE CERO Y SEGURIDAD ALIMENTARIA',
  '3. SALUD Y BIENESTAR',
  '4. EDUCACIÓN INCLUSIVA, EQUITATIVA Y DE CALIDAD',
  '5. IGUALDAD DE GÉNERO Y EMPODERAMIENTO DE LA MUJER',
  '6. AGUA LIMPIA Y SANEAMIENTO',
  '7: POTENCIAR LAS CAPACIDADES DE LA CIUDADANÍA Y PROMOVER UNA EDUCACIÓN INNOVADORA, INCLUSIVA Y DE CALIDAD DE TODOS LOS NIVELES',
  '8. TRABAJO DECENTE Y CRECIMIENTO ECONÓMICO SOSTENIDO, INCLUSIVO Y SOSTENIBLE',
];

/* Clasificación CINE (Campo Amplio/Específico/Detallado) derivada de la carrera principal. */
const CINE_POR_CARRERA: Record<string, { campoAmplio: string; campoEspecifico: string; campoDetallado: string }> = {
  'Ingeniería en Sistemas': { campoAmplio: '06 - Tecnologías de la Información y la Comunicación (TIC)', campoEspecifico: '061 - TIC', campoDetallado: '0613 - Desarrollo y análisis de software y aplicaciones' },
  'Administración de Empresas': { campoAmplio: '04 - Administración de Empresas y Derecho', campoEspecifico: '041 - Negocios y Administración', campoDetallado: '0411 - Comercio' },
  'Psicología': { campoAmplio: '03 - Ciencias Sociales, Periodismo y Información', campoEspecifico: '031 - Ciencias Sociales y del Comportamiento', campoDetallado: '0313 - Psicología' },
  'Derecho': { campoAmplio: '04 - Administración de Empresas y Derecho', campoEspecifico: '042 - Derecho', campoDetallado: '0421 - Derecho' },
  'Educación': { campoAmplio: '01 - Educación', campoEspecifico: '011 - Educación', campoDetallado: '0111 - Educación' },
  'Comunicación': { campoAmplio: '03 - Ciencias Sociales, Periodismo y Información', campoEspecifico: '032 - Periodismo y Información', campoDetallado: '0321 - Periodismo y reportería' },
};

/* Grupos Femenino/Masculino/Total para la sección de beneficiarios. */
const BENEFICIARY_FM_GROUPS: { title: string; fKey: string; mKey: string }[] = [
  { title: 'Personas Alcanzadas', fKey: 'personasAlcanzadasFemeninos', mKey: 'personasAlcanzadasMasculinos' },
  { title: 'Beneficiarios Directos', fKey: 'beneficiariosDirectosFemeninos', mKey: 'beneficiariosDirectosMasculinos' },
  { title: 'Beneficiarios Indirectos', fKey: 'beneficiariosIndirectosFemeninos', mKey: 'beneficiariosIndirectosMasculinos' },
];

/* ───────── Secciones del formulario (basado en el formulario SharePoint) ───────── */
const SECTIONS: SectionConfig[] = [
  {
    id: 'identificacion', icon: '📋', title: 'Identificación del Proyecto',
    fields: [
      { key: 'nombreProyecto', label: 'NOMBRE DEL PROYECTO', type: 'text', required: true, colSpan: 2, help: 'El título deberá expresar la idea principal del proyecto que se propone.' },
      { key: 'tipo', label: 'TIPO', type: 'select', options: OPCIONES_TIPO },
      { key: 'origenProyecto', label: 'ORIGEN DEL PROYECTO', type: 'select', required: true, options: OPCIONES_ORIGEN },
      { key: 'ambitoProyecto', label: 'Ámbito del Proyecto', type: 'select', required: true, options: OPCIONES_AMBITO },
      { key: 'ejeVinculacion', label: 'Eje de Vinculación', type: 'select', required: true, options: OPCIONES_EJE },
      { key: 'dominioAcademico', label: 'DOMINIO ACADÉMICO', type: 'select', required: true, options: OPCIONES_DOMINIO },
      { key: 'articulacionFuncionesSustantivas', label: 'ARTICULACIÓN DE FUNCIONES SUSTANTIVAS', type: 'select', required: true, options: OPCIONES_ARTICULACION_FUNCIONES },
      { key: 'articulacionFuncionesJustificacion', label: 'JUSTIFICACIÓN DE LA ARTICULACIÓN', type: 'textarea', colSpan: 2, help: 'Explique por qué el proyecto se articula con la(s) función(es) seleccionada(s).' },
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
      { key: 'grupoInvestigacion', label: 'GRUPO DE INVESTIGACIÓN', type: 'select', options: OPCIONES_GRUPO_INV },
      { key: 'lineaInvestigacion', label: 'LÍNEA DE INVESTIGACIÓN', type: 'select', options: OPCIONES_LINEA_INV },
      { key: 'lineaEstrategica', label: 'LÍNEA ESTRATÉGICA', type: 'select', options: OPCIONES_LINEA_ESTRATEGICA },
      { key: 'proyectoInvestigacion', label: 'PROYECTO INVESTIGACIÓN', type: 'text', help: '¿El proyecto de vinculación surge a partir del desarrollo de un proyecto de investigación previo?' },
      { key: 'articulaInvestigacionPuce', label: '¿El proyecto se articula con alguna investigación PUCE?', type: 'text' },
      { key: 'redAcademicaArticulada', label: 'RED ACADÉMICA ARTICULADA', type: 'multiselect', options: OPCIONES_RED_ACADEMICA, colSpan: 2 },
      { key: 'identificacion', label: 'IDENTIFICACION', type: 'text', help: 'Número de cédula, pasaporte, etc.' },
    ],
  },
  {
    id: 'diagnostico', icon: '🔍', title: 'Diagnóstico y Justificación',
    fields: [
      { key: 'diagnosticoProblemaActores', label: 'DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS', type: 'textarea' },
      { key: 'objetivo', label: 'OBJETIVO', type: 'select', options: OPCIONES_OBJETIVO },
      { key: 'resumen', label: 'Resumen', type: 'textarea' },
      { key: 'problemaContraparteDiagnostico', label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE', type: 'textarea', help: 'Máximo 200 palabras' },
      { key: 'campoAmplio', label: 'CAMPO AMPLIO', type: 'readonly', help: 'Se completa automáticamente según la carrera principal (Coordinación y Académico).' },
      { key: 'campoEspecifico', label: 'CAMPO ESPECÍFICO', type: 'readonly', help: 'Se completa automáticamente según la carrera principal.' },
      { key: 'campoDetallado', label: 'CAMPO DETALLADO', type: 'readonly', help: 'Se completa automáticamente según la carrera principal.' },
      { key: 'ods', label: 'ODS', type: 'select', options: OPCIONES_ODS },
      { key: 'mapeoActores', label: 'Mapeo de Actores y responsabilidades', type: 'textarea' },
      { key: 'tipoActoresSociales', label: 'TIPO DE ACTORES SOCIALES', type: 'select', options: OPCIONES_TIPO_ACTORES },
      { key: 'descripcionTipoVinculacion', label: 'Descripción del Tipo de Vinculación', type: 'textarea' },
    ],
  },
  {
    id: 'contraparte', icon: '🤝', title: 'Contraparte y Convenio',
    fields: [
      { key: 'nombreContraparte', label: 'NOMBRE DE CONTRAPARTE', type: 'text' },
      { key: 'instrumentoLegalContraparte', label: 'Instrumento Legal de la Contraparte', type: 'select', required: true, options: OPCIONES_INSTRUMENTO_LEGAL },
      { key: 'problemaContraparteConvenio', label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE', type: 'textarea', help: 'Máximo 200 palabras' },
    ],
  },
  {
    id: 'alcance', icon: '🌍', title: 'Alcance Territorial y Beneficiarios',
    fields: [
      { key: 'alcanceTerritorial', label: 'ALCANCE TERRITORIAL', type: 'select', options: OPCIONES_ALCANCE_TERRITORIAL },
      { key: 'nombreComunidadAlcanzada', label: 'NOMBRE DE COMUNIDAD ALCANZADA', type: 'text' },
      { key: 'criteriosSeleccionBeneficiarios', label: 'CRITERIOS DE SELECCIÓN DE BENEFICIARIOS ENTRE LA POBLACIÓN OBJETIVO', type: 'textarea' },
      { key: 'detalleCalculoComunidad', label: 'Detalle del cálculo de la comunidad participante', type: 'textarea' },
      { key: 'numeroPersonasAlcanzadas', label: 'NÚMERO DE PERSONAS ALCANZADAS', type: 'number' },
      { key: 'personasAlcanzadasFemeninos', label: 'Personas Alcanzadas Femeninos', type: 'number' },
      { key: 'personasAlcanzadasMasculinos', label: 'Personas Alcanzadas Masculinos', type: 'number' },
      { key: 'beneficiariosDirectosFemeninos', label: 'Beneficiarios Directos Femeninos', type: 'number' },
      { key: 'beneficiariosDirectosMasculinos', label: 'Beneficiarios Directos Masculinos', type: 'number' },
      { key: 'beneficiariosIndirectosFemeninos', label: 'Beneficiarios Indirectos Femeninos', type: 'number' },
      { key: 'beneficiariosIndirectosMasculinos', label: 'Beneficiarios Indirectos Masculinos', type: 'number' },
      { key: 'numComunidad1f', label: 'Número de Comunidad Femenino Primer Semestre', type: 'number' },
      { key: 'numComunidad1m', label: 'Número de Comunidad Masculino Primer Semestre', type: 'number' },
      { key: 'numComunidad2f', label: 'Número de Comunidad Femenino Segundo Semestre', type: 'number' },
      { key: 'numComunidad2m', label: 'Número de Comunidad Masculino Segundo Semestre', type: 'number' },
    ],
  },
  {
    id: 'componentes', icon: '🧩', title: 'Componentes Especiales',
    fields: [
      { key: 'componenteInterculturalidad', label: 'COMPONENTE DE INTERCULTURALIDAD', type: 'select', options: OPCIONES_SI_NO },
      { key: 'detalleInterculturalidad', label: 'DETALLE — INTERCULTURALIDAD', type: 'text', showIf: (d) => d.componenteInterculturalidad === 'SI' },
      { key: 'componenteInterdisciplinariedad', label: 'COMPONENTE DE INTERDISCIPLINARIEDAD', type: 'select', options: OPCIONES_SI_NO },
      { key: 'detalleInterdisciplinariedad', label: 'DETALLE — INTERDISCIPLINARIEDAD', type: 'text', showIf: (d) => d.componenteInterdisciplinariedad === 'SI' },
      { key: 'componenteInternacionalizacion', label: 'COMPONENTE DE INTERNACIONALIZACIÓN', type: 'select', options: OPCIONES_SI_NO },
      { key: 'detalleInternacionalizacion', label: 'DETALLE — INTERNACIONALIZACIÓN', type: 'text', showIf: (d) => d.componenteInternacionalizacion === 'SI' },
      { key: 'componentePosgrados', label: 'COMPONENTE DE POSGRADOS', type: 'select', required: true, options: OPCIONES_SI_NO },
      { key: 'detallePosgrados', label: 'DETALLE — POSGRADOS', type: 'text', showIf: (d) => d.componentePosgrados === 'SI' },
      { key: 'componenteIntersedes', label: 'COMPONENTE INTERSEDES', type: 'select', required: true, options: OPCIONES_SI_NO },
      { key: 'detalleIntersedes', label: 'DETALLE — INTERSEDES', type: 'text', showIf: (d) => d.componenteIntersedes === 'SI' },
    ],
  },
  {
    id: 'participantes', icon: '👥', title: 'Participantes (Docentes/Estudiantes/Otros)',
    fields: [
      { key: 'numeroDocentesVinculados', label: 'NÚMERO DE DOCENTES VINCULADOS (1ER SEMESTRE)', type: 'number' },
      { key: 'numeroDocentesVinculados2do', label: 'NÚMERO DE DOCENTES VINCULADOS (2DO SEMESTRE)', type: 'number' },
      { key: 'numeroEstudiantesVinculados', label: 'NÚMERO DE ESTUDIANTES VINCULADOS (1ER SEMESTRE)', type: 'number' },
      { key: 'numeroEstudiantesVinculados2do', label: 'NÚMERO DE ESTUDIANTES VINCULADOS (2DO SEMESTRE)', type: 'number' },
      { key: 'numeroAdministrativosVinculados', label: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS (1ER SEMESTRE)', type: 'number' },
      { key: 'numeroAdministrativosVinculados2do', label: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS (2DO SEMESTRE)', type: 'number' },
      { key: 'numeroAlumniVinculados', label: 'NÚMERO DE ALUMNI VINCULADOS (1ER SEMESTRE)', type: 'number' },
      { key: 'numeroAlumniVinculados2do', label: 'NÚMERO DE ALUMNI VINCULADOS (2DO SEMESTRE)', type: 'number' },
      { key: 'resultadosAprendizaje', label: 'RESULTADOS DE APRENDIZAJE', type: 'textarea' },
      { key: 'asesoria', label: 'ASESORÍA', type: 'select', options: OPCIONES_SI_NO },
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
      { key: 'fuenteFinanciamiento', label: 'FUENTE DE FINANCIAMIENTO', type: 'select', options: OPCIONES_FUENTE_FINANCIAMIENTO },
      { key: 'presupuestoPlanificado', label: 'PRESUPUESTO PLANIFICADO', type: 'number' },
      { key: 'presupuestoEjecutado', label: 'PRESUPUESTO EJECUTADO', type: 'number' },
      { key: 'presupuestoExterno', label: 'PRESUPUESTO EXTERNO PLANIFICADO', type: 'number', showIf: (d) => d.fuenteFinanciamiento === 'Externo' },
      { key: 'presupuestoExternoAsignado', label: 'PRESUPUESTO EXTERNO ASIGNADO', type: 'number', showIf: (d) => d.fuenteFinanciamiento === 'Externo' },
      { key: 'gastoNoContemplado', label: 'GASTO NO CONTEMPLADO', type: 'text' },
      { key: 'parametroCumplimiento', label: 'PARÁMETRO DE CUMPLIMIENTO', type: 'text' },
    ],
  },
  {
    id: 'impactos', icon: '🌱', title: 'Impactos del Proyecto',
    fields: [],
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

/* ───────── Combobox de opción múltiple con búsqueda y chips ───────── */
function MultiSelectField({ options, selected, onChange, showError }: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  showError?: boolean;
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

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o)
  );

  const add = (val: string) => {
    onChange([...selected, val]);
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
          placeholder="Escriba para filtrar..."
          className={`w-full pl-10 pr-9 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] ${
            showError ? 'border-red-400 bg-red-50' : 'border-[#D0D5DD]'
          }`}
        />
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054]" />
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {filtered.map((o) => (
            <li
              key={o}
              className="px-4 py-2 text-sm text-[#344054] cursor-pointer hover:bg-[#F5F7FA]"
              onClick={() => add(o)}
            >
              {o}
            </li>
          ))}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-[#003366] text-white text-sm rounded-full max-w-full">
              <span className="truncate">{s}</span>
              <button type="button" onClick={() => remove(s)} className="hover:bg-white/20 rounded-full p-0.5 flex-shrink-0">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-[#6B7280] mt-1.5">{selected.length} seleccionada(s)</p>
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
  const isWide = field.type === 'textarea' || field.type === 'file' || field.type === 'multiselect' || field.colSpan === 2;
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

      {field.type === 'multiselect' && (
        <MultiSelectField
          options={field.options || []}
          selected={Array.isArray(value) ? value : []}
          onChange={onChange}
          showError={showError}
        />
      )}

      {field.type === 'file' && <FileField value={value} onChange={onChange} />}

      {field.type === 'readonly' && (
        <div className="w-full px-4 py-3 border border-[#E1E4E8] rounded-lg bg-[#F5F7FA] text-[#6B7280] text-sm">
          {value || '—'}
        </div>
      )}

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

  const carreraPrincipal: string = (formData.carrerasInvolucradas || [])[0] || '';
  const cineInfo = CINE_POR_CARRERA[carreraPrincipal];
  const derivedCine: Record<string, string> = {
    campoAmplio: cineInfo?.campoAmplio || '',
    campoEspecifico: cineInfo?.campoEspecifico || '',
    campoDetallado: cineInfo?.campoDetallado || '',
  };
  const getFieldValue = (field: FieldConfig) =>
    field.type === 'readonly' ? (derivedCine[field.key] ?? formData[field.key]) : formData[field.key];

  const rawCarreras: string[] = formData.carrerasInvolucradas || [];
  const rawImpactos: ImpactoEntry[] = formData.impactosList || [];

  const customErrors: Record<string, boolean> = {
    coordinacion: rawCarreras.filter(Boolean).length === 0,
    impactos: rawImpactos.length === 0 || rawImpactos.some((i) => !i.tipo || !i.descripcion),
  };
  const hasCustomErrors = Object.values(customErrors).some(Boolean);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmitClick = () => {
    if (missingKeys.length > 0 || hasCustomErrors) {
      setShowErrors(true);
      const firstErrorSection = SECTIONS.find(
        (s) => s.fields.some((f) => missingKeys.includes(f.key)) || customErrors[s.id]
      );
      if (firstErrorSection) scrollToSection(firstErrorSection.id);
      return;
    }
    setShowSummary(true);
  };

  const renderGenericGrid = (section: SectionConfig) => (
    <div className="grid md:grid-cols-2 gap-6">
      {section.fields.filter((f) => !f.showIf || f.showIf(formData)).map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={getFieldValue(field)}
          onChange={(v) => updateField(field.key, v)}
          showError={showErrors && missingKeys.includes(field.key)}
        />
      ))}
    </div>
  );

  const renderCoordinacion = (section: SectionConfig) => {
    const carrerasDisplay = rawCarreras.length > 0 ? rawCarreras : [''];
    const updateCarrera = (i: number, v: string) => updateField('carrerasInvolucradas', carrerasDisplay.map((c, idx) => (idx === i ? v : c)));
    const addCarrera = () => updateField('carrerasInvolucradas', [...carrerasDisplay, '']);
    const removeCarrera = (i: number) => updateField('carrerasInvolucradas', carrerasDisplay.filter((_, idx) => idx !== i));

    return (
      <>
        {renderGenericGrid(section)}
        <div className="mt-6 pt-6 border-t border-[#E1E4E8]">
          <label className="block text-[#344054] font-medium mb-2 text-sm">
            Carreras Involucradas <span className="text-red-500">*</span>
            <span className="ml-2 text-xs text-[#6B7280] font-normal">
              ({rawCarreras.filter(Boolean).length} registrada(s) — la primera se considera la carrera principal)
            </span>
          </label>
          <div className="space-y-2">
            {carrerasDisplay.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={c}
                  onChange={(e) => updateCarrera(i, e.target.value)}
                  className={`flex-1 px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                    showErrors && customErrors.coordinacion ? 'border-red-400 bg-red-50' : 'border-[#D0D5DD]'
                  }`}
                >
                  <option value="">Seleccionar carrera...</option>
                  {OPCIONES_CARRERA.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {i === 0 && <span className="text-xs text-[#0056B3] font-semibold whitespace-nowrap">Principal</span>}
                {carrerasDisplay.length > 1 && (
                  <button type="button" onClick={() => removeCarrera(i)} className="text-red-500 hover:text-red-700">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addCarrera} className="mt-3 text-sm text-[#0056B3] font-semibold hover:underline">
            + Agregar carrera
          </button>
        </div>
      </>
    );
  };

  const renderContraparte = (section: SectionConfig) => {
    const instrumento = formData.instrumentoLegalContraparte;
    const esCartaSolicitud = instrumento === 'Carta de Solicitud o Pedido';
    const noAplica = instrumento === 'No Aplica';
    return (
      <>
        {renderGenericGrid(section)}
        {!noAplica && (
          <div className="mt-6 pt-6 border-t border-[#E1E4E8]">
            <label className="block text-[#344054] font-medium mb-2 text-sm">
              {esCartaSolicitud ? 'Adjuntar carta de solicitud' : 'Adjuntar convenio'}
            </label>
            <p className="text-xs text-[#6B7280] mb-2">
              {instrumento ? `Documento seleccionado: ${instrumento}` : 'Seleccione arriba el Instrumento Legal de la Contraparte.'}
            </p>
            <FileField value={formData.archivoConvenio} onChange={(v) => updateField('archivoConvenio', v)} />
          </div>
        )}
      </>
    );
  };

  const renderAlcance = (section: SectionConfig) => {
    const beneficiaryKeys = new Set([
      'numeroPersonasAlcanzadas',
      ...BENEFICIARY_FM_GROUPS.flatMap((g) => [g.fKey, g.mKey]),
      'numComunidad1f', 'numComunidad1m', 'numComunidad2f', 'numComunidad2m',
    ]);
    const restFields = section.fields.filter((f) => f.key !== 'alcanceTerritorial' && !beneficiaryKeys.has(f.key));
    const numeroPersonasField = section.fields.find((f) => f.key === 'numeroPersonasAlcanzadas')!;

    const fm = (fKey: string, mKey: string) => {
      const f = Number(formData[fKey]) || 0;
      const m = Number(formData[mKey]) || 0;
      return { f, m, total: f + m };
    };
    const com1 = fm('numComunidad1f', 'numComunidad1m');
    const com2 = fm('numComunidad2f', 'numComunidad2m');

    return (
      <>
        <div className="grid md:grid-cols-2 gap-6">
          <FieldRenderer
            field={section.fields.find((f) => f.key === 'alcanceTerritorial')!}
            value={formData.alcanceTerritorial}
            onChange={(v) => updateField('alcanceTerritorial', v)}
            showError={showErrors && missingKeys.includes('alcanceTerritorial')}
          />
          {restFields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={formData[field.key]}
              onChange={(v) => updateField(field.key, v)}
              showError={showErrors && missingKeys.includes(field.key)}
            />
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-[#E1E4E8]">
          <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2 text-sm">👥 BENEFICIARIOS</h3>

          <div className="mb-4 max-w-sm">
            <FieldRenderer
              field={numeroPersonasField}
              value={formData.numeroPersonasAlcanzadas}
              onChange={(v) => updateField('numeroPersonasAlcanzadas', v)}
              showError={showErrors && missingKeys.includes('numeroPersonasAlcanzadas')}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {BENEFICIARY_FM_GROUPS.map((g) => {
              const { total } = fm(g.fKey, g.mKey);
              return (
                <div key={g.title} className="bg-[#F5F7FA] rounded-lg p-4 border border-[#D0D5DD]">
                  <p className="text-sm font-semibold text-[#344054] mb-3">{g.title}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-[#6B7280] mb-1">Femenino</label>
                      <input
                        type="number" min={0}
                        value={formData[g.fKey] ?? ''}
                        onChange={(e) => updateField(g.fKey, e.target.value)}
                        className="w-full px-2 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#6B7280] mb-1">Masculino</label>
                      <input
                        type="number" min={0}
                        value={formData[g.mKey] ?? ''}
                        onChange={(e) => updateField(g.mKey, e.target.value)}
                        className="w-full px-2 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#6B7280] mb-1">Total</label>
                      <div className="px-2 py-2 border border-[#D0D5DD] rounded text-sm bg-white font-semibold text-[#003366] text-center">{total}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 bg-[#F5F7FA] rounded-lg p-5 border border-[#D0D5DD]">
            <h4 className="text-[#003366] font-semibold mb-3 text-sm">Comunidad Participante por Semestre</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-[#D0D5DD] px-3 py-2 text-left text-xs font-semibold text-[#344054]">Semestre</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-center text-xs font-semibold text-[#344054]">Femenino</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-center text-xs font-semibold text-[#344054]">Masculino</th>
                    <th className="border border-[#D0D5DD] px-3 py-2 text-center text-xs font-semibold text-[#344054]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-[#D0D5DD] px-3 py-2 text-sm text-[#344054]">1er Semestre</td>
                    <td className="border border-[#D0D5DD] px-2 py-2">
                      <input
                        type="number" min={0}
                        value={formData.numComunidad1f ?? ''}
                        onChange={(e) => updateField('numComunidad1f', e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      />
                    </td>
                    <td className="border border-[#D0D5DD] px-2 py-2">
                      <input
                        type="number" min={0}
                        value={formData.numComunidad1m ?? ''}
                        onChange={(e) => updateField('numComunidad1m', e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      />
                    </td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-semibold text-[#003366]">{com1.total}</td>
                  </tr>
                  <tr className="bg-[#F9FAFB]">
                    <td className="border border-[#D0D5DD] px-3 py-2 text-sm text-[#344054]">2do Semestre</td>
                    <td className="border border-[#D0D5DD] px-2 py-2">
                      <input
                        type="number" min={0}
                        value={formData.numComunidad2f ?? ''}
                        onChange={(e) => updateField('numComunidad2f', e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      />
                    </td>
                    <td className="border border-[#D0D5DD] px-2 py-2">
                      <input
                        type="number" min={0}
                        value={formData.numComunidad2m ?? ''}
                        onChange={(e) => updateField('numComunidad2m', e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]"
                      />
                    </td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-semibold text-[#003366]">{com2.total}</td>
                  </tr>
                  <tr className="bg-[#E6F0FF]">
                    <td className="border border-[#D0D5DD] px-3 py-2 text-sm font-bold text-[#003366]">Total General</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-bold text-[#003366]">{com1.f + com2.f}</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-bold text-[#003366]">{com1.m + com2.m}</td>
                    <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-bold text-[#0056B3]">{com1.total + com2.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderParticipantes = (section: SectionConfig) => {
    const n = (k: string) => Number(formData[k]) || 0;
    const rows = [
      { label: 'Docentes', k1: 'numeroDocentesVinculados', k2: 'numeroDocentesVinculados2do' },
      { label: 'Estudiantes', k1: 'numeroEstudiantesVinculados', k2: 'numeroEstudiantesVinculados2do' },
      { label: 'Administrativos', k1: 'numeroAdministrativosVinculados', k2: 'numeroAdministrativosVinculados2do' },
      { label: 'Alumni', k1: 'numeroAlumniVinculados', k2: 'numeroAlumniVinculados2do' },
    ];
    const total1er = rows.reduce((sum, r) => sum + n(r.k1), 0);
    const total2do = rows.reduce((sum, r) => sum + n(r.k2), 0);
    const totalGeneral = total1er + total2do;
    const restFields = section.fields.filter((f) => !rows.some((r) => r.k1 === f.key || r.k2 === f.key));

    return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#003366] text-white">
                <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Categoría</th>
                <th className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-semibold">1er Semestre</th>
                <th className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-semibold">2do Semestre</th>
                <th className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label} className={i % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}>
                  <td className="border border-[#D0D5DD] px-4 py-3 text-sm font-medium text-[#344054]">{r.label}</td>
                  <td className="border border-[#D0D5DD] px-2 py-2">
                    <input
                      type="number" min={0}
                      value={formData[r.k1] ?? ''}
                      onChange={(e) => updateField(r.k1, e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                  </td>
                  <td className="border border-[#D0D5DD] px-2 py-2">
                    <input
                      type="number" min={0}
                      value={formData[r.k2] ?? ''}
                      onChange={(e) => updateField(r.k2, e.target.value)}
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                  </td>
                  <td className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-semibold text-[#003366]">{n(r.k1) + n(r.k2)}</td>
                </tr>
              ))}
              <tr className="bg-[#E6F0FF]">
                <td className="border border-[#D0D5DD] px-4 py-3 text-sm font-bold text-[#003366]">Total General</td>
                <td className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-bold text-[#003366]">{total1er}</td>
                <td className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-bold text-[#003366]">{total2do}</td>
                <td className="border border-[#D0D5DD] px-4 py-3 text-center text-sm font-bold text-[#0056B3]">{totalGeneral}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#E1E4E8]">
          {restFields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={formData[field.key]}
              onChange={(v) => updateField(field.key, v)}
              showError={showErrors && missingKeys.includes(field.key)}
            />
          ))}
        </div>
      </>
    );
  };

  const renderComponentes = (section: SectionConfig) => {
    const items: { main: string; detail: string; label: string; required?: boolean }[] = [
      { main: 'componenteInterculturalidad', detail: 'detalleInterculturalidad', label: 'Componente de Interculturalidad' },
      { main: 'componenteInterdisciplinariedad', detail: 'detalleInterdisciplinariedad', label: 'Componente de Interdisciplinariedad' },
      { main: 'componenteInternacionalizacion', detail: 'detalleInternacionalizacion', label: 'Componente de Internacionalización' },
      { main: 'componentePosgrados', detail: 'detallePosgrados', label: 'Componente de Posgrados', required: true },
      { main: 'componenteIntersedes', detail: 'detalleIntersedes', label: 'Componente Intersedes', required: true },
    ];

    return (
      <div className="space-y-4">
        {items.map((item) => {
          const showDetail = formData[item.main] === 'SI';
          const detailField = section.fields.find((f) => f.key === item.detail)!;
          return (
            <div key={item.main} className="p-4 border border-[#D0D5DD] rounded-lg bg-[#F5F7FA]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-[#344054]">
                  {item.label} {item.required && <span className="text-red-500">*</span>}
                </span>
                <select
                  value={formData[item.main] || ''}
                  onChange={(e) => updateField(item.main, e.target.value)}
                  className={`w-44 px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                    showErrors && missingKeys.includes(item.main) ? 'border-red-400 bg-red-50' : 'border-[#D0D5DD]'
                  }`}
                >
                  <option value="">Seleccionar...</option>
                  {OPCIONES_SI_NO.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {showDetail && (
                <div className="mt-3 pl-3 border-l-2 border-[#0056B3]">
                  <FieldRenderer
                    field={detailField}
                    value={formData[item.detail]}
                    onChange={(v) => updateField(item.detail, v)}
                    showError={false}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderImpactos = () => {
    const display: ImpactoEntry[] = rawImpactos.length > 0 ? rawImpactos : [{ tipo: '', descripcion: '' }];
    const updateImpacto = (i: number, patch: Partial<ImpactoEntry>) =>
      updateField('impactosList', display.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
    const addImpacto = () => updateField('impactosList', [...display, { tipo: '', descripcion: '' }]);
    const removeImpacto = (i: number) => updateField('impactosList', display.filter((_, idx) => idx !== i));

    return (
      <div className="space-y-4">
        {display.map((item, i) => (
          <div key={i} className="flex gap-3 items-start p-4 border border-[#E1E4E8] rounded-lg">
            <div className="w-56 flex-shrink-0">
              <label className="block text-[#344054] font-medium mb-2 text-sm">
                Tipo de impacto <span className="text-red-500">*</span>
              </label>
              <select
                value={item.tipo}
                onChange={(e) => updateImpacto(i, { tipo: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  showErrors && customErrors.impactos && !item.tipo ? 'border-red-400 bg-red-50' : 'border-[#D0D5DD]'
                }`}
              >
                <option value="">Seleccionar...</option>
                {OPCIONES_TIPO_IMPACTO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[#344054] font-medium mb-2 text-sm">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={item.descripcion}
                onChange={(e) => updateImpacto(i, { descripcion: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  showErrors && customErrors.impactos && !item.descripcion ? 'border-red-400 bg-red-50' : 'border-[#D0D5DD]'
                }`}
              />
            </div>
            {display.length > 1 && (
              <button type="button" onClick={() => removeImpacto(i)} className="mt-8 text-red-500 hover:text-red-700">
                <X size={18} />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addImpacto} className="text-sm text-[#0056B3] font-semibold hover:underline">
          + Agregar impacto
        </button>

        <div className="mt-6 pt-6 border-t border-[#E1E4E8]">
          <label className="block text-[#344054] font-medium mb-3 text-sm">Tipo Propiedad Intelectual</label>
          <div className="grid md:grid-cols-2 gap-3">
            {OPCIONES_PROPIEDAD_INTELECTUAL.map((opt) => {
              const selected: string[] = formData.propiedadIntelectual || [];
              const checked = selected.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-3 p-3 border border-[#D0D5DD] rounded-lg bg-white hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => updateField('propiedadIntelectual', checked ? selected.filter((s) => s !== opt) : [...selected, opt])}
                    className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]"
                  />
                  <span className="text-sm text-[#344054]">{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
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
              const sectionHasError = showErrors && (s.fields.some((f) => missingKeys.includes(f.key)) || customErrors[s.id]);
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
      {showErrors && (missingKeys.length > 0 || hasCustomErrors) && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700 font-medium">
              Faltan campos obligatorios por completar. Revise las pestañas marcadas en rojo.
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
              {section.id === 'coordinacion' && renderCoordinacion(section)}
              {section.id === 'contraparte' && renderContraparte(section)}
              {section.id === 'alcance' && renderAlcance(section)}
              {section.id === 'componentes' && renderComponentes(section)}
              {section.id === 'participantes' && renderParticipantes(section)}
              {section.id === 'impactos' && renderImpactos()}
              {!['coordinacion', 'contraparte', 'alcance', 'componentes', 'participantes', 'impactos'].includes(section.id) && renderGenericGrid(section)}
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
              <p><span className="font-semibold">Estado:</span> Propuesta</p>
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
