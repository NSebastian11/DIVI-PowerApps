import type { Project, ProjectStatus } from '../data/projects';
import type { Proyectos_VinculacionRead } from '../generated/models/Proyectos_VinculacionModel';
import { Proyectos_VinculacionService } from '../generated/services/Proyectos_VinculacionService';
import {
  FORM_TO_SHAREPOINT_REQUIRED,
  PROJECT_CHOICE_FIELDS,
  type ProjectChoiceKey,
  type RequiredFormKey,
} from '../lib/formSharePointMap';
import {
  appendSyncedSectionsToWriteRecord,
  formDataFromSharePointRecord,
  getSyncedSelectColumns,
} from '../lib/formSharePointSync';

export type { ProjectChoiceKey } from '../lib/formSharePointMap';
export type ProjectChoiceCatalogs = Record<ProjectChoiceKey, string[]>;

type SharePointProject = Proyectos_VinculacionRead;
type SharePointProjectWrite = Record<string, unknown>;

/** Choices siempre obligatorios en SharePoint (excluye detallePosgrados, que es condicional). */
const REQUIRED_CHOICE_KEYS = (
  Object.keys(PROJECT_CHOICE_FIELDS) as ProjectChoiceKey[]
).filter((key) => key !== 'detallePosgrados');

export interface ProjectSaveData {
  title: string;
  code: string;
  responsable: string;
  email?: string;
  unidadResponsable: string;
  status: ProjectStatus;
  formData?: unknown;
}

/**
 * La sección de la lista la define field_9 (Choice «ESTADO» en SharePoint):
 * - vacío → Propuestas pendientes de revisión
 * - con valor (PROPUESTA, EN EJECUCIÓN, DETENIDO, …) → Proyectos asignados / Cierre
 * ESTADO_INFORME solo afina el subestado cuando ESTADO ya tiene valor.
 */
const statusFromSharePoint = (statusInforme?: string, sharePointEstado?: string): ProjectStatus => {
  const estado = sharePointEstado?.trim().toUpperCase() ?? '';
  const informe = statusInforme?.trim().toUpperCase() ?? '';

  // Regla de negocio: ESTADO vacío = pendiente de revisión.
  if (!estado) {
    return 'propuesta-pendiente';
  }

  switch (estado) {
    case 'EN EJECUCIÓN':
    case 'EN EJECUCION':
      return 'en-progreso';
    case 'EN CIERRE':
    case 'CIERRE':
      return 'cierre';
    case 'FINALIZADO':
    case 'CANCELADO':
      return 'finalizado';
    case 'PROPUESTA':
    case 'DETENIDO':
    default:
      break;
  }

  // ESTADO con valor genérico (p. ej. PROPUESTA): usar INFORME si indica avance.
  switch (informe) {
    case 'EN EJECUCIÓN':
    case 'EN EJECUCION':
    case 'EN PROGRESO':
      return 'en-progreso';
    case 'CIERRE':
    case 'EN CIERRE':
      return 'cierre';
    case 'FINALIZADO':
      return 'finalizado';
    default:
      return 'asignado';
  }
};

/** Valor de ESTADO_INFORME según el estado de la UI. */
const statusToSharePoint = (status: ProjectStatus): string => {
  const values: Record<ProjectStatus, string> = {
    'propuesta-pendiente': 'PROPUESTA PENDIENTE',
    asignado: 'ASIGNADO',
    'en-progreso': 'EN EJECUCI\u00d3N',
    cierre: 'CIERRE',
    finalizado: 'FINALIZADO',
  };

  return values[status];
};

/**
 * Valor de field_9 (Choice «ESTADO» en SharePoint).
 * Vacío = pendiente de revisión; PROPUESTA = asignado listo para informe.
 */
const statusToSharePointEstado = (status: ProjectStatus): string => {
  const values: Record<ProjectStatus, string> = {
    'propuesta-pendiente': '',
    asignado: 'PROPUESTA',
    'en-progreso': 'EN EJECUCI\u00d3N',
    cierre: 'EN CIERRE',
    finalizado: 'FINALIZADO',
  };

  return values[status];
};

const yearFromCode = (code?: string): number => {
  const match = code?.match(/PSC-(\d{4})-/i);
  return match ? Number(match[1]) : new Date().getFullYear();
};

const asText = (value: unknown): string => (typeof value === 'string' ? value : '');

/** Extrae el texto de un Choice de SharePoint (`string` o `{ Value: string }`). */
const choiceText = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object' && 'Value' in value) {
    const nested = (value as { Value?: unknown }).Value;
    return typeof nested === 'string' ? nested.trim() : '';
  }
  return '';
};

const normalizeOptionalText = (value: unknown): string | undefined => {
  const text = asText(value).trim();
  return text.length > 0 ? text : undefined;
};

