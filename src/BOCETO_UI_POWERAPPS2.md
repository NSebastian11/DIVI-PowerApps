# FollowUpReport.tsx
> **Estado actual:** Implementación en React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 como SPA de **canvas único escroleable** con organización visual limpia, jerárquica y moderna, y navegación por secciones.

---

## 1. Estructura General del Canvas

El formulario es un solo **Scrollable Screen (Vertical)** con barra de navegación horizontal fija para salto rápido entre secciones:

| # | Sección | Contenido |
|---|---------|-----------|
| — | **Header** (fijo, `bg-[#003366]`) | Logo PUCE + Título + Código |
| 1 | **Datos Generales** | 12 campos del proyecto en grid 2 columnas |
| 2 | **Alcance, Grupos Prioritarios y Presupuesto** | Comunidad, actores, beneficiarios, grupos (mín 1, máx 3), personas atendidas, presupuesto 3 estados |
| 3 | **Organización Contraparte** | Datos institución + RUC + checkboxes de aporte (mín 1) |
| 4 | **Componentes** | 5 radios condicionales con subcampos visibles solo si "Sí" |
| 5 | **Diagnóstico, Problema y Actores** | 7 variables cuantitativas, 2 cualitativas |
| 6 | **Estudiantes e Impacto** | Tabla semestre/género/total, articulación condicional con investigación, impactos multilínea |
| 7 | **Resultados del Proyecto** | Tabla 4×4 (Cadena/Indicadores/Fuentes/Avance) con zebra striping |
| 8 | **Participantes** | Tabla horizontal escroleable de 11 columnas, filas dinámicas |
| 9 | **Firmas** | Elaborado / Revisado / Aprobado con fecha |
| 10 | **Anexos** | Checklist con adjuntos obligatorios (*) y opcionales |
| — | **Footer** | Dirección PUCE + fecha + botones Guardar/Enviar |

---

## 2. Maquetación por Secciones

### HEADER (Fijo, `bg-[#003366]`, fuera del scroll)

```
┌─────────────────────────────────────────────────────┐
│ [PUCE Logo]   INFORME PARCIAL DE SEGUIMIENTO        │
│               Proyectos de Servicio Comunitario      │
│                                 Código: [________]   │
├─────────────────────────────────────────────────────┤
```

- Logo blanco con fondo redondeado, título **24px Bold** blanco, código derecha (label + input semitransparente)
- Header fijo fuera del scroll del canvas

### TIPO DE INFORME (solo en modo edición)

```
┌─────────────────────────────────────────────────────┐
│  Tipo de informe *                                  │
│  ┌──────────┐  ┌────────┐                           │
│  │ 📈 Avance│  │ ✅ Cierre│                          │
│  └──────────┘  └────────┘                           │
└─────────────────────────────────────────────────────┘
```
- Selector de dos botones estilo toggle, visible únicamente cuando `mode === 'edit'`
- Determina la transición del ciclo de vida del proyecto (avance → `en-progreso`, cierre → `cierre`)

---

### SECCIÓN 1 — Datos Generales

Distribución en **2 columnas** (label arriba, input abajo):

