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
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
export class ImageAccessor {
    constructor(source) {
        this.source = source;
    }
    static fromArrayBuffer(buffer, width, height) {
        return new ImageAccessor(new ImageData(new Uint8ClampedArray(buffer), width, height));
    }
    static fromImageElement(image) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0);
        return new ImageAccessor(context.getImageData(0, 0, canvas.width, canvas.height));
    }
    toArrayBuffer() {
        const { buffer } = this.source.data;
        return buffer.slice(0, buffer.byteLength);
    }
    cssColorAt(x, y) {
        if (x < 0 || y < 0 || x > (this.width - 1) || y > (this.height - 1)) {
            return 'black';
        }
        const position = (y * this.width + x) * 4;
        const array = this.source.data;
        const color = `rgb(${array[position]}, ${array[position + 1]}, ${array[position + 2]})`;
        return color;
    }
    get width() {
        return this.source.width;
    }
    get height() {
        return this.source.height;
    }
}
//# sourceMappingURL=image-accessor.js.map