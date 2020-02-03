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
import { colorDelta } from '../../third_party/pixelmatch/color-delta.js';
export const COMPONENTS_PER_PIXEL = 4;
// 35215 is the maximum possible value for the YIQ difference metric
// @see https://github.com/mapbox/pixelmatch/blob/master/index.js#L14
// @see http://www.progmat.uaem.mx:8080/artVol2Num2/Articulo3Vol2Num2.pdf
export const MAX_COLOR_DISTANCE = 35215;
export class ImageComparator {
    constructor(candidateImage, goldenImage, dimensions) {
        this.candidateImage = candidateImage;
        this.goldenImage = goldenImage;
        this.dimensions = dimensions;
        const { width, height } = dimensions;
        this.imagePixels = width * height;
    }
    drawPixel(image, position, r, g, b, a = 255) {
        image[position + 0] = r;
        image[position + 1] = g;
        image[position + 2] = b;
        image[position + 3] = a;
    }
    analyze(threshold, options = {
        generateVisuals: true
    }) {
        const { candidateImage, goldenImage } = this;
        const { width, height } = this.dimensions;
        const { generateVisuals } = options;
        const blackWhiteImage = generateVisuals ?
            new Uint8ClampedArray(this.imagePixels * COMPONENTS_PER_PIXEL) :
            null;
        const deltaImage = generateVisuals ?
            new Uint8ClampedArray(this.imagePixels * COMPONENTS_PER_PIXEL) :
            null;
        const thresholdSquared = threshold * threshold;
        let matched = 0;
        let sum = 0;
        let mismatchingSum = 0;
        let maximumDeltaIntensity = 0;
        if (candidateImage.length != goldenImage.length) {
            throw new Error(`Image sizes do not match (candidate: ${candidateImage.length}, golden: ${goldenImage.length})`);
        }
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const index = y * width + x;
                const position = index * COMPONENTS_PER_PIXEL;
                const delta = colorDelta(candidateImage, goldenImage, position, position);
                const exactlyMatched = (delta <= thresholdSquared ? 1 : 0) * 255;
                if (exactlyMatched) {
                    matched++;
                }
                else {
                    mismatchingSum += delta;
                }
                const thresholdDelta = Math.max(0, delta - thresholdSquared);
                sum += thresholdDelta;
                if (generateVisuals) {
                    const deltaIntensity = Math.round(255 * thresholdDelta / MAX_COLOR_DISTANCE);
                    maximumDeltaIntensity =
                        Math.max(deltaIntensity, maximumDeltaIntensity);
                    this.drawPixel(blackWhiteImage, position, exactlyMatched, exactlyMatched, exactlyMatched);
                    this.drawPixel(deltaImage, position, 255, 255 - deltaIntensity, 255 - deltaIntensity);
                }
            }
        }
        if (generateVisuals) {
            for (let y = 0; y < height; ++y) {
                for (let x = 0; x < width; ++x) {
                    const index = y * width + x;
                    const position = index * COMPONENTS_PER_PIXEL;
                    const absoluteDeltaIntensity = 255 - deltaImage[position + 1];
                    const relativeDeltaIntensity = Math.round(255 - 255 * (absoluteDeltaIntensity / maximumDeltaIntensity));
                    this.drawPixel(deltaImage, position, 255, relativeDeltaIntensity, relativeDeltaIntensity);
                }
            }
        }
        const mismatchingPixels = this.imagePixels - matched;
        const mismatchingAverageDistanceRatio = mismatchingPixels > 0 ?
            mismatchingSum / (this.imagePixels - matched) / MAX_COLOR_DISTANCE :
            0;
        const averageDistanceRatio = sum / this.imagePixels / MAX_COLOR_DISTANCE;
        return {
            analysis: {
                matchingRatio: matched / this.imagePixels,
                averageDistanceRatio,
                mismatchingAverageDistanceRatio,
            },
            imageBuffers: {
                delta: deltaImage ? deltaImage.buffer : null,
                blackWhite: blackWhiteImage ? blackWhiteImage.buffer :
                    null
            }
        };
    }
}
//# sourceMappingURL=common.js.map