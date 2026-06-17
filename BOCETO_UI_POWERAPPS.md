# Boceto UI — PowerApps: Informe Parcial de Seguimiento de Proyectos de Servicio Comunitario

> **Objetivo:** Mejorar la legibilidad, usabilidad y estructura del formulario existente, manteniendo el concepto de **canvas escroleable único** pero con una organización visual más limpia, jerárquica y moderna.

---

## 1. Estructura General del Canvas

El formulario completo es un solo **Scrollable Screen (Vertical)** con las siguientes secciones claramente divididas:

| Sección | Contenido |
|---------|-----------|
| **Header** | Logo PUCE + Título del informe + Código |
| **1. Datos Generales** | 14 campos informativos del proyecto + articulación investigación con dropdowns condicionales |
| **2. Alcance, Grupos Prioritarios y Presupuesto** | Comunidad, beneficiarios, grupos de atención prioritaria, personas atendidas (H/M), presupuesto |
| **3. Organización Contraparte** | Información general de la institución contraparte + Aporte al Proyecto (checkmarks) |
| **4. Componentes** | Intersedes, interculturalidad, interdisciplinariedad, internacionalización, posgrados — con subcampos condicionales SI/NO |
| **5. Diagnóstico, Problema y Actores** | 7 variables cuantitativas + 2 variables cualitativas para diagnóstico de proyectos sociales |
| **6. Estudiantes e Impacto** | N° estudiantes, articulación funciones sustantivas con dropdowns condicionales, impactos |
| **7. Matriz de Resultados** | Tabla de 4 columnas (Cadena/Indicadores/Fuentes/Avance) |
| **8. Participantes** | Tabla horizontal escroleable de 10 columnas |
| **9. Firmas** | Elaborado / Revisado / Aprobado |
| **10. Anexos** | Checklist de documentos adjuntos |
| **Footer** | Dirección PUCE + fecha |

---

## 2. Maquetación por Secciones

### HEADER (Fijo arriba, no escrolea)

```
┌─────────────────────────────────────────────────────┐
│ [Logo PUCE]  INFORMACIÓN PARCIAL DE SEGUIMIENTO     │
│              Proyectos de Servicio Comunitario       │
│              Código: [________]                      │
├─────────────────────────────────────────────────────┤
```

- **Contenedor superior fijo** (altura ~120px)
- Logo a la izquierda (imagen)
- Título centrado en **24px Bold**
- Código a la derecha como label + input

---

### SECCIÓN 1 — Datos Generales

Distribución en **2 columnas** (label arriba, input abajo) para desktop, pero en PowerApps usar un **Vertical Gallery** con cada campo como un **Card** individual:

