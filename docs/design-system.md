# Guía de estilo unificada para webs

Este documento define el estilo visual, técnico y editorial que deben seguir todos los agentes, desarrolladores y asistentes IA al crear, rediseñar o modificar cualquiera de mis webs.

El objetivo es que todos los proyectos tengan una identidad coherente, profesional, moderna, rápida, mobile first, accesible, preparada para SEO y con soporte completo para modo claro y modo oscuro.

---

## 1. Principios generales

Todas las webs deben cumplir estos principios:

1. **Claridad antes que decoración**  
   El diseño debe ser bonito y vistoso, pero nunca dificultar la lectura, la navegación o la conversión.

2. **Mobile first real**  
   Se diseña primero para móvil y después se adapta a tablet y escritorio. No se acepta una versión móvil “encogida” de escritorio.

3. **Profesional, moderno y limpio**  
   El estilo debe transmitir confianza, producto cuidado y sensación de proyecto actual.

4. **Rápido y ligero**  
   Priorizar HTML semántico, CSS eficiente y JavaScript mínimo. No añadir librerías pesadas si se puede resolver con código propio sencillo.

5. **SEO desde la base**  
   Cada página debe estar pensada para posicionar bien: estructura semántica, títulos claros, metadatos, enlazado interno, rendimiento y contenido útil.

6. **Accesible por defecto**  
   Buen contraste, navegación por teclado, textos legibles, botones claros, estados visibles y etiquetas correctas.

7. **Sin fuentes externas**  
   No cargar Google Fonts, Adobe Fonts ni fuentes remotas. Usar fuentes del sistema para mejorar rendimiento, privacidad y SEO técnico.

8. **Modo claro y oscuro obligatorio**  
   Toda interfaz nueva debe funcionar correctamente en light y dark mode.

---

## 2. Identidad visual común

Aunque cada web pueda tener su tema concreto, todas deben compartir una misma base visual.

### 2.1 Personalidad visual

Las webs deben sentirse:

- Modernas.
- Limpias.
- Rápidas.
- Cercanas.
- Profesionales.
- Con un punto visual llamativo, pero sin parecer plantillas genéricas.
- Preparadas para contenido, herramientas, noticias, guías, juegos o proyectos personales.

Evitar:

- Diseños sobrecargados.
- Sombras exageradas.
- Gradientes sin sentido.
- Animaciones lentas.
- Colores chillones usados como base.
- Interfaces que parezcan antiguas.
- Botones pequeños o poco claros.
- Páginas que dependan de hero gigantes sin contenido real.

---

## 3. Sistema de diseño base

Todas las webs deben partir de variables CSS globales. Los nombres pueden adaptarse al framework, pero la idea debe mantenerse.

```css
:root {
  color-scheme: light;

  /* Tipografía */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;

  /* Colores base */
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-soft: #f1f5f9;
  --color-surface-raised: #ffffff;

  --color-text: #0f172a;
  --color-text-muted: #475569;
  --color-text-soft: #64748b;

  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;

  /* Marca */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-soft: #dbeafe;

  --color-secondary: #7c3aed;
  --color-secondary-soft: #ede9fe;

  --color-accent: #f97316;
  --color-accent-soft: #ffedd5;

  /* Estados */
  --color-success: #16a34a;
  --color-success-soft: #dcfce7;
  --color-warning: #d97706;
  --color-warning-soft: #fef3c7;
  --color-danger: #dc2626;
  --color-danger-soft: #fee2e2;
  --color-info: #0284c7;
  --color-info-soft: #e0f2fe;

  /* Layout */
  --container-xs: 36rem;
  --container-sm: 48rem;
  --container-md: 64rem;
  --container-lg: 80rem;
  --container-xl: 96rem;

  /* Espaciado */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Radios */
  --radius-xs: 0.375rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
  --radius-2xl: 1.5rem;
  --radius-full: 999px;

  /* Sombras */
  --shadow-xs: 0 1px 2px rgb(15 23 42 / 0.06);
  --shadow-sm: 0 4px 12px rgb(15 23 42 / 0.08);
  --shadow-md: 0 12px 32px rgb(15 23 42 / 0.12);
  --shadow-lg: 0 24px 60px rgb(15 23 42 / 0.16);

  /* Transiciones */
  --transition-fast: 120ms ease;
  --transition-base: 180ms ease;
  --transition-slow: 260ms ease;

  /* Z-index */
  --z-header: 40;
  --z-dropdown: 50;
  --z-modal: 80;
  --z-toast: 100;
}

[data-theme="dark"] {
  color-scheme: dark;

  --color-bg: #020617;
  --color-surface: #0f172a;
  --color-surface-soft: #111827;
  --color-surface-raised: #1e293b;

  --color-text: #f8fafc;
  --color-text-muted: #cbd5e1;
  --color-text-soft: #94a3b8;

  --color-border: #1e293b;
  --color-border-strong: #334155;

  --color-primary: #60a5fa;
  --color-primary-hover: #93c5fd;
  --color-primary-soft: rgb(37 99 235 / 0.18);

  --color-secondary: #a78bfa;
  --color-secondary-soft: rgb(124 58 237 / 0.18);

  --color-accent: #fb923c;
  --color-accent-soft: rgb(249 115 22 / 0.18);

  --color-success: #4ade80;
  --color-success-soft: rgb(22 163 74 / 0.18);
  --color-warning: #fbbf24;
  --color-warning-soft: rgb(217 119 6 / 0.18);
  --color-danger: #f87171;
  --color-danger-soft: rgb(220 38 38 / 0.18);
  --color-info: #38bdf8;
  --color-info-soft: rgb(2 132 199 / 0.18);

  --shadow-xs: 0 1px 2px rgb(0 0 0 / 0.3);
  --shadow-sm: 0 4px 16px rgb(0 0 0 / 0.35);
  --shadow-md: 0 16px 40px rgb(0 0 0 / 0.45);
  --shadow-lg: 0 28px 80px rgb(0 0 0 / 0.55);
}
```

### 3.1 Preferencia de tema persistente

Cuando una web tenga selector de tema, debe seguir esta convención:

- Respetar `prefers-color-scheme` cuando no exista una preferencia guardada.
- Guardar solo valores explícitos `light` o `dark` en `localStorage`.
- Aplicar `data-theme` en `<html>` antes de renderizar la página para evitar parpadeo inicial.
- Mantener `<meta name="color-scheme" content="light dark">` para controles nativos del navegador.
- Usar un control accesible, traducido, con `aria-label`, estado `aria-pressed`, foco visible y tamaño cómodo en móvil.
- Definir colores, hover y focus mediante variables globales para conservar contraste en ambos modos.
- No añadir dependencias para alternar el tema.

---

## 4. Tipografía

### 4.1 Fuente base

Usar siempre fuente del sistema:

```css
body {
  font-family: var(--font-sans);
}
```

No usar:

```html
<link href="https://fonts.googleapis.com/..." rel="stylesheet">
```