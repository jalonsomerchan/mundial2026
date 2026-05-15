# Página de cuadro de eliminatorias

La página del cuadro del Mundial 2026 está localizada y se genera como página estática de Astro:

- Español: `/cuadro/`
- Inglés: `/en/bracket/`

## Datos y resolución de cruces

La página usa `getWorldCupSummary()` desde `src/data/worldcup2026.ts` y filtra los partidos sin `group` como eliminatorias.

Para evitar duplicar lógica con el simulador, los partidos se transforman con `getSimulatorMatches()` en `src/utils/simulator.ts` y el cuadro resuelve participantes mediante helpers compartidos de `src/scripts/simulator-model.ts`:

- puestos de grupo como `1A`, `2B` o `3A/B`,
- ganadores como `W102`,
- perdedores como `L102`,
- selecciones reales cuando ya estén disponibles en los datos.

Si un equipo real está disponible, se enlaza a su página de selección. Si el cruce sigue pendiente, se muestra el token de origen como texto no enlazado.

## Convenciones UI

La interfaz se divide en componentes pequeños:

- `WorldCupBracket.astro`: estructura de página, breadcrumbs, navegación por rondas y enlaces relacionados.
- `BracketRoundSection.astro`: sección de cada ronda.
- `BracketMatchCard.astro`: ficha accesible de partido.
- `BracketTeam.astro`: equipo real enlazado o placeholder de cruce pendiente.

Mantener los textos en `src/i18n/translations/*.json` y las rutas localizadas mediante `routes.bracket`.

## Tests

`tests/bracket.test.mjs` comprueba rutas, componentes, helpers compartidos, accesibilidad básica, traducciones y navegación desde el header.
