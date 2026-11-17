# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A Home Assistant custom Lovelace card distributed via HACS (as a custom repository, not in the
default store) for a Zaptec Go 2 EV charger. Since v2 it is self-contained: it auto-detects the Zaptec
integration's entities, calls the Zaptec services directly for start/stop/amp limit, and owns the
scheduled start through **one card-managed automation** that it writes via HA's automation config API
(`POST config/automation/config/<id>`). The automation is needed because a browser-only card can't
guarantee firing an action at the scheduled time if no dashboard is open.

The v1 setup (3 helpers, 3 scripts, 3 automations) still works as **legacy mode**: active when
`entity_schedule_enabled` is set in the user's config *and* that entity exists.

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
mode, whether the schedule automation exists / is on / off, the Authorized sensor, admin vs non-admin
user, price, power, per-phase current, session energy, theme, and language. The harness provides a fake
`hass.entities`/`hass.devices` registry (one installation + one charger device in the same config
entry) so auto-detection runs as on a real install. Every `hass.callService(...)` and
`hass.callApi(...)` call is logged to the browser console and reflected back into the fake state
(`callApi` creates the fake automation after a short delay, like HA's reload), so you can click through
the start/schedule/cancel/stop/slider flows without a real Home Assistant instance.
`window.__automations` holds the automation config the card wrote.

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
| `DEFAULTS` | Default config. Entity roles default to `null` (= auto-detect); legacy helper/script keys default to `null`. |
| `ENTITY_MATCHERS` / `PHASE_CURRENT_MATCHER` | How each entity role is found among `platform: zaptec` registry entries: `translation_key` first, then entity_id suffix, scoped to the charger or installation device. |
| `STATE_COLORS` | Maps the 5 visual states to a color used by both the illustration LED and (implicitly) the status text. |
| `STYLES` | Shadow DOM CSS (light/dark theme via HA CSS custom properties), including the SVG illustration's state-driven animations (`state-disconnected/charging/scheduled/ready/finished`). |
| `ZaptecChargerCardEditor` | UI config editor — uses `ha-form` with `editorSchema(lang)` (expandable sections for car tiles, entity overrides and legacy fields; cleared fields are dropped from the config so they fall back to auto-detect). Field labels are translated automatically via `editorLabel`. |
| `ZaptecChargerCard` | The card itself; standard HA custom element API |

### HA card API surface

- `setConfig(config)` — merges with `DEFAULTS`, rebuilds DOM
- `set hass(hass)` — updates state display
- `getConfigElement()` — returns the `ha-form`-based editor element
- `getStubConfig()` — `{}`; nothing needs filling in
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

### Entity resolution

`_resolve()` runs on every `hass` update but is cached on the identity of `hass.entities`. It finds
the installation device (configured `device_id`, else the device owning the `*_available_current`
number), scopes candidates to the configured `charger_device_id` or else to the installation's config
entry, and matches each role. `_ent(role)` returns explicit config first, then the detected entity.
Without `hass.entities` (old frontends) it falls back to suffix matching over `hass.states`. Note the
installation also has `sensor.*_available_current_phase_N` — `PHASE_CURRENT_MATCHER.exclude` keeps
those out of the live-current calculation.

### Schedule automation

- id `zaptec_charger_card_schedule_<schedule_id || installation device id>`; found in `hass.states`
  by `attributes.id`.
- The time lives in the alias (`… scheduled start HH:MM`) so non-admins can read it from the entity's
  `friendly_name` — `config/automation/config` reads need admin.
- Its on/off state is the "schedule enabled" state.
- On fire: `limit_current` → max, authorize if needed, then `automation.turn_off` on itself with
  `stop_actions: false` (the default `true` would abort its own run). A second trigger (charger mode →
  `disconnected`) just turns it off.
- `_saveSchedule(time, enabled)` skips the write when the time is unchanged (so non-admins can still
  toggle), otherwise POSTs, then **waits until the reloaded entity shows the new time** before
  `turn_on`/`turn_off` — the reload is async and would otherwise restore the old state.
- Writing needs admin; the time input is disabled for non-admins.

### Actions → services (built-in mode)

| Action | Service call |
|---|---|
| Start now | turn schedule automation off → `zaptec.limit_current` (max) → 2 s → `button.press` authorize if mode is `connected_requesting` and *Authorized* is off |
| Schedule start | `zaptec.limit_current` (0) → 2 s → authorize (same rule) → `_saveSchedule(time, true)` |
| Cancel schedule | `automation.turn_off` |
| Stop charging | `switch.turn_off` on the charging switch |
| Schedule toggle | `automation.toggle` (or create+enable if missing) |
| Time picker | `_saveSchedule(time, currentEnabled)` |
| Amp slider | `zaptec.limit_current` with `device_id` + `available_current`, fired on `change` (not `input`) |

In legacy mode the buttons call the configured `script.*`, the toggle `input_boolean.toggle` and the
time picker `input_datetime.set_datetime`, exactly as v1. All actions go through `_guard()`, which
blocks double taps (buttons disabled while busy) and shows failures as an HA toast
(`hass-notification`).

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
