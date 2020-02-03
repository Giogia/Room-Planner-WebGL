import './analysis-view.js';
import './rendering-scenario.js';
import { LitElement } from 'lit-element';
import { ImageComparisonConfig } from '../common.js';
export declare class ImageComparisonApp extends LitElement {
    src: string;
    config: ImageComparisonConfig | null;
    updated(changedProperties: Map<any, any>): void;
    private loadConfig;
    render(): import("lit-element").TemplateResult;
}