```
┌─────────────────────────────────────────────────────┐
│  📋 DATOS GENERALES                                 │
├─────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Proyecto:    │  │ Estado:      │                  │
│ │ [____________]│  │ [▼ Seleccionar]                │
│ └──────────────┘  └──────────────┘                  │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Unidad Resp.:│  │ Carrera:     │                  │
│ │ [____________]│  │ [____________]                  │
│ └──────────────┘  └──────────────┘                  │
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
│ │ [____]       │  │ [📅 Seleccionar]                │
│ └──────────────┘  └──────────────┘                  │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Fecha cierre:│  │ Fecha informe│                  │
│ │ [📅 Seleccionar]│ [📅 Seleccionar]                │
│ └──────────────┘  └──────────────┘                  │
│ ┌─────────────────────────────────┐                 │
│ │ Programa:                       │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│ ┌─────────────────────────────────┐                 │
│ │ ¿Articulación con investigación PUCE?             │
│ │ ○ Sí   ○ No                                      │
│ ├─────────────────────────────────┤                 │
│ │ ⚠ SOLO VISIBLE SI ELIGE "SÍ":                    │
│ │ ┌─────────────────────────────────┐              │
│ │ │ Línea de investigación:         │              │
│ │ │ [▼ Seleccionar línea...]        │              │
│ │ ├─────────────────────────────────┤              │
│ │ │ Red académica articulada:       │              │
│ │ │ [▼ Seleccionar red...]          │              │
│ │ ├─────────────────────────────────┤              │
│ │ │ Grupo de investigación:         │              │
│ │ │ [▼ Seleccionar grupo...]        │              │
│ │ └─────────────────────────────────┘              │
│ └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**Mejoras UI:**
- Usar **radio buttons** para Sí/No en vez de texto plano
- Fechas con **DatePicker** de PowerApps
- Dropdown para Estado en vez de input libre
- Inputs con **borde inferior** (línea) en vez de cuadro completo (estilo moderno)

**Lógica condicional — Articulación con investigación PUCE:**
- Si el usuario selecciona **No** → se ocultan los 3 dropdowns
- Si el usuario selecciona **Sí** → se muestran los siguientes dropdowns (obligatorios):
  - **Línea de investigación** — Dropdown con datos de líneas PUCE registradas
  - **Red académica articulada** — Dropdown con redes académicas disponibles
  - **Grupo de investigación** — Dropdown con grupos de investigación registrados
- Propiedad `Visible` de cada dropdown = `rdbInvestigacion.Selected.Value = "Sí"`

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
│ │          │          │ Suma auto│ Campo    │       │
│ │          │          │ H+M      │ libre    │       │
│ └──────────┴──────────┴──────────┴──────────┘       │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ Institución contraparte:        │                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
```

**Presupuesto (5 campos con formato moneda):**

```
│ 💰 PRESUPUESTO                                      │
│ ┌──────────────┬──────────────┬──────────────┬──────┐│
│ │ Planificado  │ Interno Ejec.│ Externo Asig. │      ││
│ │ $ [_______]  │ $ [_______]  │ $ [_______]   │      ││
│ ├──────────────┼──────────────┼──────────────┤      ││
│ │ Externo Ejec.│ Gasto no     │              │      ││
│ │ $ [_______]  │ contemplado  │              │      ││
│ │              │ $ [_______]  │              │      ││
│ └──────────────┴──────────────┴──────────────┴──────┘│
```

**Mejoras UI:**
- Campos monetarios con **formato de número** (separador de miles, 2 decimales)
- Inputs con prefijo `$` automático
- Tarjeta de presupuesto con fondo sombreado para distinguirla

**Lógica — Grupos de atención prioritaria:**
- Componente: **Combobox** con búsqueda por texto (searchable)
- Opciones: lista predefinida de grupos de atención prioritaria (p.ej. Adultos mayores, Personas con discapacidad, Niñez y adolescencia, Mujeres gestantes, Pueblos indígenas, Personas en movilidad humana, etc.)
- Reglas:
  - **Mínimo 1 grupo** seleccionado obligatorio
  - **Máximo 3 grupos** seleccionables
  - Los chips/pills seleccionados se muestran debajo del combobox con botón [×] para remover
- Validación: `Count(SelectedGroups) >= 1 && Count(SelectedGroups) <= 3`

**Lógica — Número de personas atendidas:**
- `txtHombres` + `txtMujeres` → campos numéricos de entrada manual (estimados)
- `txtTotalEstimado` = `txtHombres.Text + txtMujeres.Text` (suma automática, solo lectura)
- `txtTotalReal` = campo numérico libre para registrar el total real al cierre del proyecto (editable)
- La tabla de 4 columnas usa etiquetas y text inputs alineados

---

### SECCIÓN 3 — Información General de la Organización / Institución Contraparte

