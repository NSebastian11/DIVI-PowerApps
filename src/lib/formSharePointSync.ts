import {
  FORM_SHAREPOINT_FIELDS,
  type FormSectionId,
  type FormSharePointField,
} from './formSharePointMap';

/** Fases cableadas en esta iteración (escritura + lectura para autocompletado). */
export const SYNCED_SECTIONS: readonly FormSectionId[] = [
  'identificacion',
  'coordinacion',
] as const;

const CARRERAS_SEPARATOR = ' | ';

const asText = (value: unknown): string => (typeof value === 'string' ? value : '');

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

const toOptionalNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

/** Normaliza fechas ISO de SharePoint a `YYYY-MM-DD` para inputs date. */
const toDateInputValue = (value: unknown): string | undefined => {
  const text = choiceText(value) || asText(value).trim();
  if (!text) return undefined;
  const match = text.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1];
};

const isWritableField = (field: FormSharePointField): boolean =>
  Boolean(field.column)
  && field.connection !== 'unmapped'
  && !field.formKey.startsWith('_')
  && field.formKey !== 'codigoProyecto'
  && field.formKey !== 'nombreProyecto'
  && field.formKey !== 'numeroCarrerasInvolucradas';

export const getSyncedFields = (
  sections: readonly FormSectionId[] = SYNCED_SECTIONS,
): FormSharePointField[] =>
  FORM_SHAREPOINT_FIELDS.filter(
    (field) => sections.includes(field.section) && isWritableField(field),
  );

const formValueForColumn = (
  field: FormSharePointField,
  form: Record<string, unknown>,
): unknown => {
  if (field.formKey === 'carrerasInvolucradas') {
    const list = Array.isArray(form.carrerasInvolucradas)
      ? form.carrerasInvolucradas.map((item) => asText(item).trim()).filter(Boolean)
      : [];
    return list.length > 0 ? list.join(CARRERAS_SEPARATOR) : undefined;
  }

  const raw = form[field.formKey];

  if (field.kind === 'number') {
    return toOptionalNumber(raw);
  }

  if (field.kind === 'date') {
    return normalizeOptionalText(raw);
  }

  if (Array.isArray(raw)) {
    const joined = raw.map((item) => asText(item).trim()).filter(Boolean).join(CARRERAS_SEPARATOR);
    return joined || undefined;
  }

  return normalizeOptionalText(raw);
};

/**
 * Agrega al payload de escritura los campos de las fases sincronizadas.
 * No pisa claves ya definidas (obligatorios del create).
 */
export const appendSyncedSectionsToWriteRecord = (
  target: Record<string, unknown>,
  form: Record<string, unknown>,
  sections: readonly FormSectionId[] = SYNCED_SECTIONS,
): Record<string, unknown> => {
  for (const field of getSyncedFields(sections)) {
    const column = field.column;
    if (!column || column in target) continue;

    const value = formValueForColumn(field, form);
    if (value === undefined || value === '') continue;
    target[column] = value;
  }

  // Conteo derivado de carreras involucradas.
  if (sections.includes('coordinacion') && !('field_19' in target)) {
    const list = Array.isArray(form.carrerasInvolucradas)
      ? form.carrerasInvolucradas.map((item) => asText(item).trim()).filter(Boolean)
      : [];
    if (list.length > 0) {
      target.field_19 = list.length;
    }
  }

  return target;
};

const readColumnValue = (
  record: Record<string, unknown>,
  column: string,
): unknown => record[column];

/**
 * Reconstruye `formData` parcial desde un registro SharePoint
 * para las fases sincronizadas (base del autocompletado).
 */
export const formDataFromSharePointRecord = (
  record: Record<string, unknown>,
  sections: readonly FormSectionId[] = SYNCED_SECTIONS,
): Record<string, unknown> => {
  const form: Record<string, unknown> = {};

  const code = normalizeOptionalText(record.Title);
  const name = normalizeOptionalText(record.field_1);
  if (code) form.codigoProyecto = code;
  if (name) form.nombreProyecto = name;
  const estadoInforme = normalizeOptionalText(record.ESTADO_INFORME);
  if (estadoInforme) form._estadoInforme = estadoInforme;

  for (const field of getSyncedFields(sections)) {
    const column = field.column;
    if (!column) continue;

    const raw = readColumnValue(record, column);
    if (raw === null || raw === undefined || raw === '') continue;

    if (field.formKey === 'carrerasInvolucradas') {
      const text = choiceText(raw) || asText(raw);
      form.carrerasInvolucradas = text
        .split(/ \| |;|,/)
        .map((part) => part.trim())
        .filter(Boolean);
      continue;
    }

    if (field.kind === 'number') {
      const numberValue = toOptionalNumber(raw);
      if (numberValue !== undefined) form[field.formKey] = numberValue;
      continue;
    }

    if (field.kind === 'date') {
      const dateValue = toDateInputValue(raw);
      if (dateValue) form[field.formKey] = dateValue;
      continue;
    }

    if (field.formKey === 'redAcademicaArticulada') {
      const text = choiceText(raw);
      if (text) form.redAcademicaArticulada = text.split(CARRERAS_SEPARATOR).map((p) => p.trim()).filter(Boolean);
      continue;
    }

    const text = choiceText(raw) || normalizeOptionalText(raw);
    if (text) form[field.formKey] = text;
  }

  // Compatibilidad con registros creados antes de que la columna field_20
  // se sincronizara desde la propuesta.
  if (!form.coordinadorResponsable) {
    const responsableAnterior = normalizeOptionalText(record.R_Responsable);
    if (responsableAnterior) form.coordinadorResponsable = responsableAnterior;
  }

  return form;
};

/** Columnas SharePoint a solicitar al leer un proyecto para autocompletado. */
export const getSyncedSelectColumns = (
  sections: readonly FormSectionId[] = SYNCED_SECTIONS,
): string[] => {
  const columns = new Set<string>(['ID', 'Title', 'field_1', 'field_9', 'ESTADO_INFORME', 'R_Responsable']);
  for (const field of getSyncedFields(sections)) {
    if (field.column) columns.add(field.column);
  }
  columns.add('field_19');
  return [...columns];
};
