# Estado Actual del Proyecto — DIVI-PowerApps

> **Nota:** Este documento describe el código real existente en el repositorio. No es una especificación ni un boceto de lo que se planea construir, sino un reflejo de lo que ya está implementado.

---

## 1. Stack Tecnológico Real

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | ^19.2.0 | Framework de UI |
| **TypeScript** | ~5.9.3 | Tipado estático |
| **Vite** | ^7.2.4 | Bundler / dev server |
| **Tailwind CSS** | ^4.3.0 | Estilos utilitarios |
| **Lucide React** | ^1.17.0 | Iconos |
| **@microsoft/power-apps** | ^1.0.3 | SDK PowerApps (solo empaquetado) |
| **@microsoft/power-apps-vite** | ^1.0.2 | Plugin Vite para PowerApps |
| **ESLint** | ^9.39.1 | Linter |

**No se usa PowerApps canvas app.** El proyecto es una aplicación web React que _puede_ empaquetarse como componente personalizado de PowerApps mediante el plugin de Vite, pero en su estado actual funciona como web independiente.

---

## 2. Estructura de Archivos

```
├── index.html                          # Entry point SPA
├── package.json                        # Dependencias
├── vite.config.ts                      # Vite + PowerApps plugin
├── power.config.json                   # Config PowerApps (app name, env ID)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── .gitignore
│
├── src/
│   ├── main.tsx                        # ReactDOM.createRoot
│   ├── App.tsx                         # Router/View manager (useState)
│   ├── index.css                       # Tailwind + estilos globales
│   │
│   ├── data/
│   │   ├── projects.ts                 # Interfaz Project + 9 proyectos mock
│   │   └── existingProjects.ts         # Simulación SharePoint (códigos existentes)
│   │
│   ├── lib/
│   │   └── projectCode.ts              # Genera código PSC-YYYY-PQ-NNN
│   │
│   └── pages/
│       ├── WelcomeScreen.tsx           # Pantalla de bienvenida (110 líneas)
│       ├── ProjectList.tsx             # Dashboard de proyectos (180 líneas)
│       ├── NewProjectProposal.tsx      # Formulario NUEVA propuesta (1680 líneas)
│       └── FollowUpReport.tsx          # Informe de seguimiento (1472 líneas)
│
└── dist/                               # Build output
```

No hay base de datos, ni API, ni PowerAutomate. **Todos los datos son mock estáticos.**

---

## 3. Navegación entre Vistas (App.tsx)

El enrutamiento se maneja con `useState<AppView>`:

```
list → welcome → report
            ↕
         propose
```

| View | Componente | Descripción |
|------|-----------|-------------|
| `list` | ProjectList | Dashboard principal. Filtro por año. Dos secciones: "Proyectos asignados" (asignado/en-progreso) y "Cierre" (cierre/finalizado). Botones "Iniciar informe", "Modificar informe", "Ver informe", "Proponer Proyecto de Vinculación". |
| `welcome` | WelcomeScreen | Pantalla splash con logo PUCE, título "Bienvenido", instrucciones sobre firma y guardado. Botones Regresar / Siguiente. |
| `report` | FollowUpReport | Formulario de informe parcial/cierre (10 secciones). Modos `create` / `edit`. |
| `propose` | NewProjectProposal | Formulario de nueva propuesta de proyecto (10+ secciones). |

**Flujo de estados del proyecto:**
- `asignado` → sin informe → botón "Iniciar informe"
- `en-progreso` → informe creado (tipo avance) → botón "Modificar informe"
- `cierre` → informe creado (tipo cierre) → botón "Modificar informe"
- `finalizado` → solo lectura → botón "Ver informe"

---

## 4. FollowUpReport.tsx — Informe de Seguimiento (1472 líneas)

### 4.1 Cabecera
- Logo PUCE (div estilizado), título "INFORME PARCIAL DE SEGUIMIENTO", input de código
- Fondo azul PUCE `#003366`

### 4.2 Barra de Navegación
- Sticky horizontal con 10 tabs: Datos, Alcance, Contraparte, Comp., Diagnóstico, Est., Resultados, Particip., Firmas, Anexos
- Scroll automático (`scrollIntoView`) al hacer clic

### 4.3 Sección: Tipo de Informe (solo en modo edit)
- Selector visual: Avance (📈) / Cierre (✅)
- Al seleccionar "Cierre", el proyecto pasa a estado `cierre`

