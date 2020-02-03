import './images-4-up.js';
import '@polymer/paper-slider';
import { LitElement } from 'lit-element';
import { Dimensions, ImageComparisonResults } from '../common.js';
import { ImageAccessor } from '../image-accessor.js';
export declare class AnalysisView extends LitElement {
    leftImage: HTMLImageElement | null;
    rightImage: HTMLImageElement | null;
    analysisResult: ImageComparisonResults | null;
    protected leftImageAccessor: ImageAccessor | null;
    protected rightImageAccessor: ImageAccessor | null;
    protected blackWhiteImageAccessor: ImageAccessor | null;
    protected deltaImageAccessor: ImageAccessor | null;
    protected threshold: number;
    protected worker: Worker;
    protected port: MessagePort;
    constructor();
    onMessage(event: MessageEvent): void;
    connectedCallback(): Promise<void>;
    readonly canCompareImages: boolean;
    deselect(element: HTMLImageElement): void;
    select(element: HTMLImageElement): void;
    enterAnalysisView(): void;
    exitAnalysisView(): void;
    reset(): void;
    readonly comparisonDimensions: Dimensions;
    updated(changedProperties: Map<string, any>): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