```
┌─────────────────────────────────────────────────────┐
│  📋 DATOS GENERALES                                 │
├─────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────────┐               │
│ │ Proyecto:*   │  │ Estado:*         │               │
│ │ [____________]│  │ [▼ En ejecución..]               │
│ └──────────────┘  └──────────────────┘               │
│ ┌──────────────────────────┐  ┌──────────────┐       │
│ │ Unidad responsable:*     │  │ Carrera:*     │       │
│ │ [▼ Seleccionar unidad...]│  │ [____________]       │
│ └──────────────────────────┘  └──────────────┘       │
│ ┌─────────────────────────────────┐                  │
│ │ Docente responsable:*           │                  │
│ │ [______________________________]│                  │
│ └─────────────────────────────────┘                  │
│ ┌──────────────┐  ┌──────────────┐                   │
│ │ Correo:*     │  │ Teléfono:*   │                   │
│ │ [____________]│  │ [____________]                   │
│ └──────────────┘  └──────────────┘                   │
│ ┌──────────────┐  ┌──────────────┐                   │
│ │ Año ejec.:*  │  │ Fecha inicio:*│                  │
│ │ [____]       │  │ [📅 date]    │                   │
│ └──────────────┘  └──────────────┘                   │
│ ┌──────────────┐  ┌──────────────┐                   │
│ │ Fecha cierre:*│  │ Fecha informe:*│                │
│ │ [📅 date]    │  │ [📅 date]    │                   │
│ └──────────────┘  └──────────────┘                   │
│ ┌─────────────────────────────────┐                  │
│ │ Programa:                       │                  │
│ │ [______________________________]│                  │
│ └─────────────────────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

**UI:** Dropdowns nativos (`<select>`), inputs de tipo `date`, text, email, tel. Estilo moderno con borde redondeado y focus ring azul PUCE.

**Validaciones previstas (no implementadas):** Código `XXXX-XXX`, correo formato email, teléfono solo dígitos ≥7, fechas inicio ≤ cierre.

---

### SECCIÓN 2 — Alcance, Grupos Prioritarios y Presupuesto

```
┌─────────────────────────────────────────────────────┐
│  🎯 ALCANCE, GRUPOS PRIORITARIOS Y PRESUPUESTO      │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                  │
│ │ Comunidad alcanzada:*           │                  │
│ │ [______________________________]│                  │
│ └─────────────────────────────────┘                  │
│ ┌──────────────┐  ┌──────────────┐                   │
│ │ Tipo actores:*│  │ Beneficiarios:*│                 │
│ │ [____________]│  │ [____________]                   │
│ └──────────────┘  └──────────────┘                   │
│                                                     │
│ ┌─────────────────────────────────┐                  │
│ │ 🏷️ GRUPOS DE ATENCIÓN PRIORITARIA                │
│ │ [🔍 Buscar grupo...        ▼]  (mín 1, máx 3)     │
│ │ ┌─────────────────────────────────┐               │
│ │ │ ■ Grupo seleccionado 1      [×] │               │
│ │ │ ■ Grupo seleccionado 2      [×] │               │
│ │ │ ■ Grupo seleccionado 3      [×] │               │
│ │ └─────────────────────────────────┘               │
│ │ Seleccionados: N/3                                 │
│ └─────────────────────────────────┘                  │
│                                                     │
│ ┌─────────────────────────────────┐                  │
│ │ 👥 NÚMERO DE PERSONAS ATENDIDAS                    │
│ ├──────────┬──────────┬──────────┬──────────┤        │
│ │ Hombres  │ Mujeres  │ Total    │ Total    │        │
│ │ (Estim.)*│ (Estim.)*│ Estimado │ Real     │        │
│ │          │          │ (Auto)   │ (Manual) │        │
│ ├──────────┼──────────┼──────────┼──────────┤        │
│ │ [____]   │ [____]   │ [____]   │ [____]   │        │
│ │          │          │ Suma H+M │ Campo    │        │
│ │          │          │ automática│ libre    │        │
│ └──────────┴──────────┴──────────┴──────────┘        │
│ ┌─────────────────────────────────┐                  │
│ │ Beneficiarios directos:*        │                  │
│ │ [______________________________]│                  │
│ └─────────────────────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

**💰 PRESUPUESTO** (3 columnas: Estimado, Avance, Final):

```
│ 💰 PRESUPUESTO                                        │
│ Estado: ● Estimado  ○ Avance  ○ Final                 │
│ (Avance y Final se habilitan solo al seleccionarlos)   │
│ ┌───────────────────┬───────────────────┬────────────┐ │
│ │ 📋 ESTIMADO       │ 📈 AVANCE         │ ✅ FINAL    │ │
│ │ (Siempre activo)  │ (Se activa al     │ (Se activa │ │
│ │                   │  elegir Avance)   │ al elegir  │ │
│ │                   │                   │ Final)     │ │
│ ├───────────────────┼───────────────────┼────────────┤ │
│ │ [▼ Cuenta cont.] │ [▼ Cuenta cont.]  │ [▼ Cta]    │ │
│ │ $ [____________]  │ $ [____________]  │ $ [____]   │ │
│ │ [×]               │ [×]               │ [×]        │ │
│ ├───────────────────┼───────────────────┼────────────┤ │
│ │ [+ Agregar cuenta]│ [+ Agregar cuen.] │ [+ Agreg.] │ │
│ ├───────────────────┼───────────────────┼────────────┤ │
│ │ TOTAL: $ [______] │ TOTAL: $ [______] │ TOTAL:$[]  │ │
│ └───────────────────┴───────────────────┴────────────┘ │
```