```
┌─────────────────────────────────────────────────────┐
│  🏢 INFORMACIÓN GENERAL DE LA ORGANIZACIÓN           │
│     O INSTITUCIÓN CONTRAPARTE DE LA PUCE            │
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
│ │ 📦 APORTE AL PROYECTO (mínimo 1 obligatorio)     │
│ │                                                     │
│ │ ☐ Materiales          ☐ RREE (Relaciones Externas) │
│ │ ☐ Infraestructura     ☐ Transporte                │
│ │ ☐ Hospedaje           ☐ Alimentación              │
│ │                                                     │
│ │ Seleccionados: [___________________________]       │
│ │ (etiquetas/chips de los ítems marcados)            │
│ └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**Mejoras UI:**
- Datos de la contraparte en formato card de 2 columnas
- Sección de **Aporte al Proyecto** con fondo ligeramente sombreado para destacar

**Lógica — Aporte al Proyecto:**
- Componente: **Checkboxes** (6 opciones) dispuestos en 2 columnas
- Valores:
  1. Materiales
  2. Infraestructura
  3. Hospedaje
  4. RREE (Relaciones Externas)
  5. Transporte
  6. Alimentación
- Reglas:
  - **Mínimo 1 checkmark obligatorio** — si no hay ninguno, mostrar error de validación
  - **Sin máximo** — se pueden seleccionar todos
  - Cada checkbox guarda su valor booleano individual en la fuente de datos
- Validación: `Count(colAportesSeleccionados) >= 1`

---

### SECCIÓN 4 — Componentes

```
┌─────────────────────────────────────────────────────┐
│  🔗 COMPONENTES                                     │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                 │
│ │ Componente de interculturalidad  ○ Sí  ○ No      │
│ ├─────────────────────────────────┤                 │
│ │ Componente de interdisciplinariedad ○ Sí  ○ No   │
│ └─────────────────────────────────┘                 │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ ¿Componente Intersedes?         ○ Sí  ○ No       │
│ ├─────────────────────────────────┤                 │
│ │ ⚠ VISIBLE SOLO SI ELIGE "SÍ":                   │
│ │ ┌─────────────────────────────────┐              │
│ │ │ Sede PUCE participante:         │              │
│ │ │ [▼ Seleccionar sede...]         │              │
│ │ ├─────────────────────────────────┤              │
│ │ │ Carreras intersedes vinculadas: │              │
│ │ │ [______________________________]│              │
│ │ └─────────────────────────────────┘              │
│ └─────────────────────────────────┘                 │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ ¿Componente de Internacionalización? ○ Sí  ○ No  │
│ ├─────────────────────────────────┤                 │
│ │ ⚠ VISIBLE SOLO SI ELIGE "SÍ":                   │
│ │ ┌─────────────────────────────────┐              │
│ │ │ Convenio internacional:         │              │
│ │ │ [▼ Seleccionar convenio...]     │              │
│ │ ├─────────────────────────────────┤              │
│ │ │ Institución extranjera:         │              │
│ │ │ [______________________________]│              │
│ │ ├─────────────────────────────────┤              │
│ │ │ País:                           │              │
│ │ │ [▼ Seleccionar país...]         │              │
│ │ └─────────────────────────────────┘              │
│ └─────────────────────────────────┘                 │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ ¿Componente de Posgrados?       ○ Sí  ○ No       │
│ ├─────────────────────────────────┤                 │
│ │ ⚠ VISIBLE SOLO SI ELIGE "SÍ":                   │
│ │ ┌─────────────────────────────────┐              │
│ │ │ Programa de posgrado vinculado: │              │
│ │ │ [▼ Seleccionar programa...]     │              │
│ │ ├─────────────────────────────────┤              │
│ │ │ N° estudiantes de posgrado:     │              │
│ │ │ [____]                          │              │
│ │ ├─────────────────────────────────┤              │
│ │ │ Coordinador del posgrado:       │              │
│ │ │ [______________________________]│              │
│ │ └─────────────────────────────────┘              │
│ └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**Lógica condicional de Componentes:**

