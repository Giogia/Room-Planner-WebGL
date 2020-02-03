export interface OffscreenCanvas extends HTMLCanvasElement {
}
export declare const COMPONENTS_PER_PIXEL: number;
export declare const MAX_COLOR_DISTANCE: number;
export interface ImageComparisonAnalysis {
    matchingRatio: number;
    averageDistanceRatio: number;
    mismatchingAverageDistanceRatio: number;
}
export interface ImageComparisonResults {
    analysis: ImageComparisonAnalysis;
    imageBuffers: {
        delta: ArrayBuffer | null;
        blackWhite: ArrayBuffer | null;
    };
}
export interface ImageComparisonMessage {
    type: 'canvases-ready' | 'images-assigned' | 'threshold-changed' | 'analysis-completed';
}
export interface CanvasesReadyMessage extends ImageComparisonMessage {
    candidateCanvas: OffscreenCanvas;
    goldenCanvas: OffscreenCanvas;
    blackWhiteCanvas: OffscreenCanvas;
    deltaCanvas: OffscreenCanvas;
}
export interface ImagesAssignedMessage extends ImageComparisonMessage {
    candidateImageBuffer: ArrayBuffer;
    goldenImageBuffer: ArrayBuffer;
    dimensions: Dimensions;
}
export interface ThresholdChangedMessage extends ImageComparisonMessage {
    threshold: number;
}
export interface AnalysisCompletedMessage extends ImageComparisonMessage {
    result: ImageComparisonResults;
}
export interface Dimensions {
    width: number;
    height: number;
}
export interface Pixel {
    x: number;
    y: number;
}
export interface Rect extends Dimensions {
    x: number;
    y: number;
}
export interface ScenarioConfig {
    name: string;
    model: string;
    lighting: string;
    dimensions: Dimensions;
    target: {
        x: number;
        y: number;
        z: number;
    };
    orbit: {
        theta: number;
        phi: number;
        radius: number;
    };
    verticalFoV: number;
    exclude?: Array<string>;
}
export interface RendererConfig {
    name: string;
    description: string;
    scripts?: {
        setup: string;
    };
}
export interface GoldenConfig extends RendererConfig {
    file: string;
}
export interface ImageComparisonConfig {
    rootDirectory: string;
    analysisThresholds: Array<number>;
    renderers: Array<RendererConfig>;
    scenarios: Array<ScenarioConfig>;
}
export interface ComparableImage {
    [index: number]: number;
    length: number;
}
export interface AnalysisOptions {
    generateVisuals: boolean;
}
export declare class ImageComparator {
    protected candidateImage: ComparableImage;
    protected goldenImage: ComparableImage;
    readonly dimensions: Dimensions;
    protected imagePixels: number;
    constructor(candidateImage: ComparableImage, goldenImage: ComparableImage, dimensions: Dimensions);
    protected drawPixel(image: ComparableImage, position: number, r: number, g: number, b: number, a?: number): void;
    analyze(threshold: number, options?: AnalysisOptions): ImageComparisonResults;
}
