/**
 * Estados del ciclo de vida de un proyecto:
 *  asignado     -> sin informe creado todavía            (sección "Proyectos asignados", botón "Iniciar informe")
 *  en-progreso  -> informe creado, último tipo = Avance   (sigue en "Proyectos asignados", botón "Modificar informe")
 *  cierre       -> informe creado, último tipo = Cierre   (pasa a sección "Cierre", botón "Modificar informe")
 *  finalizado   -> el administrador bloqueó el proyecto   (sección "Cierre", solo lectura)
 */
export type ProjectStatus = 'asignado' | 'en-progreso' | 'cierre' | 'finalizado';

export interface Project {
  id: string;
  title: string;
  code: string;
  responsable: string;
  area: string;
  year: number;
  status: ProjectStatus;
}

export const initialProjects: Project[] = [
  { id: '1', title: 'DISEÑO DE EXPERIENCIAS DE APRENDIZAJE STEAM (NIVEL TÉCNICO TECNOLÓGICO) CON ESTUDIANTES DE EDUCACIÓN MEDIA DEL DMQ - TICTECTALK', code: 'PSC-2026-PQ-082', responsable: 'NUNEZ MOSQUERA JOHANNA NATHALY', area: 'Tecnología', year: 2026, status: 'asignado' },
  { id: '2', title: 'FORTALECIMIENTO DE HABILIDADES SOCIOEMOCIONALES EN ADOLESCENTES', code: 'PSC-2026-PQ-091', responsable: 'GARCIA TORRES MARIO ALEJANDRO', area: 'Psicología', year: 2026, status: 'asignado' },
  { id: '3', title: 'EDUCACIÓN FINANCIERA PARA MICROEMPRESARIOS DE LA PARROQUIA CALDERÓN', code: 'PSC-2025-PQ-046', responsable: 'PEREZ VALLEJO ANDREA SOFIA', area: 'Administración', year: 2025, status: 'asignado' },

  { id: '4', title: 'FORTALECIMIENTO DE BIBLIOTECAS COMUNITARIAS EN EL SUR DE QUITO', code: 'PSC-2024-PQ-014', responsable: 'TORRES CEVALLOS DIEGO FERNANDO', area: 'Educación', year: 2024, status: 'en-progreso' },
  { id: '5', title: 'Implementación de Sistema de Gestión Documental', code: 'PSC-2026-PQ-001', responsable: 'MORALES SUAREZ PAOLA ESTEFANIA', area: 'Tecnología', year: 2026, status: 'en-progreso' },

  { id: '6', title: 'Modernización de Infraestructura de Red', code: 'PSC-2025-PQ-038', responsable: 'CASTRO LEON RICARDO JAVIER', area: 'Infraestructura', year: 2025, status: 'cierre' },
  { id: '7', title: 'Programa de Alfabetización Digital', code: 'PSC-2025-PQ-045', responsable: 'VILLACIS ROMERO KARLA PATRICIA', area: 'Educación', year: 2025, status: 'cierre' },

  { id: '8', title: 'Huertos Urbanos Sostenibles en La Mariscal', code: 'PSC-2024-PQ-009', responsable: 'JACOME ANDRADE LUIS GABRIEL', area: 'Medio Ambiente', year: 2024, status: 'finalizado' },
  { id: '9', title: 'Asesoría Legal Gratuita a Comunidades Vulnerables', code: 'PSC-2024-PQ-021', responsable: 'SALAZAR MENA VERONICA ALEXANDRA', area: 'Jurisprudencia', year: 2024, status: 'finalizado' },
];
