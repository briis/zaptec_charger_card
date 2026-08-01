/**
 * Zaptec Go 2 Charger Card
 * UI layer over an existing Zaptec HA setup: reads charger mode/price/energy/
 * power/current sensors, drives the same scripts/helpers the user's
 * automations already use (start now / schedule / cancel), and additionally
 * offers a live amp-limit slider via zaptec.limit_current.
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
    editor_device_id:                'Zaptec Charging Unit',
    editor_script_start_now:         'Start now script',
    editor_script_schedule:          'Schedule script',
    editor_script_cancel_schedule:   'Cancel schedule script',
    editor_min_current:              'Minimum current (A)',
    editor_max_current:              'Maximum current (A)',
    editor_title:                    'Card title',
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
    editor_device_id:                'Zaptec Charging Unit',
    editor_script_start_now:         'Start now script',
    editor_script_schedule:          'Schedule script',
    editor_script_cancel_schedule:   'Cancel schedule script',
    editor_min_current:              'Minimum current (A)',
    editor_max_current:              'Maximum current (A)',
    editor_title:                    'Card title',
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
  },
};

const DEFAULTS = {
  entity_charger_mode:       'sensor.ev_ev_charger_charger_mode',
  entity_charging_switch:    'switch.ev_ev_charger_charging',
  entity_authorize_button:   'button.ev_ev_charger_authorize_charging',
  entity_deauthorize_button: 'button.ev_ev_charger_deauthorize_charging',
  entity_is_authorized:      'input_boolean.zaptec_is_authorized',
  entity_schedule_enabled:   'input_boolean.zaptec_scheduled_charge_enabled',
  entity_schedule_time:      'input_datetime.zaptec_scheduled_start_time',
  entity_price:              'sensor.stromligning_current_price_vat',
  entity_session_energy:     'sensor.ev_ev_charger_session_total_charge',
  entity_power:               'sensor.ev_ev_charger_charger_power',
  entity_current:            'sensor.ev_ev_charger_charger_current',
  device_id:                 'e58b0e3a8d33fc6560c8c7f4537bc120',
  script_start_now:          'script.zaptec_start_charging_now',
  script_schedule:           'script.zaptec_schedule_charging',
  script_cancel_schedule:    'script.zaptec_cancel_scheduled_charging',
  min_current:               6,
  max_current:               16,
  title:                     null,
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
  .hidden { display: none !important; }
`;

/* ---- UI Editor ---- */

const ENTITY_FIELDS = [
  ['entity_charger_mode',       'sensor'],
  ['entity_charging_switch',    'switch'],
  ['entity_authorize_button',   'button'],
  ['entity_deauthorize_button', 'button'],
  ['entity_is_authorized',      'input_boolean'],
  ['entity_schedule_enabled',   'input_boolean'],
  ['entity_schedule_time',      'input_datetime'],
  ['entity_price',              'sensor'],
  ['entity_session_energy',     'sensor'],
  ['entity_power',              'sensor'],
  ['entity_current',            'sensor'],
];

const SCRIPT_FIELDS = [
  'script_start_now',
  'script_schedule',
  'script_cancel_schedule',
];

const EDITOR_SCHEMA = [
  { name: 'device_id', required: false, selector: { device: { integration: 'zaptec' } } },
  ...ENTITY_FIELDS.map(([name, domain]) => ({
    name,
    required: false,
    selector: { entity: { domain } },
  })),
  ...SCRIPT_FIELDS.map(name => ({
    name,
    required: false,
    selector: { entity: { domain: 'script' } },
  })),
  { name: 'min_current', required: false, selector: { number: { min: 1, max: 32, step: 1, mode: 'box', unit_of_measurement: 'A' } } },
  { name: 'max_current', required: false, selector: { number: { min: 1, max: 32, step: 1, mode: 'box', unit_of_measurement: 'A' } } },
  { name: 'title', required: false, selector: { text: {} } },
  { name: 'left_soc_entity',  required: false, selector: { entity: { domain: 'sensor' } } },
  { name: 'left_soc_name',   required: false, selector: { text: {} } },
  { name: 'left_soc_icon',   required: false, selector: { icon: {} } },
  { name: 'left_soc_image',  required: false, selector: { text: {} } },
  { name: 'left_soc_color',  required: false, selector: { text: {} } },
  { name: 'right_soc_entity', required: false, selector: { entity: { domain: 'sensor' } } },
  { name: 'right_soc_name',  required: false, selector: { text: {} } },
  { name: 'right_soc_icon',  required: false, selector: { icon: {} } },
  { name: 'right_soc_image', required: false, selector: { text: {} } },
  { name: 'right_soc_color', required: false, selector: { text: {} } },
];

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
        this.dispatchEvent(new CustomEvent('config-changed', {
          detail: { config: e.detail.value },
          bubbles: true,
          composed: true,
        }));
      });
    }

    const lang = this._hass.language;

    this._form.hass         = this._hass;
    this._form.schema       = EDITOR_SCHEMA;
    this._form.data         = this._config;
    this._form.computeLabel = s => editorLabel(lang, s.name);
  }
}