| Componente | Comportamiento |
|------------|---------------|
| **Interculturalidad** | Radio buttons Sí/No. Si "Sí" → se registra el check (sin subcampos adicionales) |
| **Interdisciplinariedad** | Radio buttons Sí/No. Si "Sí" → se registra el check (sin subcampos adicionales) |
| **Intersedes** | Radio buttons Sí/No. Si **"No"** → no pasa nada (campos ocultos). Si **"Sí"** → se muestran: Sede PUCE participante (dropdown), Carreras intersedes vinculadas (texto) |
| **Internacionalización** | Radio buttons Sí/No. Si **"No"** → no pasa nada. Si **"Sí"** → se muestran: Convenio internacional (dropdown), Institución extranjera (texto), País (dropdown) |
| **Posgrados** | Radio buttons Sí/No. Si **"No"** → no pasa nada. Si **"Sí"** → se muestran: Programa de posgrado vinculado (dropdown), N° estudiantes de posgrado (numérico), Coordinador del posgrado (texto) |

- Propiedad `Visible` de cada grupo de subcampos = `rdbIntersedes.Selected.Value = "Sí"` (y análogo para los otros)
- Los subcampos visibles por condicionalidad son **obligatorios** cuando se muestran

---

### SECCIÓN 5 — Diagnóstico, Problema y Actores Involucrados

```
┌─────────────────────────────────────────────────────┐
│  🔍 DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS    │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                 │
│ │ Descripción del problema:       │                 │
│ │ [______________________________]│                 │
│ │ [______________________________]│                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│                                                     │
│ ┌─────────────────────────────────┐                 │
│ │ Actores involucrados:           │                 │
│ │ [______________________________]│                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
│                                                     │
│ 📊 VARIABLES CUANTITATIVAS (7)                       │
│ ┌─────────────────────────────────┐                 │
│ │ 1. Población total afectada:    │                 │
│ │    [________] personas                           │
│ ├─────────────────────────────────┤                 │
│ │ 2. N° de familias beneficiarias:│                 │
│ │    [________] familias                           │
│ ├─────────────────────────────────┤                 │
│ │ 3. Índice de pobreza (NBI) %:   │                 │
│ │    [________] %                                   │
│ ├─────────────────────────────────┤                 │
│ │ 4. Tasa de desempleo local %:   │                 │
│ │    [________] %                                   │
│ ├─────────────────────────────────┤                 │
│ │ 5. N° de organizaciones         │                 │
│ │    comunitarias existentes:     │                 │
│ │    [________]                                     │
│ ├─────────────────────────────────┤                 │
│ │ 6. Cobertura de servicios       │                 │
│ │    básicos %:                   │                 │
│ │    [________] %                                   │
│ ├─────────────────────────────────┤                 │
│ │ 7. Tasa de escolaridad %:       │                 │
│ │    [________] %                                   │
│ └─────────────────────────────────┘                 │
│                                                     │
│ 📝 VARIABLES CUALITATIVAS (2)                        │
│ ┌─────────────────────────────────┐                 │
│ │ 1. Percepción de la comunidad   │                 │
│ │    sobre la problemática:       │                 │
│ │    [______________________________]│              │
│ │    [______________________________]│              │
│ │    [______________________________]│              │
│ ├─────────────────────────────────┤                 │
│ │ 2. Factores socio-culturales    │                 │
│ │    que inciden en el problema:  │                 │
│ │    [______________________________]│              │
│ │    [______________________________]│              │
│ │    [______________________________]│              │
│ └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**Mejoras UI:**
- Variables cuantitativas: inputs numéricos con unidad de medida visible (personas, familias, %)
- Variables cualitativas: TextArea multilínea (mínimo 50 caracteres cada una)
- Sección de diagnóstico con fondo ligeramente diferenciado (gris muy claro `#F5F7FA`) para separar visualmente

**Validaciones:**
- Las 7 variables cuantitativas: **campos obligatorios**, numéricos (enteros o decimales según corresponda), rango 0-100 para porcentajes
- Las 2 variables cualitativas: **campos obligatorios**, mínimo 50 caracteres cada una

---

### SECCIÓN 6 — Estudiantes e Impacto

