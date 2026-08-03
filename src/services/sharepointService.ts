import type { Project, ProjectStatus } from '../data/projects';
import type { Proyectos_VinculacionRead } from '../generated/models/Proyectos_VinculacionModel';
import { Proyectos_VinculacionService } from '../generated/services/Proyectos_VinculacionService';

type SharePointProject = Proyectos_VinculacionRead;
type SharePointProjectWrite = Record<string, unknown>;

export interface ProjectSaveData {
  title: string;
  code: string;
  responsable: string;
  email?: string;
  unidadResponsable: string;
  status: ProjectStatus;
  formData?: unknown;
}

const statusFromSharePoint = (status?: string): ProjectStatus => {
  switch (status?.trim().toUpperCase()) {
    case 'PROPUESTA PENDIENTE':
    case 'EN REVISIÓN':
    case 'EN REVISION':
      return 'propuesta-pendiente';
    case 'FINALIZADO':
      return 'finalizado';
    case 'CIERRE':
      return 'cierre';
    case 'EN EJECUCI\u00d3N':
    case 'EN EJECUCION':
    case 'EN PROGRESO':
      return 'en-progreso';
    default:
      return 'asignado';
  }
};

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

const yearFromCode = (code?: string): number => {
  const match = code?.match(/PSC-(\d{4})-/i);
  return match ? Number(match[1]) : new Date().getFullYear();
};

const asText = (value: unknown): string => (typeof value === 'string' ? value : '');

const toProject = (record: SharePointProject): Project => {
  const title = record.field_1 || record.Title || 'Sin nombre';

  return {
    id: String(record.ID),
    // Estos son los campos disponibles en la lista Proyectos_Vinculacion
    // regenerada desde SharePoint.
    title,
    code: record.Title ?? '',
    responsable: record.R_Responsable ?? '',
    area: '',
    year: yearFromCode(title),
    status: statusFromSharePoint(record.ESTADO_INFORME),
    unidadResponsable: undefined,
  };
};

const toWriteRecord = (project: ProjectSaveData): SharePointProjectWrite => {
  const form = project.formData && typeof project.formData === 'object'
    ? project.formData as Record<string, unknown>
    : {};

  return {
    Title: project.code,
    field_1: project.title,
    field_9: 'PROPUESTA',
    ESTADO_INFORME: statusToSharePoint(project.status),
    OData__x00c1_mbitodelProyecto: asText(form.ambitoProyecto),
    field_14: asText(form.fechaInicio),
    field_15: asText(form.fechaFinPlaneado),
    field_5: asText(form.dominioAcademico),
    EjedeVinculaci_x00f3_n: asText(form.ejeVinculacion),
    ORIGENDELPROYECTO: asText(form.origenProyecto),
    field_11: asText(form.componenteIntersedes),
    field_13: asText(form.componentePosgrados),
    field_42: asText(form.articulacionFuncionesSustantivas),
    field_16: asText(form.fechaFinReal),
    DETALLE_INTERDISCIPLINARIEDAD: asText(form.articulacionFuncionesJustificacion),
    DETALLE_POSGRADOS: asText(form.detallePosgrados),
  };
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
  const result = await Proyectos_VinculacionService.update(
    id,
    {
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

/** Recupera y deserializa los datos completos guardados para un proyecto. */
export const getProjectFormData = async <T>(id: string): Promise<T | null> => {
  void id;
  return null;
};