**UI:** Selector de estado con botones estilo toggle. Cuentas contables desde `<select>` del catálogo institucional (16 cuentas). Campos con prefijo `$` y formato número con 2 decimales. Fondo sombreado (`bg-[#F5F7FA]`).

**Reglas:**
- Grupos prioritarios: mínimo 1, máximo 3 selecciones (tags removibles con chip azul)
- Total estimado = suma automática H+M. Total real = campo libre manual
- Presupuesto Estimado siempre activo. Avance/Final se habilitan solo al seleccionar ese estado (opacidad reducida cuando inactivos)
- Cuentas contables requeridas desde catálogo
- Botón "+ Agregar cuenta" disponible en las 3 columnas
- Botón "×" para eliminar cuenta (solo si hay más de 1 fila)

---

### SECCIÓN 3 — Organización Contraparte

```
┌─────────────────────────────────────────────────────┐
│  🏢 ORGANIZACIÓN CONTRAPARTE       [+ Agregar]      │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐                  │
│ │ Contraparte #1                  │                  │
│ ├─────────────────────────────────┤                  │
│ │ Nombre de la institución:*      │                  │
│ │ [______________________________]│                  │
│ │ ┌──────────────┐  ┌──────────────┐                │
│ │ │ RUC:*        │  │ Teléfono:*   │                │
│ │ │ [____________]│  │ [____________]                │
│ │ └──────────────┘  └──────────────┘                │
│ │ Dirección:*                                       │
│ │ [______________________________]                  │
│ │ Representante legal:*                             │
│ │ [______________________________]                  │
│ │                                                   │
│ │ 📦 APORTE AL PROYECTO (mínimo 1 obligatorio)      │
│ │ ☐ Materiales       ☐ Infraestructura   ☐ Hospedaje│
│ │ ☐ RREE (Relac.    ☐ Transporte        ☐ Alimentac.│
│ │    Externas)                                       │
│ │ [chips de ítems marcados]                          │
│ │ Seleccionados: N (mínimo 1 requerido)              │
│ └─────────────────────────────────┘                  │
│                                                     │
│ (Si hay más de una, separador punteado y             │
│  encabezado "Contraparte #2" con botón Eliminar)     │
├─────────────────────────────────────────────────────┤
│ [📎 Adjuntar convenio / carta de compromiso]        │
└─────────────────────────────────────────────────────┘
```

**Reglas:** Múltiples contrapartes dinámicas (botón "+ Agregar contraparte"). Cada una con sus propios datos y checkboxes. Mínimo 1 checkbox obligatorio por contraparte, sin máximo. Validación visual: "Seleccionados: N (mínimo 1 requerido)" en rojo si 0.

---

### SECCIÓN 4 — Componentes

```
┌─────────────────────────────────────────────────────┐
│  🔗 COMPONENTES                                     │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ Componente de interculturalidad    ○ Sí  ○ No   │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Componente de interdisciplinariedad ○ Sí  ○ No  │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Componente Intersedes         ○ Sí  ○ No        │ │
│ │ ── Visible solo si "SÍ" ──                      │ │
│ │   Sede PUCE:       [▼ Seleccionar sede...]      │ │
│ │   Carreras interse: [________________]          │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Componente de Internacionalización ○ Sí  ○ No   │ │
│ │ ── Visible solo si "SÍ" ──                      │ │
│ │   Convenio intl.:   [▼ Seleccionar convenio...]  │ │
│ │   Inst. extranjera: [________________]          │ │
│ │   País:             [▼ Seleccionar país...]     │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Componente de Posgrados        ○ Sí  ○ No        │ │
│ │ ── Visible solo si "SÍ" ──                      │ │
│ │   Programa posgrado: [▼ Escribir o seleccionar] │ │
│ │   N° estudiantes:   [____]                      │ │
│ │   Coordinador:      [▼ Escribir o seleccionar]  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ (Si internacionalización=Sí)                         │
│ [📎 Adjuntar documento del convenio internacional]   │
└─────────────────────────────────────────────────────┘
```

| Componente | Sin subcampos | Subcampos si "Sí" |
|------------|:---:|---|
| Interculturalidad | ✓ | — |
| Interdisciplinariedad | ✓ | — |
| Intersedes | — | Sede PUCE (dropdown 6 sedes) + Carreras (texto) |
| Internacionalización | — | Convenio (dropdown 3 opciones) + Institución (texto) + País (dropdown 10 países) |
| Posgrados | — | Programa (combobox 5 opciones) + N° estudiantes (numérico) + Coordinador (combobox 8 opciones) |

