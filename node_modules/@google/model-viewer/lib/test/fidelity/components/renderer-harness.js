/* @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, customElement, html, LitElement, property } from 'lit-element';
import { ConfigReader } from '../config-reader.js';
let RendererConfiguration = class RendererConfiguration extends LitElement {
    constructor() {
        super(...arguments);
        this.scenarioName = null;
        this.configUrl = null;
        this.hideUi = false;
        this.config = null;
        this.scenario = null;
    }
    connectedCallback() {
        super.connectedCallback();
        const { queryParameters } = this;
        this.configUrl = queryParameters.config || '../../config.json';
        this.scenarioName = queryParameters.scenario || null;
        this.hideUi = 'hide-ui' in queryParameters || false;
    }
    get queryParameters() {
        return self.location.search.slice(1).split('&').reduce((queryParameters, parameter) => {
            const [key, value] = parameter.split('=');
            queryParameters[key] = decodeURIComponent(value);
            return queryParameters;
        }, {});
    }
    async updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('configUrl')) {
            if (this.configUrl == null) {
                this.config = null;
            }
            else {
                this.config = await (await fetch(this.configUrl)).json();
            }
        }
        if (changedProperties.has('scenarioName') ||
            changedProperties.has('config')) {
            if (this.scenarioName == null || this.config == null) {
                this.scenario = null;
            }
            else {
                this.scenario =
                    (new ConfigReader(this.config)).scenarioConfig(this.scenarioName);
                this.dispatchEvent(new CustomEvent('scenario-change', { detail: { scenario: this.scenario } }));
            }
            const previousScenarioName = changedProperties.get('scenarioName');
            if (previousScenarioName != null && this.scenarioName != null) {
                const url = new URL(window.location.toString());
                url.search = url.search.replace(`scenario=${encodeURIComponent(previousScenarioName)}`, `scenario=${encodeURIComponent(this.scenarioName)}`);
                history.pushState(null, document.title, url.toString());
            }
        }
    }
    static get styles() {
        return css `
:host {
  display: flex;
  flex-direction: column;
  font-family: system-ui, sans-serif;
  color: #fafafa;
}

#widgets {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #444;
  padding: 0 1em;
  min-height: 4em;
}

#widgets > * {
  margin-right: 1em;
}

#widgets.hidden {
  display: none;
}

#renderer {
  max-width: 100%;
  overflow: auto;
}
`;
    }
    render() {
        const widgets = [];
        if (this.config != null) {
            const scenarioOptions = this.config.scenarios.map(scenario => html `<option ?selected="${scenario.name === this.scenarioName}">${scenario.name}</option>`);
            widgets.push(html `
<select @change="${(event) => this.scenarioName =
                (event.target != null ?
                    event.target.value :
                    this.scenarioName)}">
  ${scenarioOptions}
</select>`);
        }
        return html `
<div id="widgets" class="${this.hideUi ? 'hidden' : ''}">
  <h2><slot name="title"></slot></h2>
  ${widgets}
</div>
<div id="renderer" .style="${this.hideUi ? 'overflow: visible' : ''}">
  <slot name="renderer"></slot>
</div>
`;
    }
};
__decorate([
    property({ type: String, attribute: 'scenario-name' })
], RendererConfiguration.prototype, "scenarioName", void 0);
__decorate([
    property({ type: String, attribute: 'config-url' })
], RendererConfiguration.prototype, "configUrl", void 0);
__decorate([
    property({ type: Boolean, attribute: 'hide-ui' })
], RendererConfiguration.prototype, "hideUi", void 0);
__decorate([
    property({ type: Object })
], RendererConfiguration.prototype, "config", void 0);
__decorate([
    property({ type: Object })
], RendererConfiguration.prototype, "scenario", void 0);
RendererConfiguration = __decorate([
    customElement('renderer-harness')
], RendererConfiguration);
export { RendererConfiguration };
//# sourceMappingURL=renderer-harness.js.map