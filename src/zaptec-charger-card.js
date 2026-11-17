/**
 * Zaptec Go 2 Charger Card
 * Self-contained: auto-detects the Zaptec integration's entities, calls the
 * Zaptec services directly for start / stop / amp limit, and keeps the
 * scheduled start in one card-managed automation (so it fires server-side
 * even with no dashboard open). The v1 helper/script setup still works: if
 * entity_schedule_enabled is configured and exists, the card runs in legacy
 * mode.
 */

const TRANSLATIONS = {
  da: {
    title:               'Zaptec Go 2',
    status_disconnected: 'Ingen bil tilsluttet',
    status_charging:     'Oplader nu',
    status_finished:      'Opladning færdig',
    status_scheduled:    'Opladning planlagt',
    status_ready:        'Klar til opladning',
    secondary_disconnected: 'Tilslut bilen for at starte opladning',
    secondary_charging_full: 'Strømpris: {price} kr/kWh · Opladet: {charged} kWh',
    secondary_charging:      'Opladning er i gang',
    secondary_finished_full: 'Opladet i session: {charged} kWh',
    secondary_finished:      'Opladning er afsluttet',
    secondary_scheduled:     'Starter automatisk kl. {time}',
    secondary_ready:         'Klar til at starte nu eller kl. {time}',
    price:               'Strømpris',
    power:               'Effekt',
    current:             'Strøm',
    energy:              'Opladet',
    amp_limit:           'Ladestrøm',
    schedule_time:       'Planlagt start',
    schedule_toggle_on:  'Planlægning aktiv',
    schedule_toggle_off: 'Planlægning slået fra',
    start_now:           'Start nu',
    start_now_desc:      'Autoriser og oplad med det samme',
    schedule_start:      'Planlæg start',
    schedule_start_desc: 'Vent til valgt tidspunkt',
    stop_charging:       'Stop opladning',
    stop_charging_desc:  'Stop opladning med det samme',
    cancel_schedule:     'Annuller planlagt start',
    cancel_schedule_desc: 'Stop den planlagte opladning',
    editor_entity_charger_mode:      'Charger mode sensor',
    editor_entity_charging_switch:   'Charging switch',
    editor_entity_authorize_button:  'Authorize button',
    editor_entity_deauthorize_button: 'Deauthorize button',
    editor_entity_is_authorized:     'Authorized helper (input_boolean)',
    editor_entity_schedule_enabled:  'Schedule enabled helper (input_boolean)',
    editor_entity_schedule_time:     'Schedule time helper (input_datetime)',
    editor_entity_price:             'Price sensor',
    editor_entity_session_energy:    'Session energy sensor',
    editor_entity_power:             'Power sensor',
    editor_entity_current:           'Current sensor',
    editor_device_id:                'Zaptec installation (auto-detected)',
    editor_script_start_now:         'Start now script',
    editor_script_schedule:          'Schedule script',
    editor_script_cancel_schedule:   'Cancel schedule script',
    editor_min_current:              'Minimum current (A)',
    editor_max_current:              'Maximum current (A)',
    editor_title:                    'Card title',
    editor_charger_icon:             'Charger icon (optional, replaces the built-in drawing)',
    editor_charger_image:            'Charger image URL (optional, overrides the icon)',
    editor_left_soc_entity:          'Left car battery sensor (optional)',
    editor_left_soc_name:            'Left car name',
    editor_left_soc_icon:            'Left car icon',
    editor_left_soc_image:           'Left car image URL (optional, overrides icon)',
    editor_left_soc_color:           'Left car icon color',
    editor_right_soc_entity:         'Right car battery sensor (optional)',
    editor_right_soc_name:           'Right car name',
    editor_right_soc_icon:           'Right car icon',
    editor_right_soc_image:          'Right car image URL (optional, overrides icon)',
    editor_right_soc_color:          'Right car icon color',
    schedule_admin_only: 'Planlægningen skal sættes op én gang af en administrator',
    action_failed:       'Zaptec-kortet: handlingen fejlede ({error})',
    editor_charger_device_id:        'Zaptec charger (optional, auto-detected)',
    editor_entity_authorized:        'Authorized sensor (auto-detected)',
    editor_entity_available_current: 'Available current (auto-detected)',
    editor_schedule_id:              'Schedule ID (only needed for several cards per charger)',
    editor_section_entities:         'Entities (auto-detected — override only if needed)',
    editor_section_cars:             'Car battery tiles',
    editor_section_legacy:           'Legacy helpers & scripts (v1 setup)',
  },
  en: {
    title:               'Zaptec Go 2',
    status_disconnected: 'No car connected',
    status_charging:     'Charging now',
    status_finished:      'Charging finished',
    status_scheduled:    'Charging scheduled',
    status_ready:        'Ready to charge',
    secondary_disconnected: 'Connect the car to start charging',
    secondary_charging_full: 'Price: {price} kr/kWh · Charged: {charged} kWh',
    secondary_charging:      'Charging in progress',
    secondary_finished_full: 'Charged this session: {charged} kWh',
    secondary_finished:      'Charging has finished',
    secondary_scheduled:     'Starts automatically at {time}',
    secondary_ready:         'Ready to start now or at {time}',
    price:               'Price',
    power:               'Power',
    current:             'Current',
    energy:              'Charged',
    amp_limit:           'Charge current',
    schedule_time:       'Scheduled start',
    schedule_toggle_on:  'Schedule active',
    schedule_toggle_off: 'Schedule off',
    start_now:           'Start now',
    start_now_desc:      'Authorize and charge immediately',
    schedule_start:      'Schedule start',
    schedule_start_desc: 'Wait until the selected time',
    stop_charging:       'Stop charging',
    stop_charging_desc:  'Stop charging immediately',
    cancel_schedule:     'Cancel scheduled start',
    cancel_schedule_desc: 'Stop the scheduled charge',
    editor_entity_charger_mode:      'Charger mode sensor',
    editor_entity_charging_switch:   'Charging switch',
    editor_entity_authorize_button:  'Authorize button',
    editor_entity_deauthorize_button: 'Deauthorize button',
    editor_entity_is_authorized:     'Authorized helper (input_boolean)',
    editor_entity_schedule_enabled:  'Schedule enabled helper (input_boolean)',
    editor_entity_schedule_time:     'Schedule time helper (input_datetime)',
    editor_entity_price:             'Price sensor',
    editor_entity_session_energy:    'Session energy sensor',
    editor_entity_power:             'Power sensor',
    editor_entity_current:           'Current sensor',
    editor_device_id:                'Zaptec installation (auto-detected)',
    editor_script_start_now:         'Start now script',
    editor_script_schedule:          'Schedule script',
    editor_script_cancel_schedule:   'Cancel schedule script',
    editor_min_current:              'Minimum current (A)',
    editor_max_current:              'Maximum current (A)',
    editor_title:                    'Card title',
    editor_charger_icon:             'Charger icon (optional, replaces the built-in drawing)',
    editor_charger_image:            'Charger image URL (optional, overrides the icon)',
    editor_left_soc_entity:          'Left car battery sensor (optional)',
    editor_left_soc_name:            'Left car name',
    editor_left_soc_icon:            'Left car icon',
    editor_left_soc_image:           'Left car image URL (optional, overrides icon)',
    editor_left_soc_color:           'Left car icon color',
    editor_right_soc_entity:         'Right car battery sensor (optional)',
    editor_right_soc_name:           'Right car name',
    editor_right_soc_icon:           'Right car icon',
    editor_right_soc_image:          'Right car image URL (optional, overrides icon)',
    editor_right_soc_color:          'Right car icon color',
    schedule_admin_only: 'The schedule has to be set up once by an administrator',
    action_failed:       'Zaptec card: action failed ({error})',
    editor_charger_device_id:        'Zaptec charger (optional, auto-detected)',
    editor_entity_authorized:        'Authorized sensor (auto-detected)',
    editor_entity_available_current: 'Available current (auto-detected)',
    editor_schedule_id:              'Schedule ID (only needed for several cards per charger)',
    editor_section_entities:         'Entities (auto-detected — override only if needed)',
    editor_section_cars:             'Car battery tiles',
    editor_section_legacy:           'Legacy helpers & scripts (v1 setup)',
  },
};