**Regla:** Subcampos visibles solo si el radio es "Sí". Si internacionalización activo, se muestra upload de convenio internacional.

---

### SECCIÓN 5 — Diagnóstico, Problema y Actores Involucrados

```
┌─────────────────────────────────────────────────────┐
│  🔍 DIAGNÓSTICO, PROBLEMA Y ACTORES INVOLUCRADOS    │
├─────────────────────────────────────────────────────┤
│ Descripción del problema:*                          │
│ [__________________________________________________]│
│ [__________________________________________________]│
│                                                     │
│ Actores involucrados:*                              │
│ [__________________________________________________]│
│                                                     │
│ 📊 VARIABLES CUANTITATIVAS (7) — obligatorias       │
│ 1. Población total afectada:   [________] personas  │
│ 2. N° familias beneficiarias:  [________] familias  │
│ 3. Índice de pobreza (NBI):    [________] % (0-100) │
│ 4. Tasa de desempleo local:    [________] % (0-100) │
│ 5. N° org. comunitarias:       [________]           │
│ 6. Cobertura servicios básicos:[________] % (0-100) │
│ 7. Tasa de escolaridad:        [________] % (0-100) │
│                                                     │
│ 📝 RESUMEN DEL PROBLEMA                             │
│ [__________________________________________________]│
└─────────────────────────────────────────────────────┘
```

**Validaciones previstas (no implementadas):** 2 variables cualitativas (descripción del problema y actores involucrados), mínimo 50 caracteres cada una. 7 cuantitativas con rango 0-100 para % (parcial: `min=0` y `max=100` en inputs tipo %).

---

### SECCIÓN 6 — Estudiantes e Impacto

```
┌─────────────────────────────────────────────────────┐
│  👥 ESTUDIANTES E IMPACTO                           │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🎓 ESTUDIANTES VINCULADOS      [+ Agregar fila] │ │
│ │ ┌──────────┬──────────┬──────────┬──────────┬──┐ │ │
│ │ │ Semestre │ Hombres  │ Mujeres  │  Total   │ ×│ │ │
│ │ ├──────────┼──────────┼──────────┼──────────┼──┤ │ │
│ │ │ [____]   │ [____]   │ [____]   │ [____]   │  │ │ │
│ │ │ [____]   │ [____]   │ [____]   │ [____]   │  │ │ │
│ │ │ ... (filas dinámicas)           │           │  │ │ │
│ │ ├──────────┼──────────┼──────────┼──────────┼──┤ │ │
│ │ │TOTAL     │    N     │    N     │    N     │  │ │ │
│ │ │GENERAL   │          │          │          │  │ │ │
│ │ └──────────┴──────────┴──────────┴──────────┴──┘ │ │
│ │ Total de estudiantes vinculados: N               │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Articulación funciones sustantivas:                 │
│ ¿Se articula con Investigación?  ○ Sí  ○ No        │
│ ── Visible solo si "SÍ" ──                          │
│   Línea de investigación:  [▼ Seleccionar línea...] │
│   Red académica articulada: [▼ Seleccionar red...]  │
│   Grupo de investigación:   [▼ Seleccionar grupo...]│
│                                                     │
│ Impactos del proyecto:                              │
│ [__________________________________________________]│
│                                                     │
│ [📎 Adjuntar reporte banner de estudiantes]         │
└─────────────────────────────────────────────────────┘
```

**Reglas:** Al menos 1 fila completa (no validado). Total por fila calculado automáticamente (H+M). Fila de TOTAL GENERAL al final. Si articulación con investigación = "Sí", los 3 dropdowns con datos estáticos son obligatorios (no validado). Impactos como multilínea.

---

### SECCIÓN 7 — Resultados del Proyecto (Matriz de Marco Lógico)


# Matriz de Marco Lógico

La sección de Matriz de Marco Lógico es uno de los bloques más técnicos de FollowUpReport. Está diseñada para traducir la lógica del proyecto a una estructura visual de tabla, donde cada fila representa un nivel de la cadena de resultados y cada columna recoge la información necesaria para evaluar, verificar y asignar responsabilidad sobre ese nivel.

## Estructura visual

La interfaz se presenta dentro de una tarjeta blanca con borde suave y sombra ligera, siguiendo la misma estética del resto del formulario. Arriba se muestra un rótulo corto y directo: 5. MATRIZ DE MARCO LÓGICO. Este encabezado actúa como separador visual y deja claro que el bloque pertenece a la parte de resultados del informe.

