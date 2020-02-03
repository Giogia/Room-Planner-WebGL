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
import { html, LitElement, property } from 'lit-element';
const PIXEL_SIZE = 10;
export class MagnifyingGlass extends LitElement {
    constructor() {
        super(...arguments);
        this.imageAccessor = null;
        this.pixel = null;
        this.direction = 'vertical';
        this.position = { x: 0, y: 0 };
        this.context = null;
        this.xRay = true;
        this.reticleSize = 1;
    }
    enhance() {
        if (this.pixel == null || this.imageAccessor == null) {
            return;
        }
        this.classList.remove('hidden');
        if (this.context == null) {
            const canvas = this.shadowRoot.querySelector('canvas');
            if (canvas == null) {
                return;
            }
            this.context = canvas.getContext('2d');
        }
        const { context } = this;
        const rect = this.getBoundingClientRect();
        const scale = rect.width / this.imageAccessor.width;
        for (let y = 0; y < 24; ++y) {
            for (let x = 0; x < 24; ++x) {
                context.fillStyle = this.imageAccessor.cssColorAt(this.pixel.x + x - 12, this.pixel.y + y - 12);
                context.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
        this.reticleSize = Math.round(26 * scale);
        this.position = {
            x: this.pixel.x * scale - 130,
            y: this.pixel.y * scale - 130
        };
    }
    toggleXRay() {
        this.xRay = !this.xRay;
    }
    hide() {
        this.classList.add('hidden');
    }
    get glassPosition() {
        const { width, height } = this.imageAccessor != null ? this.imageAccessor : { width: 0, height: 0 };
        const { x, y } = this.pixel != null ? this.pixel : { x: 0, y: 0 };
        return this.direction === 'horizontal' ?
            x < (width / 2) ? 'right' : 'left' :
            y < (height / 2) ? 'bottom' : 'top';
    }
    render() {
        this.enhance();
        return html `
<style>
:host {
  display: block;
  position: relative;
}

#glass {
  display: block;
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 260px;
  height: 260px;
  transition: transform 0.1s;
  z-index: 1;
  background-color: transparent;
}

canvas {
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(40, 40, 40, 0.25);
  width: 100%;
  height: 100%;
  transition: opacity 0.3s, transform 0.5s;
  opacity: 1;
}

#glass.top canvas {
  transform: translate(0, -180px);
}

#glass.bottom canvas {
  transform: translate(0, 180px);
}

#glass.left canvas {
  transform: translate(-180px, 0);
}

#glass.right canvas {
  transform: translate(180px, 0);
}

#glass:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(calc(-50% + 130px), calc(130px - var(--reticle-size) / 2));
  box-sizing: border-box;
  border: 1px solid black;
  width: var(--reticle-size);
  height: var(--reticle-size);
}

#glass:after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(calc(-50% + 130px), calc(129px - var(--reticle-size) / 2));
  box-sizing: border-box;

  border: 1px solid white;

  width: calc(var(--reticle-size) + 2px);
  height: calc(var(--reticle-size) + 2px);
}

:host(.hidden) canvas {
  opacity: 0;
}
</style>
<slot></slot>
<div id="glass"
    class="${this.glassPosition}"
    style="transform: translate(${this.position.x}px, ${this.position.y}px); --reticle-size: ${this.reticleSize}px"
    @click="${() => this.toggleXRay()}">
  <canvas style="opacity: ${this.xRay ? 0 : 1};" width="240" height="240">
</div>
</canvas>
`;
    }
}
__decorate([
    property({ type: Object })
], MagnifyingGlass.prototype, "imageAccessor", void 0);
__decorate([
    property({ type: Object })
], MagnifyingGlass.prototype, "pixel", void 0);
__decorate([
    property({ type: String })
], MagnifyingGlass.prototype, "direction", void 0);
__decorate([
    property({ type: Object })
], MagnifyingGlass.prototype, "position", void 0);
__decorate([
    property({ type: Boolean })
], MagnifyingGlass.prototype, "xRay", void 0);
__decorate([
    property({ type: Number })
], MagnifyingGlass.prototype, "reticleSize", void 0);
customElements.define('magnifying-glass', MagnifyingGlass);
//# sourceMappingURL=magnifying-glass.js.map