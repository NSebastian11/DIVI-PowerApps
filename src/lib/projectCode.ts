const CODE_PREFIX = 'PSC';
const CODE_SEGMENT = 'PQ';

function buildPrefix(year: number) {
  return `${CODE_PREFIX}-${year}-${CODE_SEGMENT}-`;
}

/**
 * Genera el siguiente código de proyecto con formato PSC-YYYY-PQ-NNN.
 * El contador NNN se reinicia en 001 cada vez que cambia el año.
 */
export function generateNextProjectCode(existingCodes: string[], year: number = new Date().getFullYear()): string {
  const prefix = buildPrefix(year);

  const numbers = existingCodes
    .filter((code) => code.startsWith(prefix))
    .map((code) => parseInt(code.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `${prefix}${String(next).padStart(3, '0')}`;
}