/**
 * Validaciones de formato previas al envío. Se conservan como texto para no
 * alterar ceros iniciales ni el contrato de columnas de SharePoint.
 */
const validateContactFields = (form: Record<string, unknown>): void => {
  const email = requireText(form.correoCoordinador, 'Correo electrónico del coordinador');
  const phone = normalizeOptionalText(form.telefonoCoordinador);
  const identification = requireText(form.identificacion, 'Identificación');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('El correo electrónico del coordinador no tiene un formato válido.');
  }
  if (phone && !/^\d{7,15}$/.test(phone)) {
    throw new Error('El teléfono del coordinador debe contener entre 7 y 15 dígitos.');
  }
  if (!/^\d{10}$/.test(identification)) {
    throw new Error('La identificación debe contener exactamente 10 dígitos.');
  }
};

const requireText = (value: unknown, label: string): string => {
  const text = normalizeOptionalText(value);
  if (!text) {
    throw new Error(`El campo «${label}» es obligatorio para SharePoint.`);
  }
  return text;
};

const getChoiceValues = (data: unknown): string[] => {
  const records = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'value' in data && Array.isArray(data.value)
      ? data.value
      : [];

  return [...new Set(records
    .map((record) => record && typeof record === 'object' && 'Value' in record ? record.Value : undefined)
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim()))];
};

/** Obtiene los valores vigentes de las columnas Choice obligatorias desde SharePoint. */
export const getProjectChoiceCatalogs = async (): Promise<ProjectChoiceCatalogs> => {
  const entries = await Promise.all(
    Object.entries(PROJECT_CHOICE_FIELDS).map(async ([key, field]) => {
      const result = await Proyectos_VinculacionService.getReferencedEntity('', field.reference);
      const data = requireData(result, `consultar el catálogo «${field.label}»`);
      const values = getChoiceValues(data);

      if (values.length === 0) {
        throw new Error(`El catálogo «${field.label}» no devolvió opciones disponibles.`);
      }

      return [key, values] as const;
    }),
  );

  return Object.fromEntries(entries) as ProjectChoiceCatalogs;
};

const validateProjectChoiceValues = async (form: Record<string, unknown>): Promise<void> => {
  const catalogs = await getProjectChoiceCatalogs();
  const requiresDetallePosgrados = asText(form.componentePosgrados).trim() === 'SI';

  const invalidFields = (Object.keys(PROJECT_CHOICE_FIELDS) as ProjectChoiceKey[])
    .filter((key) => {
      const value = asText(form[key]).trim();
      const isRequired = (REQUIRED_CHOICE_KEYS as readonly ProjectChoiceKey[]).includes(key)
        || (key === 'detallePosgrados' && requiresDetallePosgrados);

      if (!value) {
        return isRequired;
      }

      return !catalogs[key].includes(value);
    })
    .map((key) => PROJECT_CHOICE_FIELDS[key].label);

  if (invalidFields.length > 0) {
    throw new Error(
      `Los siguientes valores ya no son válidos en SharePoint: ${invalidFields.join(', ')}. `
      + 'Actualice las selecciones e inténtelo de nuevo.',
    );
  }
};

const validateProjectPayload = (project: ProjectSaveData, form: Record<string, unknown>): void => {
  const formWithProject: Record<string, unknown> = {
    ...form,
    nombreProyecto: form.nombreProyecto ?? project.title,
    codigoProyecto: form.codigoProyecto ?? project.code,
  };

  const missingLabels = (Object.keys(FORM_TO_SHAREPOINT_REQUIRED) as RequiredFormKey[])
    .filter((key) => {
      if (key === 'nombreProyecto') return !normalizeOptionalText(project.title) && !normalizeOptionalText(form.nombreProyecto);
      if (key === 'codigoProyecto') return !normalizeOptionalText(project.code) && !normalizeOptionalText(form.codigoProyecto);
      return !normalizeOptionalText(formWithProject[key]);
    })
    .map((key) => FORM_TO_SHAREPOINT_REQUIRED[key].label);

  if (missingLabels.length > 0) {
    throw new Error(
      `Complete los campos obligatorios de SharePoint: ${missingLabels.join(', ')}.`,
    );
  }

  const projectName = requireText(project.title || form.nombreProyecto, FORM_TO_SHAREPOINT_REQUIRED.nombreProyecto.label);
  const projectCode = requireText(project.code || form.codigoProyecto, FORM_TO_SHAREPOINT_REQUIRED.codigoProyecto.label);

  if (projectName.length > 255 || projectCode.length > 255) {
    throw new Error('El nombre y el código del proyecto no pueden superar 255 caracteres.');
  }

  const startDate = requireText(form.fechaInicio, FORM_TO_SHAREPOINT_REQUIRED.fechaInicio.label);
  const plannedEndDate = requireText(form.fechaFinPlaneado, FORM_TO_SHAREPOINT_REQUIRED.fechaFinPlaneado.label);
  const realEndDate = normalizeOptionalText(form.fechaFinReal);
  const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

  if (!isDate(startDate) || !isDate(plannedEndDate)) {
    throw new Error('Las fechas de inicio y de fin planeado deben tener un formato válido.');
  }
  if (realEndDate && !isDate(realEndDate)) {
    throw new Error('La fecha de fin real debe tener un formato válido.');
  }
  if (plannedEndDate < startDate) {
    throw new Error('La fecha de fin planeado no puede ser anterior a la fecha de inicio.');
  }
  if (realEndDate && realEndDate < startDate) {
    throw new Error('La fecha de fin real no puede ser anterior a la fecha de inicio.');
  }
  validateContactFields(form);
  if (asText(form.componentePosgrados).trim() === 'SI' && !normalizeOptionalText(form.detallePosgrados)) {
    throw new Error(
      `Seleccione el «${PROJECT_CHOICE_FIELDS.detallePosgrados.label}» cuando el componente de posgrados sea «SI».`,
    );
  }
};