Debajo del título aparece una tabla de ancho completo con desplazamiento horizontal si la pantalla lo requiere. La matriz está organizada en cinco columnas fijas:

1. Cadena de resultados.
2. Indicadores.
3. Fuentes y medios de verificación.
4. Supuestos.
5. Responsable.

La primera columna tiene un ancho más estable porque contiene las etiquetas de cada nivel de la lógica del proyecto. Las demás columnas se adaptan al contenido y permiten escribir texto extenso en varias líneas. Esto favorece una lectura tipo matriz, no tipo formulario simple.

## Filas que componen la matriz

La tabla se construye a partir de un arreglo de filas predefinidas. Cada fila corresponde a un componente clásico de marco lógico:

- FIN.
- PROPÓSITO.
- R1.
- A1R1.
- R2.
- A1R2.
- R3.
- A1R3.
- R4.
- A1R4.

Este orden refleja una secuencia jerárquica: primero el impacto esperado, luego el propósito general, después los resultados y finalmente las actividades o acciones asociadas. La UI no obliga al usuario a entender la teoría del marco lógico desde cero, pero sí le muestra una estructura que guía la forma de pensar el proyecto, además le debe permitir añadir más resultados y las actividades de las mismas

## Cómo funciona la edición

Cada celda editable de la matriz se implementa como un área de texto. Esto permite escribir descripciones más largas que un simple input de una línea. El usuario puede redactar:

- indicadores verificables,
- fuentes documentales o evidencias,
- supuestos externos que podrían afectar el logro,
- y la persona o rol responsable de cada nivel.

La edición es directa: al escribir en una celda, el valor se guarda en el estado local de la pantalla y queda asociado a la fila y al campo correspondiente. No hay pasos intermedios ni ventanas emergentes, lo que hace que la captura sea fluida y continua.

## Lógica de interacción

La matriz se construye para trabajar como una tabla de análisis y no como un listado de campos aislados. Por eso, cada fila mantiene el mismo patrón de columnas y el usuario puede comparar fácilmente un nivel con otro. Esa repetición visual ayuda a detectar vacíos, inconsistencias o diferencias entre resultados, supuestos y responsables.

El color de fondo alternado entre filas también mejora la lectura. Una fila blanca y la siguiente en gris claro crean ritmo visual y evitan que el usuario pierda la referencia cuando recorre la tabla de izquierda a derecha o de arriba hacia abajo.

Los campos usan bordes finos, tipografía pequeña y foco visible al activar cada celda. Ese tratamiento refuerza la idea de que el contenido es técnico y detallado, pero sigue siendo editable sin fricción.

## Relación con la utilidad del informe

Esta sección no solo documenta el proyecto; también sirve para alinear expectativas entre resultados, medios de verificación y condiciones externas. En la práctica, funciona como una herramienta de control porque obliga a que cada resultado tenga una explicación lógica completa.

Desde la perspectiva de UX, esto transforma un contenido complejo en una tabla editable y ordenada. El usuario no ve un bloque narrativo difícil de interpretar, sino una estructura que le indica qué debe escribir y en qué lugar debe hacerlo.

## Conexión con la impresión

La matriz también tiene una salida directa a PDF. En el componente existe una acción para imprimir esta sección con un formato horizontal, usando un encabezado propio y una tabla de salida pensada para presentar la información de forma profesional.

Esto significa que la matriz no es solo un elemento visual dentro de la pantalla: también es un resultado exportable del formulario. La interfaz, por tanto, cumple dos objetivos al mismo tiempo. Primero, permite capturar el contenido; segundo, lo prepara para documentación formal y presentación institucional.

## Resumen funcional

La Matriz de Marco Lógico está hecha como una tabla editable de cinco columnas y varias filas fijas, donde cada nivel del proyecto se completa con texto libre. Su diseño prioriza la claridad estructural, la comparación entre niveles y la captura de información técnica en una sola vista. Dentro del informe, es la sección que mejor representa el componente analítico del seguimiento, porque conecta objetivos, verificación, riesgos y responsables en una misma lógica visual.



**UI:** Encabezados con background azul PUCE + texto blanco. Encabezados de fila con fondo zebra striping (`#F5F7FA` / blanco). Celdas con `<textarea>` multilínea. Bordes sutiles.

---

### SECCIÓN 8 — Participantes (Tabla Horizontal Escroleable)

