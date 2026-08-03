/**
 * Mapa canónico: clave del formulario → columna interna de SharePoint
 * (lista Proyectos_Vinculacion).
 *
 * Usar este archivo como única fuente de verdad antes de persistir o
 * autocompletar. Si `column` es `null`, el campo de UI no tiene columna
 * en la lista y no debe enviarse a SharePoint.
 */

export type FormSectionId =
  | 'sistema'
  | 'identificacion'
  | 'coordinacion'
  | 'diagnostico'
  | 'contraparte'
  | 'alcance'
  | 'componentes'
  | 'participantes'
  | 'marcoLogico'
  | 'presupuesto'
  | 'impactos';

/** Tipo de dato en SharePoint (según el esquema generado). */
export type SharePointValueKind =
  | 'text'
  | 'number'
  | 'date'
  | 'choice'
  | 'lookup'
  | 'multichoice'
  | 'none';

/**
 * Estado de conexión con la lista:
 * - mapped: ya se escribe/lee en el servicio (create/update)
 * - pending: existe columna SP; falta cablear en toWriteRecord / lectura
 * - unmapped: no hay columna en la lista (no conectar)
 * - derived: se calcula en UI o se reparte en varias columnas
 */
export type ConnectionStatus = 'mapped' | 'pending' | 'unmapped' | 'derived';

export interface FormSharePointField {
  formKey: string;
  label: string;
  section: FormSectionId;
  /** Nombre interno en SharePoint. `null` = sin columna en la lista. */
  column: string | null;
  /** Título visible en SharePoint (si se conoce). */
  spTitle?: string;
  kind: SharePointValueKind;
  /** Obligatorio al crear el ítem según el modelo Write / reglas de negocio. */
  requiredOnCreate?: boolean;
  /** Condicional: solo aplica si otra clave del form cumple la condición. */
  requiredIf?: { formKey: string; equals: string };
  connection: ConnectionStatus;
  notes?: string;
}

