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

- `WorldCupBracket.astro`: estructura de página, breadcrumbs, navegación por rondas, tablero gráfico, lista accesible y enlaces relacionados.
- `BracketBoard.astro`: tablero gráfico desplazable con zoom, arrastre táctil/ratón y navegación por teclado.
- `BracketRoundSection.astro`: sección de cada ronda para la lista accesible y SEO.
- `BracketMatchCard.astro`: ficha accesible de partido, con variante compacta para el tablero.
- `BracketTeam.astro`: equipo real enlazado o placeholder de cruce pendiente.

La primera ronda debe mostrarse como `Ronda de 32` en español. Aunque equivale a dieciseisavos por número de partidos, este texto evita confusión cuando todavía no hay equipos clasificados ni partidos jugados.

Mantener los textos en `src/i18n/translations/*.json` y las rutas localizadas mediante `routes.bracket`.

## Interacción del tablero

El tablero gráfico debe poder usarse con:

- Arrastre con ratón o dedo para moverse.
- Botones de zoom para ampliar, reducir y restablecer.
- Rueda del ratón con `Ctrl` o `Cmd` para zoom.
- Teclado: flechas para desplazarse, `+` y `-` para zoom y `0` para restablecer.

Debe mantenerse una lista HTML por rondas debajo del tablero para accesibilidad, SEO y usuarios que prefieran una lectura lineal.

## Tests

`tests/bracket.test.mjs` comprueba rutas, componentes, helpers compartidos, accesibilidad básica, traducciones, navegación desde el header, etiqueta `Ronda de 32` y controles de tablero gráfico.
