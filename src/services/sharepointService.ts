import type { Project, ProjectStatus } from '../data/projects';
import type {
  EnPrueba_ProyectosVinculacionRead,
  EnPrueba_ProyectosVinculacionWrite,
} from '../generated/models/EnPrueba_ProyectosVinculacionModel';
import { EnPrueba_ProyectosVinculacionService } from '../generated/services/EnPrueba_ProyectosVinculacionService';

type SharePointProject = EnPrueba_ProyectosVinculacionRead;
type SharePointProjectWrite = Omit<EnPrueba_ProyectosVinculacionWrite, 'ID'>;

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

const toProject = (record: SharePointProject): Project => ({
  id: String(record.ID),
  title: record.nombreProyecto ?? record.Title ?? 'Sin nombre',
  code: record.codigoProyecto ?? record.Title ?? '',
  responsable: record.coordinadorResponsable ?? '',
  area: record.unidadResponsable ?? '',
  year: yearFromCode(record.codigoProyecto),
  status: statusFromSharePoint(record.estado),
});

const toWriteRecord = (project: ProjectSaveData): SharePointProjectWrite => ({
  // Title es obligatorio internamente en SharePoint; se conserva el c\u00f3digo como t\u00edtulo t\u00e9cnico.
  Title: project.code,
  codigoProyecto: project.code,
  nombreProyecto: project.title,
  estado: statusToSharePoint(project.status),
  coordinadorResponsable: project.responsable,
  correoCoordinador: project.email ?? '',
  unidadResponsable: project.unidadResponsable,
  fechaGuardado: new Date().toISOString(),
  datosCompletos: project.formData === undefined ? undefined : JSON.stringify(project.formData),
});

const requireData = <T>(data: T | undefined, operation: string): T => {
  if (data === undefined) {
    throw new Error(`SharePoint no devolvi\u00f3 datos al ${operation}.`);
  }
  return data;
};

/** Obtiene los proyectos de la lista SharePoint ProyectosVinculacion. */
export const getProjects = async (): Promise<Project[]> => {
  const result = await EnPrueba_ProyectosVinculacionService.getAll({
    select: [
      'ID',
      'Title',
      'codigoProyecto',
      'nombreProyecto',
      'estado',
      'coordinadorResponsable',
      'unidadResponsable',
    ],
    orderBy: ['Modified desc'],
  });

  return requireData(result.data, 'consultar los proyectos').map(toProject);
};

/** Crea un proyecto y devuelve el registro adaptado para la interfaz. */
export const createProject = async (project: ProjectSaveData): Promise<Project> => {
  const result = await EnPrueba_ProyectosVinculacionService.create(toWriteRecord(project));
  return toProject(requireData(result.data, 'crear el proyecto'));
};

/** Actualiza el estado mostrado en la lista y conserva la fecha de guardado. */
export const updateProjectStatus = async (
  id: string,
  status: ProjectStatus,
): Promise<Project> => {
  const result = await EnPrueba_ProyectosVinculacionService.update(id, {
    estado: statusToSharePoint(status),
    fechaGuardado: new Date().toISOString(),
  });
  return toProject(requireData(result.data, 'actualizar el estado del proyecto'));
};

/** Guarda los datos completos de un formulario como JSON en datosCompletos. */
export const saveProjectFormData = async (
  id: string,
  formData: unknown,
): Promise<void> => {
  await EnPrueba_ProyectosVinculacionService.update(id, {
    datosCompletos: JSON.stringify(formData),
    fechaGuardado: new Date().toISOString(),
  });
};

/** Recupera y deserializa los datos completos guardados para un proyecto. */
export const getProjectFormData = async <T>(id: string): Promise<T | null> => {
  const result = await EnPrueba_ProyectosVinculacionService.get(id, {
    select: ['datosCompletos'],
  });
  const value = requireData(result.data, 'consultar el proyecto').datosCompletos;

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error('El campo datosCompletos no contiene un JSON v\u00e1lido.');
  }
};