export const FORM_SHAREPOINT_FIELDS: readonly FormSharePointField[] = [
  /* ── Sistema / cabecera ── */
  {
    formKey: 'codigoProyecto',
    label: 'Código del Proyecto',
    section: 'sistema',
    column: 'Title',
    spTitle: 'CÓDIGO DEL PROYECTO',
    kind: 'text',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: '_estado',
    label: 'ESTADO (ciclo de vida)',
    section: 'sistema',
    column: 'field_9',
    spTitle: 'ESTADO',
    kind: 'choice',
    connection: 'mapped',
    notes: 'Vacío = pendiente de revisión; con valor = asignados/cierre. No es un input del formulario.',
  },
  {
    formKey: '_estadoInforme',
    label: 'ESTADO_INFORME',
    section: 'sistema',
    column: 'ESTADO_INFORME',
    spTitle: 'ESTADO_INFORME',
    kind: 'text',
    connection: 'mapped',
    notes: 'Estado de la app (informe). Lo gestiona el servicio, no el formulario.',
  },

  /* ── Identificación ── */
  {
    formKey: 'nombreProyecto',
    label: 'NOMBRE DEL PROYECTO',
    section: 'identificacion',
    column: 'field_1',
    spTitle: 'NOMBRE DEL PROYECTO',
    kind: 'text',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'tipo',
    label: 'TIPO',
    section: 'identificacion',
    column: 'field_2',
    spTitle: 'TIPO',
    kind: 'choice',
    connection: 'mapped',
  },
  {
    formKey: 'origenProyecto',
    label: 'ORIGEN DEL PROYECTO',
    section: 'identificacion',
    column: 'ORIGENDELPROYECTO',
    spTitle: 'ORIGEN DEL PROYECTO',
    kind: 'choice',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'ambitoProyecto',
    label: 'Ámbito del Proyecto',
    section: 'identificacion',
    column: 'OData__x00c1_mbitodelProyecto',
    spTitle: 'Ámbito del Proyecto',
    kind: 'choice',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'ejeVinculacion',
    label: 'Eje de Vinculación',
    section: 'identificacion',
    column: 'EjedeVinculaci_x00f3_n',
    spTitle: 'Eje de Vinculación',
    kind: 'choice',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'dominioAcademico',
    label: 'DOMINIO ACADÉMICO',
    section: 'identificacion',
    column: 'field_5',
    spTitle: 'DOMINIO ACADÉMICO',
    kind: 'choice',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'articulacionFuncionesSustantivas',
    label: 'ARTICULACIÓN DE FUNCIONES SUSTANTIVAS',
    section: 'identificacion',
    column: 'field_42',
    spTitle: 'ARTICULACIÓN DE FUNCIONES SUSTANTIVAS',
    kind: 'choice',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'articulacionFuncionesJustificacion',
    label: 'JUSTIFICACIÓN DE LA ARTICULACIÓN',
    section: 'identificacion',
    column: null,
    kind: 'none',
    connection: 'unmapped',
    notes: 'No existe columna en la lista. No enviar a SharePoint hasta crear el campo.',
  },
  {
    formKey: 'fechaInicio',
    label: 'FECHA INICIO',
    section: 'identificacion',
    column: 'field_14',
    spTitle: 'FECHA INICIO',
    kind: 'date',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'fechaFinPlaneado',
    label: 'FECHA DE FIN PLANEADO',
    section: 'identificacion',
    column: 'field_15',
    spTitle: 'FECHA DE FIN PLANEADO',
    kind: 'date',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'fechaFinReal',
    label: 'FECHA DE FIN REAL',
    section: 'identificacion',
    column: 'field_16',
    spTitle: 'FECHA DE FIN REAL',
    kind: 'date',
    connection: 'mapped',
  },
  {
    formKey: 'anioPresupuesto',
    label: 'AÑO DE PRESUPUESTO',
    section: 'identificacion',
    column: 'field_36',
    spTitle: 'AÑO DE PRESUPUESTO',
    kind: 'number',
    connection: 'mapped',
  },
  {
    formKey: 'unidadResponsable',
    label: 'UNIDAD RESPONSABLE',
    section: 'identificacion',
    column: 'field_17',
    spTitle: 'UNIDAD RESPONSABLE',
    kind: 'choice',
    connection: 'mapped',
  },
  {
    formKey: 'sede',
    label: 'SEDE',
    section: 'identificacion',
    column: 'field_44',
    spTitle: 'SEDE',
    kind: 'choice',
    connection: 'mapped',
  },

  /* ── Coordinación ── */
  {
    formKey: 'coordinadorResponsable',
    label: 'COORDINADOR / RESPONSABLE',
    section: 'coordinacion',
    column: 'field_20',
    spTitle: 'COORDINADOR / RESPONSABLE',
    kind: 'text',
    connection: 'mapped',
  },
  {
    formKey: 'correoCoordinador',
    label: 'CORREO ELECTRÓNICO COORDINADOR',
    section: 'coordinacion',
    column: 'field_21',
    spTitle: 'CORREO ELECTRÓNICO COORDINADOR',
    kind: 'text',
    connection: 'mapped',
  },
  {
    formKey: 'telefonoCoordinador',
    label: 'TELÉFONO COORDINADOR',
    section: 'coordinacion',
    column: 'field_22',
    spTitle: 'TELÉFONO COORDINADOR',
    kind: 'text',
    connection: 'mapped',
  },
  {
    formKey: 'carreraQueCoordina',
    label: 'CARRERA QUE COORDINA',
    section: 'coordinacion',
    column: 'field_18',
    spTitle: 'CARRERA QUE COORDINA',
    kind: 'text',
    connection: 'mapped',
  },
  {
    formKey: 'carrerasInvolucradas',
    label: 'Carreras Involucradas',
    section: 'coordinacion',
    column: 'Carrera',
    spTitle: 'Carrera',
    kind: 'text',
    connection: 'mapped',
    notes: 'Lista UI → texto en Carrera; conteo en field_19.',
  },
  {
    formKey: 'numeroCarrerasInvolucradas',
    label: 'NÚMERO DE CARRERAS INVOLUCRADAS',
    section: 'coordinacion',
    column: 'field_19',
    spTitle: 'NÚMERO DE CARRERAS INVOLUCRADAS EN EL PROYECTO',
    kind: 'number',
    connection: 'derived',
    notes: 'Derivado de carrerasInvolucradas.length',
  },
  {
    formKey: 'grupoInvestigacion',
    label: 'GRUPO DE INVESTIGACIÓN',
    section: 'coordinacion',
    column: 'GRUPODEINVESTIGACI_x00d3_N',
    spTitle: 'GRUPO DE INVESTIGACIÓN',
    kind: 'lookup',
    connection: 'mapped',
  },
  {
    formKey: 'lineaInvestigacion',
    label: 'LÍNEA DE INVESTIGACIÓN',
    section: 'coordinacion',
    column: 'field_6',
    spTitle: 'LÍNEA DE INVESTIGACIÓN',
    kind: 'choice',
    connection: 'mapped',
  },
  {
    formKey: 'lineaEstrategica',
    label: 'LÍNEA ESTRATÉGICA',
    section: 'coordinacion',
    column: 'field_4',
    spTitle: 'LÍNEA ESTRATÉGICA',
    kind: 'choice',
    connection: 'mapped',
  },
  {
    formKey: 'proyectoInvestigacion',
    label: 'PROYECTO INVESTIGACIÓN',
    section: 'coordinacion',
    column: 'PROYECTOINVESTIGACI_x00d3_N',
    spTitle: 'PROYECTO INVESTIGACIÓN',
    kind: 'lookup',
    connection: 'mapped',
  },
  {
    formKey: 'articulaInvestigacionPuce',
    label: '¿El proyecto se articula con alguna investigación PUCE?',
    section: 'coordinacion',
    column: 'OData__x00bf_Elproyectosearticulaconal',
    spTitle: '¿El proyecto se articula con alguna investigación PUCE?',
    kind: 'text',
    connection: 'mapped',
  },
  {
    formKey: 'redAcademicaArticulada',
    label: 'RED ACADÉMICA ARTICULADA',
    section: 'coordinacion',
    column: 'REDACAD_x00c9_MICAARTICULADA',
    spTitle: 'RED ACADÉMICA ARTICULADA',
    kind: 'choice',
    connection: 'mapped',
  },
  {
    formKey: 'identificacion',
    label: 'IDENTIFICACIÓN',
    section: 'coordinacion',
    column: 'IDENTIFICACION',
    spTitle: 'IDENTIFICACION',
    kind: 'text',
    connection: 'mapped',
  },

  /* ── Diagnóstico ── */
  {
    formKey: 'diagnosticoProblemaActores',
    label: 'DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS',
    section: 'diagnostico',
    column: 'DIAGN_x00d3_STICO_x002c_PROBLEMA',
    spTitle: 'DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'objetivo',
    label: 'OBJETIVO',
    section: 'diagnostico',
    column: 'field_7',
    spTitle: 'OBJETIVO',
    kind: 'choice',
    connection: 'pending',
  },
  {
    formKey: 'resumen',
    label: 'Resumen',
    section: 'diagnostico',
    column: 'Resumen',
    spTitle: 'Resumen',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'problemaContraparteDiagnostico',
    label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE (diagnóstico)',
    section: 'diagnostico',
    column: 'PROBLEMAENELQUEINTERVIENELACONTR',
    spTitle: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE',
    kind: 'text',
    connection: 'pending',
    notes: 'Comparte columna con problemaContraparteConvenio.',
  },
  {
    formKey: 'campoAmplio',
    label: 'CAMPO AMPLIO',
    section: 'diagnostico',
    column: 'field_23',
    spTitle: 'CAMPO AMPLIO',
    kind: 'text',
    connection: 'derived',
    notes: 'Readonly derivado de la carrera principal.',
  },
  {
    formKey: 'campoEspecifico',
    label: 'CAMPO ESPECÍFICO',
    section: 'diagnostico',
    column: 'field_24',
    spTitle: 'CAMPO ESPECÍFICO',
    kind: 'text',
    connection: 'derived',
  },
  {
    formKey: 'campoDetallado',
    label: 'CAMPO DETALLADO',
    section: 'diagnostico',
    column: 'field_25',
    spTitle: 'CAMPO DETALLADO',
    kind: 'text',
    connection: 'derived',
  },
  {
    formKey: 'ods',
    label: 'ODS',
    section: 'diagnostico',
    column: 'field_8',
    spTitle: 'ODS',
    kind: 'choice',
    connection: 'pending',
  },
  {
    formKey: 'mapeoActores',
    label: 'Mapeo de Actores y responsabilidades',
    section: 'diagnostico',
    column: 'MapeodeActoresyresponsabilidades',
    spTitle: 'Mapeo de Actores y responsabilidades',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'tipoActoresSociales',
    label: 'TIPO DE ACTORES SOCIALES',
    section: 'diagnostico',
    column: 'field_27',
    spTitle: 'TIPO DE ACTORES SOCIALES',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'descripcionTipoVinculacion',
    label: 'Descripción del Tipo de Vinculación',
    section: 'diagnostico',
    column: 'Descripci_x00f3_ndelTipodeVincul',
    spTitle: 'Descripción del Tipo de Vinculación',
    kind: 'text',
    connection: 'pending',
  },

  /* ── Contraparte ── */
  {
    formKey: 'nombreContraparte',
    label: 'NOMBRE DE CONTRAPARTE',
    section: 'contraparte',
    column: 'field_30',
    spTitle: 'NOMBRE DE CONTRAPARTE',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'instrumentoLegalContraparte',
    label: 'Instrumento Legal de la Contraparte',
    section: 'contraparte',
    column: 'InstrumentoLegaldelaContraparte',
    spTitle: 'Instrumento Legal de la Contraparte',
    kind: 'choice',
    connection: 'pending',
  },
  {
    formKey: 'problemaContraparteConvenio',
    label: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE (convenio)',
    section: 'contraparte',
    column: 'PROBLEMAENELQUEINTERVIENELACONTR',
    spTitle: 'PROBLEMA EN EL QUE INTERVIENE LA CONTRAPARTE',
    kind: 'text',
    connection: 'pending',
    notes: 'Misma columna que problemaContraparteDiagnostico. Unificar en UI o priorizar uno al guardar.',
  },

  /* ── Alcance ── */
  {
    formKey: 'alcanceTerritorial',
    label: 'ALCANCE TERRITORIAL',
    section: 'alcance',
    column: 'field_26',
    spTitle: 'ALCANCE TERRITORIAL',
    kind: 'choice',
    connection: 'pending',
  },
  {
    formKey: 'nombreComunidadAlcanzada',
    label: 'NOMBRE DE COMUNIDAD ALCANZADA',
    section: 'alcance',
    column: 'field_28',
    spTitle: 'NOMBRE DE COMUNIDAD ALCANZADA',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'ubicacionComunidad',
    label: 'Ubicación/es de la Comunidad/es',
    section: 'alcance',
    column: 'Ubicaci_x00f3_n_x002f_esdelaComu',
    spTitle: 'Ubicación/es de la Comunidad/es o Grupo/s Alcanzado/s',
    kind: 'text',
    connection: 'pending',
    notes: 'Incluye enlace/mapa si la UI lo captura en esta clave.',
  },
  {
    formKey: 'criteriosSeleccionBeneficiarios',
    label: 'CRITERIOS DE SELECCIÓN DE BENEFICIARIOS',
    section: 'alcance',
    column: 'CRITERIOSDESELECCI_x00d3_NDEBENE',
    spTitle: 'CRITERIOS DE SELECCIÓN DE BENEFICIARIOS ENTRE LA POBLACIÓN OBJETIVO',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'detalleCalculoComunidad',
    label: 'Detalle del cálculo de la comunidad participante',
    section: 'alcance',
    column: 'Detalledelc_x00e1_lculodelacomun',
    spTitle: 'Detalle del cálculo de la comunidad participante',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'numeroPersonasAlcanzadas',
    label: 'NÚMERO DE PERSONAS ALCANZADAS',
    section: 'alcance',
    column: 'field_31',
    spTitle: 'NÚMERO DE PERSONAS ALCANZADAS',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'personasAlcanzadasFemeninos',
    label: 'Personas Alcanzadas Femeninos',
    section: 'alcance',
    column: 'personas_alcanzadas_femeninos',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'personasAlcanzadasMasculinos',
    label: 'Personas Alcanzadas Masculinos',
    section: 'alcance',
    column: 'personas_alcanzadas_masculinos',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'beneficiariosDirectosFemeninos',
    label: 'Beneficiarios Directos Femeninos',
    section: 'alcance',
    column: 'beneficiarios_directos_femeninos',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'beneficiariosDirectosMasculinos',
    label: 'Beneficiarios Directos Masculinos',
    section: 'alcance',
    column: 'beneficiarios_directos_masculino',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'beneficiariosIndirectosFemeninos',
    label: 'Beneficiarios Indirectos Femeninos',
    section: 'alcance',
    column: 'beneficiarios_indirectos_femenin',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'beneficiariosIndirectosMasculinos',
    label: 'Beneficiarios Indirectos Masculinos',
    section: 'alcance',
    column: 'beneficiarios_indirectos_masculi',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numComunidad1f',
    label: 'Número de Comunidad Femenino 1er semestre',
    section: 'alcance',
    column: 'num_comunidad_1f',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numComunidad1m',
    label: 'Número de Comunidad Masculino 1er semestre',
    section: 'alcance',
    column: 'num_comunidad_1m',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numComunidad2f',
    label: 'Número de Comunidad Femenino 2do semestre',
    section: 'alcance',
    column: 'num_comunidad_2f',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numComunidad2m',
    label: 'Número de Comunidad Masculino 2do semestre',
    section: 'alcance',
    column: 'num_comunidad_2m',
    kind: 'number',
    connection: 'pending',
  },

  /* ── Componentes ── */
  {
    formKey: 'componenteInterculturalidad',
    label: 'COMPONENTE DE INTERCULTURALIDAD',
    section: 'componentes',
    column: 'COMPONENTEDEINTERCULTURALIDAD',
    spTitle: 'COMPONENTE DE INTERCULTURALIDAD',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'detalleInterculturalidad',
    label: 'DETALLE — INTERCULTURALIDAD',
    section: 'componentes',
    column: 'DETALLE_INTERCULTURALIDAD',
    spTitle: 'DETALLE_INTERCULTURALIDAD',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'componenteInterdisciplinariedad',
    label: 'COMPONENTE DE INTERDISCIPLINARIEDAD',
    section: 'componentes',
    column: 'field_10',
    spTitle: 'COMPONENTE DE INTERDISCIPLINARIEDAD',
    kind: 'choice',
    connection: 'pending',
  },
  {
    formKey: 'detalleInterdisciplinariedad',
    label: 'DETALLE — INTERDISCIPLINARIEDAD',
    section: 'componentes',
    column: 'DETALLE_INTERDISCIPLINARIEDAD',
    spTitle: 'DETALLE_INTERDISCIPLINARIEDAD',
    kind: 'text',
    connection: 'mapped',
    notes: 'Ya se escribe en toWriteRecord cuando hay valor.',
  },
  {
    formKey: 'componenteInternacionalizacion',
    label: 'COMPONENTE DE INTERNACIONALIZACIÓN',
    section: 'componentes',
    column: 'field_12',
    spTitle: 'COMPONENTE DE INTERNACIONALIZACIÓN',
    kind: 'choice',
    connection: 'pending',
  },
  {
    formKey: 'detalleInternacionalizacion',
    label: 'DETALLE — INTERNACIONALIZACIÓN',
    section: 'componentes',
    column: null,
    kind: 'none',
    connection: 'unmapped',
    notes: 'No existe columna DETALLE de internacionalización en la lista.',
  },
  {
    formKey: 'componentePosgrados',
    label: 'COMPONENTE DE POSGRADOS',
    section: 'componentes',
    column: 'field_13',
    spTitle: 'COMPONENTE DE POSGRADOS',
    kind: 'choice',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'detallePosgrados',
    label: 'DETALLE — POSGRADOS',
    section: 'componentes',
    column: 'DETALLE_POSGRADOS',
    spTitle: 'DETALLE_POSGRADOS',
    kind: 'choice',
    requiredIf: { formKey: 'componentePosgrados', equals: 'SI' },
    connection: 'mapped',
  },
  {
    formKey: 'componenteIntersedes',
    label: 'COMPONENTE INTERSEDES',
    section: 'componentes',
    column: 'field_11',
    spTitle: 'COMPONENTE INTERSEDES',
    kind: 'choice',
    requiredOnCreate: true,
    connection: 'mapped',
  },
  {
    formKey: 'detalleIntersedes',
    label: 'DETALLE — INTERSEDES',
    section: 'componentes',
    column: null,
    kind: 'none',
    connection: 'unmapped',
    notes: 'No existe columna DETALLE de intersedes en la lista.',
  },

  /* ── Participantes ── */
  {
    formKey: 'numeroDocentesVinculados',
    label: 'NÚMERO DE DOCENTES VINCULADOS (1ER SEMESTRE)',
    section: 'participantes',
    column: 'field_33',
    spTitle: 'NÚMERO DE DOCENTES VINCULADOS',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numeroDocentesVinculados2do',
    label: 'NÚMERO DE DOCENTES VINCULADOS (2DO SEMESTRE)',
    section: 'participantes',
    column: 'N_x00da_MERODEDOCENTESVINCULADOS',
    spTitle: 'NÚMERO DE DOCENTES VINCULADOS 2DO SEMESTRE',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numeroEstudiantesVinculados',
    label: 'NÚMERO DE ESTUDIANTES VINCULADOS (1ER SEMESTRE)',
    section: 'participantes',
    column: 'field_32',
    spTitle: 'NÚMERO DE ESTUDIANTES VINCULADOS',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numeroEstudiantesVinculados2do',
    label: 'NÚMERO DE ESTUDIANTES VINCULADOS (2DO SEMESTRE)',
    section: 'participantes',
    column: 'N_x00da_MERODEESTUDIANTESVINCULA',
    spTitle: 'NÚMERO DE ESTUDIANTES VINCULADOS 2DO SEMESTRE',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'numeroAdministrativosVinculados',
    label: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS (1ER SEMESTRE)',
    section: 'participantes',
    column: 'field_34',
    spTitle: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS',
    kind: 'number',
    connection: 'pending',
    notes: 'La lista solo tiene una columna de administrativos (sin 2do semestre).',
  },
  {
    formKey: 'numeroAdministrativosVinculados2do',
    label: 'NÚMERO DE ADMINISTRATIVOS VINCULADOS (2DO SEMESTRE)',
    section: 'participantes',
    column: null,
    kind: 'none',
    connection: 'unmapped',
    notes: 'No hay columna 2do semestre para administrativos en SharePoint.',
  },
  {
    formKey: 'numeroAlumniVinculados',
    label: 'NÚMERO DE ALUMNI VINCULADOS (1ER SEMESTRE)',
    section: 'participantes',
    column: 'field_35',
    spTitle: 'NÚMERO DE ALUMNI VINCULADOS',
    kind: 'number',
    connection: 'pending',
    notes: 'La lista solo tiene una columna de alumni (sin 2do semestre).',
  },
  {
    formKey: 'numeroAlumniVinculados2do',
    label: 'NÚMERO DE ALUMNI VINCULADOS (2DO SEMESTRE)',
    section: 'participantes',
    column: null,
    kind: 'none',
    connection: 'unmapped',
    notes: 'No hay columna 2do semestre para alumni en SharePoint.',
  },
  {
    formKey: 'resultadosAprendizaje',
    label: 'RESULTADOS DE APRENDIZAJE',
    section: 'participantes',
    column: 'RESULTADOSDEAPRENDIZAJE',
    spTitle: 'RESULTADOS DE APRENDIZAJE',
    kind: 'text',
    connection: 'pending',
  },
  {
    formKey: 'asesoria',
    label: 'ASESORÍA',
    section: 'participantes',
    column: 'ASESOR_x00cd_A',
    spTitle: 'ASESORÍA',
    kind: 'choice',
    connection: 'pending',
  },

  /* ── Marco lógico (estructura UI anidada → columnas planas) ── */
  {
    formKey: 'marcoLogico.OG',
    label: 'Objetivo General (marco lógico)',
    section: 'marcoLogico',
    column: 'OG_Resultados',
    kind: 'text',
    connection: 'derived',
    notes: 'Aplanar desde la UI: OG_Resultados, OG_Indicadores, OG_Fuentes, OG_Avance, OG_SUPUESTOS.',
  },
  {
    formKey: 'marcoLogico.OE',
    label: 'Objetivos Específicos (marco lógico)',
    section: 'marcoLogico',
    column: 'OE_Resultados',
    kind: 'text',
    connection: 'derived',
    notes: 'Columnas OE_Resultados, OE_Indicadores, OE_Fuentes, OE_Avance, OE_Supuestos.',
  },
  {
    formKey: 'marcoLogico.resultados',
    label: 'Resultados (marco lógico)',
    section: 'marcoLogico',
    column: 'R_Resultados',
    kind: 'text',
    connection: 'derived',
    notes: 'Columnas R_Resultados, R_Indicadores, R_Responsable, R_Etapa, R_Fuentes, R_Supuestos.',
  },
  {
    formKey: 'marcoLogico.actividades',
    label: 'Actividades (marco lógico)',
    section: 'marcoLogico',
    column: 'A_Resultados',
    kind: 'text',
    connection: 'derived',
    notes: 'Columnas A_Resultados, A_Indicadores, A_Fuentes, A_Supuestos.',
  },

  /* ── Presupuesto ── */
  {
    formKey: 'fuenteFinanciamiento',
    label: 'FUENTE DE FINANCIAMIENTO',
    section: 'presupuesto',
    column: 'field_39',
    spTitle: 'FUENTE DE FINANCIAMIENTO',
    kind: 'choice',
    connection: 'pending',
  },
  {
    formKey: 'presupuestoPlanificado',
    label: 'PRESUPUESTO PLANIFICADO',
    section: 'presupuesto',
    column: 'field_37',
    spTitle: 'PRESUPUESTO PLANIFICADO',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'presupuestoEjecutado',
    label: 'PRESUPUESTO EJECUTADO',
    section: 'presupuesto',
    column: 'field_38',
    spTitle: 'PRESUPUESTO EJECUTADO',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'presupuestoExterno',
    label: 'PRESUPUESTO EXTERNO PLANIFICADO',
    section: 'presupuesto',
    column: 'PRESUPUESTOEXTERNO',
    spTitle: 'PRESUPUESTO EXTERNO',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'presupuestoExternoAsignado',
    label: 'PRESUPUESTO EXTERNO ASIGNADO',
    section: 'presupuesto',
    column: 'PRESUPUESTOEXTERNOASIGNADO',
    spTitle: 'PRESUPUESTO EXTERNO ASIGNADO',
    kind: 'number',
    connection: 'pending',
  },
  {
    formKey: 'gastoNoContemplado',
    label: 'GASTO NO CONTEMPLADO',
    section: 'presupuesto',
    column: 'GASTONOCONTEMPLADO',
    spTitle: 'GASTO NO CONTEMPLADO',
    kind: 'number',
    connection: 'pending',
    notes: 'En SharePoint es number; la UI actual usa text — convertir al guardar.',
  },
  {
    formKey: 'parametroCumplimiento',
    label: 'PARÁMETRO DE CUMPLIMIENTO',
    section: 'presupuesto',
    column: 'field_40',
    spTitle: 'PARÁMETRO DE CUMPLIMIENTO',
    kind: 'choice',
    connection: 'pending',
  },

  /* ── Impactos / PI ── */
  {
    formKey: 'impactosList',
    label: 'Impactos del Proyecto',
    section: 'impactos',
    column: 'field_41',
    spTitle: 'IMPACTOS DEL PROYECTO',
    kind: 'choice',
    connection: 'derived',
    notes:
      'Repartir descripciones en IMPACTOSOCIAL, IMPACTOECON_x00d3_MICO, IMPACTOCIENT_x00cd_FICO_x002d_AC, IMPACTOAMBIENTAL, IMPACTOPOL_x00cd_TICO, OTRO_IMPACTO.',
  },
  {
    formKey: 'propiedadIntelectual',
    label: 'Tipo Propiedad Intelectual',
    section: 'impactos',
    column: 'TipoPropiedadIntelectual',
    spTitle: 'Tipo Propiedad Intelectual',
    kind: 'multichoice',
    connection: 'pending',
  },
  {
    formKey: 'detallePropiedadIntelectual',
    label: 'PROPIEDAD INTELECTUAL (detalle)',
    section: 'impactos',
    column: 'PROPIEDADINTELECTUAL',
    spTitle: 'PROPIEDAD INTELECTUAL',
    kind: 'text',
    connection: 'pending',
  },
] as const;