/*
 * Every entity is auto-detected from the Zaptec integration (see
 * ENTITY_MATCHERS), so these defaults are all null except where there's no
 * Zaptec entity to find (price) or a sensible numeric default.
 *
 * The entity_is_authorized / entity_schedule_* / script_* keys are only for
 * the v1 helper-based setup: if entity_schedule_enabled is set AND exists, the
 * card runs in legacy mode and behaves exactly like v1.
 */
const DEFAULTS = {
  device_id:                 null,  // Zaptec *installation* device (zaptec.limit_current)
  charger_device_id:         null,  // Zaptec *charger* device (only to disambiguate several chargers)
  entity_charger_mode:       null,
  entity_charging_switch:    null,
  entity_authorize_button:   null,
  entity_authorized:         null,
  entity_available_current:  null,
  entity_price:              'sensor.stromligning_current_price_vat',
  entity_session_energy:     null,
  entity_power:              null,
  entity_current:            null,
  schedule_id:               null,
  // legacy (v1) helper/script setup
  entity_deauthorize_button: null,
  entity_is_authorized:      null,
  entity_schedule_enabled:   null,
  entity_schedule_time:      null,
  script_start_now:          null,
  script_schedule:           null,
  script_cancel_schedule:    null,
  min_current:               6,
  max_current:               16,
  title:                     null,
  charger_icon:              null,  // e.g. mdi:ev-station — replaces the built-in SVG
  charger_image:             null,  // e.g. /local/charger.png — overrides charger_icon
  left_soc_entity:           null,
  left_soc_name:             '',
  left_soc_icon:             'mdi:car-electric',
  left_soc_image:            null,
  left_soc_color:            '#03a9f4',
  right_soc_entity:          null,
  right_soc_name:            '',
  right_soc_icon:            'mdi:car-electric',
  right_soc_image:           null,
  right_soc_color:           '#03a9f4',
};

/*
 * How each role is found among the Zaptec integration's entities: first by
 * the entity registry translation_key, then by entity_id suffix. `scope`
 * says which Zaptec device it lives on (the charger or the installation).
 */
const ENTITY_MATCHERS = {
  entity_charger_mode:      { domain: 'sensor',        scope: 'charger',      keys: ['charger_operation_mode', 'operation_mode', 'charger_mode'], suffixes: ['_charger_mode', '_operation_mode'] },
  entity_charging_switch:   { domain: 'switch',        scope: 'charger',      keys: ['charging'],                                                 suffixes: ['_charging'] },
  entity_authorize_button:  { domain: 'button',        scope: 'charger',      keys: ['authorize_charging'],                                       suffixes: ['_authorize_charging'] },
  entity_authorized:        { domain: 'binary_sensor', scope: 'charger',      keys: ['authorized', 'charger_current_user_uuid'],                  suffixes: ['_authorized', '_authorized_power'] },
  entity_session_energy:    { domain: 'sensor',        scope: 'charger',      keys: ['session_total_charge', 'session_energy'],                   suffixes: ['_session_total_charge'] },
  entity_power:             { domain: 'sensor',        scope: 'charger',      keys: ['charge_power', 'total_charge_power'],                       suffixes: ['_charge_power', '_charger_power', '_total_charge_power'] },
  entity_current:           { domain: 'sensor',        scope: 'charger',      keys: ['charger_current'],                                          suffixes: ['_charger_current'] },
  entity_available_current: { domain: 'number',        scope: 'installation', keys: ['available_current'],                                        suffixes: ['_available_current'] },
};

/* Fallback for the live current when there's no single "current" sensor: max of the three phases. */
const PHASE_CURRENT_MATCHER = {
  domain: 'sensor', scope: 'charger', keys: ['current_phase1', 'current_phase2', 'current_phase3'],
  suffixes: ['_current_phase_1', '_current_phase_2', '_current_phase_3'], exclude: ['available_current'],
};

const DEFAULT_SCHEDULE_TIME = '06:00';
const AUTOMATION_PREFIX     = 'zaptec_charger_card_schedule';
const AUTOMATION_ALIAS      = 'Zaptec Charger Card – scheduled start';
const HELPER_NAME           = 'Zaptec Charger Card schedule time';

/** JSON with sorted keys, to compare automation configs regardless of key order. */
const stableJson = v => JSON.stringify(v, (k, x) =>
  x && typeof x === 'object' && !Array.isArray(x)
    ? Object.fromEntries(Object.keys(x).sort().map(key => [key, x[key]]))
    : x);

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* visual state → color token, used by both the illustration and status dot */
const STATE_COLORS = {
  disconnected: '#8a8f98',
  charging:     '#4caf50',
  finished:     '#42a5f5',
  scheduled:    '#ffb300',
  ready:        '#4caf50',
};

