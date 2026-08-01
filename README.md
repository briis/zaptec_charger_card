# Zaptec Go 2 Charger Card

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card for managing a Zaptec Go 2 EV charger — start, schedule, throttle and monitor charging from a single card with an animated illustration of the charger as its centerpiece.

![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)

---

## Features

- Animated CSS/SVG illustration of the Zaptec Go 2 whose glow color and animation reflect the charger's state (disconnected, ready, scheduled, charging, finished)
- Live stats: price, power (kW), current (A), and session energy charged (kWh)
- Amp-limit slider that calls `zaptec.limit_current` directly
- Start now / schedule start / cancel schedule / stop charging actions
- Time picker + toggle for the scheduled start time
- Adapts to Home Assistant light and dark themes
- Supports **Danish** and **English** (follows the HA language setting)

This card is a **UI layer**, not a replacement for automations. Scheduled charging still relies on a
server-side Home Assistant automation triggered by an `input_datetime` helper — this keeps the
scheduled start reliable even when no browser has the dashboard open. See [Requirements](#requirements).

---

## Screenshots

**Light theme**

![Zaptec Go 2 Charger Card, no car connected, light theme](https://raw.githubusercontent.com/briis/zaptec_charger_card/main/images/zaptec_card_no_car_light.png)

**Dark theme**

![Zaptec Go 2 Charger Card, no car connected, dark theme](https://raw.githubusercontent.com/briis/zaptec_charger_card/main/images/zaptec_card_no_car_dark.png)

More screenshots (active charging, scheduled start, finished) will be added once a car is connected.

---

## Requirements

The card is a **UI layer only** — it does not create automations, scripts, or helpers for you. It calls
entities and services that need to already exist in your Home Assistant setup. This section gives you
everything needed to build that backend from scratch, matching what the card expects by default (you
can point every entity at something else via the visual editor, but the shape of the automation/script
setup below is what makes the scheduled start reliable).

### 1. The Zaptec integration

Install the [Zaptec HA integration](https://github.com/custom-components/zaptec). It provides (entity
names vary by installation — yours may not say `ev_ev_charger`):

- `sensor.<charger>_charger_mode` — `disconnected` / `connected_requesting` / `connected_charging` / `connected_finished`
- `switch.<charger>_charging`
- `button.<charger>_authorize_charging` / `button.<charger>_deauthorize_charging`
- `sensor.<charger>_charger_power`, `sensor.<charger>_charger_current`, `sensor.<charger>_session_total_charge`
- Two Zaptec **devices** per charger — the charging circuit and the charger itself often have
  *different* device IDs. Find both under **Settings → Devices & services → Zaptec**, or by opening
  **Developer tools → Actions**, picking `zaptec.limit_current` / `zaptec.authorize_charging`, and
  using the device picker to see which device each service expects.

### 2. Helpers

Create these under **Settings → Devices & services → Helpers → Create helper**:

| Helper | Type | Notes |
|---|---|---|
| `input_boolean.zaptec_is_authorized` | Toggle | Tracks whether the charger is currently authorized |
| `input_boolean.zaptec_scheduled_charge_enabled` | Toggle | Tracks whether a scheduled start is pending |
| `input_datetime.zaptec_scheduled_start_time` | Date and/or time → **Time only** | Backing entity for the card's time picker |

Equivalent YAML (`configuration.yaml`), if you prefer helpers as code:

```yaml
input_boolean:
  zaptec_is_authorized:
    name: Zaptec Is Authorized
    icon: mdi:ev-station
  zaptec_scheduled_charge_enabled:
    name: Zaptec Scheduled Charge Enabled
    icon: mdi:car-clock

input_datetime:
  zaptec_scheduled_start_time:
    name: Zaptec Scheduled Start Time
    has_date: false
    has_time: true
```

### 3. Scripts

Create three scripts under **Settings → Automations & scenes → Scripts**. Replace the `device_id`
values with your own (see [step 1](#1-the-zaptec-integration) — `limit_current` and
`authorize_charging` may need different device IDs) and the entity IDs with yours.

**`script.zaptec_start_charging_now`** — set current to max and authorize immediately:

```yaml
alias: Zaptec - Start charging now
description: Set charger current to 16A and authorize charging immediately
sequence:
  - action: input_boolean.turn_off
    target:
      entity_id: input_boolean.zaptec_scheduled_charge_enabled
  - action: zaptec.limit_current
    data:
      device_id: <circuit_device_id>
      available_current: 16
  - delay:
      seconds: 2
  - if:
      - condition: state
        entity_id: sensor.ev_ev_charger_charger_mode
        state: connected_requesting
    then:
      - if:
          - condition: state
            entity_id: input_boolean.zaptec_is_authorized
            state: "off"
        then:
          - action: button.press
            target:
              entity_id: button.ev_ev_charger_authorize_charging
          - action: zaptec.authorize_charging
            data:
              device_id: <charger_device_id>
            enabled: false
          - action: input_boolean.turn_on
            target:
              entity_id: input_boolean.zaptec_is_authorized
```

**`script.zaptec_schedule_charging`** — hold at 0A, authorize, and wait for the scheduled time:

```yaml
alias: Zaptec - Schedule charging
description: >-
  Hold charging by setting current to 0A, authorize, and wait for scheduled
  start time
sequence:
  - action: zaptec.limit_current
    data:
      device_id: <circuit_device_id>
      available_current: 0
  - delay:
      seconds: 2
  - if:
      - condition: state
        entity_id: sensor.ev_ev_charger_charger_mode
        state: connected_requesting
    then:
      - if:
          - condition: state
            entity_id: input_boolean.zaptec_is_authorized
            state: "off"
        then:
          - action: button.press
            target:
              entity_id: button.ev_ev_charger_authorize_charging
          - action: zaptec.authorize_charging
            data:
              device_id: <charger_device_id>
            enabled: false
          - action: input_boolean.turn_on
            target:
              entity_id: input_boolean.zaptec_is_authorized
  - action: input_boolean.turn_on
    target:
      entity_id: input_boolean.zaptec_scheduled_charge_enabled
```

**`script.zaptec_cancel_scheduled_charging`** — cancel a pending scheduled start without charging:

```yaml
alias: Zaptec - Cancel scheduled charging
description: Cancel pending scheduled charging without starting charging
icon: mdi:ev-station
sequence:
  - action: input_boolean.turn_off
    target:
      entity_id: input_boolean.zaptec_scheduled_charge_enabled
```

### 4. Automations

Create these under **Settings → Automations & scenes → Automations**. The third one is what makes
scheduled charging reliable even when no dashboard is open — it's a server-side trigger on the
`input_datetime` helper, not something the card does itself in the browser.

**Reset "authorized" when the cable is unplugged or deauthorized:**

```yaml
alias: Set Zaptec Authorized Helper to off, when cable is disconnected
description: >-
  If the EV Charger cable is disconnected or the Deauthorize button is
  pressed, set the Input Boolean 'Zaptec Is Authorized' to Off
triggers:
  - trigger: state
    entity_id:
      - sensor.ev_ev_charger_charger_mode
    to:
      - disconnected
  - trigger: state
    entity_id:
      - button.ev_ev_charger_deauthorize_charging
    to: null
conditions: []
actions:
  - action: input_boolean.turn_off
    target:
      entity_id: input_boolean.zaptec_is_authorized
mode: single
```

**Turn off the schedule flag once charging finishes:**

```yaml
alias: Turn Off Zaptec Scheduled Charge when charging is completed
triggers:
  - trigger: state
    entity_id:
      - sensor.ev_ev_charger_charger_mode
    to:
      - connected_finished
conditions: []
actions:
  - action: input_boolean.turn_off
    target:
      entity_id: input_boolean.zaptec_scheduled_charge_enabled
mode: single
```

**Fire the scheduled start at the configured time:**

```yaml
alias: Zaptec - Run scheduled charging start
description: Start charging when the selected helper time is reached
triggers:
  - trigger: time
    at: input_datetime.zaptec_scheduled_start_time
conditions:
  - condition: state
    entity_id: input_boolean.zaptec_scheduled_charge_enabled
    state: "on"
actions:
  - action: zaptec.limit_current
    data:
      device_id: <circuit_device_id>
      available_current: 16
mode: single
```

### 5. Point the card at your entities

Once the above exists, add the card and either accept its defaults (if you matched the entity IDs
above) or open the visual editor and map each field to your own entities/scripts/device. See
[Configuration](#configuration) for the full list.

---

## Installation

### Via HACS (recommended)

1. Open **HACS** in Home Assistant.
2. Go to **Frontend** → click the three-dot menu → **Custom repositories**.
3. Add `https://github.com/briis/zaptec_charger_card` with category **Lovelace**.
4. Find **Zaptec Go 2 Charger Card** in the list and click **Download**.
5. Reload your browser.

### Manual

1. Download `zaptec-charger-card.js` from the [latest release](https://github.com/briis/zaptec_charger_card/releases/latest).
2. Copy it to `/config/www/zaptec_charger_card/zaptec-charger-card.js`.
3. In Home Assistant go to **Settings → Dashboards → Resources** and add:
   ```
   URL:  /local/zaptec_charger_card/zaptec-charger-card.js
   Type: JavaScript module
   ```
4. Reload your browser.

---

## Configuration

Add the card via the UI card picker (**Zaptec Go 2 Charger Card**) or paste the YAML directly. Every option below has a default matching a typical Zaptec HA integration setup, and can be overridden through the visual editor.

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | string | — | `custom:zaptec-charger-card` |
| `entity_charger_mode` | string | `sensor.ev_ev_charger_charger_mode` | Drives the state machine (`disconnected` / `connected_requesting` / `connected_charging` / `connected_finished`) |
| `entity_charging_switch` | string | `switch.ev_ev_charger_charging` | Used by the Stop charging button |
| `entity_authorize_button` | string | `button.ev_ev_charger_authorize_charging` | Referenced by your authorize script flow |
| `entity_deauthorize_button` | string | `button.ev_ev_charger_deauthorize_charging` | Referenced by your deauthorize automation |
| `entity_is_authorized` | string | `input_boolean.zaptec_is_authorized` | Authorized-state helper |
| `entity_schedule_enabled` | string | `input_boolean.zaptec_scheduled_charge_enabled` | Schedule-active helper, toggled by the card's schedule button |
| `entity_schedule_time` | string | `input_datetime.zaptec_scheduled_start_time` | Backing entity for the time picker |
| `entity_price` | string | `sensor.stromligning_current_price_vat` | Live electricity price |
| `entity_session_energy` | string | `sensor.ev_ev_charger_session_total_charge` | kWh charged this session |
| `entity_power` | string | `sensor.ev_ev_charger_charger_power` | Live power draw (kW) |
| `entity_current` | string | `sensor.ev_ev_charger_charger_current` | Live current draw (A) |
| `device_id` | string | — | Zaptec charger device, passed to `zaptec.limit_current` calls made by the amp slider. In the visual editor this is a device picker (filtered to the Zaptec integration), not a manual ID field. |
| `script_start_now` | string | `script.zaptec_start_charging_now` | Run when "Start now" is tapped |
| `script_schedule` | string | `script.zaptec_schedule_charging` | Run when "Schedule start" is tapped |
| `script_cancel_schedule` | string | `script.zaptec_cancel_scheduled_charging` | Run when "Cancel scheduled start" is tapped |
| `min_current` | number | `6` | Amp slider minimum |
| `max_current` | number | `16` | Amp slider maximum |
| `title` | string | `Zaptec Go 2` | Card title |
| `left_soc_entity` | string | — | Optional sensor (%) shown left of the illustration, e.g. a car's battery state of charge. Hidden when unset. |
| `left_soc_name` | string | — | Label shown under the left sensor's value |
| `left_soc_icon` | string | `mdi:car-electric` | Icon for the left sensor |
| `left_soc_image` | string | — | Optional image URL/path (e.g. `/local/car.png`) for the left sensor. Overrides `left_soc_icon` when set. |
| `left_soc_color` | string | `#03a9f4` | Icon color for the left sensor (any CSS color); ignored when `left_soc_image` is set |
| `right_soc_entity` | string | — | Optional sensor (%) shown right of the illustration. Hidden when unset. |
| `right_soc_name` | string | — | Label shown under the right sensor's value |
| `right_soc_icon` | string | `mdi:car-electric` | Icon for the right sensor |
| `right_soc_image` | string | — | Optional image URL/path (e.g. `/local/car.png`) for the right sensor. Overrides `right_soc_icon` when set. |
| `right_soc_color` | string | `#03a9f4` | Icon color for the right sensor (any CSS color); ignored when `right_soc_image` is set |

### Example

```yaml
type: custom:zaptec-charger-card
entity_charger_mode: sensor.ev_ev_charger_charger_mode
entity_charging_switch: switch.ev_ev_charger_charging
entity_schedule_enabled: input_boolean.zaptec_scheduled_charge_enabled
entity_schedule_time: input_datetime.zaptec_scheduled_start_time
entity_price: sensor.stromligning_current_price_vat
entity_session_energy: sensor.ev_ev_charger_session_total_charge
entity_power: sensor.ev_ev_charger_charger_power
entity_current: sensor.ev_ev_charger_charger_current
device_id: e58b0e3a8d33fc6560c8c7f4537bc120
min_current: 6
max_current: 16
title: Zaptec Go 2
```

---

## Button visibility rules

The action buttons follow the same precedence as a typical hand-built Zaptec dashboard:

| Button | Shown when |
|---|---|
| Start now | mode is not `disconnected` and not `connected_charging` |
| Schedule start | mode is not `disconnected`/`connected_charging`, and the schedule is not already enabled |
| Stop charging | mode is `connected_charging` |
| Cancel scheduled start | mode is not `connected_charging`, and the schedule is enabled |

---

## Grid layout

| Property | Value |
|---|---|
| Default columns | 6 |
| Minimum | 4 × 6 |
| Maximum columns | 12 |

---

## License

[MIT](LICENSE)
