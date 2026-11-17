# Changelog

All notable changes to this card are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [2.0.0] - Unreleased

The card is now self-contained: no helpers, scripts or automations to create yourself.
Existing v1 setups keep working unchanged (see *Upgrading* below).

### Added

- **Entity auto-detection.** The card finds the Zaptec integration's entities in the entity registry:
  charger mode, charging switch, authorize button, *Authorized* sensor, session energy, charge power,
  phase currents and the installation's *Available current*. It also finds the installation device
  used for `zaptec.limit_current`. Every entity can still be overridden in the editor.
- **Built-in actions.** *Start now*, *Schedule start* and *Cancel scheduled start* call the Zaptec
  services directly, with no scripts. The authorize check uses the integration's own *Authorized*
  sensor.
- **Card-managed schedule.** The first time an administrator uses the schedule, the card creates a
  time helper (*Zaptec Charger Card schedule time*) and an automation
  (*Zaptec Charger Card – scheduled start*).
  - The automation fires at the helper's time, even with no dashboard open.
  - It runs once, then switches itself off. Unplugging the car also cancels it.
  - After the first setup, every user (admin or not) can change the time, schedule, cancel and toggle.
- When an admin opens the card, it updates the schedule automation if the card's settings changed
  (for example *Maximum current*).
- **Own charger icon or image.** New `charger_icon` and `charger_image` options replace the built-in
  drawing. They keep the state-colored glow and animations.
- New options: `charger_device_id`, `entity_authorized`, `entity_available_current`, `schedule_id`.
- Errors from service calls show as a Home Assistant toast. Buttons are disabled while an action runs,
  so a double tap does nothing.
- README: setup guide for the first run, troubleshooting, and upgrade guide.

### Changed

- The amp slider follows the installation's *Available current* setting instead of the measured
  current.
- *Current* shows the highest of the three phase currents when there's no single current sensor.
- The card editor puts the Zaptec device pickers first. Car tiles, entity overrides and legacy fields
  are in collapsible sections. Clearing a field falls back to auto-detection.
- A new card starts with an empty config (`getStubConfig()` returns `{}`).

### Removed

- The hard-coded default `device_id` and the default entity ids for helpers and scripts.
  Configs that set them explicitly are unaffected. Without them, the card auto-detects.

### Upgrading

- If your config has `entity_schedule_enabled` pointing at an existing helper, the card runs in
  **legacy mode** and behaves exactly as in 1.x.
- To switch to the built-in logic, clear the *Legacy helpers & scripts* fields in the editor and do the
  first-run setup as an administrator. Then you can delete the old helpers, scripts and automations.
  See the README.

## [1.0.1] - 2026-08-01

### Changed

- The car tile image fields in the card editor are now plain URL/path text fields (e.g. `/local/car.png`)
  instead of the image upload selector.

## [1.0.0] - 2026-08-01

### Added

- First release: animated Zaptec Go 2 illustration, price/power/current/energy stats, amp-limit slider,
  start/schedule/cancel/stop actions, schedule time picker and toggle, optional car battery tiles with
  icon or image, light/dark theme, Danish and English.

[2.0.0]: https://github.com/briis/zaptec_charger_card/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/briis/zaptec_charger_card/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/briis/zaptec_charger_card/releases/tag/v1.0.0