const STYLES = `
  :host { display: block; height: 100%; }

  ha-card {
    height: 100%;
    padding: 16px 18px 18px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* -- Header -- */
  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  /* -- Illustration -- */
  .illustration-wrap {
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center;
    justify-items: center;
    gap: 6px;
    padding: 4px 0 2px;
  }
  .soc-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: 100%;
  }
  /* Explicit column assignments — without these, a hidden tile is removed
     from the grid's item list entirely and auto-placement shifts the
     illustration into column 1 instead of leaving it centered. */
  #soc-left      { grid-column: 1; }
  .illustration  { grid-column: 2; }
  .charger-alt   { grid-column: 2; }
  #soc-right     { grid-column: 3; }
  .soc-tile ha-icon { --mdc-icon-size: 40px; }
  .soc-tile .soc-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  .soc-tile .soc-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .soc-tile .soc-name {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    text-align: center;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .illustration {
    width: 96px;
    height: 130px;
    transition: opacity 0.6s ease;
  }
  .zc-body   { fill: #2b2f36; }
  .zc-stripe { fill: #3f4650; }
  .zc-cable  { stroke: #3f4650; stroke-width: 7; stroke-linecap: round; }
  .zc-connector rect { fill: #1c1f24; }
  .zc-connector circle { fill: #6b7280; }
  .zc-led-outer { fill: none; stroke-width: 5; transition: stroke 0.6s ease; }
  .zc-led-inner { transition: fill 0.6s ease; }

  .illustration.state-disconnected { opacity: 0.45; }
  .illustration.state-disconnected .zc-led-outer,
  .illustration.state-disconnected .zc-led-inner { stroke: #8a8f98; fill: #8a8f98; }

  .illustration.state-charging .zc-led-outer { animation: zc-pulse 1.6s ease-in-out infinite; }
  .illustration.state-charging .zc-cable { stroke-dasharray: 6 6; animation: zc-flow 1.1s linear infinite; }

  .illustration.state-scheduled .zc-led-outer { animation: zc-breathe 2.6s ease-in-out infinite; }

  .illustration.state-ready .zc-led-outer { animation: zc-breathe 3.4s ease-in-out infinite; }

  .illustration.state-finished .zc-led-outer { stroke-width: 6; }

  /* Custom charger icon / image: same state colour + animation language as the SVG. */
  .charger-alt {
    width: 96px;
    height: 130px;
    --zc-color: #8a8f98;
    transition: opacity 0.6s ease, filter 0.6s ease;
  }
  ha-icon.charger-alt {
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 88px;
    color: var(--zc-color);
  }
  img.charger-alt { object-fit: contain; }
  .charger-alt.state-disconnected { opacity: 0.45; filter: grayscale(1); }
  .charger-alt.state-charging     { animation: zc-glow 1.6s ease-in-out infinite; }
  .charger-alt.state-scheduled    { animation: zc-breathe 2.6s ease-in-out infinite; filter: drop-shadow(0 0 4px var(--zc-color)); }
  .charger-alt.state-ready        { animation: zc-breathe 3.4s ease-in-out infinite; filter: drop-shadow(0 0 4px var(--zc-color)); }
  .charger-alt.state-finished     { filter: drop-shadow(0 0 6px var(--zc-color)); }

  @keyframes zc-glow {
    0%, 100% { filter: drop-shadow(0 0 2px var(--zc-color)); }
    50%      { filter: drop-shadow(0 0 12px var(--zc-color)); }
  }
  @keyframes zc-pulse {
    0%, 100% { stroke-width: 5; filter: drop-shadow(0 0 2px currentColor); }
    50%      { stroke-width: 8; filter: drop-shadow(0 0 8px currentColor); }
  }
  @keyframes zc-breathe {
    0%, 100% { opacity: 0.55; }
    50%      { opacity: 1; }
  }
  @keyframes zc-flow {
    from { stroke-dashoffset: 24; }
    to   { stroke-dashoffset: 0; }
  }

  /* -- Status text -- */
  .status { text-align: center; }
  .status-primary {
    font-size: 17px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .status-secondary {
    font-size: 12.5px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  /* -- Stats grid -- */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 4px;
    border-radius: 10px;
    background: var(--secondary-background-color, rgba(120,120,120,0.08));
  }
  .stat ha-icon { --mdc-icon-size: 16px; color: var(--secondary-text-color); }
  .stat-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .stat-label {
    font-size: 9px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }

  /* -- Amp slider -- */
  .amp-row { display: flex; flex-direction: column; gap: 4px; }
  .amp-row-label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .amp-row input[type="range"] {
    width: 100%;
    accent-color: var(--primary-color, #03a9f4);
  }

  /* -- Schedule row -- */
  .schedule-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .schedule-row input[type="time"] {
    flex: 1;
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, rgba(120,120,120,0.3));
    background: var(--card-background-color, transparent);
    color: var(--primary-text-color);
    font-size: 13px;
  }
  .schedule-toggle {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: var(--secondary-background-color, rgba(120,120,120,0.08));
    color: var(--secondary-text-color);
  }
  .schedule-toggle.active {
    background: rgba(255,179,0,0.18);
    color: #ffb300;
  }
  .schedule-toggle ha-icon { --mdc-icon-size: 18px; }

  /* -- Action buttons -- */
  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
  }
  .action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    text-align: left;
    background: var(--secondary-background-color, rgba(120,120,120,0.08));
  }
  .action-btn ha-icon { --mdc-icon-size: 22px; flex-shrink: 0; }
  .action-btn .a-title { font-size: 13.5px; font-weight: 600; color: var(--primary-text-color); }
  .action-btn .a-desc   { font-size: 11px; color: var(--secondary-text-color); }
  .action-btn.green  ha-icon { color: #4caf50; }
  .action-btn.amber  ha-icon { color: #ffb300; }
  .action-btn.red    ha-icon { color: #ef5350; }
  .action-btn:disabled,
  .schedule-toggle:disabled { opacity: 0.5; cursor: default; }
  .schedule-row input[type="time"]:disabled { opacity: 0.6; }
  .hidden { display: none !important; }
`;

/* ---- UI Editor ---- */

const ENTITY_FIELDS = [
  ['entity_charger_mode',       'sensor'],
  ['entity_charging_switch',    'switch'],
  ['entity_authorize_button',   'button'],
  ['entity_authorized',         'binary_sensor'],
  ['entity_available_current',  'number'],
  ['entity_session_energy',     'sensor'],
  ['entity_power',              'sensor'],
  ['entity_current',            'sensor'],
];

const LEGACY_FIELDS = [
  ['entity_deauthorize_button', 'button'],
  ['entity_is_authorized',      'input_boolean'],
  ['entity_schedule_enabled',   'input_boolean'],
  ['entity_schedule_time',      'input_datetime'],
  ['script_start_now',          'script'],
  ['script_schedule',           'script'],
  ['script_cancel_schedule',    'script'],
];

const entitySel = ([name, domain]) => ({ name, required: false, selector: { entity: { domain } } });