const toProject = (record: SharePointProject): Project => {
  const title = record.field_1 || record.Title || 'Sin nombre';
  const code = record.Title ?? '';
  // field_9 es la columna Choice con título «ESTADO» en SharePoint (no existe columna ESTADO).
  const sharePointEstado = choiceText(record.field_9);

  return {
    id: String(record.ID),
    // Estos son los campos disponibles en la lista Proyectos_Vinculacion
    // regenerada desde SharePoint.
    title,
    code,
    responsable: record.R_Responsable ?? '',
    area: '',
    year: yearFromCode(code),
    status: statusFromSharePoint(record.ESTADO_INFORME, sharePointEstado),
    unidadResponsable: undefined,
  };
};

const toWriteRecord = (project: ProjectSaveData): SharePointProjectWrite => {
  const form = project.formData && typeof project.formData === 'object'
    ? project.formData as Record<string, unknown>
    : {};

  const startDate = requireText(form.fechaInicio, FORM_TO_SHAREPOINT_REQUIRED.fechaInicio.label);
  const plannedEndDate = requireText(form.fechaFinPlaneado, FORM_TO_SHAREPOINT_REQUIRED.fechaFinPlaneado.label);
  const realEndDate = normalizeOptionalText(form.fechaFinReal);
  const interdisciplinarityDetail = normalizeOptionalText(form.detalleInterdisciplinariedad);
  const postgraduateDetail = normalizeOptionalText(form.detallePosgrados);
  const sharePointEstado = statusToSharePointEstado(project.status);

  const ambitoProyecto = requireText(form.ambitoProyecto, FORM_TO_SHAREPOINT_REQUIRED.ambitoProyecto.label);
  const dominioAcademico = requireText(form.dominioAcademico, FORM_TO_SHAREPOINT_REQUIRED.dominioAcademico.label);
  const ejeVinculacion = requireText(form.ejeVinculacion, FORM_TO_SHAREPOINT_REQUIRED.ejeVinculacion.label);
  const origenProyecto = requireText(form.origenProyecto, FORM_TO_SHAREPOINT_REQUIRED.origenProyecto.label);
  const componenteIntersedes = requireText(form.componenteIntersedes, FORM_TO_SHAREPOINT_REQUIRED.componenteIntersedes.label);
  const componentePosgrados = requireText(form.componentePosgrados, FORM_TO_SHAREPOINT_REQUIRED.componentePosgrados.label);
  const articulacionFuncionesSustantivas = requireText(
    form.articulacionFuncionesSustantivas,
    FORM_TO_SHAREPOINT_REQUIRED.articulacionFuncionesSustantivas.label,
  );

  const record: SharePointProjectWrite = {
    Title: project.code.trim(),
    field_1: project.title.trim(),
    // ESTADO vacío = pendiente de revisión; no forzar el default PROPUESTA de SharePoint.
    ...(sharePointEstado ? { field_9: sharePointEstado } : { field_9: '' }),
    ESTADO_INFORME: statusToSharePoint(project.status),
    OData__x00c1_mbitodelProyecto: ambitoProyecto,
    field_14: startDate,
    field_15: plannedEndDate,
    field_5: dominioAcademico,
    EjedeVinculaci_x00f3_n: ejeVinculacion,
    ORIGENDELPROYECTO: origenProyecto,
    field_11: componenteIntersedes,
    field_13: componentePosgrados,
    field_42: articulacionFuncionesSustantivas,
    ...(realEndDate ? { field_16: realEndDate } : {}),
    ...(interdisciplinarityDetail ? { DETALLE_INTERDISCIPLINARIEDAD: interdisciplinarityDetail } : {}),
    ...(componentePosgrados === 'SI' && postgraduateDetail
      ? { DETALLE_POSGRADOS: postgraduateDetail }
      : {}),
  };

  // Identificación + Coordinación (mapa canónico → columnas SharePoint).
  appendSyncedSectionsToWriteRecord(record, form);

  return record;
};

