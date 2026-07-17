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
  onSave?: (
    formData: Record<string, unknown>,
    mode: 'draft' | 'submitted',
  ) => Promise<void> | void;
}

interface ImpactoEntry {
  tipo: string;
  descripcion: string;
}

interface ActividadML {
  actividad: string;
  indicadores: string;
  fuentesVerificacion: string;
  supuestos: string;
  responsable: string;
}

interface ResultadoML {
  resultado: string;
  indicadores: string;
  fuentesVerificacion: string;
  supuestos: string;
  responsable: string;
  actividades: ActividadML[];
}

type MLSubView = 'main' | 'resultado';

/* ───────── Datos geográficos Ecuador ───────── */
const PARROQUIAS_QUITO_URBANAS = [
  'Belisario Quevedo', 'Carcelén', 'Centro Histórico', 'Chimbacalle', 'Chillogallo',
  'Chilibulo', 'Cochapamba', 'Comité del Pueblo', 'Cotocollao', 'El Condado',
  'El Inca', 'Guamaní', 'Iñaquito', 'Itchimbía', 'Jipijapa', 'Kennedy',
  'La Argelia', 'La Concepción', 'La Ecuatoriana', 'La Ferroviaria', 'La Libertad',
  'La Magdalena', 'La Mena', 'Mariscal Sucre', 'Ponceano', 'Puengasí',
  'Quitumbe', 'Rumipamba', 'San Bartolo', 'San Juan', 'Solanda', 'Turubamba',
];
const PARROQUIAS_QUITO_RURALES = [
  'Alangasí', 'Amaguaña', 'Atahualpa', 'Calacalí', 'Calderón', 'Chavezpamba',
  'Checa (Chilpa)', 'El Quinche', 'Gualea', 'Guangopolo', 'Guayllabamba',
  'La Merced', 'Llano Chico', 'Lloa', 'Nanegal', 'Nanegalito', 'Nayón',
  'Nono', 'Pacto', 'Perucho', 'Pifo', 'Píntag', 'Pomasqui', 'Puéllaro',
  'Puembo', 'San Antonio de Pichincha', 'San José de Minas', 'Tababela',
  'Tumbaco', 'Yaruquí', 'Zámbiza',
];
const PROVINCIAS_ECUADOR = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi',
  'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja',
  'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza',
  'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos',
  'Tungurahua', 'Zamora Chinchipe',
];

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
  'FACULTAD DE CIENCIAS EXACTAS Y NATURALES',
  'FACULTAD DE CIENCIAS FILOSÓFICO Y TEOLÓGICAS',
  'FACULTAD DE CIENCIAS HUMANAS',
  'FACULTAD DE COMUNICACIÓN, LINGÜÍSTICA Y LITERATURA',
  'FACULTAD DE DERECHO Y SOCIEDAD',
  'FACULTAD DE ECONOMÍA Y GESTIÓN EMPRESARIAL',
  'FACULTAD DE ENFERMERÍA',
  'FACULTAD DE HÁBITAT, INFRAESTRUCTURA Y CREATIVIDAD',
  'FACULTAD DE INGENIERIA',
  'FACULTAD DE JURISPRUDENCIA',
  'FACULTAD DE SALUD Y BIENESTAR',
  'FACULTAD ECLESIÁSTICA DE CIENCIAS FILOSÓFICO TEOLÓGICAS',
  'FACULTAD INTERNACIONAL DE INNOVACIÓN PUCE-ICAM',
  'ICAM',
  'PUCETEC',
  'RECTORADO',
];
const OPCIONES_SEDE = ['Quito - Matriz', 'Ibarra', 'Santo Domingo', 'Esmeraldas', 'Ambato', 'Manabí'];
const OPCIONES_CARRERA = ['Ingeniería en Sistemas', 'Administración de Empresas', 'Psicología', 'Derecho', 'Educación', 'Comunicación'];
// Conectar con Listado de Grupos SH
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
// Actualiar listado de Redes
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
const OPCIONES_TIPO_IMPACTO = ['SOCIAL', 'ECONÓMICO', 'AMBIENTAL', 'CIENTÍFICO-ACADÉMICO', 'POLÍTICO', 'OTRO'];
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
// Actualizar ODS
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
      { key: 'tipo', label: 'TIPO', type: 'select', required: true, options: OPCIONES_TIPO },
      { key: 'origenProyecto', label: 'ORIGEN DEL PROYECTO', type: 'select', required: true, options: OPCIONES_ORIGEN },
      { key: 'ambitoProyecto', label: 'Ámbito del Proyecto', type: 'select', required: true, options: OPCIONES_AMBITO },
      { key: 'ejeVinculacion', label: 'Eje de Vinculación', type: 'select', required: true, options: OPCIONES_EJE },
      { key: 'dominioAcademico', label: 'DOMINIO ACADÉMICO', type: 'select', required: true, options: OPCIONES_DOMINIO },
      { key: 'articulacionFuncionesSustantivas', label: 'ARTICULACIÓN DE FUNCIONES SUSTANTIVAS', type: 'select', required: true, options: OPCIONES_ARTICULACION_FUNCIONES },
      { key: 'articulacionFuncionesJustificacion', label: 'JUSTIFICACIÓN DE LA ARTICULACIÓN', type: 'textarea', required: true, colSpan: 2, help: 'Explique por qué el proyecto se articula con la(s) función(es) seleccionada(s).' },
      { key: 'fechaInicio', label: 'FECHA INICIO', type: 'date', required: true },
      { key: 'fechaFinPlaneado', label: 'FECHA DE FIN PLANEADO', type: 'date', required: true },
      { key: 'fechaFinReal', label: 'FECHA DE FIN REAL', type: 'date' },
      { key: 'anioPresupuesto', label: 'AÑO DE PRESUPUESTO', type: 'number', required: true },
      { key: 'unidadResponsable', label: 'UNIDAD RESPONSABLE', type: 'select', required: true, options: OPCIONES_UNIDAD },
      { key: 'sede', label: 'SEDE', type: 'select', required: true, options: OPCIONES_SEDE },
    ],
  },
  {
    id: 'coordinacion', icon: '🎓', title: 'Coordinación y Académico',
    fields: [
      { key: 'coordinadorResponsable', label: 'COORDINADOR / RESPONSABLE', type: 'text', required: true },
      { key: 'correoCoordinador', label: 'CORREO ELECTRÓNICO COORDINADOR', type: 'email', required: true },
      { key: 'telefonoCoordinador', label: 'TELÉFONO COORDINADOR', type: 'tel' },
      { key: 'carreraQueCoordina', label: 'CARRERA QUE COORDINA', type: 'text', required: true },
      { key: 'grupoInvestigacion', label: 'GRUPO DE INVESTIGACIÓN', type: 'select', required: true, options: OPCIONES_GRUPO_INV },
      { key: 'lineaInvestigacion', label: 'LÍNEA DE INVESTIGACIÓN', type: 'select', required: true, options: OPCIONES_LINEA_INV },
      { key: 'lineaEstrategica', label: 'LÍNEA ESTRATÉGICA', type: 'select', required: true, options: OPCIONES_LINEA_ESTRATEGICA },
      { key: 'proyectoInvestigacion', label: 'PROYECTO INVESTIGACIÓN', type: 'text', help: '¿El proyecto de vinculación surge a partir del desarrollo de un proyecto de investigación previo?' },
      { key: 'articulaInvestigacionPuce', label: '¿El proyecto se articula con alguna investigación PUCE?', type: 'text' },
      { key: 'redAcademicaArticulada', label: 'RED ACADÉMICA ARTICULADA', type: 'multiselect', options: OPCIONES_RED_ACADEMICA, colSpan: 2 },
      { key: 'identificacion', label: 'IDENTIFICACION', type: 'text', required: true, help: 'Número de cédula, pasaporte, etc.' },
    ],
  },
  {
    id: 'diagnostico', icon: '🔍', title: 'Diagnóstico y Justificación',
    fields: [
      { key: 'diagnosticoProblemaActores', label: 'DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS', type: 'textarea', required: true },
      { key: 'objetivo', label: 'OBJETIVO', type: 'select', required: true, options: OPCIONES_OBJETIVO },
      { key: 'resumen', label: 'Resumen', type: 'textarea', required: true },
      { key: 'problemaContraparteDiagnostico', label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE', type: 'textarea', required: true, help: 'Máximo 200 palabras' },
      { key: 'campoAmplio', label: 'CAMPO AMPLIO', type: 'readonly', help: 'Se completa automáticamente según la carrera principal (Coordinación y Académico).' },
      { key: 'campoEspecifico', label: 'CAMPO ESPECÍFICO', type: 'readonly', help: 'Se completa automáticamente según la carrera principal.' },
      { key: 'campoDetallado', label: 'CAMPO DETALLADO', type: 'readonly', help: 'Se completa automáticamente según la carrera principal.' },
      { key: 'ods', label: 'ODS', type: 'select', required: true, options: OPCIONES_ODS },
      { key: 'mapeoActores', label: 'Mapeo de Actores y responsabilidades', type: 'textarea', required: true },
      { key: 'tipoActoresSociales', label: 'TIPO DE ACTORES SOCIALES', type: 'select', required: true, options: OPCIONES_TIPO_ACTORES },
      { key: 'descripcionTipoVinculacion', label: 'Descripción del Tipo de Vinculación', type: 'textarea', required: true },
    ],
  },
  {
    id: 'contraparte', icon: '🤝', title: 'Contraparte y Convenio',
    fields: [
      { key: 'nombreContraparte', label: 'NOMBRE DE CONTRAPARTE', type: 'text', required: true },
      { key: 'instrumentoLegalContraparte', label: 'Instrumento Legal de la Contraparte', type: 'select', required: true, options: OPCIONES_INSTRUMENTO_LEGAL },
      { key: 'problemaContraparteConvenio', label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE', type: 'textarea', required: true, help: 'Máximo 200 palabras' },
    ],
  },
  {
    id: 'alcance', icon: '🌍', title: 'Alcance Territorial y Beneficiarios',
    fields: [
      { key: 'alcanceTerritorial', label: 'ALCANCE TERRITORIAL', type: 'select', required: true, options: OPCIONES_ALCANCE_TERRITORIAL },
      { key: 'nombreComunidadAlcanzada', label: 'NOMBRE DE COMUNIDAD ALCANZADA', type: 'text', required: true },
      { key: 'criteriosSeleccionBeneficiarios', label: 'CRITERIOS DE SELECCIÓN DE BENEFICIARIOS ENTRE LA POBLACIÓN OBJETIVO', type: 'textarea', required: true },
      { key: 'detalleCalculoComunidad', label: 'Detalle del cálculo de la comunidad participante', type: 'textarea', required: true },
      { key: 'numeroPersonasAlcanzadas', label: 'NÚMERO DE PERSONAS ALCANZADAS', type: 'number' },
      { key: 'personasAlcanzadasFemeninos', label: 'Personas Alcanzadas Femeninos', type: 'number' },
      { key: 'personasAlcanzadasMasculinos', label: 'Personas Alcanzadas Masculinos', type: 'number' },
      { key: 'beneficiariosDirectosFemeninos', label: 'Beneficiarios Directos Femeninos', type: 'number', required: true },
      { key: 'beneficiariosDirectosMasculinos', label: 'Beneficiarios Directos Masculinos', type: 'number', required: true },
      { key: 'beneficiariosIndirectosFemeninos', label: 'Beneficiarios Indirectos Femeninos', type: 'number', required: true },
      { key: 'beneficiariosIndirectosMasculinos', label: 'Beneficiarios Indirectos Masculinos', type: 'number', required: true },
      { key: 'numComunidad1f', label: 'Número de Comunidad Femenino Primer Semestre', type: 'number' },
      { key: 'numComunidad1m', label: 'Número de Comunidad Masculino Primer Semestre', type: 'number' },
      { key: 'numComunidad2f', label: 'Número de Comunidad Femenino Segundo Semestre', type: 'number' },
      { key: 'numComunidad2m', label: 'Número de Comunidad Masculino Segundo Semestre', type: 'number' },
    ],
  },
  {
    id: 'componentes', icon: '🧩', title: 'Componentes Especiales',
    fields: [
      { key: 'componenteInterculturalidad', label: 'COMPONENTE DE INTERCULTURALIDAD', type: 'select', required: true, options: OPCIONES_SI_NO },
      { key: 'detalleInterculturalidad', label: 'DETALLE — INTERCULTURALIDAD', type: 'text', showIf: (d) => d.componenteInterculturalidad === 'SI' },
      { key: 'componenteInterdisciplinariedad', label: 'COMPONENTE DE INTERDISCIPLINARIEDAD', type: 'select', required: true, options: OPCIONES_SI_NO },
      { key: 'detalleInterdisciplinariedad', label: 'DETALLE — INTERDISCIPLINARIEDAD', type: 'text', showIf: (d) => d.componenteInterdisciplinariedad === 'SI' },
      { key: 'componenteInternacionalizacion', label: 'COMPONENTE DE INTERNACIONALIZACIÓN', type: 'select', required: true, options: OPCIONES_SI_NO },
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
      { key: 'numeroDocentesVinculados', label: 'NÚMERO DE DOCENTES VINCULADOS (1ER SEMESTRE)', type: 'number', required: true },
      { key: 'numeroDocentesVinculados2do', label: 'NÚMERO DE DOCENTES VINCULADOS (2DO SEMESTRE)', type: 'number', required: true },
      { key: 'numeroEstudiantesVinculados', label: 'NÚMERO DE ESTUDIANTES VINCULADOS (1ER SEMESTRE)', type: 'number', required: true },
      { key: 'numeroEstudiantesVinculados2do', label: 'NÚMERO DE ESTUDIANTES VINCULADOS (2DO SEMESTRE)', type: 'number', required: true },
      { key: 'numeroAdministrativosVinculados', label: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS (1ER SEMESTRE)', type: 'number', required: true },
      { key: 'numeroAdministrativosVinculados2do', label: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS (2DO SEMESTRE)', type: 'number', required: true },
      { key: 'numeroAlumniVinculados', label: 'NÚMERO DE ALUMNI VINCULADOS (1ER SEMESTRE)', type: 'number', required: true },
      { key: 'numeroAlumniVinculados2do', label: 'NÚMERO DE ALUMNI VINCULADOS (2DO SEMESTRE)', type: 'number', required: true },
      { key: 'resultadosAprendizaje', label: 'RESULTADOS DE APRENDIZAJE', type: 'textarea', required: true },
      { key: 'asesoria', label: 'ASESORÍA', type: 'select', required: true, options: OPCIONES_SI_NO },
    ],
  },
  {
    id: 'marcoLogico', icon: '🎯', title: 'Marco Lógico',
    fields: [],
  },
  {
    id: 'presupuesto', icon: '💰', title: 'Presupuesto',
    fields: [
      { key: 'fuenteFinanciamiento', label: 'FUENTE DE FINANCIAMIENTO', type: 'select', required: true, options: OPCIONES_FUENTE_FINANCIAMIENTO },
      { key: 'presupuestoPlanificado', label: 'PRESUPUESTO PLANIFICADO', type: 'number', required: true },
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
/*  SEARCHABLE SELECT (combobox)                                 */
/* ============================================================ */
interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  groups?: { label: string; options: string[] }[];
  options?: string[];
  className?: string;
}

function SearchableSelect({ value, onChange, placeholder = 'Buscar...', groups, options = [], className = '' }: SearchableSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const allOptions = groups ? groups.flatMap((g) => g.options) : options;
  const lq = query.toLowerCase();
  const filtered = lq ? allOptions.filter((o) => o.toLowerCase().includes(lq)) : allOptions;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setQuery('');
    setOpen(false);
  };

  const baseCls = `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${className}`;
  const borderCls = open ? 'border-[#003366]' : 'border-[#D0D5DD]';

  const renderList = () => {
    if (filtered.length === 0) {
      return (
        <div className="px-3 py-3 text-sm text-[#6B7280] italic">Sin resultados para "{query}"</div>
      );
    }
    if (groups && !lq) {
      return groups.map((g) => (
        <div key={g.label}>
          <div className="px-3 py-1.5 text-xs font-bold text-[#6B7280] uppercase tracking-wide bg-[#F5F7FA] sticky top-0">
            {g.label}
          </div>
          {g.options.map((opt) => (
            <div
              key={opt}
              onMouseDown={() => handleSelect(opt)}
              className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                opt === value ? 'bg-[#DBEAFE] font-semibold text-[#003366]' : 'text-[#344054] hover:bg-[#EFF6FF]'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      ));
    }
    return filtered.map((opt) => (
      <div
        key={opt}
        onMouseDown={() => handleSelect(opt)}
        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
          opt === value ? 'bg-[#DBEAFE] font-semibold text-[#003366]' : 'text-[#344054] hover:bg-[#EFF6FF]'
        }`}
      >
        {opt}
      </div>
    ));
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={open ? query : value}
          placeholder={open ? 'Escriba para buscar...' : (value || placeholder)}
          onFocus={() => { setOpen(true); setQuery(''); }}
          onChange={(e) => { setQuery(e.target.value); }}
          className={`${baseCls} ${borderCls} pr-8`}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none">
          {open ? <Search size={14} /> : <ChevronDown size={14} />}
        </span>
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {renderList()}
        </div>
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ── Marco Lógico sub-navigation ── */
  const [mlSubView, setMLSubView] = useState<MLSubView>('main');
  const [mlResultadoEdit, setMLResultadoEdit] = useState<ResultadoML>({
    resultado: '', indicadores: '', fuentesVerificacion: '', supuestos: '', responsable: '', actividades: [],
  });
  const [mlResultadoEditIdx, setMLResultadoEditIdx] = useState<number | null>(null);
  const [mlActividadEdit, setMLActividadEdit] = useState<ActividadML>({
    actividad: '', indicadores: '', fuentesVerificacion: '', supuestos: '', responsable: '',
  });
  const [mlActividadEditIdx, setMLActividadEditIdx] = useState<number | null>(null);
  const [mlSelectedActividadIdx, setMLSelectedActividadIdx] = useState<number | null>(null);
  const [mlSelectedResultadoIdx, setMLSelectedResultadoIdx] = useState<number | null>(null);
  const [mlShowActForm, setMLShowActForm] = useState(false);

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

  const saveProposal = async (mode: 'draft' | 'submitted') => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await onSave?.({ ...formData, codigoProyecto }, mode);
      setShowSummary(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'No se pudo guardar la propuesta.');
    } finally {
      setIsSaving(false);
    }
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#003366] text-white">
                  <th className="border border-[#1a4a7a] px-4 py-3 text-left text-sm font-semibold">Tipo de Beneficiario</th>
                  <th className="border border-[#1a4a7a] px-4 py-3 text-center text-sm font-semibold w-32">Femenino</th>
                  <th className="border border-[#1a4a7a] px-4 py-3 text-center text-sm font-semibold w-32">Masculino</th>
                  <th className="border border-[#1a4a7a] px-4 py-3 text-center text-sm font-semibold w-28">Total</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { label: 'Beneficiarios Directos', fKey: 'beneficiariosDirectosFemeninos', mKey: 'beneficiariosDirectosMasculinos', bg: 'bg-white' },
                  { label: 'Beneficiarios Indirectos', fKey: 'beneficiariosIndirectosFemeninos', mKey: 'beneficiariosIndirectosMasculinos', bg: 'bg-[#F9FAFB]' },
                ] as const).map((row) => {
                  const { f, m } = fm(row.fKey, row.mKey);
                  return (
                    <tr key={row.label} className={row.bg}>
                      <td className="border border-[#D0D5DD] px-4 py-2.5 text-sm font-medium text-[#344054]">
                        {row.label} <span className="text-red-500">*</span>
                      </td>
                      <td className="border border-[#D0D5DD] px-2 py-2">
                        <input type="number" min={0} value={formData[row.fKey] ?? ''} onChange={(e) => updateField(row.fKey, e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                      </td>
                      <td className="border border-[#D0D5DD] px-2 py-2">
                        <input type="number" min={0} value={formData[row.mKey] ?? ''} onChange={(e) => updateField(row.mKey, e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#D0D5DD] rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                      </td>
                      <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-semibold text-[#003366]">{f + m}</td>
                    </tr>
                  );
                })}
                {(() => {
                  const dirF = Number(formData.beneficiariosDirectosFemeninos) || 0;
                  const dirM = Number(formData.beneficiariosDirectosMasculinos) || 0;
                  const indF = Number(formData.beneficiariosIndirectosFemeninos) || 0;
                  const indM = Number(formData.beneficiariosIndirectosMasculinos) || 0;
                  return (
                    <tr className="bg-[#E6F0FF]">
                      <td className="border border-[#D0D5DD] px-4 py-2.5 text-sm font-bold text-[#003366]">Personas Alcanzadas (Total)</td>
                      <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-bold text-[#003366]">{dirF + indF}</td>
                      <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-bold text-[#003366]">{dirM + indM}</td>
                      <td className="border border-[#D0D5DD] px-3 py-2 text-center text-sm font-bold text-[#0056B3]">{dirF + indF + dirM + indM}</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
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

        {/* ── Ubicación del proyecto ── */}
        <div className="mt-6 pt-6 border-t border-[#E1E4E8]">
          <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2 text-sm">📍 UBICACIÓN DEL PROYECTO</h3>

          <div className="mb-5">
            <p className="text-sm font-medium text-[#344054] mb-2">
              ¿El proyecto se desarrolla dentro del Distrito Metropolitano de Quito?
            </p>
            <div className="flex gap-6">
              {(['SI', 'NO'] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="esQuito"
                    value={opt}
                    checked={formData.esQuito === opt}
                    onChange={() => updateField('esQuito', opt)}
                    className="accent-[#003366] w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-[#344054]">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.esQuito === 'SI' && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">Parroquia (Quito)</label>
              <SearchableSelect
                value={formData.parroquiaQuito || ''}
                onChange={(v) => updateField('parroquiaQuito', v)}
                placeholder="— Seleccione parroquia —"
                groups={[
                  { label: 'Parroquias Urbanas', options: PARROQUIAS_QUITO_URBANAS },
                  { label: 'Parroquias Rurales', options: PARROQUIAS_QUITO_RURALES },
                ]}
              />
            </div>
          )}

          {formData.esQuito === 'NO' && (
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1.5">Provincia</label>
                <SearchableSelect
                  value={formData.provinciaFuera || ''}
                  onChange={(v) => updateField('provinciaFuera', v)}
                  placeholder="— Seleccione provincia —"
                  options={PROVINCIAS_ECUADOR}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-1.5">Cantón</label>
                <input
                  type="text"
                  placeholder="Nombre del cantón..."
                  value={formData.cantonFuera || ''}
                  onChange={(e) => updateField('cantonFuera', e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#344054] mb-1.5">Parroquia</label>
                <input
                  type="text"
                  placeholder="Nombre de la parroquia..."
                  value={formData.parroquiaFuera || ''}
                  onChange={(e) => updateField('parroquiaFuera', e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>
          )}

          {(formData.esQuito === 'SI' || formData.esQuito === 'NO') && (
            <div className="mt-2">
              <label className="block text-xs font-semibold text-[#344054] mb-1.5">
                Enlace del mapa (Google Maps)
              </label>
              <input
                type="url"
                placeholder="Pegue aquí el enlace de Google Maps..."
                value={formData.enlaceUbicacion || ''}
                onChange={(e) => updateField('enlaceUbicacion', e.target.value)}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] mb-2"
              />
              <p className="text-xs text-[#6B7280] mb-3">
                Para previsualizar el mapa: en Google Maps use{' '}
                <strong>Compartir → Insertar un mapa</strong> y copie el <code>src</code> del iframe.
              </p>
              {formData.enlaceUbicacion && (
                formData.enlaceUbicacion.includes('maps/embed') ? (
                  <div className="rounded-lg overflow-hidden border border-[#D0D5DD] shadow-sm">
                    <iframe
                      src={formData.enlaceUbicacion}
                      width="100%"
                      height="300"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="block"
                      title="Vista previa del mapa"
                    />
                  </div>
                ) : (
                  <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-lg p-4 flex items-start gap-3">
                    <span className="text-lg leading-none">⚠️</span>
                    <div>
                      <p className="text-sm font-semibold text-[#92400E]">
                        Este enlace no puede previsualizarse aquí.
                      </p>
                      <p className="text-xs text-[#92400E] mt-1">
                        Use <strong>Compartir → Insertar un mapa</strong> en Google Maps para obtener el
                        link de embed (contiene <code>/maps/embed</code>). O bien,{' '}
                        <a
                          href={formData.enlaceUbicacion}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold"
                        >
                          abra el mapa en Google Maps ↗
                        </a>
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
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
        {display.map((item, i) => {
          const usedTipos = display.filter((_, idx) => idx !== i).map((it) => it.tipo).filter(Boolean);
          const opcionesDisponibles = OPCIONES_TIPO_IMPACTO.filter((t) => !usedTipos.includes(t));
          return (
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
                {opcionesDisponibles.map((t) => <option key={t} value={t}>{t}</option>)}
                {item.tipo && !opcionesDisponibles.includes(item.tipo) && (
                  <option value={item.tipo}>{item.tipo}</option>
                )}
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
          );
        })}
        <button
          type="button"
          onClick={addImpacto}
          disabled={display.length >= OPCIONES_TIPO_IMPACTO.length}
          className="text-sm text-[#0056B3] font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
        >
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

  const renderMarcoLogico = () => {
    const mlResultados: ResultadoML[] = formData.mlResultados ?? [];
    const inp = 'w-full px-4 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm';
    const COLS = ['Descripción', 'Indicadores', 'Fuentes y Medios de Verif.', 'Supuestos', 'Responsable'];
    const emptyAct: ActividadML = { actividad: '', indicadores: '', fuentesVerificacion: '', supuestos: '', responsable: '' };
    const emptyRes: ResultadoML = { resultado: '', indicadores: '', fuentesVerificacion: '', supuestos: '', responsable: '', actividades: [] };

    /* ── Vista: Formulario de Resultado con actividades inline ── */
    if (mlSubView === 'resultado') {
      const resFields: { key: keyof Omit<ResultadoML, 'actividades'>; label: string }[] = [
        { key: 'resultado', label: 'Resultado' },
        { key: 'indicadores', label: 'Indicadores' },
        { key: 'fuentesVerificacion', label: 'Fuentes y Medios de Verificación' },
        { key: 'supuestos', label: 'Supuestos' },
        { key: 'responsable', label: 'Responsable' },
      ];
      const actFields: { key: keyof ActividadML; label: string; wide?: boolean }[] = [
        { key: 'actividad', label: 'Actividad', wide: true },
        { key: 'indicadores', label: 'Indicadores' },
        { key: 'fuentesVerificacion', label: 'Fuentes y Medios de Verificación' },
        { key: 'supuestos', label: 'Supuestos' },
        { key: 'responsable', label: 'Responsable' },
      ];

      const handleSaveResultado = () => {
        const updated = [...mlResultados];
        if (mlResultadoEditIdx !== null) updated[mlResultadoEditIdx] = { ...mlResultadoEdit };
        else updated.push({ ...mlResultadoEdit });
        updateField('mlResultados', updated);
        setMLResultadoEditIdx(null);
        setMLSelectedResultadoIdx(null);
        setMLSelectedActividadIdx(null);
        setMLShowActForm(false);
        setMLSubView('main');
      };

      const handleSaveActividad = () => {
        const acts = [...mlResultadoEdit.actividades];
        if (mlActividadEditIdx !== null) acts[mlActividadEditIdx] = { ...mlActividadEdit };
        else acts.push({ ...mlActividadEdit });
        setMLResultadoEdit((p) => ({ ...p, actividades: acts }));
        setMLActividadEdit(emptyAct);
        setMLActividadEditIdx(null);
        setMLSelectedActividadIdx(null);
        setMLShowActForm(false);
      };

      return (
        <div className="space-y-5">
          {/* Datos del resultado */}
          <div className="p-4 bg-[#EFF6FF] rounded-lg border border-[#C5D9F0]">
            <p className="text-[#003366] font-bold text-sm mb-3">Datos del Resultado</p>
            <div className="grid md:grid-cols-2 gap-4">
              {resFields.slice(0, 2).map((f) => (
                <div key={f.key}>
                  <label className="block text-[#344054] font-medium mb-1.5 text-sm"><span className="text-red-500">* </span>{f.label}</label>
                  <input type="text" value={mlResultadoEdit[f.key]}
                    onChange={(e) => setMLResultadoEdit((p) => ({ ...p, [f.key]: e.target.value } as ResultadoML))}
                    className={inp} />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {resFields.slice(2).map((f) => (
                <div key={f.key}>
                  <label className="block text-[#344054] font-medium mb-1.5 text-sm"><span className="text-red-500">* </span>{f.label}</label>
                  <input type="text" value={mlResultadoEdit[f.key]}
                    onChange={(e) => setMLResultadoEdit((p) => ({ ...p, [f.key]: e.target.value } as ResultadoML))}
                    className={inp} />
                </div>
              ))}
            </div>
          </div>

          {/* Actividades de este resultado */}
          <div className="p-4 bg-white rounded-lg border border-[#D0D5DD]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#003366] font-bold text-sm">Actividades de este Resultado</p>
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => { setMLActividadEdit(emptyAct); setMLActividadEditIdx(null); setMLShowActForm(true); }}
                  className="px-3 py-1.5 bg-[#003366] text-white text-sm font-semibold rounded-lg hover:bg-[#002952]">+ Agregar</button>
                <button type="button" disabled={mlSelectedActividadIdx === null}
                  onClick={() => { if (mlSelectedActividadIdx !== null) { setMLActividadEdit({ ...mlResultadoEdit.actividades[mlSelectedActividadIdx] }); setMLActividadEditIdx(mlSelectedActividadIdx); setMLShowActForm(true); } }}
                  className="px-3 py-1.5 bg-white border border-[#D0D5DD] text-sm font-semibold rounded-lg hover:bg-[#F5F7FA] disabled:opacity-40">Editar</button>
                <button type="button" disabled={mlSelectedActividadIdx === null}
                  onClick={() => { if (mlSelectedActividadIdx !== null) { setMLResultadoEdit((p) => ({ ...p, actividades: p.actividades.filter((_, i) => i !== mlSelectedActividadIdx) })); setMLSelectedActividadIdx(null); setMLShowActForm(false); } }}
                  className="px-3 py-1.5 bg-white border border-[#D0D5DD] text-sm font-semibold rounded-lg hover:bg-[#F5F7FA] disabled:opacity-40">Borrar</button>
              </div>
            </div>

            <div className="overflow-x-auto rounded border border-[#E1E4E8]">
              <table className="w-full border-collapse min-w-[560px]">
                <thead>
                  <tr className="bg-[#344054] text-white">
                    {COLS.map((c) => <th key={c} className="px-3 py-2 text-xs font-semibold text-left border-r border-white/20 last:border-r-0 whitespace-nowrap">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {mlResultadoEdit.actividades.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-sm text-[#6B7280] py-5 italic">Sin actividades — use + Agregar</td></tr>
                  ) : mlResultadoEdit.actividades.map((act, i) => (
                    <tr key={i}
                      onClick={() => { setMLSelectedActividadIdx(mlSelectedActividadIdx === i ? null : i); setMLShowActForm(false); }}
                      className={`cursor-pointer transition-colors ${mlSelectedActividadIdx === i ? 'bg-[#DBEAFE]' : i % 2 === 0 ? 'bg-white hover:bg-[#F5F7FA]' : 'bg-[#F9FAFB] hover:bg-[#F0F2F5]'}`}>
                      {[act.actividad, act.indicadores, act.fuentesVerificacion, act.supuestos, act.responsable].map((val, ci) => (
                        <td key={ci} className="px-3 py-2.5 text-sm text-[#344054] border-b border-[#E1E4E8] max-w-[160px]"><div className="truncate">{val}</div></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mlShowActForm && (
              <div className="mt-4 pt-4 border-t border-[#E1E4E8]">
                <p className="text-sm font-semibold text-[#344054] mb-3">{mlActividadEditIdx !== null ? 'Editar Actividad' : 'Nueva Actividad'}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {actFields.map((f) => (
                    <div key={f.key} className={f.wide ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-semibold text-[#344054] mb-1">{f.label}</label>
                      <input type="text" value={mlActividadEdit[f.key]}
                        onChange={(e) => setMLActividadEdit((p) => ({ ...p, [f.key]: e.target.value } as ActividadML))}
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={handleSaveActividad}
                    className="px-4 py-2 bg-[#003366] text-white text-sm font-semibold rounded-lg hover:bg-[#002952]">
                    {mlActividadEditIdx !== null ? 'Actualizar' : 'Guardar'} Actividad
                  </button>
                  <button type="button" onClick={() => { setMLShowActForm(false); setMLActividadEditIdx(null); setMLActividadEdit(emptyAct); }}
                    className="px-4 py-2 border border-[#D0D5DD] text-sm font-semibold rounded-lg hover:bg-[#F5F7FA]">Cancelar</button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-[#E1E4E8]">
            <button type="button"
              onClick={() => { setMLResultadoEditIdx(null); setMLSelectedActividadIdx(null); setMLShowActForm(false); setMLSubView('main'); }}
              className="px-5 py-2.5 border-2 border-[#D0D5DD] rounded-lg font-semibold text-[#344054] hover:bg-[#F5F7FA]">Regresar</button>
            <button type="button" onClick={handleSaveResultado}
              className="px-5 py-2.5 bg-[#003366] text-white rounded-lg font-semibold hover:bg-[#002952]">Guardar Resultado →</button>
          </div>
        </div>
      );
    }

    /* ── Vista principal: Fin/Propósito + tabla combinada ── */
    return (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#344054] font-medium mb-1.5 text-sm"><span className="text-red-500">* </span>Fin (impacto)</label>
            <input type="text" value={formData.mlFin || ''} onChange={(e) => updateField('mlFin', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-[#344054] font-medium mb-1.5 text-sm"><span className="text-red-500">* </span>Propósito (Objetivo General)</label>
            <input type="text" value={formData.mlProposito || ''} onChange={(e) => updateField('mlProposito', e.target.value)} className={inp} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#003366] font-bold text-sm">Matriz de Resultados y Actividades</span>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => { setMLResultadoEdit(emptyRes); setMLResultadoEditIdx(null); setMLSelectedActividadIdx(null); setMLShowActForm(false); setMLSubView('resultado'); }}
                className="px-3 py-1.5 bg-[#003366] text-white text-sm font-semibold rounded-lg hover:bg-[#002952]">+ Agregar</button>
              <button type="button" disabled={mlSelectedResultadoIdx === null}
                onClick={() => { if (mlSelectedResultadoIdx !== null) { setMLResultadoEdit({ ...mlResultados[mlSelectedResultadoIdx] }); setMLResultadoEditIdx(mlSelectedResultadoIdx); setMLSelectedActividadIdx(null); setMLShowActForm(false); setMLSubView('resultado'); } }}
                className="px-3 py-1.5 bg-white border border-[#D0D5DD] text-sm font-semibold rounded-lg hover:bg-[#F5F7FA] disabled:opacity-40">Editar</button>
              <button type="button" disabled={mlSelectedResultadoIdx === null}
                onClick={() => { if (mlSelectedResultadoIdx !== null) { updateField('mlResultados', mlResultados.filter((_, i) => i !== mlSelectedResultadoIdx)); setMLSelectedResultadoIdx(null); } }}
                className="px-3 py-1.5 bg-white border border-[#D0D5DD] text-sm font-semibold rounded-lg hover:bg-[#F5F7FA] disabled:opacity-40">Borrar</button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#D0D5DD] rounded-lg">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#003366] text-white">
                  <th className="px-3 py-2.5 text-xs font-semibold text-left border-r border-white/20 w-24 whitespace-nowrap">Tipo</th>
                  {COLS.map((c) => <th key={c} className="px-3 py-2.5 text-xs font-semibold text-left border-r border-white/20 last:border-r-0 whitespace-nowrap">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {mlResultados.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-sm text-[#6B7280] py-8 italic">Sin resultados — use + Agregar para comenzar</td></tr>
                ) : mlResultados.flatMap((r, ri) => {
                  const actRows = r.actividades.length === 0
                    ? [<tr key={`r-${ri}-empty`}><td colSpan={6} className="px-3 py-2 text-xs text-[#9CA3AF] italic border-b border-[#E1E4E8] pl-5">↳ Sin actividades</td></tr>]
                    : r.actividades.map((act, ai) => (
                        <tr key={`r-${ri}-a-${ai}`} className={ai % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
                          <td className="px-3 py-2 text-xs text-[#6B7280] border-b border-[#E1E4E8] pl-5">↳ Act.{ai + 1}</td>
                          {[act.actividad, act.indicadores, act.fuentesVerificacion, act.supuestos, act.responsable].map((val, ci) => (
                            <td key={ci} className="px-3 py-2 text-sm text-[#344054] border-b border-[#E1E4E8] max-w-[180px]"><div className="truncate">{val}</div></td>
                          ))}
                        </tr>
                      ));
                  return [
                    <tr key={`r-${ri}`}
                      onClick={() => setMLSelectedResultadoIdx(mlSelectedResultadoIdx === ri ? null : ri)}
                      className={`cursor-pointer transition-colors ${mlSelectedResultadoIdx === ri ? 'bg-[#DBEAFE]' : 'bg-[#EFF6FF] hover:bg-[#DBEAFE]/60'}`}>
                      <td className="px-3 py-2.5 text-xs font-bold text-[#003366] border-b border-[#C5D9F0]">R{ri + 1} Resultado</td>
                      {[r.resultado, r.indicadores, r.fuentesVerificacion, r.supuestos, r.responsable].map((val, ci) => (
                        <td key={ci} className="px-3 py-2.5 text-sm text-[#1F2937] font-medium border-b border-[#C5D9F0] max-w-[180px]"><div className="truncate">{val}</div></td>
                      ))}
                    </tr>,
                    ...actRows,
                  ];
                })}
              </tbody>
            </table>
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
              {section.id === 'marcoLogico' && renderMarcoLogico()}
              {!['coordinacion', 'contraparte', 'alcance', 'componentes', 'participantes', 'impactos', 'marcoLogico'].includes(section.id) && renderGenericGrid(section)}
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
              <button onClick={() => void saveProposal('draft')} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-[#F5F7FA] text-[#344054] border border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#E1E4E8] transition-colors disabled:opacity-60">
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
          {saveError && <p className="mt-3 text-center text-sm text-red-600">{saveError}</p>}
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
            <p className="text-xs text-[#6B7280] mb-6">La propuesta se guardará en la lista ProyectosVinculacion de SharePoint.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSummary(false)} className="px-5 py-2.5 border border-[#D0D5DD] rounded-lg text-[#344054] font-semibold hover:bg-[#F5F7FA] transition-colors">
                Seguir editando
              </button>
              <button onClick={() => void saveProposal('submitted')} disabled={isSaving} className="px-5 py-2.5 bg-[#003366] text-white rounded-lg font-semibold hover:bg-[#002952] transition-colors disabled:opacity-60">
                {isSaving ? 'Guardando…' : 'Confirmar y guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