/* ───────── Índices y helpers ───────── */

export const FORM_SHAREPOINT_BY_KEY: Readonly<Record<string, FormSharePointField>> =
  Object.fromEntries(FORM_SHAREPOINT_FIELDS.map((field) => [field.formKey, field]));

/** Campos Choice del create que ya validan catálogo vivo en SharePoint. */
export const PROJECT_CHOICE_FIELDS = {
  ambitoProyecto: {
    reference: 'OData__x00c1_mbitodelProyecto',
    label: 'Ámbito del Proyecto',
  },
  dominioAcademico: { reference: 'field_5', label: 'Dominio Académico' },
  ejeVinculacion: { reference: 'EjedeVinculaci_x00f3_n', label: 'Eje de Vinculación' },
  origenProyecto: { reference: 'ORIGENDELPROYECTO', label: 'Origen del Proyecto' },
  componenteIntersedes: { reference: 'field_11', label: 'Componente Intersedes' },
  componentePosgrados: { reference: 'field_13', label: 'Componente de Posgrados' },
  detallePosgrados: { reference: 'DETALLE_POSGRADOS', label: 'Detalle de Posgrados' },
  articulacionFuncionesSustantivas: {
    reference: 'field_42',
    label: 'Articulación de Funciones Sustantivas',
  },
} as const;

