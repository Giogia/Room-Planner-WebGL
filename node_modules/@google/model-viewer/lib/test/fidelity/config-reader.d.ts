import { Dimensions, ImageComparisonConfig, RendererConfig, ScenarioConfig } from './common.js';
export declare class ConfigReader {
    readonly config: ImageComparisonConfig;
    constructor(config: ImageComparisonConfig);
    scenarioConfig(name: string): ScenarioConfig | null;
    rendererConfig(name: string): RendererConfig | null;
    dimensionsForScenario(name: string): Dimensions;
}
