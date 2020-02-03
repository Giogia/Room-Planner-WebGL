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
import { ImageComparator } from './common.js';
class ImageComparisonWorker {
    constructor() {
        this.analyzer = null;
        this.candidateCanvas = null;
        this.candidateContext = null;
        this.goldenCanvas = null;
        this.goldenContext = null;
        this.blackWhiteCanvas = null;
        this.blackWhiteContext = null;
        this.deltaCanvas = null;
        this.deltaContext = null;
        self.onmessage = (event) => this.onGlobalMessage(event);
    }
    onMessage(event, port) {
        const data = event.data;
        switch (data.type) {
            case 'canvases-ready': {
                const { candidateCanvas, goldenCanvas, blackWhiteCanvas, deltaCanvas } = data;
                this.candidateCanvas = candidateCanvas;
                this.candidateContext = candidateCanvas.getContext('2d');
                this.goldenCanvas = goldenCanvas;
                this.goldenContext = goldenCanvas.getContext('2d');
                this.blackWhiteCanvas = blackWhiteCanvas;
                this.blackWhiteContext = blackWhiteCanvas.getContext('2d');
                this.deltaCanvas = deltaCanvas;
                this.deltaContext = deltaCanvas.getContext('2d');
                break;
            }
            case 'images-assigned': {
                const { candidateImageBuffer, goldenImageBuffer, dimensions } = data;
                if (this.candidateCanvas == null || this.goldenCanvas == null ||
                    this.blackWhiteCanvas == null || this.deltaCanvas == null) {
                    console.warn('Images assigned before canvases are available!');
                }
                this.candidateCanvas.width = this.goldenCanvas.width =
                    this.blackWhiteCanvas.width = this.deltaCanvas.width =
                        dimensions.width;
                this.candidateCanvas.height = this.goldenCanvas.height =
                    this.blackWhiteCanvas.height = this.deltaCanvas.height =
                        dimensions.height;
                const candidateArray = new Uint8ClampedArray(candidateImageBuffer);
                const goldenArray = new Uint8ClampedArray(goldenImageBuffer);
                const { width, height } = dimensions;
                this.analyzer =
                    new ImageComparator(candidateArray, goldenArray, dimensions);
                this.candidateContext.putImageData(new ImageData(candidateArray, width, height), 0, 0);
                this.goldenContext.putImageData(new ImageData(goldenArray, width, height), 0, 0);
                break;
            }
            case 'threshold-changed': {
                const { threshold } = data;
                const { analyzer } = this;
                if (analyzer == null) {
                    console.warn(`Analyzer not created!`);
                    return;
                }
                const { width, height } = this.analyzer.dimensions;
                const result = analyzer.analyze(threshold, { generateVisuals: true });
                this.blackWhiteContext.putImageData(new ImageData(new Uint8ClampedArray(result.imageBuffers.blackWhite), width, height), 0, 0);
                this.deltaContext.putImageData(new ImageData(new Uint8ClampedArray(result.imageBuffers.delta), width, height), 0, 0);
                port.postMessage({ type: 'analysis-completed', result });
                break;
            }
            default:
                break;
        }
    }
    onGlobalMessage(event) {
        event.ports.forEach(port => port.onmessage = (event) => this.onMessage(event, port));
    }
}
self.imageComparisonWorker = new ImageComparisonWorker();
//# sourceMappingURL=image-comparison-worker.js.map