### 4.4 Sección 1 — Datos Generales
- Grid 2 columnas con 12 campos: Proyecto, Estado (dropdown), Unidad (dropdown con 13 facultades), Carrera, Docente responsable, Correo, Teléfono, Año ejecución, Fecha inicio/cierre/informe (date), Programa
- Validaciones básicas con `formErrors` state y `getError()` (solo muestra errores, no valida formato)

### 4.5 Sección 2 — Alcance, Grupos Prioritarios y Presupuesto
- Comunidad alcanzada (input), Tipo actores, Beneficiarios
- **Grupos de atención prioritaria**: Componente `GrupoSearchable` (búsqueda + chips, máx 3, permite agregar valor personalizado). Lista de 11 grupos predefinidos.
- **Personas atendidas**: Grid 4 columnas: Hombres, Mujeres, Total Estimado (auto: H+M), Total Real (manual)
- **Presupuesto**: Sistema de 3 estados (Estimado/Avance/Final). Botones de selección visual. Cada estado tiene su propio array de cuentas contables (dropdown desde catálogo de 16 cuentas + monto $). Solo el estado activo es editable. Totales por columna con formato `toLocaleString('es-EC')`.
- Adjuntar archivo por sección (mock: solo almacena nombre)

### 4.6 Sección 3 — Organización Contraparte
- Múltiples contrapartes dinámicas (agregar/eliminar)
- Campos: Nombre, RUC, Teléfono, Dirección, Representante legal
- **Aporte al proyecto**: 6 checkboxes (Materiales, Infraestructura, Hospedaje, RREE, Transporte, Alimentación). Mínimo 1 requerido (advertencia visual).
- Chips muestran los aportes seleccionados

### 4.7 Sección 4 — Componentes
5 radios Sí/No con condicionalidad:

| Componente | Subcampos si "Sí" |
|------------|------------------|
| Interculturalidad | — |
| Interdisciplinariedad | — |
| Intersedes | Sede (dropdown 6 sedes) + Carreras (texto) |
| Internacionalización | Convenio (3 opciones) + Institución extranjera + País (10 países) |
| Posgrados | Programa (5 programas) + N° estudiantes + Coordinador (8 opciones) |

### 4.8 Sección 5 — Diagnóstico, Problema y Actores
- Descripción del problema (textarea) y Actores involucrados (textarea)
- **7 variables cuantitativas** fijas: Población afectada, Familias beneficiarias, Índice pobreza NBI (%), Desempleo (%), Org. comunitarias, Cobertura servicios (%), Escolaridad (%). Inputs numéricos, rango 0-100 para %
- Resumen del problema (textarea)

### 4.9 Sección 6 — Estudiantes e Impacto
- **Tabla dinámica de estudiantes**: Columnas Semestre, Hombres, Mujeres, Total (auto), Acción. Filas agregables/eliminables. Footer con totales.
- **Articulación con investigación**: Radio Sí/No. Si "Sí": Línea (6), Red académica (4), Grupo investigación (4) — dropdowns obligatorios
- Impactos (textarea multilínea)

### 4.10 Sección 7 — Resultados del Proyecto (Matriz Marco Lógico)
- Tabla 4×4 con headers: Cadena de Resultados, Indicadores, Fuentes y Medios de Verificación, Avance y Actores Participantes
- Filas fijas: OBJETIVO GENERAL, OBJETIVO ESPECÍFICO, RESULTADOS, ACTIVIDADES (con sub-label "Ejecución")
- Zebra striping, textareas multilínea en cada celda

### 4.11 Sección 8 — Participantes
- Grid horizontal de 11 columnas: Tipo participante, Nacionalidad, Horas, Fecha inicio, Fecha fin, Tipo doc., N° doc., Apellidos y nombres (colspan 2), Carrera, Acciones
- Filas dinámicas (agregar/eliminar)
- Header azul oscuro, zebra striping
- Columnas adicionales respecto al spec original: se agregó **Carrera**

### 4.12 Sección 9 — Firmas
- Grid 3 columnas: ELABORADO POR (Docente Líder), REVISADO POR (Decano Unidad), APROBADO POR (Dirección Vinculación)
- Cada bloque: título, subtítulo, input nombre, input fecha (date)
- **Sin carga de imagen de firma** (solo texto)

### 4.13 Sección 10 — Anexos
- Checklist dinámico: Acta entrega-recepción (*), Reporte banner (*), Convenio internacional (* condicional si internacionalización = Sí), Convenio/Carta compromiso, Listado firmado, Firmas escaneado, Otros documentos
- Adjuntar archivos (mock)
- Warning box con detalle de obligatoriedad condicional

