# Boceto UI — PowerApps: Informe Parcial de Seguimiento de Proyectos de Servicio Comunitario

> **Objetivo:** Migrar el informe Word a una PowerApp de **canvas único escroleable** con organización visual limpia, jerárquica y moderna, validaciones en tiempo real y navegación por secciones.

---

## 1. Estructura General del Canvas

El formulario es un solo **Scrollable Screen (Vertical)** con barra de navegación lateral/superior para salto rápido entre secciones:

| # | Sección | Contenido |
|---|---------|-----------|
| — | **Header** (fijo) | Logo PUCE + Título + Código |
| 1 | **Datos Generales** | 12 campos del proyecto en grid 2 columnas |
| 2 | **Alcance, Grupos Prioritarios y Presupuesto** | Comunidad, beneficiarios, grupos (mín 1, máx 3), personas atendidas, presupuesto 3 estados |
| 3 | **Organización Contraparte** | Datos institución + RUC + checkboxes de aporte (mín 1) |
| 4 | **Componentes** | 5 radios condicionales con subcampos visibles solo si "Sí" |
| 5 | **Diagnóstico, Problema y Actores** | 7 variables cuantitativas, 2 cualitativas (mín 50 caracteres) |
| 6 | **Estudiantes e Impacto** | Tabla semestre/género/total, articulación condicional con investigación, impactos multilínea |
| 7 | **Matriz de Marco Lógico** | Tabla 4×4 (Cadena/Indicadores/Fuentes/Avance) con zebra striping |
| 8 | **Participantes** | Tabla horizontal escroleable de 10 columnas, filas dinámicas |
| 9 | **Firmas** | Elaborado / Revisado / Aprobado con fecha |
| 10 | **Anexos** | Checklist con adjuntos obligatorios (*) y opcionales |
| — | **Footer** | Dirección PUCE + fecha |

---

## 2. Maquetación por Secciones

### HEADER (Fijo, ~120px, no escrolea)

```
┌─────────────────────────────────────────────────────┐
│ [Logo PUCE]  INFORME PARCIAL DE SEGUIMIENTO         │
│              Proyectos de Servicio Comunitario       │
│              Código: [________]                      │
├─────────────────────────────────────────────────────┤
```

- Logo izquierda, título centrado **24px Bold**, código derecha (label + input)
- Header fijo fuera del scroll del canvas

---

### SECCIÓN 1 — Datos Generales

Distribución en **2 columnas** (label arriba, input abajo):

