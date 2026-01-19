const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

console.info(
  `%c APPLE-TV-STATUS-CARD %c v1.0.1 `,
  "color: white; background: #555; font-weight: bold;",
  "color: white; background: #918F8F; font-weight: bold;"
);

class AppleTvStatusCard extends LitElement {
  static properties = {
    hass: {},
    config: {},
  };

  static styles = css`
    @import url('https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;700&display=swap');

    :host {
      font-family: 'Karla', sans-serif;
      --card-bg: var(--ha-card-background, #4a4a4a);
      --text-color: var(--primary-text-color, #e0e0e0);
      --text-color-secondary: var(--secondary-text-color, rgba(255, 255, 255, 0.7));
      --border-color: var(--divider-color, #555);
    }

    .wrapper {
      width: fit-content;
      height: 62px;
      padding: 10px 19px;
      background: var(--card-bg);
      overflow: hidden;
      border-radius: 16px;
      outline: 1px var(--border-color) solid;
      outline-offset: -1px;
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 0px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    .wrapper:hover {
      transform: translateY(-1px);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .title {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 22px;
    }

    .title-text {
      color: var(--text-color);
      font-size: 15px;
      font-weight: 500;
      min-width: 70px;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon svg {
      width: 23px;
      height: auto;
    }

    .status-row {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
    }

    .status-text {
      color: var(--text-color-secondary);
      font-size: 14px;
      font-weight: 500;
    }

    .error-message {
      color: #d32f2f;
      padding: 10px;
      border-radius: 4px;
      background: #ffebee;
      font-size: 12px;
    }
  `;

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = {
      name: 'Apple TV',
      type: 'apple_tv',
      ...config
    };
  }

  _handleClick() {
    if (this.config.tap_action) {
      // Handle custom tap action
      const action = this.config.tap_action;
      if (action.action === 'call-service') {
        const [domain, service] = action.service.split('.');
        this.hass.callService(domain, service, action.service_data || {});
      } else if (action.action === 'more-info') {
        const event = new CustomEvent('hass-more-info', {
          bubbles: true,
          composed: true,
          detail: { entityId: this.config.entity }
        });
        this.dispatchEvent(event);
      }
    } else {
      // Default: show more info
      const event = new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId: this.config.entity }
      });
      this.dispatchEvent(event);
    }
  }

  _getStatusText(entity) {
    if (!entity) return 'Unavailable';
    
    const state = entity.state;
    const attributes = entity.attributes;

    // Check for app name first
    if (attributes.app_name) {
      return attributes.app_name;
    }

    // Check for media title
    if (attributes.media_title) {
      return attributes.media_title;
    }

    // Map states to friendly text
    const stateMap = {
      'playing': 'Playing',
      'paused': 'Paused',
      'idle': 'Idle',
      'standby': 'Standby',
      'off': 'Off',
      'on': 'On',
      'unavailable': 'Unavailable',
      'unknown': 'Unknown'
    };

    return stateMap[state] || state;
  }

  _renderIcon() {
    const type = this.config.type;

    if (type === 'samsung_tv' || type === 'tv') {
      return html`
        <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.25 2.40533H19.75C20.8546 2.40533 21.75 3.30076 21.75 4.40533V13.5303C21.75 14.6349 20.8546 15.5303 19.75 15.5303H2.75C1.64543 15.5303 0.75 14.6349 0.75 13.5303V4.40533C0.75 3.30077 1.64543 2.40533 2.75 2.40533H11.25ZM11.25 2.40533L13.125 0.530334M11.25 2.40533L9.375 0.530334" stroke="#2B2B2B" stroke-width="1.5"/>
        </svg>
      `;
    }

    // Default: Apple TV icon
    return html`
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.75" y="0.75" width="19.5" height="19.5" rx="3.25" stroke="#2B2B2B" stroke-width="1.5"/>
        <path d="M7.4255 8.45892C7.54244 8.32828 7.63095 8.17597 7.68569 8.01116C7.74043 7.84635 7.76027 7.67247 7.744 7.5C7.55331 7.51351 7.36792 7.56718 7.20068 7.6573C7.03345 7.74742 6.88837 7.87183 6.7755 8.0219C6.67236 8.139 6.5952 8.27555 6.54887 8.423C6.50253 8.57045 6.48801 8.72562 6.50621 8.87878C6.68358 8.89105 6.86121 8.85889 7.02215 8.78539C7.18309 8.71188 7.32196 8.59948 7.4255 8.45892ZM8.199 10.6801C8.19686 10.4503 8.25743 10.2239 8.37456 10.0242C8.49168 9.82453 8.66115 9.6586 8.86571 9.54334C8.73496 9.35047 8.55502 9.19386 8.34345 9.08878C8.13188 8.9837 7.89591 8.93375 7.65857 8.94379C7.28331 8.99983 6.91492 9.09301 6.55914 9.2219C6.31586 9.2219 5.95371 8.96004 5.48571 8.96004C4.767 8.96004 4 9.58578 4 10.7795C4 11.9912 4.90536 13.5 5.62221 13.5C5.872 13.5 6.25643 13.2553 6.64364 13.2553C7.03086 13.2553 7.30386 13.491 7.66507 13.491C8.44971 13.491 9.031 11.9009 9.031 11.9009C8.78517 11.7983 8.5755 11.6281 8.42771 11.4112C8.27992 11.1944 8.20043 10.9403 8.199 10.6801ZM15.4688 11.7239C15.3803 11.9394 15.2995 12.1444 15.2264 12.3388C15.1534 12.5327 15.0853 12.719 15.0221 12.8977H15.0026C14.9395 12.7172 14.8726 12.5248 14.803 12.3343C14.7337 12.1435 14.6544 11.94 14.5653 11.7239L13.5197 8.96456H13.0443L14.7937 13.4025H15.1837L17 8.96456H16.5246L15.4688 11.7239ZM11.5214 7.98758L11.0646 8.15372V8.96637H10.3143V9.31761H11.0655V12.1293C11.0641 12.3137 11.0802 12.4978 11.1138 12.6792C11.139 12.8333 11.1955 12.981 11.28 13.1135C11.3602 13.2338 11.4717 13.3313 11.6031 13.3962C11.765 13.4698 11.9427 13.5045 12.1213 13.4973C12.3294 13.5055 12.5369 13.471 12.7304 13.3962L12.6831 13.063C12.6145 13.0839 12.5444 13.0993 12.4732 13.109C12.3757 13.1226 12.2773 13.1287 12.1789 13.1271C12.08 13.1363 11.9805 13.1193 11.8909 13.0778C11.8012 13.0363 11.7249 12.9718 11.67 12.8914C11.5595 12.6829 11.5082 12.4494 11.5214 12.2151V9.31941H12.7861V8.96456H11.5214V7.98758Z" fill="black"/>
      </svg>
    `;
  }

  render() {
    if (!this.hass) {
      return html`<div class="error-message">Loading...</div>`;
    }

    const entity = this.hass.states[this.config.entity];
    if (!entity) {
      return html`<div class="error-message">Entity not found: ${this.config.entity}</div>`;
    }

    const statusText = this._getStatusText(entity);

    return html`
      <div class="wrapper" @click=${this._handleClick}>
        <div class="title">
          <div class="title-text">${this.config.name}</div>
          <div class="icon">
            ${this._renderIcon()}
          </div>
        </div>
        <div class="status-row">
          <div class="status-text">${statusText}</div>
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 1;
  }

  static getStubConfig() {
    return {
      entity: 'media_player.apple_tv',
      name: 'Apple TV',
      type: 'apple_tv'
    };
  }
}

if (!customElements.get("apple-tv-status-card")) {
  customElements.define("apple-tv-status-card", AppleTvStatusCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "apple-tv-status-card",
  name: "Apple TV Status Card",
  description: "A compact card showing Apple TV or Samsung TV status",
  preview: true,
});