### 4.14 Footer
- Botones: Volver, Guardar borrador (💾), Enviar informe (📤)
- Dirección PUCE + fecha actual

---

## 5. NewProjectProposal.tsx — Nueva Propuesta de Proyecto (1680 líneas)

Formulario significativamente más extenso que el FollowUpReport. No estaba contemplado en el boceto original. Secciones:

| # | Sección | Contenido |
|---|---------|-----------|
| 1 | **Identificación del Proyecto** | 14 campos: nombre, tipo, origen, ámbito, eje, dominio, articulación, fechas, año, unidad, sede |
| 2 | **Coordinación y Académico** | 11 campos + carreras involucradas dinámicas (múltiple, primera es "Principal") |
| 3 | **Diagnóstico y Justificación** | 11 campos: texto libre, objetivo, ODS (12 opciones), CINE automático, mapeo actores |
| 4 | **Contraparte y Convenio** | Instrumento legal, adjuntar condicional (carta/convenio), texto |
| 5 | **Alcance Territorial y Beneficiarios** | Tabla F/M para 3 grupos (Alcanzados/Directos/Indirectos), comunidad por semestre, ubicación geográfica (provincia/parroquia con SearchableSelect agrupado), Google Maps embed |
| 6 | **Componentes Especiales** | 5 componentes SI/NO con detalle condicional |
| 7 | **Participantes** | Tabla Docentes/Estudiantes/Administrativos/Alumni × 2 semestres + resultados aprendizaje |
| 8 | **Marco Lógico** | Sistema de 3 sub-vistas (main → resultado → actividad) con CRUD completo. Fin, Propósito, Resultados, Actividades con tablas seleccionables. |
| 9 | **Presupuesto** | Fuente, planificado/ejecutado/externo, gasto no contemplado, parámetro cumplimiento |
| 10 | **Impactos del Proyecto** | Lista dinámica tipo+descripción, propiedad intelectual (8 checkboxes) |

**Características adicionales:**
- Código auto-generado `PSC-YYYY-PQ-NNN` (sin input manual)
- Banner de errores con `AlertTriangle` + pestañas en rojo
- Error tracking por sección (missingKeys + customErrors)
- Modal de resumen/confirmación antes de enviar
- Componente `SearchableSelect` con grupos (parroquias urbanas/rurales)
- Componente `MultiSelectField` con búsqueda y chips
- Componente `FieldRenderer` genérico (text, email, tel, number, date, select, multiselect, textarea, file, readonly)
- Integración de Google Maps embed condicional

---

## 6. ProjectList.tsx — Dashboard (180 líneas)

- Header oscuro `#0A2540` con título "Ficha de Registro de Proyectos"
- Botones: "Proponer Proyecto de Vinculación", "Manual"
- Filtro por año (dinámico desde START_YEAR=2024 hasta año actual)
- Dos secciones separadas por línea punteada:
  - **Proyectos asignados**: Punto azul, tarjetas con borde azul claro, botones "Iniciar informe" / "Modificar informe", badge PROPUESTA / EN PROGRESO
  - **Cierre**: Punto gris, tarjetas, botones "Modificar informe" / "Ver informe", badge CIERRE / FINALIZADO (con candado)

---

## 7. WelcomeScreen.tsx — Pantalla de Bienvenida (110 líneas)

- Fondo blanco con decoraciones SVG geométricas
- Logo PUCE + "Dirección de Investigación"
- Título "Bienvenido" en 5xl/6xl
- Instrucciones sobre formato de firma (JPG/PNG) y guardado
- Botones: Regresar / Siguiente

---

## 8. Paleta de Colores (implementada en código)

| Elemento | Hex | Uso |
|----------|-----|-----|
| Fondo general | `#F4F5F7` | body, main background |
| Header / Nav activo | `#003366` | Azul PUCE oscuro |
| Hover azul | `#002952` | Hover de botones |
| Botones secundarios | `#0056B3` | Azul más claro |
| Hover secundario | `#004494` | |
| Fondo secciones | `#F5F7FA` | Cards internas |
| Bordes inputs | `#D0D5DD` | |
| Texto labels | `#344054` | Gris oscuro |
| Texto inputs | `#101828` | Negro (implícito) |
| Errores | `#D92D20` | Texto y bordes rojos |
| Éxito | `#12B76A` | Botón enviar |
| Borde azul claro | `#C5D9F0` | Tarjetas de proyecto |
| Fondo tabla activa | `#DBEAFE` | Fila seleccionada |

## 9. Tipografía

