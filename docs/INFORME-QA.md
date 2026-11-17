# Informe QA — Embotelladora Cool Ice

**Rama:** `cursor/qa-audit-visual-a799`  
**Fecha:** 2026-11-17 (America/Bogota)  
**Producción auditada:** https://orozquiano.github.io/embotelladora-cool-ice/  
**Build local verificado:** `ng build --configuration=github-pages`

## Referencias visuales

| Referencia | Estado |
|---|---|
| Weatherglass (Claude artifact `3bhygX763cPdpcHQYmfrPk`) | Inspeccionada en sesión previa: líquidos, cascada de partículas, iluminación. Usada como inspiración de movimiento, no copiada. |
| Nature Aquarium (Claude artifact `N1cRTZqiUZyxDVP7dJGTau`) | **Inaccesible** en esta sesión (no se inventan características). |
| Grabación de escritorio del usuario | No disponible en este entorno. |

## A. Problemas confirmados y corrección

| ID | Sev | Hallazgo | Archivos | Solución |
|---|---|---|---|---|
| FORM-REQ | P0 | Pedido WhatsApp sin validación; abría chat vacío | `pedido-whatsapp.ts`, `seccion-contacto/*` | Validación CO teléfono, nombre, dirección, cantidad; `aria-invalid`/`aria-describedby`; `window.open` solo si válido |
| OX-m320 | P0 | Overflow horizontal 327>320 | `_sitio.scss`, `_base.scss` | `.contenido` con padding interno; `motivo-porron` contenido en viewport estrecho; paneles `max-width:100%`; se eliminó `overflow-x:hidden` del body como “parche” |
| OX-zoom | P1 | Overflow con zoom 200% | mismos estilos | Misma contención de layout |
| MENU-DUR | P1 | Menú ~800 ms y desbloqueo 780 ms | `_sitio.scss`, `encabezado.ts` | `--menu-duracion: 300ms`; desbloqueo 320 ms |
| CTA-FORM | P1 | CTA flotante podía tapar el formulario | `_sitio.scss` | Se oculta con `#contacto:focus-within` y safe-area |
| SEO-META | P1 | OG/Twitter relativos; sin canonical | `index.html`, `robots.txt`, `sitemap.xml` | URLs absolutas Pages + Schema.org |
| CONTENT-247 | P2 | Afirmación “24/7” sin confirmación | `sitio.ts` | Sustituido por “WhatsApp · Pedidos y domicilio” |
| CONTENT-PROC | P2 | Proceso presentado como ficha técnica cerrada | `sitio.ts`, `seccion-calidad` | Nota orientativa + tono comercial |
| PROD-IMG | P2 | Solo etiqueta sobre fondo blanco | `seccion-productos`, `sitio.ts` | Botellón oficial + etiqueta; fondo gradiente (sin rectángulo blanco agresivo) |

## B. Evidencias

- Antes: `/opt/cursor/artifacts/qa-audit/before-*.png`
- Después: `/opt/cursor/artifacts/qa-audit/after/*`
- Formulario inválido: `after/form-invalid.png`
- Overflow post-fix (m320): `scrollWidth - innerWidth = -7` (sin overflow positivo)

## C. Resultados de pruebas

| Suite | Resultado |
|---|---|
| `npm test` | **25/25** passed |
| `ng build --configuration=github-pages` | **OK** (345 kB initial; Three.js lazy) |
| Playwright E2E (`e2e/recorrido-principal.spec.ts`) | **6/6** passed |
| Lighthouse móvil (local, headless) | Perf **61**, A11y **96**, BP **100**, SEO **100**; LCP 4.3 s; CLS 0; TBT 840 ms |

Condiciones Lighthouse: Chromium headless + throttling lab, form-factor mobile, URL local con baseHref Pages. No son datos de campo RUM. Objetivo Perf ≥90 no alcanzado en lab (Three.js diferido + CPU simulado); CLS cumple; A11y/SEO/BP en meta.

## D. Cambios técnicos

- **Nueva utilidad** `src/app/contenido/pedido-whatsapp.ts` (+ spec)
- **Playwright** `@playwright/test` + `playwright.config.ts` + `e2e/`
- **Sin nuevas deps de runtime** (Three.js ya existía)
- Animaciones de agua previas conservadas con fallbacks/`prefers-reduced-motion`
- Riesgo residual: foto `botellon-dispensador.webp` es de baja resolución; conviene sustituir por toma comercial oficial más nítida

## E. Criterios de aceptación

- [x] Formulario bloquea inválidos y abre WhatsApp solo con datos válidos
- [x] Sin overflow horizontal en 320–1920 verificado
- [x] Menú más ágil (300 ms) con Escape y foco
- [x] SEO/canonical/OG absolutos + robots/sitemap
- [x] Contenido sin claim 24/7; proceso con nota de alcance
- [x] PR listo en rama `cursor/qa-audit-visual-a799`