```
┌──────────────────────────────────────────────────────────────┐
│  👤 LISTA DE PARTICIPANTES        [+ Agregar participante]  │
│  Docentes, Administrativos, Alumni                           │
├──────────────────────────────────────────────────────────────┤
│ ← Deslizar horizontalmente →                                 │
│ ┌──────┬──────┬───────┬───────┬───────┬──────┬──────┬──────┐ │
│ │Tipo  │Nac.  │Horas  │F.Inicio│F.Fin │Tipo  │N° doc│Apell.│ │
│ │Partic│      │(prog.)│       │      │docum.│      │y Nomb│ │
│ ├──────┼──────┼───────┼───────┼───────┼──────┼──────┼──────┤ │
│ │[____]│[____]│[_____]│[📅]   │[📅]  │[____]│[____]│[____]│ │
│ │[____]│[____]│[_____]│[📅]   │[📅]  │[____]│[____]│[____]│ │
│ │ ...  (filas dinámicas con botón 🗑 por fila)              │ │
│ └──────┴──────┴───────┴───────┴───────┴──────┴──────┴──────┘ │
├──────────────────────────────────────────────────────────────┤
│ Columnas (11): Tipo participante | Nacionalidad | Horas       │
│ (programadas) | Fecha inicio | Fecha fin | Tipo documento |   │
│ N° documento | Apellidos y nombres (colspan 2) | Carrera |    │
│ Acciones (🗑)                                              │
├──────────────────────────────────────────────────────────────┤
│ 💡 Deslizar horizontalmente para ver más columnas            │
│                                                              │
│ [📎 Adjuntar listado firmado de participantes]               │
└──────────────────────────────────────────────────────────────┘
```

**UI:** Grid CSS horizontal (`overflow-x-auto`, `min-w-max`). Filas dinámicas con botón "+ Agregar participante" y "🗑" por fila. Inputs de tipo `date` en fechas. Sin validación de campos obligatorios por fila.

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
│ [📎 Adjuntar documento de firmas escaneado]          │
└─────────────────────────────────────────────────────┘
```

---

### SECCIÓN 10 — Anexos (Checklist)

```
┌─────────────────────────────────────────────────────┐
│  📎 ANEXOS  *Documentos obligatorios                │
├─────────────────────────────────────────────────────┤
│ ☑ * Acta de entrega-recepción de productos          │
│ ☑ * Reporte banner de estudiantes                   │
│ ☑ * Convenio internacional                          │
│     (requerido si aplica componente de               │
│      internacionalización)                           │
│ ☐   Convenio / Carta de compromiso                  │
│ ☐   Listado firmado de participantes                │
│ ☐   Documento de firmas escaneado                   │
│ ☐   Otros documentos                                │
│                                                     │
│ [📎 Adjuntar archivos...]                            │
│                                                     │
│ ⚠️ Los documentos marcados con * son obligatorios.   │
│   (Condicional: si componente internacionalización   │
│    activo, se muestra mensaje adicional)             │
└─────────────────────────────────────────────────────┘
```

**UI:** Checkboxes + botón de adjuntar archivos (mock, almacena solo nombre/tamaño). Lista condicional: si `internacionalizacion === 'si'` se añade "Convenio internacional" como obligatorio. Banner de advertencia con fondo `#FFF9F0` borde `#FFD9A0`.

---

## 3. Paleta de Colores

| Elemento | Color | Hex (Tailwind) |
|----------|-------|----------------|
| Fondo general | Gris claro | `#F4F5F7` |
| Header / Nav activo | Azul PUCE | `#003366` |
| Títulos de sección | Azul PUCE | `#003366` |
| Background de subsecciones | Gris muy claro | `#F5F7FA` |
| Bordes de inputs | Gris medio | `#D0D5DD` |
| Input focus | Azul PUCE ring | `#003366` |
| Texto labels | Gris oscuro | `#344054` |
| Errores / validación | Rojo | `#D92D20` |
| Éxito / completado | Verde | `#12B76A` |
| Checkbox activo | Azul PUCE | `#003366` |
| Botón Guardar borrador | Gris claro | bg `#F5F7FA` text `#344054` |
| Botón Enviar informe | Verde | bg `#12B76A` text white |
| Borde tabla | Gris medio | `#D0D5DD` |
| Fondo tabla zebra (par) | Blanco | `#FFFFFF` |
| Fondo tabla zebra (impar) | Gris muy claro | `#F5F7FA` |
| Banner advertencia | Fondo naranja claro | `#FFF9F0` / borde `#FFD9A0` |