```
┌─────────────────────────────────────────────────────┐
│  👥 ESTUDIANTES E IMPACTO                           │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                 │
│ │ N° estudiantes vinculados:      │                 │
│ │ [______]                        │                 │
│ └─────────────────────────────────┘                 │
│ ┌─────────────────────────────────┐                 │
│ │ Articulación de funciones sustantivas:            │
│ │ ┌─────────────────────────────────┐              │
│ │ │ ¿Se articula con Investigación? ○ Sí  ○ No    │
│ │ ├─────────────────────────────────┤              │
│ │ │ ⚠ VISIBLE SOLO SI ELIGE "SÍ":                 │
│ │ │ Línea de investigación:         │              │
│ │ │ [▼ Seleccionar línea...]        │              │
│ │ │ Red académica articulada:       │              │
│ │ │ [▼ Seleccionar red...]          │              │
│ │ │ Grupo de investigación:         │              │
│ │ │ [▼ Seleccionar grupo...]        │              │
│ │ └─────────────────────────────────┘              │
│ └─────────────────────────────────┘                 │
│ ┌─────────────────────────────────┐                 │
│ │ Impactos:                       │                 │
│ │ [______________________________]│                 │
│ │ [______________________________]│                 │
│ │ [______________________________]│                 │
│ └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

**Mejoras UI:**
- Impactos como **multilínea** (TextArea / Multiline Input)
- Contador de caracteres opcional

**Lógica — Articulación de funciones sustantivas:**
- Radio buttons **Sí/No** para determinar si el proyecto se articula con investigación
- Si **"Sí"** → se muestran 3 dropdowns condicionales obligatorios:
  - **Línea de investigación** — Dropdown con líneas activas PUCE
  - **Red académica articulada** — Dropdown con redes disponibles
  - **Grupo de investigación** — Dropdown con grupos registrados
- Si **"No"** → los dropdowns permanecen ocultos
- Propiedad `Visible` = `rdbArticulacionInv.Selected.Value = "Sí"`

---

### SECCIÓN 7 — Matriz de Resultados (Tabla)

```
┌─────────────────────────────────────────────────────┐
│  📊 RESULTADOS DEL PROYECTO                         │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┬──────────┬──────────┬──────────────┐│
│ │ Cadena de   │Indicadores│Fuentes y │ Avance de la ││
│ │ Resultados  │          │Medios de │ Actividad y  ││
│ │             │          │Verificac.│ Actores Part.││
│ ├─────────────┼──────────┼──────────┼──────────────┤│
│ │ OBJETIVO    │          │          │              ││
│ │ GENERAL     │          │          │              ││
│ │ [________]  │[________]│[________]│[___________] ││
│ ├─────────────┼──────────┼──────────┼──────────────┤│
│ │ OBJETIVO    │          │          │              ││
│ │ ESPECÍFICO  │          │          │              ││
│ │ [________]  │[________]│[________]│[___________] ││
│ ├─────────────┼──────────┼──────────┼──────────────┤│
│ │ RESULTADOS  │          │          │              ││
│ │ [________]  │[________]│[________]│              ││
│ ├─────────────┼──────────┼──────────┼──────────────┤│
│ │ ACTIVIDADES │          │          │ Ejecución    ││
│ │ [________]  │[________]│[________]│ [________]   ││
│ └─────────────┴──────────┴──────────┴──────────────┘│
└─────────────────────────────────────────────────────┘
```

**Mejoras UI:**
- Encabezados de fila (OBJETIVO GENERAL, etc.) con **background de color** y texto bold
- Cada celda es un input multilínea
- La columna "Cadena de Resultados" más ancha (40% del ancho)
- Bordes sutiles, **alternancia de color** en filas (zebra striping)

---

### SECCIÓN 8 — Participantes (Tabla Horizontal Escroleable)

```
┌─────────────────────────────────────────────────────┐
│  👤 LISTA DE PARTICIPANTES                          │
│  [Docentes, Administrativos, Alumni]                │
├─────────────────────────────────────────────────────┤
│ ← Deslizar horizontalmente →                        │
│ ┌────────┬────────┬──────┬────────┬────────┬──...──┐│
│ │ Tipo   │Nac.    │Horas │Fecha   │Fecha   │      ││
│ │ Partic.│        │      │Inicio  │Final   │      ││
│ ├────────┼────────┼──────┼────────┼────────┼──...──┤│
│ │ [____] │ [____] │[____]│[______]│[______]│      ││
│ │ [____] │ [____] │[____]│[______]│[______]│      ││
│ │ [____] │ [____] │[____]│[______]│[______]│      ││
│ │ ...     (filas dinámicas con +AGREGAR)          ││
│ └────────┴────────┴──────┴────────┴────────┴──...──┘│
│                                                    │
│ Columnas: Tipo participante | Nacionalidad | Horas  │
│ Fecha inicio | Fecha fin | Tipo documento | N° doc  │
│ Apellidos y nombres | Carrera | Firma               │
└─────────────────────────────────────────────────────┘
```

**Mejoras UI:**
- Botón **"+ Agregar participante"** que añade filas dinámicamente
- Tabla horizontal con **scroll lateral** (Horizontal Gallery)
- Indicador visual de "deslizar para ver más columnas" (flechas)
- Botón **🗑 Eliminar** por fila
- Fecha con **DatePicker** en lugar de input manual
- Validación de campos obligatorios antes de guardar fila

---

### SECCIÓN 9 — Firmas (Footer del Informe)

```
┌─────────────────────────────────────────────────────┐
│  ✍️ FIRMAS                                          │
├─────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌────────┐│
│ │ ELABORADO POR    │ │ REVISADO POR     │ │APROBADO││
│ │ Docente Líder    │ │ Decano Unidad    │ │Dirección││
│ │ del Proyecto     │ │                  │ │Vinculac││
│ │ [_____________]  │ │ [_____________]  │ │[______]││
│ │ Fecha: [📅]     │ │ Fecha: [📅]     │ │[📅]    ││
│ └──────────────────┘ └──────────────────┘ └────────┘│
└─────────────────────────────────────────────────────┘
```

---

### SECCIÓN 10 — Anexos (Checklist)

```
┌─────────────────────────────────────────────────────┐
│  📎 ANEXOS                                         │
├─────────────────────────────────────────────────────┤
│ ☐ Acta de entrega-recepción de productos            │
│ ☐ Reporte banner de estudiantes                     │
│ ☐ Convenio / Carta de compromiso                    │
│                                                     │
│ [📎 Adjuntar archivos...]                           │
└─────────────────────────────────────────────────────┘
```

**Mejoras UI:**
- Checkboxes + botón de **subir archivo** (PowerApps Attachment Control)
- Indicador de "archivo adjunto" con nombre y tamaño

---

## 3. Navegación entre Secciones

Dado que es un canvas único escroleable, agregar un **menú de navegación rápida** lateral o superior:

```
┌─────────────────────────────────────────────────────┐
│ [🏠] [📋 Datos] [🎯 Alcance] [🏢 Contraparte]      │
│ [🔗 Comp.] [🔍 Diagnóstico] [👥 Est.]              │
│ [📊 Resultados] [👤 Particip.] [✍️ Firmas] [📎 Anexos]│
├─────────────────────────────────────────────────────┤
│                                                     │
│  (contenido de la sección activa)                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Opción alternativa:** Usar un **Sidebar navegable** o **Tab List** horizontal que haga scroll automático a cada sección.