export type ProjectChoiceKey = keyof typeof PROJECT_CHOICE_FIELDS;

/** Contrato mínimo al crear un ítem (columnas no opcionales / reglas de negocio). */
export const FORM_TO_SHAREPOINT_REQUIRED = {
  codigoProyecto: { column: 'Title', label: 'Código del Proyecto' },
  nombreProyecto: { column: 'field_1', label: 'Nombre del Proyecto' },
  fechaInicio: { column: 'field_14', label: 'Fecha de Inicio' },
  fechaFinPlaneado: { column: 'field_15', label: 'Fecha de Fin Planeado' },
  ambitoProyecto: {
    column: PROJECT_CHOICE_FIELDS.ambitoProyecto.reference,
    label: PROJECT_CHOICE_FIELDS.ambitoProyecto.label,
  },
  dominioAcademico: {
    column: PROJECT_CHOICE_FIELDS.dominioAcademico.reference,
    label: PROJECT_CHOICE_FIELDS.dominioAcademico.label,
  },
  ejeVinculacion: {
    column: PROJECT_CHOICE_FIELDS.ejeVinculacion.reference,
    label: PROJECT_CHOICE_FIELDS.ejeVinculacion.label,
  },
  origenProyecto: {
    column: PROJECT_CHOICE_FIELDS.origenProyecto.reference,
    label: PROJECT_CHOICE_FIELDS.origenProyecto.label,
  },
  componenteIntersedes: {
    column: PROJECT_CHOICE_FIELDS.componenteIntersedes.reference,
    label: PROJECT_CHOICE_FIELDS.componenteIntersedes.label,
  },
  componentePosgrados: {
    column: PROJECT_CHOICE_FIELDS.componentePosgrados.reference,
    label: PROJECT_CHOICE_FIELDS.componentePosgrados.label,
  },
  articulacionFuncionesSustantivas: {
    column: PROJECT_CHOICE_FIELDS.articulacionFuncionesSustantivas.reference,
    label: PROJECT_CHOICE_FIELDS.articulacionFuncionesSustantivas.label,
  },
} as const;

export type RequiredFormKey = keyof typeof FORM_TO_SHAREPOINT_REQUIRED;

export const getFieldsBySection = (section: FormSectionId): FormSharePointField[] =>
  FORM_SHAREPOINT_FIELDS.filter((field) => field.section === section);

export const getConnectedFields = (): FormSharePointField[] =>
  FORM_SHAREPOINT_FIELDS.filter((field) => field.column !== null);

export const getUnmappedFields = (): FormSharePointField[] =>
  FORM_SHAREPOINT_FIELDS.filter((field) => field.connection === 'unmapped');

export const getPendingPersistFields = (): FormSharePointField[] =>
  FORM_SHAREPOINT_FIELDS.filter((field) => field.connection === 'pending');

/** Resumen rápido para depuración / autocompletado. */
export const getConnectionSummary = () => {
  const counts = { mapped: 0, pending: 0, unmapped: 0, derived: 0 };
  for (const field of FORM_SHAREPOINT_FIELDS) {
    counts[field.connection] += 1;
  }
  return counts;
};
