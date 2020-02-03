import { LitElement } from 'lit-element';
import { ImageComparisonConfig, ScenarioConfig } from '../common.js';
export declare class RendererConfiguration extends LitElement {
    scenarioName: string | null;
    configUrl: string | null;
    hideUi: boolean;
    protected config: ImageComparisonConfig | null;
    protected scenario: ScenarioConfig | null;
    connectedCallback(): void;
    protected readonly queryParameters: {
        [index: string]: string;
    };
    updated(changedProperties: Map<string, any>): Promise<void>;
    static readonly styles: import("lit-element").CSSResult;
    render(): import("lit-element").TemplateResult;
}