## 4. Tipografía

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Título principal (header) | 24px (`text-2xl`) | Bold |
| Título de sección | 20px (`text-xl`) | SemiBold |
| Subtítulo de subsección | 14px (`text-sm`) | SemiBold |
| Labels de campo | 14px (`text-sm`) | Medium |
| Valor / Input | 16px (`text-base`) | Regular |
| Texto de ayuda / metadata | 12px (`text-xs`) | Regular |

Fuente: **Segoe UI** (definida en `index.css` via `font-family: 'Segoe UI', system-ui, ...`).

## 5. Validaciones

| Campo | Estado actual en código |
|-------|------------------------|
| Código | Estado de error definido, sin regex implementado |
| Unidad | Sin validación |
| Correo | Estado de error definido, sin regex implementado |
| Teléfono | Estado de error definido, sin regex implementado |
| Fechas inicio ≤ cierre | Sin validación |
| Presupuesto Estimado | `min={0}` en inputs numéricos |
| Presupuesto Avance/Final | Deshabilitado visualmente si no está seleccionado ese estado |
| Cuenta contable | Selección obligatoria desde catálogo de 16 cuentas |
| Grupos prioritarios | Máximo 3 forzado en componente `GrupoSearchable`, contador visible |
| Aporte al proyecto | Advertencia visual si 0 seleccionado |
| Variables cuantitativas % | `min={0}` y `max={100}` en inputs de porcentaje |
| Variables cualitativas | Sin validación de 50 caracteres |
| Estudiantes vinculados | Sin validación de al menos 1 fila |
| Articulación investigación | Sin validación de dropdowns obligatorios |
| Participantes | Sin validación de campos obligatorios por fila |
| Anexos (*) | Sin validación de checkboxes obligatorios |

**Botones (footer fijo):**
- 💾 **Guardar Borrador** — llama a `onSave(tipoInforme)` sin validación completa
- 📤 **Enviar Informe** — llama a `onSave(tipoInforme)` sin validación estricta
- **Volver** — botón de retroceso

## 6. Flujo de Datos

```
Carga:
  → App.tsx gestiona vista activa ('list' | 'welcome' | 'report' | 'propose')
  → FollowUpReport recibe mode ('create' | 'edit') vía props
  → Si mode='edit', muestra selector de Tipo de Informe (Avance/Cierre)

Edición:
  → useState local para cada campo, fila y estado
  → Sin persistencia externa (datos mock en memoria)
  → FileUpload simulado: solo almacena nombre y tamaño del archivo

Guardar Borrador / Enviar:
  → onSave(tipoInforme) → App.tsx actualiza status del proyecto
  → create mode → status = 'en-progreso'
  → edit + cierre → status = 'cierre'
  → edit + avance → status = 'en-progreso'
  → Sin validación estricta, sin bloqueo posterior
```

## 7. Consideraciones Técnicas (Implementación Actual)

1. **Stack:** React 19.2 + TypeScript 5.9 + Vite 7.2 + Tailwind CSS 4.3 + Lucide React icons
2. **DataSource:** Ninguno — datos mock estáticos en arrays (`projects.ts`, `existingProjects.ts`)
3. **Ruteo:** Sin React Router — `useState<AppView>` en App.tsx para cambio de vistas
4. **Componentes internos reutilizables:** `GrupoSearchable` (multiselect con chips), `RadioSiNo`, `SelectField`, `ComboboxField`, `InputField`, `TextAreaField`, `FileUploadBtn`
5. **Estado:** `useState` local en cada página (sin estado global ni context)
6. **Responsive:** Tailwind responsive classes (ej. `grid md:grid-cols-2`)
7. **Auto-guardado:** No implementado
8. **Navegación:** Barra horizontal sticky con scroll-to-section vía `scrollIntoView`
9. **Iconos:** Lucide React (Save, Send, Plus, Trash2, FileText, Search, X, ChevronDown)

## 8. Mapa de Componentes