function editorSchema(lang) {
  return [
    { name: 'device_id',         required: false, selector: { device: { integration: 'zaptec' } } },
    { name: 'charger_device_id', required: false, selector: { device: { integration: 'zaptec' } } },
    { name: 'entity_price',      required: false, selector: { entity: { domain: 'sensor' } } },
    { name: 'min_current', required: false, selector: { number: { min: 0, max: 32, step: 1, mode: 'box', unit_of_measurement: 'A' } } },
    { name: 'max_current', required: false, selector: { number: { min: 1, max: 32, step: 1, mode: 'box', unit_of_measurement: 'A' } } },
    { name: 'title', required: false, selector: { text: {} } },
    { name: 'charger_icon',  required: false, selector: { icon: {} } },
    { name: 'charger_image', required: false, selector: { text: {} } },
    {
      type: 'expandable', name: '', flatten: true, title: editorLabel(lang, 'section_cars'),
      schema: [
        { name: 'left_soc_entity',  required: false, selector: { entity: { domain: 'sensor' } } },
        { name: 'left_soc_name',    required: false, selector: { text: {} } },
        { name: 'left_soc_icon',    required: false, selector: { icon: {} } },
        { name: 'left_soc_image',   required: false, selector: { text: {} } },
        { name: 'left_soc_color',   required: false, selector: { text: {} } },
        { name: 'right_soc_entity', required: false, selector: { entity: { domain: 'sensor' } } },
        { name: 'right_soc_name',   required: false, selector: { text: {} } },
        { name: 'right_soc_icon',   required: false, selector: { icon: {} } },
        { name: 'right_soc_image',  required: false, selector: { text: {} } },
        { name: 'right_soc_color',  required: false, selector: { text: {} } },
      ],
    },
    {
      type: 'expandable', name: '', flatten: true, title: editorLabel(lang, 'section_entities'),
      schema: [
        ...ENTITY_FIELDS.map(entitySel),
        { name: 'schedule_id', required: false, selector: { text: {} } },
      ],
    },
    {
      type: 'expandable', name: '', flatten: true, title: editorLabel(lang, 'section_legacy'),
      schema: LEGACY_FIELDS.map(entitySel),
    },
  ];
}

function editorLabel(lang, name) {
  const key = TRANSLATIONS[lang] ? lang : (TRANSLATIONS[lang?.split('-')[0]] ? lang.split('-')[0] : 'en');
  const t = TRANSLATIONS[key] ?? TRANSLATIONS.en;
  return t[`editor_${name}`] ?? TRANSLATIONS.en[`editor_${name}`] ?? name;
}

class ZaptecChargerCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass   = null;
    this._form   = null;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass) return;

    if (!this._form) {
      this.shadowRoot.innerHTML = '<ha-form></ha-form>';
      this._form = this.shadowRoot.querySelector('ha-form');
      this._form.addEventListener('value-changed', e => {
        // Drop cleared fields so they fall back to auto-detection.
        const config = Object.fromEntries(
          Object.entries(e.detail.value).filter(([, v]) => v !== '' && v !== null && v !== undefined),
        );
        this.dispatchEvent(new CustomEvent('config-changed', {
          detail: { config },
          bubbles: true,
          composed: true,
        }));
      });
    }

    const lang = this._hass.language;

    this._form.hass         = this._hass;
    this._form.schema       = editorSchema(lang);
    this._form.data         = this._config;
    this._form.computeLabel = s => s.title ?? editorLabel(lang, s.name);
  }
}

customElements.define('zaptec-charger-card-editor', ZaptecChargerCardEditor);

/* ---- Card ---- */

class ZaptecChargerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config      = null;
    this._userConfig  = null;
    this._hass        = null;
    this._built       = false;
    this._sliderDirty = false;
    this._busy        = false;
    this._resolved    = null;   // { entities: {role: entity_id}, phases: [...], deviceId }
    this._resolvedKey = null;
    this._pendingTime = null;   // time picked before the schedule helper exists
    this._synced      = false;  // automation checked against the card's settings this session
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._userConfig = { ...config };
    this._config     = { ...DEFAULTS, ...config };
    this._built      = false;
    this._resolvedKey = null;
    this._synced      = false;
    this._buildDOM();
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._buildDOM();
    this._update();
  }

  getLayoutOptions() {
    return {
      grid_columns:     6,
      grid_rows:        'auto',
      grid_min_columns: 4,
      grid_min_rows:    6,
      grid_max_columns: 12,
    };
  }

  getCardSize() { return 6; }

  static getConfigElement() { return document.createElement('zaptec-charger-card-editor'); }

  // Nothing to fill in — every Zaptec entity is auto-detected.
  static getStubConfig() { return {}; }

  _langKey() {
    // hass.language is usually a bare code ("da"), but some setups report a
    // full locale ("da-DK") — fall back through the base subtag before
    // giving up and using English, so any HA language setting resolves to
    // the closest translation we ship instead of silently landing on en.
    const raw = (this._hass?.language || 'en').toLowerCase();
    if (TRANSLATIONS[raw]) return raw;
    const base = raw.split('-')[0];
    return TRANSLATIONS[base] ? base : 'en';
  }

  _t(key, vars) {
    const lang = this._langKey();
    let str = TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, v);
    return str;
  }

  _buildDOM() {
    if (!this._config) return;

    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <ha-card>
        <div class="header">
          <div class="card-title" id="card-title"></div>
        </div>

        <div class="illustration-wrap">
          <div class="soc-tile" id="soc-left">
            <ha-icon id="soc-left-icon"></ha-icon>
            <img class="soc-image hidden" id="soc-left-image" />
            <div class="soc-value" id="soc-left-value">—</div>
            <div class="soc-name" id="soc-left-name"></div>
          </div>

          <svg class="illustration" id="illustration" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
            <rect class="zc-body" x="40" y="10" width="120" height="170" rx="26"/>
            <circle class="zc-led-outer" id="led-outer" cx="100" cy="62" r="22"/>
            <circle class="zc-led-inner" id="led-inner" cx="100" cy="62" r="9"/>
            <rect class="zc-stripe" x="70" y="104" width="60" height="8" rx="4"/>
            <path class="zc-cable" d="M100,180 C58,202 58,232 100,242 C142,252 152,220 122,214" fill="none"/>
            <g class="zc-connector">
              <rect x="108" y="204" width="28" height="24" rx="6"/>
              <circle cx="116" cy="212" r="2"/>
              <circle cx="128" cy="212" r="2"/>
              <circle cx="122" cy="220" r="2"/>
            </g>
          </svg>
          <ha-icon class="charger-alt hidden" id="charger-icon"></ha-icon>
          <img class="charger-alt hidden" id="charger-image" alt="" />

          <div class="soc-tile" id="soc-right">
            <ha-icon id="soc-right-icon"></ha-icon>
            <img class="soc-image hidden" id="soc-right-image" />
            <div class="soc-value" id="soc-right-value">—</div>
            <div class="soc-name" id="soc-right-name"></div>
          </div>
        </div>

        <div class="status">
          <div class="status-primary" id="status-primary"></div>
          <div class="status-secondary" id="status-secondary"></div>
        </div>

        <div class="stats-grid" id="stats-grid">
          <div class="stat">
            <ha-icon icon="mdi:cash"></ha-icon>
            <div class="stat-value" id="stat-price">—</div>
            <div class="stat-label" id="lbl-price"></div>
          </div>
          <div class="stat">
            <ha-icon icon="mdi:lightning-bolt"></ha-icon>
            <div class="stat-value" id="stat-power">—</div>
            <div class="stat-label" id="lbl-power"></div>
          </div>
          <div class="stat">
            <ha-icon icon="mdi:current-ac"></ha-icon>
            <div class="stat-value" id="stat-current">—</div>
            <div class="stat-label" id="lbl-current"></div>
          </div>
          <div class="stat">
            <ha-icon icon="mdi:battery-charging-80"></ha-icon>
            <div class="stat-value" id="stat-energy">—</div>
            <div class="stat-label" id="lbl-energy"></div>
          </div>
        </div>

        <div class="amp-row" id="amp-row">
          <div class="amp-row-label">
            <span id="lbl-amp-limit"></span>
            <span id="amp-value">—</span>
          </div>
          <input type="range" id="amp-slider" min="${this._config.min_current}" max="${this._config.max_current}" step="1" />
        </div>

        <div class="schedule-row" id="schedule-row">
          <input type="time" id="schedule-time" step="60" />
          <button class="schedule-toggle" id="schedule-toggle">
            <ha-icon icon="mdi:car-clock"></ha-icon>
          </button>
        </div>

        <div class="actions" id="actions">
          <button class="action-btn green" id="btn-start">
            <ha-icon icon="mdi:flash"></ha-icon>
            <div>
              <div class="a-title" id="lbl-start-title"></div>
              <div class="a-desc" id="lbl-start-desc"></div>
            </div>
          </button>
          <button class="action-btn amber" id="btn-schedule">
            <ha-icon icon="mdi:clock-start"></ha-icon>
            <div>
              <div class="a-title" id="lbl-schedule-title"></div>
              <div class="a-desc" id="lbl-schedule-desc"></div>
            </div>
          </button>
          <button class="action-btn red" id="btn-stop">
            <ha-icon icon="mdi:stop-circle-outline"></ha-icon>
            <div>
              <div class="a-title" id="lbl-stop-title"></div>
              <div class="a-desc" id="lbl-stop-desc"></div>
            </div>
          </button>
          <button class="action-btn red" id="btn-cancel">
            <ha-icon icon="mdi:cancel"></ha-icon>
            <div>
              <div class="a-title" id="lbl-cancel-title"></div>
              <div class="a-desc" id="lbl-cancel-desc"></div>
            </div>
          </button>
        </div>
      </ha-card>
    `;

    const $ = id => this.shadowRoot.getElementById(id);

    $('btn-start').addEventListener('click',    () => this._guard(() => this._startNow()));
    $('btn-schedule').addEventListener('click', () => this._guard(() => this._scheduleStart()));
    $('btn-cancel').addEventListener('click',   () => this._guard(() => this._cancelSchedule()));
    $('btn-stop').addEventListener('click',     () => this._guard(() => this._stopCharging()));
    $('schedule-toggle').addEventListener('click', () => this._guard(() => this._toggleSchedule()));

    $('schedule-time').addEventListener('change', e => {
      const value = e.target.value; // "HH:MM"
      if (!value) return;
      this._guard(() => this._setScheduleTime(value));
    });

    const slider = $('amp-slider');
    slider.addEventListener('input', () => {
      this._sliderDirty = true;
      $('amp-value').textContent = `${slider.value} A`;
    });
    slider.addEventListener('change', () => {
      this._sliderDirty = false;
      this._guard(() => this._limitCurrent(Number(slider.value)));
    });

    this._built = true;
  }

  /* ---------- entity resolution ---------- */

  _isLegacy() {
    const id = this._userConfig?.entity_schedule_enabled;
    return !!(id && this._hass?.states?.[id]);
  }

  /** Entity id for a role: explicit config wins, otherwise auto-detected. */
  _ent(role) {
    return this._userConfig?.[role] || this._resolved?.entities?.[role] || DEFAULTS[role] || null;
  }

  _deviceId() {
    return this._userConfig?.device_id || this._resolved?.deviceId || null;
  }

  _resolve() {
    const hass = this._hass;
    if (!hass) return;
    const key = hass.entities ?? hass.states;
    if (this._resolvedKey === key && this._resolved) return;

    // Candidate list: the entity registry when available (gives translation_key
    // + device), otherwise just every state's entity_id.
    let all;
    if (hass.entities) {
      all = Object.values(hass.entities).filter(e => e.platform === 'zaptec');
    } else {
      all = Object.keys(hass.states).map(entity_id => ({ entity_id }));
    }

    const cfg = this._userConfig || {};
    const devices = hass.devices || {};
    const entriesOf = id => devices[id]?.config_entries || [];

    // Installation device: configured, or whichever device owns the available_current number.
    let installation = cfg.device_id || null;
    if (!installation) {
      const avail = this._match(all, ENTITY_MATCHERS.entity_available_current);
      installation = avail?.device_id || null;
    }

    // Scope charger entities to the configured charger, else to the same config entry as the installation.
    let scoped = all;
    if (cfg.charger_device_id) {
      scoped = all.filter(e => e.device_id === cfg.charger_device_id || e.device_id === installation);
    } else if (installation && entriesOf(installation).length) {
      const entries = new Set(entriesOf(installation));
      scoped = all.filter(e => !e.device_id || entriesOf(e.device_id).some(x => entries.has(x)));
    }

    const entities = {};
    for (const [role, m] of Object.entries(ENTITY_MATCHERS)) {
      const pool = m.scope === 'installation' && installation && hass.entities
        ? scoped.filter(e => e.device_id === installation)
        : scoped;
      const hit = this._match(pool, m) || this._match(scoped, m);
      if (hit) entities[role] = hit.entity_id;
    }

    const phases = PHASE_CURRENT_MATCHER.suffixes
      .map((suffix, i) => this._match(scoped, {
        ...PHASE_CURRENT_MATCHER,
        keys: [PHASE_CURRENT_MATCHER.keys[i]],
        suffixes: [suffix],
      }))
      .filter(Boolean)
      .map(e => e.entity_id);

    this._resolved    = { entities, phases, deviceId: installation };
    this._resolvedKey = key;
  }

  _match(list, m) {
    const ok = e => e.entity_id.startsWith(`${m.domain}.`)
      && !(m.exclude || []).some(x => e.entity_id.includes(x));
    return list.find(e => ok(e) && e.translation_key && m.keys.includes(e.translation_key))
        || list.find(e => ok(e) && m.suffixes.some(s => e.entity_id.endsWith(s)))
        || null;
  }

  /* ---------- schedule (built-in: card-managed helper + automation) ---------- */
  //
  // The time lives in an input_datetime helper, so anyone can change it with
  // input_datetime.set_datetime. The automation triggers on that helper and
  // its on/off state is "schedule active". Creating either one needs an admin;
  // after that every user can use the schedule fully.

  _automationId() {
    const raw = this._config.schedule_id || this._deviceId() || 'default';
    return `${AUTOMATION_PREFIX}_${String(raw).toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;
  }

  _helperName() {
    return this._config.schedule_id ? `${HELPER_NAME} (${this._config.schedule_id})` : HELPER_NAME;
  }

  _scheduleAutomation() {
    const id = this._automationId();
    const states = this._hass?.states || {};
    const entityId = Object.keys(states).find(k =>
      k.startsWith('automation.') && states[k].attributes?.id === id);
    return entityId ? { entityId, stateObj: states[entityId] } : null;
  }

  /** The card's time helper, found by its name (entity ids can be renamed or get a _2 suffix). */
  _scheduleHelper() {
    const name = this._helperName();
    const states = this._hass?.states || {};
    const entityId = Object.keys(states).find(k =>
      k.startsWith('input_datetime.') && states[k].attributes?.friendly_name === name);
    return entityId ? { entityId, stateObj: states[entityId] } : null;
  }

  _scheduleReady() {
    return !!(this._scheduleAutomation() && this._scheduleHelper());
  }

  _scheduleEnabled() {
    if (this._isLegacy()) return this._isOn(this._config.entity_schedule_enabled);
    return this._scheduleAutomation()?.stateObj?.state === 'on';
  }

  _scheduleTime() {
    const s = this._isLegacy()
      ? this._state(this._config.entity_schedule_time)
      : this._scheduleHelper()?.stateObj?.state;
    if (s && /^\d{1,2}:\d{2}/.test(s)) return s.slice(0, 5).padStart(5, '0');
    return this._isLegacy() ? null : (this._pendingTime || DEFAULT_SCHEDULE_TIME);
  }

  _buildAutomation(helperEntityId) {
    const mode       = this._ent('entity_charger_mode');
    const authorized = this._ent('entity_authorized');
    const authorize  = this._authorizeAction();

    const triggers = [{ trigger: 'time', at: helperEntityId, id: 'start' }];
    // Unplugging cancels a pending scheduled start.
    if (mode) triggers.push({ trigger: 'state', entity_id: mode, to: 'disconnected', id: 'unplugged' });

    const authorizeIf = [];
    if (mode)       authorizeIf.push({ condition: 'state', entity_id: mode, state: 'connected_requesting' });
    if (authorized) authorizeIf.push({ condition: 'state', entity_id: authorized, state: 'off' });

    const startSequence = [
      { action: 'zaptec.limit_current', data: { device_id: this._deviceId(), available_current: Number(this._config.max_current) } },
    ];
    if (authorize) {
      startSequence.push({ delay: { seconds: 2 } });
      startSequence.push(authorizeIf.length ? { if: authorizeIf, then: [authorize] } : authorize);
    }

    return {
      alias: AUTOMATION_ALIAS,
      description: `Managed by zaptec-charger-card. The start time is ${helperEntityId}. Switched on/off from the card and rewritten when the card's settings change — edits here will be overwritten. Runs once, then turns itself off.`,
      mode: 'single',
      triggers,
      conditions: [],
      actions: [
        { choose: [{ conditions: [{ condition: 'trigger', id: 'start' }], sequence: startSequence }] },
        { action: 'automation.turn_off', target: { entity_id: '{{ this.entity_id }}' }, data: { stop_actions: false } },
      ],
    };
  }

  /**
   * Make sure the helper and the automation exist (admin only, once). New
   * pieces start with `time` and switched off. Returns the automation entity id.
   */
  async _ensureSchedule(time) {
    if (this._scheduleReady()) return this._scheduleAutomation().entityId;
    if (!this._isAdmin()) throw new Error(this._t('schedule_admin_only'));

    let helper = this._scheduleHelper();
    if (!helper) {
      await this._hass.callWS({
        type: 'input_datetime/create',
        name: this._helperName(),
        icon: 'mdi:car-clock',
        has_date: false,
        has_time: true,
      });
      helper = await this._waitFor(() => this._scheduleHelper());
      if (!helper) throw new Error('schedule time helper did not appear');
      await this._hass.callService('input_datetime', 'set_datetime', { time: `${time}:00` }, { entity_id: helper.entityId });
    }

    let automation = this._scheduleAutomation();
    if (!automation) {
      await this._writeAutomation(helper.entityId);
      automation = await this._waitFor(() => this._scheduleAutomation());
      if (!automation) throw new Error('schedule automation did not appear');
      await this._hass.callService('automation', 'turn_off', {}, { entity_id: automation.entityId });
    }
    return automation.entityId;
  }

  _writeAutomation(helperEntityId) {
    return this._hass.callApi('POST', `config/automation/config/${this._automationId()}`, this._buildAutomation(helperEntityId));
  }

  /**
   * Admin only, once per card instance: rewrite the automation if the card's
   * settings (max current, entities, device) no longer match what it holds.
   * Keeps its on/off state across the rewrite.
   */
  async _syncAutomation() {
    if (this._synced || this._isLegacy() || !this._isAdmin() || !this._scheduleReady()) return;
    this._synced = true;
    const { entityId, stateObj } = this._scheduleAutomation();
    const wanted = this._buildAutomation(this._scheduleHelper().entityId);
    try {
      const { config } = await this._hass.callWS({ type: 'automation/config', entity_id: entityId });
      const { id: _id, ...current } = config || {};
      if (stableJson(current) === stableJson(wanted)) return;
      const wasOn = stateObj.state === 'on';
      const before = stateObj.last_updated;
      await this._writeAutomation(this._scheduleHelper().entityId);
      // Wait for the reload to replace the entity before restoring its state.
      await this._waitFor(() => this._scheduleAutomation()?.stateObj?.last_updated !== before, 5000);
      const now = this._scheduleAutomation();
      if (now && (now.stateObj.state === 'on') !== wasOn) {
        await this._hass.callService('automation', wasOn ? 'turn_on' : 'turn_off', {}, { entity_id: now.entityId });
      }
    } catch (err) {
      console.warn('[zaptec-charger-card] could not sync the schedule automation', err);
    }
  }

  async _waitFor(fn, timeoutMs = 10000) {
    const until = Date.now() + timeoutMs;
    for (;;) {
      const v = fn();
      if (v || Date.now() > until) return v;
      await sleep(250);
    }
  }

  async _disableSchedule() {
    const a = this._scheduleAutomation();
    if (a && a.stateObj.state === 'on') {
      await this._hass.callService('automation', 'turn_off', {}, { entity_id: a.entityId });
    }
  }

  _isAdmin() {
    return this._hass?.user ? !!this._hass.user.is_admin : true;
  }

  /* ---------- actions ---------- */

  async _guard(fn) {
    if (this._busy || !this._hass) return;
    this._busy = true;
    this._update();
    try {
      await fn();
    } catch (err) {
      const message = this._t('action_failed', { error: err?.message || err?.body?.message || String(err) });
      console.error('[zaptec-charger-card]', err);
      this.dispatchEvent(new CustomEvent('hass-notification', { detail: { message }, bubbles: true, composed: true }));
    } finally {
      this._busy = false;
      this._update();
    }
  }

  _runScript(entityId) {
    const objectId = entityId.split('.').slice(1).join('.');
    return this._hass.callService('script', objectId, {});
  }

  _limitCurrent(amps) {
    return this._hass.callService('zaptec', 'limit_current', {
      device_id: this._deviceId(),
      available_current: amps,
    });
  }

  /** The service call that authorizes charging, as an automation action. */
  _authorizeAction() {
    const button = this._ent('entity_authorize_button');
    if (button) return { action: 'button.press', target: { entity_id: button } };
    if (this._config.charger_device_id) return { action: 'zaptec.authorize_charging', data: { device_id: this._config.charger_device_id } };
    return null;
  }

  async _authorizeIfNeeded() {
    const mode = this._state(this._ent('entity_charger_mode'));
    if (mode !== 'connected_requesting') return;
    const authorizedId = this._ent('entity_authorized');
    if (authorizedId && this._isOn(authorizedId)) return;
    const a = this._authorizeAction();
    if (!a) return;
    const [domain, service] = a.action.split('.');
    await this._hass.callService(domain, service, a.data || {}, a.target);
  }

  async _startNow() {
    if (this._isLegacy()) return this._config.script_start_now && this._runScript(this._config.script_start_now);
    await this._disableSchedule();
    await this._limitCurrent(Number(this._config.max_current));
    await sleep(2000);
    await this._authorizeIfNeeded();
  }

  async _scheduleStart() {
    if (this._isLegacy()) return this._config.script_schedule && this._runScript(this._config.script_schedule);
    // Hold at 0 A and authorize now; the automation raises the current at the scheduled time.
    await this._limitCurrent(0);
    await sleep(2000);
    await this._authorizeIfNeeded();
    const automation = await this._ensureSchedule(this._scheduleTime());
    await this._hass.callService('automation', 'turn_on', {}, { entity_id: automation });
  }

  async _cancelSchedule() {
    if (this._isLegacy()) return this._config.script_cancel_schedule && this._runScript(this._config.script_cancel_schedule);
    await this._disableSchedule();
  }

  _stopCharging() {
    return this._hass.callService('switch', 'turn_off', {}, { entity_id: this._ent('entity_charging_switch') });
  }

  async _toggleSchedule() {
    if (this._isLegacy()) {
      return this._hass.callService('input_boolean', 'toggle', {}, { entity_id: this._config.entity_schedule_enabled });
    }
    if (this._scheduleReady()) {
      return this._hass.callService('automation', 'toggle', {}, { entity_id: this._scheduleAutomation().entityId });
    }
    const automation = await this._ensureSchedule(this._scheduleTime());
    await this._hass.callService('automation', 'turn_on', {}, { entity_id: automation });
  }

  async _setScheduleTime(time) {
    if (this._isLegacy()) {
      return this._hass.callService('input_datetime', 'set_datetime', { time: `${time}:00` }, { entity_id: this._config.entity_schedule_time });
    }
    this._pendingTime = time;
    // First time: create helper + automation (switched off) so the time persists.
    if (!this._scheduleReady()) await this._ensureSchedule(time);
    const helper = this._scheduleHelper();
    if (!helper) throw new Error('schedule time helper not found');
    await this._hass.callService('input_datetime', 'set_datetime', { time: `${time}:00` }, { entity_id: helper.entityId });
  }

  /* ---------- rendering ---------- */

  _visualState(mode, scheduleEnabled) {
    if (mode === 'disconnected') return 'disconnected';
    if (mode === 'connected_charging') return 'charging';
    if (mode === 'connected_finished') return 'finished';
    if (scheduleEnabled) return 'scheduled';
    return 'ready';
  }

  _updateSocTile(side, cfg) {
    const $ = id => this.shadowRoot.getElementById(id);
    const entityId = cfg[`${side}_soc_entity`];
    const tile = $(`soc-${side}`);

    if (!entityId) {
      tile.classList.add('hidden');
      return;
    }
    tile.classList.remove('hidden');

    const value = this._num(entityId);
    const icon  = $(`soc-${side}-icon`);
    const image = $(`soc-${side}-image`);
    const imageUrl = cfg[`${side}_soc_image`];

    if (imageUrl) {
      image.setAttribute('src', imageUrl);
      image.classList.remove('hidden');
      icon.classList.add('hidden');
    } else {
      image.classList.add('hidden');
      icon.classList.remove('hidden');
      icon.setAttribute('icon', cfg[`${side}_soc_icon`] || DEFAULTS[`${side}_soc_icon`]);
      icon.style.color = cfg[`${side}_soc_color`] || DEFAULTS[`${side}_soc_color`];
    }
    $(`soc-${side}-value`).textContent = isNaN(value) ? '—' : `${Math.round(value)}%`;
    $(`soc-${side}-name`).textContent  = cfg[`${side}_soc_name`] || '';
  }

  _liveCurrent() {
    const single = this._ent('entity_current');
    if (single && this._hass.states[single]) return this._num(single);
    const phases = (this._resolved?.phases || []).map(id => this._num(id)).filter(v => !isNaN(v));
    return phases.length ? Math.max(...phases) : NaN;
  }

  _update() {
    if (!this._built || !this._hass || !this._config) return;
    this._resolve();
    if (!this._busy) this._syncAutomation();
    const cfg = this._config;
    const $ = id => this.shadowRoot.getElementById(id);
    const legacy = this._isLegacy();

    const mode            = this._state(this._ent('entity_charger_mode'));
    const scheduleEnabled = this._scheduleEnabled();
    const price           = this._num(this._ent('entity_price'));
    const charged         = this._num(this._ent('entity_session_energy'));
    const power           = this._powerKw(this._ent('entity_power'));
    const current         = this._liveCurrent();
    const scheduleTime    = this._scheduleTime();
    const shortTime       = scheduleTime || '--:--';

    const visual = this._visualState(mode, scheduleEnabled);
    const color  = STATE_COLORS[visual];

    $('card-title').textContent = cfg.title || this._t('title');

    // Static labels — re-applied every update since hass.language may not
    // have been known yet the one time _buildDOM() ran.
    $('lbl-price').textContent   = this._t('price');
    $('lbl-power').textContent   = this._t('power');
    $('lbl-current').textContent = this._t('current');
    $('lbl-energy').textContent  = this._t('energy');
    $('lbl-amp-limit').textContent = this._t('amp_limit');
    $('lbl-start-title').textContent    = this._t('start_now');
    $('lbl-start-desc').textContent     = this._t('start_now_desc');
    $('lbl-schedule-title').textContent = this._t('schedule_start');
    $('lbl-schedule-desc').textContent  = this._t('schedule_start_desc');
    $('lbl-stop-title').textContent     = this._t('stop_charging');
    $('lbl-stop-desc').textContent      = this._t('stop_charging_desc');
    $('lbl-cancel-title').textContent   = this._t('cancel_schedule');
    $('lbl-cancel-desc').textContent    = this._t('cancel_schedule_desc');

    // Illustration
    // Charger visual: custom image > custom icon > built-in SVG.
    const chargerImage = cfg.charger_image || null;
    const chargerIcon  = !chargerImage && cfg.charger_icon ? cfg.charger_icon : null;
    const altImage = $('charger-image');
    const altIcon  = $('charger-icon');
    for (const [el, on] of [[altImage, !!chargerImage], [altIcon, !!chargerIcon]]) {
      el.setAttribute('class', `charger-alt state-${visual}${on ? '' : ' hidden'}`);
      el.style.setProperty('--zc-color', color);
    }
    if (chargerImage && altImage.getAttribute('src') !== chargerImage) altImage.setAttribute('src', chargerImage);
    if (chargerIcon) altIcon.setAttribute('icon', chargerIcon);

    const illustration = $('illustration');
    illustration.setAttribute('class', `illustration state-${visual}${chargerImage || chargerIcon ? ' hidden' : ''}`);
    $('led-outer').style.stroke = color;
    $('led-inner').style.fill   = color;
    $('led-outer').style.color  = color; // for currentColor in the pulse filter

    // Car battery (state of charge) tiles — optional, hidden when no entity configured
    this._updateSocTile('left', cfg);
    this._updateSocTile('right', cfg);

    // Status text
    $('status-primary').textContent = this._t(`status_${visual}`);
    let secondary;
    if (visual === 'charging') {
      secondary = !isNaN(price) && !isNaN(charged)
        ? this._t('secondary_charging_full', { price: this._fmt(price, 2), charged: this._fmt(charged, 2) })
        : this._t('secondary_charging');
    } else if (visual === 'finished') {
      secondary = !isNaN(charged) ? this._t('secondary_finished_full', { charged: this._fmt(charged, 1) }) : this._t('secondary_finished');
    } else if (visual === 'disconnected') {
      secondary = this._t('secondary_disconnected');
    } else if (visual === 'scheduled') {
      secondary = this._t('secondary_scheduled', { time: shortTime });
    } else {
      secondary = this._t('secondary_ready', { time: shortTime });
    }
    $('status-secondary').textContent = secondary;

    // Nothing to show, act on, or throttle while no car is connected — just
    // the illustration, the optional SoC tiles, and the status text remain.
    const disconnected = visual === 'disconnected';
    $('stats-grid').classList.toggle('hidden', disconnected);
    $('amp-row').classList.toggle('hidden', disconnected);
    $('schedule-row').classList.toggle('hidden', disconnected);
    $('actions').classList.toggle('hidden', disconnected);
    if (disconnected) return;

    // Stats
    const priceState = this._hass.states[this._ent('entity_price')];
    const priceUnit   = priceState?.attributes?.unit_of_measurement ?? '';
    $('stat-price').textContent   = isNaN(price) ? '—' : `${this._fmt(price, 2)}${priceUnit ? ' ' + priceUnit : ''}`;
    $('stat-power').textContent   = isNaN(power) ? '—' : `${this._fmt(power, 1)} kW`;
    $('stat-current').textContent = isNaN(current) ? '—' : `${this._fmt(current, 1)} A`;
    $('stat-energy').textContent  = isNaN(charged) ? '—' : `${this._fmt(charged, 1)} kWh`;

    // Amp slider (don't fight the user mid-drag). Prefer the installation's
    // available-current setting; fall back to the measured current.
    if (!this._sliderDirty) {
      const slider = $('amp-slider');
      const avail = this._num(this._ent('entity_available_current'));
      const basis = !isNaN(avail) ? avail : current;
      const limitNow = isNaN(basis) ? cfg.max_current : Math.round(basis);
      if (this.shadowRoot.activeElement !== slider) {
        slider.value = Math.min(cfg.max_current, Math.max(cfg.min_current, limitNow));
        $('amp-value').textContent = `${slider.value} A`;
      }
    }

    // Schedule row. Only the first-time setup (creating the helper and the
    // automation) needs an admin; after that everyone can use the schedule.
    const canEdit   = legacy || this._isAdmin() || this._scheduleReady();
    const automationExists = canEdit;
    const timeInput = $('schedule-time');
    if (this.shadowRoot.activeElement !== timeInput && scheduleTime) timeInput.value = shortTime;
    timeInput.disabled = !canEdit || this._busy;
    timeInput.title    = canEdit ? '' : this._t('schedule_admin_only');
    const toggle = $('schedule-toggle');
    toggle.classList.toggle('active', scheduleEnabled);
    toggle.disabled = this._busy || (!canEdit && !automationExists);
    toggle.title = this._t(scheduleEnabled ? 'schedule_toggle_on' : 'schedule_toggle_off');

    // Buttons — mirrors the exact visibility rules from the original dashboard
    const showStart    = mode !== 'disconnected' && mode !== 'connected_charging';
    const showSchedule = mode !== 'connected_charging' && mode !== 'disconnected' && !scheduleEnabled;
    const showStop     = mode === 'connected_charging';
    const showCancel   = mode !== 'connected_charging' && scheduleEnabled;

    $('btn-start').classList.toggle('hidden', !showStart);
    $('btn-schedule').classList.toggle('hidden', !showSchedule);
    $('btn-stop').classList.toggle('hidden', !showStop);
    $('btn-cancel').classList.toggle('hidden', !showCancel);
    for (const id of ['btn-start', 'btn-schedule', 'btn-stop', 'btn-cancel']) $(id).disabled = this._busy;
    $('btn-schedule').disabled = this._busy || (!canEdit && !automationExists);
  }

  _state(entityId) {
    return entityId ? this._hass?.states?.[entityId]?.state : undefined;
  }

  _isOn(entityId) {
    return this._state(entityId) === 'on';
  }

  _num(entityId) {
    const s = this._state(entityId);
    return s !== undefined ? parseFloat(s) : NaN;
  }

  _powerKw(entityId) {
    const raw = this._num(entityId);
    if (isNaN(raw)) return NaN;
    // The Zaptec power sensor reports watts; the card displays kW.
    const unit = this._hass?.states?.[entityId]?.attributes?.unit_of_measurement;
    return unit && unit.toLowerCase() === 'w' ? raw / 1000 : raw;
  }

  _fmt(num, decimals) {
    if (isNaN(num)) return '—';
    return num.toLocaleString(this._hass?.language || 'en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
}

customElements.define('zaptec-charger-card', ZaptecChargerCard);

/**
 * HA 2026.6+: offer this card under "Community" in the card picker when the
 * user picks any Zaptec entity. The card auto-detects everything, so the
 * config only names the charger when there is more than one to choose from.
 */
function zaptecEntitySuggestion(hass, entityId) {
  const entry = hass?.entities?.[entityId];
  if (!entry || entry.platform !== 'zaptec') return null;

  const config = { type: 'custom:zaptec-charger-card' };
  const isChargerDevice = deviceId => Object.values(hass.entities).some(e =>
    e.platform === 'zaptec' && e.device_id === deviceId && e.entity_id.startsWith('sensor.')
    && (e.translation_key === 'charger_operation_mode' || e.entity_id.endsWith('_charger_mode')));
  const chargers = new Set(Object.values(hass.entities)
    .filter(e => e.platform === 'zaptec' && e.device_id && isChargerDevice(e.device_id))
    .map(e => e.device_id));
  if (chargers.size > 1 && chargers.has(entry.device_id)) config.charger_device_id = entry.device_id;

  return { config };
}

window.customCards = window.customCards || [];
window.customCards.push({
  type:             'zaptec-charger-card',
  name:             'Zaptec Go 2 Charger Card',
  description:      'Manage a Zaptec Go 2 EV charger — start, schedule, throttle and monitor charging.',
  preview:          true,
  documentationURL: 'https://github.com/briis/zaptec_charger_card',
  getEntitySuggestion: zaptecEntitySuggestion,
});