- Fuente: **Segoe UI** (definida en `index.css`)
- Jerarquía aproximada:
  - Título principal header: 24px Bold
  - Título de sección: 20px / 18px Semibold
  - Labels: 13-14px Medium
  - Inputs: 14-16px Regular
  - Texto ayuda: 11-12px Regular

## 10. Validaciones Reales

| Campo | Validación Real | Estado |
|-------|----------------|--------|
| Código | Input libre sin formato | ❌ Sin validación |
| Correo | Solo `formErrors` manual | ❌ Sin regex |
| Teléfono | Solo `formErrors` manual | ❌ Sin regex |
| Fechas | Sin validación inicio ≤ cierre | ❌ No implementada |
| Presupuesto | Números positivos (`min=0`) | ✅ Parcial |
| Grupos prioritarios | Máx 3 (en lógica de componente) | ✅ |
| Aportes | Advertencia visual si 0 | ⚠️ Solo visual |
| Variables cualitativas | Sin validación de 50 caracteres | ❌ No implementada |
| Campos requeridos | `showErrors` + `missingKeys` (solo en NewProjectProposal) | ✅ Parcial |
| Participantes | Sin validación de filas completas | ❌ No implementada |
| Anexos | Sin validación de checkboxes | ❌ No implementada |

## 11. Flujo de Datos

```
Carga inicial → datos mock desde arrays estáticos
Edición → useState local en cada componente
Guardar → onSave callback → actualiza estado en App.tsx (projects array)
Enviar → simulación local (modal de confirmación en Proposal, callback simple en Report)
Persistencia → NINGUNA (no hay API, ni SharePoint, ni SQL)
```

## 12. Diferencias con el Boceto Original

| Aspecto | Boceto (especificación) | Real (código actual) |
|---------|------------------------|----------------------|
| Tecnología | PowerApps Canvas App | React + TypeScript + Vite + Tailwind |
| DataSource | SharePoint / SQL | Mock arrays estáticos |
| Persistencia | PowerAutomate + Patch | Ninguna |
| Código proyecto | `XXXX-XXX` | `PSC-YYYY-PQ-NNN` |
| Auto-guardado | Timer 5 min | No implementado |
| Validación email/tel/código | Regex completo | No implementado |
| Adjuntos | Attachment Control PowerApps | Mock (solo nombre) |
| Firma | Imagen (JPG/PNG) | Solo texto |
| Participantes | 10 columnas | 11 columnas (+ Carrera) |
| Marco Lógico (Proposal) | Tabla 4×4 estática | Sub-vistas con CRUD dinámico |
| Nueva Propuesta | No contemplado | Formulario completo (1680 líneas) |
| Dashboard | No contemplado | ProjectList con filtros |
| Pantalla bienvenida | No contemplado | WelcomeScreen |

---

## 13. Catálogos / Datos de Referencia (hardcodeados)

| Dataset | Valores | Usado en |
|---------|---------|----------|
| Provincias Ecuador | 24 | Proposal |
| Parroquias Quito | 32 urbanas + 31 rurales | Proposal |
| Unidades PUCE | 30 | FollowUpReport, Proposal |
| Sedes PUCE | 6 | Ambos |
| Carreras | 6 | Ambos |
| Grupos investigación | 36 | Proposal |
| Redes académicas | 19 | Proposal |
| Líneas investigación | 13 | Proposal |
| ODS | 12 | Proposal |
| Cuentas contables | 16 | FollowUpReport |
| Grupos prioritarios | 11 | FollowUpReport |
| Aportes | 6 | FollowUpReport |
| Convenios intl. | 3 | FollowUpReport |
| Programas posgrado | 5 | FollowUpReport |
| Coordinadores posgrado | 8 | FollowUpReport |
| Presupuesto param. cumplimiento | 10 | Proposal |

---

## 14. Componentes Compartidos / Patrones

**En FollowUpReport:**
- `RadioSiNo` — Radio button Sí/No reutilizable
- `SelectField` — Dropdown con label + required
- `ComboboxField` — Input + datalist
- `InputField` — Input con label
- `TextAreaField` — Textarea con label
- `FileUploadBtn` — Botón de adjuntar mock (por sección)
- `GrupoSearchable` — Búsqueda multi-select con chips (máx 3)

**En NewProjectProposal:**
- `FieldRenderer` — Renderizador genérico por tipo de campo
- `MultiSelectField` — Búsqueda multi-select con chips
- `FileField` — Adjuntar archivo mock
- `SearchableSelect` — Combobox con agrupación y búsqueda

---

*Versión 3.0 — Refleja el estado real del código al 8 de julio de 2026.*