```
App.tsx (Router con useState)
├── ProjectList.tsx (Dashboard con filtro por año)
│   ├── Proyectos asignados (cards con Iniciar/Modificar)
│   └── Cierre (cards con Ver/Modificar)
├── WelcomeScreen.tsx (Pantalla de bienvenida)
└── FollowUpReport.tsx (1472 líneas, 1 Screen scrollable)
    ├── Header (bg-[#003366], fijo)
    │   ├── logo PUCE
    │   ├── h1 "INFORME PARCIAL DE SEGUIMIENTO"
    │   └── input Código
    ├── NavBar (sticky, 10 tabs con iconos)
    ├── TipoInforme (solo edit mode, Avance/Cierre toggle)
    ├── Section: datos (2-column grid, 12 campos)
    ├── Section: alcance
    │   ├── GrupoSearchable (multiselect tags, max 3)
    │   ├── PersonasAtendidas (4-column grid)
    │   └── Presupuesto (3-column card, 16 cuentas contables)
    ├── Section: contraparte (dinámica, add/remove)
    │   └── Card: Aportes (6 checkboxes)
    ├── Section: componentes (5 radios condicionales)
    ├── Section: diagnostico (7 cuantitativas fijas + 2 cualitativas)
    ├── Section: estudiantes
    │   ├── Tabla dinámica (semestre/H/M/total + footer total)
    │   └── Card: Articulación (3 dropdowns condicionales)
    ├── Section: resultados (4×4 Marco Lógico con zebra)
    ├── Section: participantes (11-column grid dinámica)
    ├── Section: firmas (3-column grid)
    ├── Section: anexos (checklist + file upload mock)
    └── Footer (fijo abajo)
        ├── btn Volver
        ├── btn Guardar Borrador
        ├── btn Enviar Informe
        └── lbl PIUCE + dirección + fecha
```

## 9. Diferencias vs. Documento de Especificación Original

| Aspecto | Especificación Original | Implementación Actual |
|---------|------------------------|----------------------|
| Plataforma | PowerApps Canvas (SharePoint/SQL) | React + TypeScript + Vite + Tailwind |
| Persistencia | SharePoint List o SQL Database | Datos mock en memoria (arrays estáticos) |
| PowerAutomate | Flujo de envío | No implementado |
| Attachment real | PowerApps Attachment Control | Mock (solo nombre/tamaño, `<input type="file">`) |
| Auto-guardado | Timer cada 5 minutos | No implementado |
| Tipo de Informe | No mencionado | Selector Avance/Cierre en modo edición |
| Contrapartes | Única institución | Múltiples contrapartes dinámicas (add/remove) |
| Aportes layout | 2 filas | Grid 3 columnas |
| RREE label | "RREE" | "RREE (Relaciones Externas)" |
| Columna Firma (Part.) | Columna "Firma" incluida | Columna "Acciones" (🗑) en lugar de "Firma" |
| Ancho columna 1 (Matriz) | 40% | 30% |
| Anexos checklist | 5 ítems | 7 ítems (añadidos listado firmado y firmas escaneado) |
| File uploads por sección | Solo en Anexos | En alcance, contraparte, componentes, estudiantes, participantes, firmas y anexos |
| Footer address | "Dirección PUCE + fecha" | "Pontificia Universidad Católica del Ecuador • Av. 12 de Octubre 1076 • Quito, Ecuador • {fecha}" |
| Validaciones | 14 reglas de validación | Estados de error definidos pero sin lógica de validación implementada |
| Beneficiarios directos | No diagramado (sí en tabla de validaciones) | Campo de texto después de personas atendidas |
| Section IDs | Numéricas (1–10) | Strings: datos, alcance, contraparte, componentes, diagnostico, estudiantes, resultados, participantes, firmas, anexos |
| Responsive | `App.Width`/`App.Height` | Tailwind responsive grid (`md:grid-cols-2`, etc.) |

## 10. Pendientes / Mejoras Identificadas

- [ ] Implementar validaciones: código (regex `XXXX-XXX`), correo (regex email), teléfono (≥7 dígitos)
- [ ] Validar fechas: fecha inicio ≤ fecha cierre
- [ ] Validar mínimo 50 caracteres en variables cualitativas
- [ ] Validar al menos 1 fila completa en estudiantes y participantes
- [ ] Validar checkboxes obligatorios en anexos
- [ ] Validar dropdowns de articulación si "Sí"
- [ ] Persistencia real (API / backend)
- [ ] File upload real (no solo mock)
- [ ] PowerAutomate flow simulation o real
- [ ] Auto-guardado periódico
- [ ] Bloqueo de edición posterior al envío
- [ ] Extraer componentes reutilizables a `src/components/`

---

*Documento actualizado para reflejar el estado real del código — Julio 2026.*