---

## 4. Paleta de Colores Propuesta

| Elemento | Color | Hex |
|----------|-------|-----|
| Fondo general | Blanco | `#FFFFFF` |
| Barra de navegación / Header | Azul PUCE | `#003366` |
| Títulos de sección | Azul PUCE | `#003366` |
| Background de sección | Gris muy claro | `#F5F7FA` |
| Bordes de inputs | Gris medio | `#D0D5DD` |
| Input focus | Azul PUCE | `#003366` |
| Texto labels | Gris oscuro | `#344054` |
| Texto inputs | Negro | `#101828` |
| Errores / validación | Rojo | `#D92D20` |
| Éxito / completado | Verde | `#12B76A` |
| Checkbox activo | Azul PUCE | `#003366` |

---

## 5. Tipografía

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Título principal | 24px | Bold |
| Título de sección | 18px | SemiBold |
| Labels de campo | 13px | Medium |
| Valor / Input | 14px | Regular |
| Texto de ayuda | 11px | Regular |

Fuente: **Segoe UI** (estándar PowerApps) o **Inter** si se importa.

---

## 6. Comportamientos y Validaciones

| Campo | Validación |
|-------|-----------|
| Código | Requerido, formato `XXXX-XXX` |
| Correo | Formato email válido |
| Teléfono | Solo dígitos, mínimo 7 |
| Fechas | Fecha inicio ≤ Fecha cierre |
| Presupuestos | Solo números positivos |
| N° estudiantes | Entero positivo |
| Participantes | Al menos 1 fila completa |
| Grupos de atención prioritaria | Mínimo 1, máximo 3 seleccionados (Combobox) |
| Personas atendidas (H/M) | Enteros positivos, obligatorios |
| Total estimado | Calculado automáticamente (solo lectura) |
| Aporte al proyecto | Mínimo 1 checkmark seleccionado, sin máximo |
| Articulación investigación | Si "Sí" → Línea, Red, Grupo obligatorios (dropdowns) |
| Componentes condicionales | Si "Sí" en Intersedes/Internacionalización/Posgrados → subcampos obligatorios |
| Variables cuantitativas (7) | Obligatorias, numéricas, 0-100 para porcentajes |
| Variables cualitativas (2) | Obligatorias, mínimo 50 caracteres cada una |