customElements.define('zaptec-charger-card-editor', ZaptecChargerCardEditor);

/* ---- Card ---- */

class ZaptecChargerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = null;
    this._hass   = null;
    this._built  = false;
    this._sliderDirty = false;
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = { ...DEFAULTS, ...config };
    this._built  = false;
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

  static getStubConfig() { return { ...DEFAULTS }; }

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

    $('btn-start').addEventListener('click', () => this._runScript(this._config.script_start_now));
    $('btn-schedule').addEventListener('click', () => this._runScript(this._config.script_schedule));
    $('btn-cancel').addEventListener('click', () => this._runScript(this._config.script_cancel_schedule));
    $('btn-stop').addEventListener('click', () => {
      this._hass.callService('switch', 'turn_off', {}, { entity_id: this._config.entity_charging_switch });
    });

    $('schedule-toggle').addEventListener('click', () => {
      this._hass.callService('input_boolean', 'toggle', {}, { entity_id: this._config.entity_schedule_enabled });
    });

    $('schedule-time').addEventListener('change', e => {
      const value = e.target.value; // "HH:MM"
      if (!value) return;
      this._hass.callService('input_datetime', 'set_datetime', { time: `${value}:00` }, { entity_id: this._config.entity_schedule_time });
    });

    const slider = $('amp-slider');
    slider.addEventListener('input', () => {
      this._sliderDirty = true;
      $('amp-value').textContent = `${slider.value} A`;
    });
    slider.addEventListener('change', () => {
      this._sliderDirty = false;
      this._hass.callService('zaptec', 'limit_current', {
        device_id: this._config.device_id,
        available_current: Number(slider.value),
      });
    });

    this._built = true;
  }

  _runScript(entityId) {
    if (!entityId || !this._hass) return;
    const objectId = entityId.split('.').slice(1).join('.');
    this._hass.callService('script', objectId, {});
  }

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

  _update() {
    if (!this._built || !this._hass || !this._config) return;
    const cfg = this._config;
    const $ = id => this.shadowRoot.getElementById(id);

    const mode            = this._state(cfg.entity_charger_mode);
    const scheduleEnabled = this._isOn(cfg.entity_schedule_enabled);
    const price           = this._num(cfg.entity_price);
    const charged         = this._num(cfg.entity_session_energy);
    const power           = this._powerKw(cfg.entity_power);
    const current         = this._num(cfg.entity_current);
    const scheduleTime    = this._state(cfg.entity_schedule_time);
    const shortTime       = scheduleTime && scheduleTime.length >= 5 ? scheduleTime.slice(0, 5) : '--:--';

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
    const illustration = $('illustration');
    illustration.setAttribute('class', `illustration state-${visual}`);
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
    const priceState = this._hass.states[cfg.entity_price];
    const priceUnit   = priceState?.attributes?.unit_of_measurement ?? '';
    $('stat-price').textContent   = isNaN(price) ? '—' : `${this._fmt(price, 2)}${priceUnit ? ' ' + priceUnit : ''}`;
    $('stat-power').textContent   = isNaN(power) ? '—' : `${this._fmt(power, 1)} kW`;
    $('stat-current').textContent = isNaN(current) ? '—' : `${this._fmt(current, 1)} A`;
    $('stat-energy').textContent  = isNaN(charged) ? '—' : `${this._fmt(charged, 1)} kWh`;

    // Amp slider (don't fight the user mid-drag)
    if (!this._sliderDirty) {
      const slider = $('amp-slider');
      const limitNow = isNaN(current) ? cfg.max_current : Math.round(current);
      if (document.activeElement !== slider) {
        slider.value = Math.min(cfg.max_current, Math.max(cfg.min_current, limitNow));
        $('amp-value').textContent = `${slider.value} A`;
      }
    }

    // Schedule row
    const timeInput = $('schedule-time');
    if (document.activeElement !== timeInput && scheduleTime) timeInput.value = shortTime;
    const toggle = $('schedule-toggle');
    toggle.classList.toggle('active', scheduleEnabled);
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
  }

  _state(entityId) {
    return this._hass?.states?.[entityId]?.state;
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

window.customCards = window.customCards || [];
window.customCards.push({
  type:             'zaptec-charger-card',
  name:             'Zaptec Go 2 Charger Card',
  description:      'Manage a Zaptec Go 2 EV charger — start, schedule, throttle and monitor charging.',
  preview:          true,
  documentationURL: 'https://github.com/briis/zaptec_charger_card',
});
