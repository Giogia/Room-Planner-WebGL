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
import '../image-accessor.js';
import './magnifying-glass.js';
import { html, LitElement, property } from 'lit-element';
export class Images4Up extends LitElement {
    constructor() {
        super(...arguments);
        this.topLeftImageAccessor = null;
        this.topRightImageAccessor = null;
        this.bottomLeftImageAccessor = null;
        this.bottomRightImageAccessor = null;
        this.magnifiedPixel = null;
        this.dimensions = { width: 0, height: 0 };
        this.containerRect = { x: 0, y: 0, width: 0, height: 0 };
    }
    localCoordinateToImagePixel(localX, localY) {
        const constrainedX = Math.min(Math.max(localX - this.containerRect.x, -1), this.containerRect.width + 1);
        const constrainedY = Math.min(Math.max(localY - this.containerRect.y, -1), this.containerRect.height + 1);
        const scaledWidth = this.containerRect.width / 2;
        const scaledHeight = this.containerRect.height / 2;
        const scale = this.dimensions.width / scaledWidth;
        return {
            x: Math.floor((constrainedX % scaledWidth) * scale),
            y: Math.floor((constrainedY % scaledHeight) * scale)
        };
    }
    selectPixel(pixel) {
        this.magnifiedPixel = pixel;
        this.dispatchEvent(new CustomEvent('select-pixel', { detail: pixel }));
    }
    onPointerEvent(event) {
        const pixel = this.localCoordinateToImagePixel(event.x, event.y);
        if (pixel.x > -1 && pixel.x < this.dimensions.width && pixel.y > -1 &&
            pixel.y < this.dimensions.height) {
            this.selectPixel(pixel);
        }
        else {
            this.magnifiedPixel = null;
        }
    }
    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        self.addEventListener('resize', (_event) => this.updateSize());
    }
    updateSize() {
        const rect = this.getBoundingClientRect();
        const { width: containerWidth, height: containerHeight } = rect;
        const fourUpWidth = 2 * this.dimensions.width;
        const fourUpHeight = 2 * this.dimensions.height;
        const containerAspectRatio = containerWidth / containerHeight;
        const fourUpAspectRatio = fourUpWidth / fourUpHeight;
        const scale = fourUpAspectRatio < containerAspectRatio ?
            containerHeight / fourUpHeight :
            containerWidth / fourUpWidth;
        const width = scale * fourUpWidth;
        const height = scale * fourUpHeight;
        const x = (containerWidth - width) / 2;
        const y = (containerHeight - height) / 2;
        this.containerRect = { x, y, width, height };
    }
    async updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('dimensions') && this.dimensions != null) {
            this.updateSize();
            this.selectPixel({
                x: Math.floor(this.dimensions.width / 2),
                y: Math.floor(this.dimensions.height / 2)
            });
        }
    }
    render() {
        const { x, y, width, height } = this.containerRect;
        return html `
<style>
:host {
  display: block;
  position: relative;
}

magnifying-glass {
  flex: 1 1 50%;
  width: 50%;
  height: 50%;
}

#container {
  display: flex;
  cursor: crosshair;
  position: absolute;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
}

#magnifier-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<div id="container"
    @pointermove="${(event) => this.onPointerEvent(event)}"
    @pointerdown="${(event) => this.onPointerEvent(event)}"
    style="transform: translate(${x}px, ${y}px);
           width: ${width}px;
           height: ${height}px">
  <magnifying-glass id="top-left"
      .pixel="${this.magnifiedPixel}"
      .imageAccessor="${this.topLeftImageAccessor}">
    <slot name="top-left"></slot>
  </magnifying-glass>
  <magnifying-glass id="top-right"
      .pixel="${this.magnifiedPixel}"
      .imageAccessor="${this.topRightImageAccessor}">
    <slot name="top-right"></slot>
  </magnifying-glass>
  <magnifying-glass id="bottom-left"
      .pixel="${this.magnifiedPixel}"
      .imageAccessor="${this.bottomLeftImageAccessor}">
    <slot name="bottom-left"></slot>
  </magnifying-glass>
  <magnifying-glass id="bottom-right"
      .pixel="${this.magnifiedPixel}"
      .imageAccessor="${this.bottomRightImageAccessor}">
    <slot name="bottom-right"></slot>
  </magnifying-glass>
</div>`;
    }
}
__decorate([
    property({ type: Object })
], Images4Up.prototype, "topLeftImageAccessor", void 0);
__decorate([
    property({ type: Object })
], Images4Up.prototype, "topRightImageAccessor", void 0);
__decorate([
    property({ type: Object })
], Images4Up.prototype, "bottomLeftImageAccessor", void 0);
__decorate([
    property({ type: Object })
], Images4Up.prototype, "bottomRightImageAccessor", void 0);
__decorate([
    property({ type: Object })
], Images4Up.prototype, "magnifiedPixel", void 0);
__decorate([
    property({ type: Object })
], Images4Up.prototype, "dimensions", void 0);
__decorate([
    property({ type: Object })
], Images4Up.prototype, "containerRect", void 0);
customElements.define('images-4-up', Images4Up);
//# sourceMappingURL=images-4-up.js.map