const responseErrorMessage = (error: unknown): string => {
  if (!error) return '';
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const isNotFoundError = (error: unknown): boolean =>
  responseErrorMessage(error).includes('"status":404')
  || /item not found/i.test(responseErrorMessage(error));

const requireData = <T>(response: { data?: T; error?: unknown } | undefined, operation: string): T => {
  const errorMessage = responseErrorMessage(response?.error);

  if (!response || response.data === undefined) {
    throw new Error(
      errorMessage
        ? `SharePoint no pudo ${operation}: ${errorMessage}`
        : `SharePoint no devolvió datos al ${operation}.`,
    );
  }

  return response.data;
};

/** Obtiene los proyectos de la lista SharePoint Proyectos_Vinculacion. */
export const getProjects = async (): Promise<Project[]> => {
  const result = await Proyectos_VinculacionService.getAll({
    select: [
      'ID',
      'Title',
      'field_1',
      'field_9',
      'ESTADO_INFORME',
      'R_Responsable',
      'Modified',
    ],
    orderBy: ['Modified desc'],
  });

  const data = requireData(result, 'consultar los proyectos');
  if (!Array.isArray(data)) {
    console.error('Respuesta inesperada de SharePoint:', data);
    throw new Error('SharePoint no devolvió una lista de proyectos.');
  }
  return data.map(toProject);
};

/** Crea un proyecto y devuelve el registro adaptado para la interfaz. */
export const createProject = async (project: ProjectSaveData): Promise<Project> => {
  const form = project.formData && typeof project.formData === 'object'
    ? project.formData as Record<string, unknown>
    : {};
  validateProjectPayload(project, form);
  await validateProjectChoiceValues(form);

  const result = await Proyectos_VinculacionService.create(
    toWriteRecord(project) as Parameters<typeof Proyectos_VinculacionService.create>[0],
  );
  return toProject(requireData(result, 'crear el proyecto'));
};

/** Actualiza el estado mostrado en la lista y conserva la fecha de guardado. */
export const updateProjectStatus = async (
  id: string,
  status: ProjectStatus,
): Promise<Project> => {
  const estadoValue = statusToSharePointEstado(status);
  const result = await Proyectos_VinculacionService.update(
    id,
    {
      field_9: estadoValue,
      ESTADO_INFORME: statusToSharePoint(status),
    } as Parameters<typeof Proyectos_VinculacionService.update>[1],
  );
  return toProject(requireData(result, 'actualizar el estado del proyecto'));
};

/** Guarda los datos completos de un formulario como JSON en datosCompletos. */
export const saveProjectFormData = async (
  id: string,
  formData: unknown,
): Promise<void> => {
  void id;
  void formData;
};

/**
 * Busca por ID mediante la colección. La operación `get` del conector puede
 * responder 404 aun cuando el ítem sí es visible en la lista.
 */
const getProjectRecordById = async (id: string): Promise<SharePointProject | null> => {
  const itemId = Number(id);
  if (!Number.isSafeInteger(itemId) || itemId <= 0) return null;

  try {
    const result = await Proyectos_VinculacionService.getAll({
      select: getSyncedSelectColumns(),
      filter: `ID eq ${itemId}`,
      top: 1,
    });
    const records = requireData(result, 'consultar los datos del formulario');
    if (Array.isArray(records) && records.length > 0) return records[0];
  } catch (error) {
    // Algunos conectores SharePoint no admiten el filtro ID en esta operación.
    if (!isNotFoundError(error)) throw error;
  }

  // Respaldo: la lectura de la colección ya es compatible con el conector.
  const fallbackResult = await Proyectos_VinculacionService.getAll({
    select: getSyncedSelectColumns(),
  });
  const fallbackRecords = requireData(fallbackResult, 'consultar los datos del formulario');
  return Array.isArray(fallbackRecords)
    ? fallbackRecords.find((record) => Number(record.ID) === itemId) ?? null
    : null;
};

/** Obtiene un proyecto por ID con las columnas de Identificación + Coordinación. */
export const getProjectById = async (id: string): Promise<Project | null> => {
  const record = await getProjectRecordById(id);
  return record ? toProject(record) : null;
};

/**
 * Recupera formData de Identificación + Coordinación desde SharePoint
 * para autocompletar el formulario.
 */
export const getProjectFormData = async <T>(id: string): Promise<T | null> => {
  try {
    const record = await getProjectRecordById(id);
    return record
      ? formDataFromSharePointRecord(record as unknown as Record<string, unknown>) as T
      : null;
  } catch (error) {
    // No impedir iniciar el informe si el ítem fue eliminado o no es accesible.
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
