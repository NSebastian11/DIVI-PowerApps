export interface ExistingProjectRecord {
  id: number;
  titulo: string;
  nombreProyecto: string;
  estado: string;
  origenProyecto: string;
  anioPresupuesto: number;
  fechaInicio: string;
  unidadResponsable: string;
}

/**
 * Lista simulada de la lista de SharePoint "Proyectos_Vinculacion".
 * Sirve para probar que el contador PSC-YYYY-PQ-NNN se reinicia por año.
 */
export const existingProjects: ExistingProjectRecord[] = [
  { id: 318, titulo: 'PSC-2025-PQ-012', nombreProyecto: 'ALFABETIZACIÓN DIGITAL PARA ADULTOS MAYORES EN CALDERÓN', estado: 'FINALIZADO', origenProyecto: 'Docente', anioPresupuesto: 2025, fechaInicio: '2025-02-10', unidadResponsable: 'Facultad de Ciencias de la Educación' },
  { id: 325, titulo: 'PSC-2025-PQ-027', nombreProyecto: 'FORTALECIMIENTO DE EMPRENDIMIENTOS COMUNITARIOS EN TUMBACO', estado: 'FINALIZADO', origenProyecto: 'Convenio', anioPresupuesto: 2025, fechaInicio: '2025-03-18', unidadResponsable: 'Facultad de Ciencias Administrativas y Contables' },
  { id: 331, titulo: 'PSC-2025-PQ-038', nombreProyecto: 'ASESORÍA LEGAL GRATUITA A COMUNIDADES VULNERABLES', estado: 'FINALIZADO', origenProyecto: 'Estudiante', anioPresupuesto: 2025, fechaInicio: '2025-05-02', unidadResponsable: 'Facultad de Jurisprudencia' },
  { id: 339, titulo: 'PSC-2025-PQ-045', nombreProyecto: 'PROMOCIÓN DE SALUD MENTAL EN UNIDADES EDUCATIVAS DE QUITO', estado: 'FINALIZADO', origenProyecto: 'Docente', anioPresupuesto: 2025, fechaInicio: '2025-08-11', unidadResponsable: 'Facultad de Psicología' },
  { id: 344, titulo: 'PSC-2026-PQ-001', nombreProyecto: 'HUERTOS URBANOS SOSTENIBLES EN LA MARISCAL', estado: 'EN EJECUCIÓN', origenProyecto: 'Comunidad', anioPresupuesto: 2026, fechaInicio: '2026-01-15', unidadResponsable: 'Facultad de Ciencias Exactas y Naturales' },
  { id: 348, titulo: 'PSC-2026-PQ-015', nombreProyecto: 'CAPACITACIÓN EN COMPETENCIAS DIGITALES PARA PYMES', estado: 'EN EJECUCIÓN', origenProyecto: 'Convenio', anioPresupuesto: 2026, fechaInicio: '2026-02-02', unidadResponsable: 'Facultad de Ingeniería' },
  { id: 350, titulo: 'PSC-2026-PQ-053', nombreProyecto: 'PREVENCIÓN DE VIOLENCIA DE GÉNERO EN ZONAS RURALES DEL DMQ', estado: 'EN EJECUCIÓN', origenProyecto: 'Docente', anioPresupuesto: 2026, fechaInicio: '2026-03-20', unidadResponsable: 'Facultad de Psicología' },
  { id: 352, titulo: 'PSC-2026-PQ-081', nombreProyecto: 'DISEÑO E IMPLEMENTACIÓN DE PROCESOS FORMATIVOS PARA EL FORTALECIMIENTO DEL TRABAJO COOPERATIVO Y SOLIDARIO CON ACTORES PRODUCTIVOS DE LA PARROQUIA CALDERÓN.', estado: 'PROPUESTA', origenProyecto: 'Docente', anioPresupuesto: 2026, fechaInicio: '2026-05-04', unidadResponsable: 'Facultad de Ciencias Administrativas y Contables' },
  { id: 353, titulo: 'PSC-2026-PQ-082', nombreProyecto: 'DISEÑO DE EXPERIENCIAS DE APRENDIZAJE STEAM (NIVEL TÉCNICO TECNOLÓGICO) CON ESTUDIANTES DE EDUCACIÓN MEDIA DEL DMQ - TICTECTALK', estado: 'PROPUESTA', origenProyecto: 'Docente', anioPresupuesto: 2026, fechaInicio: '2026-05-18', unidadResponsable: 'Facultad de Ingeniería' },
];

export const existingProjectCodes = existingProjects.map((p) => p.titulo);
