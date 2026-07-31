# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A Home Assistant custom Lovelace card distributed via HACS (as a custom repository, not in the
default store). It's a UI layer over an existing Zaptec Go 2 EV charger automation setup: it reads
charger mode/price/power/current/energy sensors and calls the user's existing scripts and helpers
for start/schedule/cancel — it does not own the scheduling logic itself. The scheduled start still
relies on a server-side HA automation triggered by an `input_datetime` helper, since a browser-only
card can't guarantee firing an action if no dashboard is open at the scheduled time. The amp-limit
slider is the one control the card owns directly (`zaptec.limit_current`), since it's a live/manual
adjustment rather than something that needs to survive the browser being closed.

GitHub: https://github.com/briis/zaptec_charger_card

## Project structure

```
src/zaptec-charger-card.js  — single-source card (edit this)
dist/zaptec-charger-card.js — built output (committed, attached to releases)
dev-preview.html            — standalone browser harness for local dev
rollup.config.mjs           — bundles src → dist, minifies for production
hacs.json                   — HACS metadata (name, filename, render_readme)
.github/workflows/
  release.yml                — builds & publishes a GitHub release on vX.Y.Z tags
  validate.yml                — HACS validation on push/PR to main
```

## Dev environment

Runs inside a VS Code devcontainer (see `.devcontainer/`). The container is started automatically by VS Code.

**Port:** the dev server runs on **3000**.

```sh
npm start          # rollup --watch + serve on :3000 (run inside the container)
```

Open http://localhost:3000/dev-preview.html to preview the card live. Controls let you fake: charger
mode (disconnected / connected_requesting / connected_charging / connected_finished), the schedule
toggle, price, power, current, session energy, the scheduled time, theme, and language. Every
`hass.callService(...)` call the card makes is logged to the browser console and reflected back into
the fake state, so you can click through the actual start/schedule/cancel/stop/slider flows without a
real Home Assistant instance.

`docker-compose.yml` is an alternative entry point (maps `3000:3000`), but normal dev happens via the
VS Code devcontainer.

## Build

```sh
npm run build      # production bundle → dist/zaptec-charger-card.js
```

Rollup minifies for production and skips the inline source map. Always build before tagging a release.

## Releasing

```sh
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

The `release.yml` workflow fires on the tag, runs `npm ci && npm run build`, and attaches
`dist/zaptec-charger-card.js` to the GitHub release. No manual upload needed.

## Card architecture

Everything lives in **`src/zaptec-charger-card.js`** as a single ES module. No framework — plain
custom elements with shadow DOM.

Key pieces:

| Symbol | Purpose |
|---|---|
| `TRANSLATIONS` | i18n strings for `da` and `en`; follows `hass.language`. Also contains `editor_*` keys used to translate field labels in the UI editor. |
| `editorLabel(lang, name)` | Looks up an `editor_*` key from `TRANSLATIONS` for the given language; used by `computeLabel` in the editor. |
| `DEFAULTS` | Default entity IDs, script entity IDs, `device_id`, and amp slider bounds — all matching a typical Zaptec HA integration setup. |
| `STATE_COLORS` | Maps the 5 visual states to a color used by both the illustration LED and (implicitly) the status text. |
| `STYLES` | Shadow DOM CSS (light/dark theme via HA CSS custom properties), including the SVG illustration's state-driven animations (`state-disconnected/charging/scheduled/ready/finished`). |
| `ZaptecChargerCardEditor` | UI config editor — uses `ha-form` with `EDITOR_SCHEMA`. Field labels are translated automatically via `editorLabel`. |
| `ZaptecChargerCard` | The card itself; standard HA custom element API |

### HA card API surface

- `setConfig(config)` — merges with `DEFAULTS`, rebuilds DOM
- `set hass(hass)` — updates state display
- `getConfigElement()` — returns the `ha-form`-based editor element
- `getStubConfig()` — default config shown when card is added via UI
- `getLayoutOptions()` — declares preferred grid size (6 col, min 4×6, max 12 col)
- `getCardSize()` — returns `6`

### State machine

`_visualState(mode, scheduleEnabled)` computes one of 5 states with this precedence (mirrors the
Jinja template logic from the original hand-built dashboard):

1. `disconnected` — charger mode is `disconnected`
2. `charging` — charger mode is `connected_charging`
3. `finished` — charger mode is `connected_finished`
4. `scheduled` — the schedule-enabled helper is `on`
5. `ready` — none of the above

Button visibility is computed independently, directly from `mode`/`scheduleEnabled`, to exactly match
the original dashboard's conditional cards (see the table in `README.md`) — including the quirk where
Start now and Schedule start can both show simultaneously in the `finished` state, since that's what
the original YAML did.

### Actions → services

| Action | Service call |
|---|---|
| Start now / Schedule start / Cancel schedule buttons | `script.<object_id>` (derived from the configured `script_*` entity ID) — equivalent to how the original dashboard invoked scripts as their own service |
| Stop charging | `switch.turn_off` targeting `entity_charging_switch` |
| Schedule toggle button | `input_boolean.toggle` targeting `entity_schedule_enabled` |
| Time picker | `input_datetime.set_datetime` targeting `entity_schedule_time` |
| Amp slider | `zaptec.limit_current` with `device_id` + `available_current`, fired on `change` (not `input`) to avoid spamming calls while dragging |

### Illustration

A single inline SVG (`#illustration`) of a wall-mounted charger with an LED ring, a stripe, a
cable, and a connector. State is applied via `element.setAttribute('class', ...)` — **not**
`element.className = ...`, since `className` is read-only on `SVGElement` (a `TypeError` was hit
and fixed during initial development; don't regress this). CSS keyframes (`zc-pulse`, `zc-breathe`,
`zc-flow`) drive the charging/scheduled/ready animations; color comes from `STATE_COLORS` applied
inline to `stroke`/`fill` so the same markup works in both themes.

## Adding a language

1. Add a key block to `TRANSLATIONS` in `src/zaptec-charger-card.js` — copy the `en` block as a
   template. Include all status/action/editor keys.
2. Add a matching option to the `<select id="langSelect">` in `dev-preview.html`.

Language is detected automatically from `hass.language`; no config option is exposed to the user.