```
┌─────────────────────────────────────────────────────┐
│  📋 DATOS GENERALES                                 │
├─────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Proyecto:    │  │ Estado:      │                  │
│ │ [____________]│  │ [▼ Seleccionar]                │
│ └──────────────┘  └──────────────┘                  │
│ ┌──────────────────────────┐  ┌──────────────┐      │
│ │ Unidad:                  │  │ Carrera:     │      │
│ │ [▼ Seleccionar unidad...]│  │ [____________]      │
│ └──────────────────────────┘  └──────────────┘      │
│ ┌─────────────────────────────────┐                 │
│ │ Docente responsable:            │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Correo:      │  │ Teléfono:    │                  │
│ │ [____________]│  │ [____________]                  │
│ └──────────────┘  └──────────────┘                  │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Año ejec.:   │  │ Fecha inicio:│                  │
│ │ [____]       │  │ [📅 DatePicker]                │
│ └──────────────┘  └──────────────┘                  │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Fecha cierre:│  │ Fecha informe│                  │
│ │ [📅 DatePicker]│ [📅 DatePicker]                │
│ └──────────────┘  └──────────────┘                  │
│ ┌─────────────────────────────────┐                 │
│ │ Programa:                       │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**UI:** Radio buttons para Sí/No, DatePicker, dropdowns, inputs con borde inferior (estilo moderno).

**Validaciones:** Código `XXXX-XXX`, correo formato email, teléfono solo dígitos ≥7, fechas inicio ≤ cierre.

---

### SECCIÓN 2 — Alcance, Grupos Prioritarios y Presupuesto

```
┌─────────────────────────────────────────────────────┐
│  🎯 ALCANCE, GRUPOS PRIORITARIOS Y PRESUPUESTO      │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                 │
│ │ Comunidad alcanzada:            │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Tipo actores:│  │ Beneficiarios:│                  │
│ │ [____________]│  │ [____________]                  │
│ └──────────────┘  └──────────────┘                  │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ 🏷️ GRUPOS DE ATENCIÓN PRIORITARIA               │
│ │ [▼ Buscar y seleccionar...]  (mín 1, máx 3)      │
│ │ ┌─────────────────────────────────┐              │
│ │ │ ■ Grupo seleccionado 1      [×] │              │
│ │ │ ■ Grupo seleccionado 2      [×] │              │
│ │ │ ■ Grupo seleccionado 3      [×] │              │
│ │ └─────────────────────────────────┘              │
│ └─────────────────────────────────┘                 │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ 👥 NÚMERO DE PERSONAS ATENDIDAS                   │
│ ├──────────┬──────────┬──────────┬──────────┤       │
│ │ Hombres  │ Mujeres  │ Total    │ Total    │       │
│ │ (Estim.) │ (Estim.) │ Estimado │ Real     │       │
│ │          │          │ (Auto)   │ (Manual) │       │
│ ├──────────┼──────────┼──────────┼──────────┤       │
│ │ [____]   │ [____]   │ [____]   │ [____]   │       │
│ │          │          │ Suma H+M │ Campo    │       │
│ │          │          │ automática│ libre    │       │
│ └──────────┴──────────┴──────────┴──────────┘       │
└─────────────────────────────────────────────────────┘
```

**💰 PRESUPUESTO** (3 columnas: Estimado, Avance, Final):

```
│ 💰 PRESUPUESTO — * = Campos obligatorios             │
│ Estado: ● Estimado (activo)  ○ Avance  ○ Final       │
│ (Avance y Final se habilitan al seleccionarlos)       │
│ ┌───────────────────┬───────────────────┬────────────┐│
│ │ 📋 ESTIMADO       │ 📋 AVANCE         │ 📋 FINAL   ││
│ │ (Siempre activo)  │ (Activo al elegir │ (Activo al ││
│ │                   │  "Avance")        │ elegir "Fi-││
│ │                   │                   │ nal")      ││
│ ├───────────────────┼───────────────────┼────────────┤│
│ │ [▼ Cuenta contab.]│ [▼ Cuenta contab.]│ [▼ Cta]    ││
│ │ $ [____________]  │ $ [____________]  │ $ [____]   ││
│ ├───────────────────┼───────────────────┼────────────┤│
│ │ [▼ Cuenta contab.]│ [▼ Cuenta contab.]│ [▼ Cta]    ││
│ │ $ [____________]  │ $ [____________]  │ $ [____]   ││
│ ├───────────────────┼───────────────────┼────────────┤│
│ │ [+ Agregar cuenta]│                   │            ││
│ ├───────────────────┼───────────────────┼────────────┤│
│ │ TOTAL: $ [______] │ TOTAL: $ [______] │ $ [____]   ││
│ └───────────────────┴───────────────────┴────────────┘│
```

**UI:** Selector de estado con radio buttons. Cuentas contables desde dropdown del catálogo institucional. Campos con prefijo `$` y formato número (miles, 2 decimales). Tarjeta con fondo sombreado.

**Reglas:**
- Grupos prioritarios: mínimo 1, máximo 3 selecciones (tags removibles)
- Total estimado = suma automática H+M. Total real = campo libre manual
- Presupuesto Estimado siempre activo. Avance/Final se habilitan solo al seleccionar ese estado
- Cuentas contables requeridas desde catálogo

---

### SECCIÓN 3 — Organización Contraparte

```
┌─────────────────────────────────────────────────────┐
│  🏢 ORGANIZACIÓN CONTRAPARTE                        │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                 │
│ │ Nombre de la institución:       │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ RUC:         │  │ Teléfono:    │                  │
│ │ [____________]│  │ [____________]                  │
│ └──────────────┘  └──────────────┘                  │
│ ┌─────────────────────────────────┐                 │
│ │ Dirección:                      │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│ ┌─────────────────────────────────┐                 │
│ │ Representante legal:            │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ 📦 APORTE AL PROYECTO (mín 1 obligatorio)        │
│ │ ☐ Materiales    ☐ RREE                            │
│ │ ☐ Infraestructura  ☐ Transporte                   │
│ │ ☐ Hospedaje     ☐ Alimentación                   │
│ │                                                     │
│ │ Seleccionados: [chips de ítems marcados]           │
│ └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**Reglas:** Mínimo 1 checkbox obligatorio, sin máximo. Validación: `Count(colAportesSeleccionados) >= 1`. Cada checkbox guarda su valor booleano individual.

---

### SECCIÓN 4 — Componentes

```
┌─────────────────────────────────────────────────────┐
│  🔗 COMPONENTES                                     │
├─────────────────────────────────────────────────────┤
│ Interculturalidad            ○ Sí  ○ No             │
│ Interdisciplinariedad        ○ Sí  ○ No             │
│                                                     │
│ ¿Componente Intersedes?      ○ Sí  ○ No             │
│ ── Visible solo si "SÍ" ──                          │
│   Sede PUCE:       [▼ Seleccionar sede...]          │
│   Carreras interse: [________________]              │
│                                                     │
│ ¿Internacionalización?       ○ Sí  ○ No             │
│ ── Visible solo si "SÍ" ──                          │
│   Convenio intl.:   [▼ Seleccionar convenio...]     │
│   Inst. extranjera: [________________]              │
│   País:             [▼ Seleccionar país...]         │
│                                                     │
│ ¿Componente de Posgrados?    ○ Sí  ○ No             │
│ ── Visible solo si "SÍ" ──                          │
│   Programa posgrado: [▼ Seleccionar programa...]    │
│   N° estudiantes:   [____]                          │
│   Coordinador:      [________________]              │
└─────────────────────────────────────────────────────┘
```

| Componente | Sin subcampos | Subcampos si "Sí" |
|------------|:---:|---|
| Interculturalidad | ✓ | — |
| Interdisciplinariedad | ✓ | — |
| Intersedes | — | Sede (dropdown) + Carreras (texto) |
| Internacionalización | — | Convenio (dropdown) + Institución (texto) + País (dropdown) |
| Posgrados | — | Programa (dropdown) + N° estudiantes (numérico) + Coordinador (texto) |

**Regla:** `Visible` de cada grupo = `rdbComponente.Selected.Value = "Sí"`. Subcampos visibles son obligatorios.

---

### SECCIÓN 5 — Diagnóstico, Problema y Actores Involucrados

```
┌─────────────────────────────────────────────────────┐
│  🔍 DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS    │
├─────────────────────────────────────────────────────┤
│ Descripción del problema:                           │
│ [__________________________________________________]│
│ [__________________________________________________]│
│                                                     │
│ Actores involucrados:                               │
│ [__________________________________________________]│
│                                                     │
│ 📊 VARIABLES CUANTITATIVAS (7) — obligatorias       │
│ 1. Población total afectada:   [________] personas  │
│ 2. N° familias beneficiarias:  [________] familias  │
│ 3. Índice de pobreza (NBI):    [________] %         │
│ 4. Tasa de desempleo local:    [________] %         │
│ 5. N° org. comunitarias:       [________]           │
│ 6. Cobertura servicios básicos:[________] %         │
│ 7. Tasa de escolaridad:        [________] %         │
│                                                     │
│ 📝 RESUMEN DEL PROBLEMA                             │
│ [__________________________________________________]│
└─────────────────────────────────────────────────────┘
```

**Validaciones:** 7 variables cuantitativas obligatorias (rango 0-100 para %). 2 variables cualitativas obligatorias, mínimo 50 caracteres cada una.

---

### SECCIÓN 6 — Estudiantes e Impacto

```
┌─────────────────────────────────────────────────────┐
│  👥 ESTUDIANTES E IMPACTO                           │
├─────────────────────────────────────────────────────┤
│ ESTUDIANTES VINCULADOS (por semestre/género/total)  │
│ ┌──────────┬──────────┬──────────┬──────────┐       │
│ │ Semestre │ Hombres  │ Mujeres  │  Total   │       │
│ ├──────────┼──────────┼──────────┼──────────┤       │
│ │ [____]   │ [____]   │ [____]   │ [____]   │       │
│ │ [____]   │ [____]   │ [____]   │ [____]   │       │
│ │ ... (+ Agregar fila)│           │           │       │
│ └──────────┴──────────┴──────────┴──────────┘       │
│                                                     │
│ Articulación funciones sustantivas:                 │
│ ¿Se articula con Investigación?  ○ Sí  ○ No        │
│ ── Visible solo si "SÍ" ──                          │
│   Línea de investigación:  [▼ Seleccionar línea...] │
│   Red académica articulada: [▼ Seleccionar red...]  │
│   Grupo de investigación:   [▼ Seleccionar grupo...]│
│                                                     │
│ Impactos:                                           │
│ [__________________________________________________]│
│ [__________________________________________________]│
└─────────────────────────────────────────────────────┘
```

**Reglas:** Al menos 1 fila completa de estudiantes. Si articulación con investigación = "Sí", los 3 dropdowns son obligatorios. Impactos como multilínea.

---

### SECCIÓN 7 — Matriz de Marco Lógico

```
┌─────────────────────────────────────────────────────┐
│  📊 RESULTADOS DEL PROYECTO                         │
├──────────────┬──────────┬──────────┬────────────────┤
│ Cadena de    │Indicadores│Fuentes y │ Avance de la   │
│ Resultados   │          │Medios de │ Actividad y    │
│ (40% ancho)  │          │Verificac.│ Actores Part.  │
├──────────────┼──────────┼──────────┼────────────────┤
│ OBJETIVO     │          │          │                │
│ GENERAL      │          │          │                │
│ [________]   │[________]│[________]│[___________]   │
├──────────────┼──────────┼──────────┼────────────────┤
│ OBJETIVO     │          │          │                │
│ ESPECÍFICO   │          │          │                │
│ [________]   │[________]│[________]│[___________]   │
├──────────────┼──────────┼──────────┼────────────────┤
│ RESULTADOS   │          │          │                │
│ [________]   │[________]│[________]│                │
├──────────────┼──────────┼──────────┼────────────────┤
│ ACTIVIDADES  │          │          │ Ejecución      │
│ [________]   │[________]│[________]│ [________]     │
└──────────────┴──────────┴──────────┴────────────────┘
```

**UI:** Encabezados de fila con background de color + bold. Celdas multilínea. Bordes sutiles, zebra striping.

---

### SECCIÓN 8 — Participantes (Tabla Horizontal Escroleable)

```
┌─────────────────────────────────────────────────────────────┐
│  👤 LISTA DE PARTICIPANTES   [Docentes, Administrativos,    │
│                               Alumni, Externos]             │
├─────────────────────────────────────────────────────────────┤
│ ← Deslizar horizontalmente →                                │
│ ┌──────┬──────┬───────┬───────┬───────┬──────┬──────┬──────┐│
│ │Tipo  │Nac.  │Horas  │F.Inicio│F.Fin │Tipo  │N° doc│Apell.││
│ │Partic│      │(prog.)│       │      │docum.│      │y Nomb││
│ ├──────┼──────┼───────┼───────┼───────┼──────┼──────┼──────┤│
│ │[____]│[____]│[_____]│[📅]   │[📅]  │[____]│[____]│[____]││
│ │[____]│[____]│[_____]│[📅]   │[📅]  │[____]│[____]│[____]││
│ │ ...  (filas dinámicas con +AGREGAR y 🗑 Eliminar por fila)││
│ └──────┴──────┴───────┴───────┴───────┴──────┴──────┴──────┘│
├─────────────────────────────────────────────────────────────┤
│ Columnas (10): Tipo participante | Nacionalidad | Horas      │
│ (programadas) | Fecha inicio | Fecha fin | Tipo documento |  │
│ N° documento | Apellidos y nombres | Carrera | Firma        │
└─────────────────────────────────────────────────────────────┘
```

**UI:** Horizontal Gallery con scroll lateral + indicador visual de flechas. Filas dinámicas con botón "+ Agregar" y "🗑 Eliminar". DatePicker en fechas. Validación de campos obligatorios antes de guardar fila. Al menos 1 fila completa requerida.

---

### SECCIÓN 9 — Firmas

```
┌─────────────────────────────────────────────────────┐
│  ✍️ FIRMAS                                          │
├──────────────────┬──────────────────┬───────────────┤
│ ELABORADO POR    │ REVISADO POR     │ APROBADO POR  │
│ Docente Líder    │ Decano Unidad    │ Dirección de  │
│ del Proyecto     │                  │ Vinculación   │
│ [______________] │ [______________] │ [____________]│
│ Fecha: [📅]     │ Fecha: [📅]     │ Fecha: [📅]  │
└──────────────────┴──────────────────┴───────────────┘
```

---

### SECCIÓN 10 — Anexos (Checklist)

```
┌─────────────────────────────────────────────────────┐
│  📎 ANEXOS  *Campos obligatorios                    │
├─────────────────────────────────────────────────────┤
│ * ☐ Acta de entrega-recepción de productos          │
│ * ☐ Reporte banner de estudiantes                   │
│ * ☐ Convenio internacional                          │
│     (requerido si aplica componente de               │
│      internacionalización)                          │
│   ☐ Convenio / Carta de compromiso                  │
│   ☐ Otros documentos                                │
│                                                     │
│ [📎 Adjuntar archivos...]  *Adjunto obligatorio      │
│                                                     │
│ ⚠ Los documentos con * son obligatorios             │
└─────────────────────────────────────────────────────┘
```

**UI:** Checkboxes + Attachment Control de PowerApps. Indicador de archivo adjunto con nombre y tamaño. Validación condicional: si componente internacionalización activo → convenio internacional obligatorio.

---

## 3. Paleta de Colores

| Elemento | Color | Hex |
|----------|-------|-----|
| Fondo general | Blanco | `#FFFFFF` |
| Barra navegación / Header | Azul PUCE | `#003366` |
| Títulos de sección | Azul PUCE | `#003366` |
| Background de sección | Gris muy claro | `#F5F7FA` |
| Bordes de inputs | Gris medio | `#D0D5DD` |
| Input focus | Azul PUCE | `#003366` |
| Texto labels | Gris oscuro | `#344054` |
| Texto inputs | Negro | `#101828` |
| Errores / validación | Rojo | `#D92D20` |
| Éxito / completado | Verde | `#12B76A` |
| Checkbox activo | Azul PUCE | `#003366` |

## 4. Tipografía

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Título principal | 24px | Bold |
| Título de sección | 18px | SemiBold |
| Labels de campo | 13px | Medium |
| Valor / Input | 14px | Regular |
| Texto de ayuda | 11px | Regular |

Fuente: **Segoe UI** (estándar PowerApps) o **Inter** (importada).

## 5. Validaciones Generales

| Campo | Validación |
|-------|-----------|
| Código | Requerido, formato `XXXX-XXX` |
| Unidad | Requerido, selección desde desplegable |
| Correo | Formato email válido |
| Teléfono | Solo dígitos, mínimo 7 |
| Fechas | Fecha inicio ≤ Fecha cierre |
| Presupuesto Estimado | Requerido, solo números positivos |
| Presupuesto Avance/Final | Requerido solo si ese estado está seleccionado |
| Cuenta contable | Requerido, selección desde catálogo |
| Grupos prioritarios | Mínimo 1, máximo 3 |
| Aporte al proyecto | Mínimo 1 checkbox |
| Variables cuantitativas | 7 campos obligatorios, rango 0-100 para % |
| Variables cualitativas | Mínimo 50 caracteres cada una |
| Estudiantes vinculados | Al menos 1 fila completa |
| Articulación con investigación | 3 dropdowns obligatorios si "Sí" |
| Participantes | Al menos 1 fila completa, Horas requerido |
| Anexos (*) | Los marcados con * son obligatorios |

**Botones (bottom fijo):**
- 💾 **Guardar Borrador** — guarda estado actual sin validación completa
- 📤 **Enviar Informe** — validación estricta total → PowerAutomate → bloquea edición

## 6. Flujo de Datos

```
Carga:
  → Buscar proyecto por Código → si existe, cargar metadatos
  → Si es nuevo: inicializar campos vacíos

Edición:
  → Load from DataSource → Patch a colección local → Display
  → OnChange de cada campo → actualizar colección local

Guardar Borrador:
  → Patch(DataSource, Defaults, {colección local})
  → Notificación de éxito/error

Enviar:
  → Validación estricta de todos los campos
  → Envío a flujo PowerAutomate
  → Cambiar Estado a "Enviado"
  → Bloquear toda edición posterior
```

## 7. Consideraciones Técnicas PowerApps

1. **DataSource:** SharePoint List o SQL Database
2. **Gallery anidada:** Vertical Gallery con controles por fila para tabla de participantes
3. **Colecciones locales:** `Collect()` para filas dinámicas antes de enviar
4. **Variables globales:** Estado del formulario, sección activa, validaciones
5. **Responsive:** `App.Width` y `App.Height` para adaptación tablet/desktop
6. **Timer:** Auto-guardado cada 5 minutos como borrador
7. **Navegación:** Sidebar o Tab List horizontal con scroll automático a cada sección

## 8. Mapa de Componentes

```
Screen: Frm_InformeComunitario (Scrollable)
├── Header (Container, fijo)
│   ├── imgLogo
│   ├── lblTitulo
│   └── txtCodigo
├── NavBar (Horizontal Gallery / Tab List)
├── Section_DatosGenerales (Container, 2-column grid)
├── Section_AlcancePresupuesto (Container)
│   ├── GruposPrioritarios (multiselect tags)
│   ├── PersonasAtendidas (tabla 4 columnas)
│   └── Card_Presupuesto (3 columnas condicionales)
├── Section_Contraparte (Container)
│   └── Card_Aportes (6 checkboxes)
├── Section_Componentes (Container, 5 radios condicionales)
├── Section_Diagnostico (Container)
│   └── VariablesCuantitativas (7 inputs)
├── Section_Estudiantes (Container)
│   ├── TablaEstudiantes (Vertical Gallery, 4 cols)
│   └── Card_Articulacion (3 dropdowns condicionales)
├── Section_MatrizMarcoLogico (Container, tabla 4×4)
├── Section_Participantes (Container)
│   ├── HorizontalGallery (10 columnas)
│   └── btn_AgregarFila + btn_EliminarFila
├── Section_Firmas (Container, 3-column grid)
├── Section_Anexos (Container)
│   └── Checklist + AttachmentControl
└── Footer (Container, fijo abajo)
    ├── btn_GuardarBorrador
    ├── btn_Enviar
    └── lbl_FooterPUCE
```

## 9. Diferencias vs. Versión Word Actual

| Aspecto | Word Actual | Propuesta PowerApps |
|---------|-------------|---------------------|
| Diseño | Tablas rígidas | Cards flexibles con espaciado |
| Navegación | Scroll infinito sin guía | Barra de navegación por secciones |
| Fechas | Texto libre | DatePicker con calendario |
| Estados | Texto libre | Dropdown con opciones predefinidas |
| Presupuesto | Texto plano | Formato moneda con validación |
| Participantes | Tabla precargada | Filas dinámicas agregables |
| Anexos | Solo mención | Adjuntos reales + checklist |
| Validación | Ninguna | Validación en tiempo real |
| Paleta | Escala de grises | Azul PUCE corporativo |
| Tipografía | Sin definir | Jerarquía clara (24/18/14/13px) |
| Responsive | No aplica | Adaptable a tablet/desktop |
| Autoguardado | No | Timer cada 5 minutos |
| Condicionalidad | No | Campos que aparecen/desaparecen |

---

*Versión 2.0 — Revisada y reestructurada. Se eliminaron secciones duplicadas (Estudiantes e Impacto, Matriz de Marco Lógico, Participantes) y se unificó la numeración a 10 secciones secuenciales.*
