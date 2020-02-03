import { LitElement } from 'lit-element';
import { Dimensions, GoldenConfig } from '../common.js';
export declare class RenderingScenario extends LitElement {
    name: string;
    goldens: Array<GoldenConfig>;
    dimensions: Dimensions;
    exclude: Array<string>;
    readonly basePath: string;
    render(): import("lit-element").TemplateResult;
}