**Botón Guardar:** Bottom fijo con:
- 💾 **Guardar Borrador** (guarda estado actual)
- 📤 **Enviar Informe** (valida todo antes de enviar)

---

## 7. Consideraciones para PowerApps

1. **DataSource:** SharePoint List o SQL Database
2. **Gallery anidada:** Para la tabla de participantes usar una **Vertical Gallery** con controles dentro de cada fila
3. **Colecciones locales:** Usar `Collect()` para filas dinámicas de participantes antes de enviar
4. **Variables globales:** Para estado del formulario, sección activa y validaciones
5. **Responsive:** Usar `App.Width` y `App.Height` para adaptarse a tablet y desktop
6. **Iconos:** Usar iconos nativos de PowerApps (Iconos >...)
7. **Timer:** Auto-guardado cada 5 minutos como borrador

---

## 8. Mapa de Componentes PowerApps

```
Screen: Frm_InformeComunitario (Scrollable)
├── Header (Container)
│   ├── imgLogo
│   ├── lblTitulo
│   └── txtCodigo
├── NavBar (Horizontal Gallery / TabList)
│   └── [Items: Datos, Alcance, Contraparte, Componentes, Diagnóstico, Estudiantes, Resultados, Participantes, Firmas, Anexos]
├── Section_DatosGenerales (Container)
│   ├── [2-column grid of Label + TextInput/DatePicker/Dropdown]
│   └── Card_ArticulacionInv (Container condicional)
│       └── [Dropdown Línea investig. + Dropdown Red académica + Dropdown Grupo investig.]
├── Section_AlcancePrioritariosPresupuesto (Container)
│   ├── [TextInput fields]
│   ├── Card_GruposPrioritarios (Container)
│   │   └── [Combobox searchable + chips de seleccionados]
│   ├── Card_PersonasAtendidas (Container)
│   │   └── [4-column: Hombres | Mujeres | Total Est. (auto) | Total Real]
│   └── Card_Presupuesto (Container with 5 inputs)
├── Section_Contraparte (Container)
│   ├── [2-column grid of Label + TextInput]
│   └── Card_AporteProyecto (Container)
│       └── [6 Checkboxes + chips de seleccionados]
├── Section_Componentes (Container)
│   ├── Card_Interculturalidad (Radio Sí/No)
│   ├── Card_Interdisciplinariedad (Radio Sí/No)
│   ├── Card_Intersedes (Container condicional)
│   │   ├── rdbIntersedes (Radio Sí/No)
│   │   └── [Dropdown Sede + TextInput Carreras] (Visible=Sí)
│   ├── Card_Internacionalizacion (Container condicional)
│   │   ├── rdbInternacionalizacion (Radio Sí/No)
│   │   └── [Dropdown Convenio + TextInput Institución + Dropdown País] (Visible=Sí)
│   └── Card_Posgrados (Container condicional)
│       ├── rdbPosgrados (Radio Sí/No)
│       └── [Dropdown Programa + TextInput N° estudiantes + TextInput Coordinador] (Visible=Sí)
├── Section_Diagnostico (Container)
│   ├── [TextArea multilínea: Descripción del problema + Actores]
│   ├── Card_VariablesCuantitativas (Container)
│   │   └── [7 TextInput numéricos con label de unidad]
│   └── Card_VariablesCualitativas (Container)
│       └── [2 TextArea multilínea]
├── Section_Estudiantes (Container)
│   ├── [TextInput N° estudiantes]
│   ├── Card_ArticulacionFunciones (Container condicional)
│   │   ├── rdbArticulacion (Radio Sí/No)
│   │   └── [Dropdown Línea + Dropdown Red + Dropdown Grupo] (Visible=Sí)
│   └── [3 TextArea multilínea: Impactos]
├── Section_MatrizResultados (Container)
│   └── Table (Gallery with 4 columns)
├── Section_Participantes (Container)
│   ├── HorizontalGallery (10 columns)
│   └── btn_AgregarFila
├── Section_Firmas (Container)
│   └── [3-column grid]
├── Section_Anexos (Container)
│   └── [Checklist + Attachment]
└── Footer (Container)
    ├── btn_GuardarBorrador
    ├── btn_Enviar
    └── lbl_FooterPUCE
```

