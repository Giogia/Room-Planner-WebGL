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
import './analysis-view.js';
import './rendering-scenario.js';
import { html, LitElement, property } from 'lit-element';
export class ImageComparisonApp extends LitElement {
    constructor() {
        super(...arguments);
        this.src = '';
        this.config = null;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('src')) {
            this.loadConfig();
        }
    }
    async loadConfig() {
        if (this.src) {
            this.config = await (await fetch(this.src)).json();
        }
        else {
            this.config = null;
        }
    }
    render() {
        const { config } = this;
        if (config == null) {
            return this.src ? html `Loading...` : html `No config specified`;
        }
        const goldens = config.renderers.map(renderer => (Object.assign({}, renderer, { file: `${renderer.name}-golden.png` })));
        const scenarios = config.scenarios.map((scenario) => html `
<rendering-scenario
    .name="${scenario.name}"
    .goldens="${goldens}"
    .dimensions="${scenario.dimensions}"
    .exclude="${scenario.exclude || []}">
</rendering-scenario>`);
        return html `
<style>
#scenarios {
  display: flex;
  max-width: 100%;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5em;
}
</style>
<div id="scenarios">
  ${scenarios}
</div>
<analysis-view></analysis-view>`;
    }
}
__decorate([
    property({ type: String })
], ImageComparisonApp.prototype, "src", void 0);
__decorate([
    property({ type: Object })
], ImageComparisonApp.prototype, "config", void 0);
;
customElements.define('image-comparison-app', ImageComparisonApp);
//# sourceMappingURL=image-comparison-app.js.map