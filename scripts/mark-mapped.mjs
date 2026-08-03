import fs from 'fs';

const path = 'src/lib/formSharePointMap.ts';
let src = fs.readFileSync(path, 'utf8');

const keys = new Set([
  'tipo',
  'anioPresupuesto',
  'unidadResponsable',
  'sede',
  'coordinadorResponsable',
  'correoCoordinador',
  'telefonoCoordinador',
  'carreraQueCoordina',
  'carrerasInvolucradas',
  'grupoInvestigacion',
  'lineaInvestigacion',
  'lineaEstrategica',
  'proyectoInvestigacion',
  'articulaInvestigacionPuce',
  'redAcademicaArticulada',
  'identificacion',
]);

src = src.replace(
  /formKey: '([^']+)',([\s\S]*?)connection: '(pending|mapped|derived|unmapped)'/g,
  (match, key, mid, status) => {
    if (keys.has(key) && status === 'pending') {
      return `formKey: '${key}',${mid}connection: 'mapped'`;
    }
    return match;
  },
);

fs.writeFileSync(path, src);
console.log('Map connection statuses updated for Identificación + Coordinación.');