---

## 9. Flujo de Datos

```
Carga inicial:
  → Cargar metadatos del proyecto por Código (si existe)
  → Si es nuevo: inicializar campos vacíos

Edición:
  → Load data from DataSource → Patch local collection → Display
  → OnChange de cada campo → Actualizar colección local

Guardar:
  → Validar todos los campos requeridos
  → Patch(DataSource, Defaults, {colección})
  → Notificación de éxito/error

Envío:
  → Validación estricta (todos los campos)
  → Envío a flujo PowerAutomate
  → Cambiar Estado a "Enviado"
  → Bloquear edición
```

---

## 10. Diferencias Clave vs. Versión Actual (Word)

| Aspecto | Word Actual | Propuesta PowerApps |
|---------|-------------|---------------------|
| Diseño | Tablas rígidas de Word | Cards flexibles con espaciado |
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
| Autoguardado | No | Timer de autoguardado |
| Adjuntos | No | Attachment Control |
| Articulación investigación | Campo de texto libre | Radio Sí/No + dropdowns condicionales (Línea, Red, Grupo) |
| Grupos prioritarios | No existe | Combobox searchable (mín 1, máx 3) |
| Personas atendidas | Un solo número | División Hombres/Mujeres + Total estimado automático + Total real |
| Contraparte | Solo nombre | Datos completos + Aporte al Proyecto con checkmarks (mín 1) |
| Componentes | 4 checkboxes planos | Radio Sí/No con subcampos condicionales para Intersedes, Internacionalización, Posgrados |
| Diagnóstico | No existe | 7 variables cuantitativas + 2 cualitativas para proyectos sociales |
| Articulación funs. sustantivas | Texto libre | Radio Sí/No + dropdowns condicionales (Línea, Red, Grupo) |

---

*Documento generado como boceto para implementación en Microsoft PowerApps.*
*Versión: 2.0 — Fecha: 2026-06-15*
