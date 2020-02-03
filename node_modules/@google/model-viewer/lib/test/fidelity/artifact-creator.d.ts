/// <reference types="node" />
import { ImageComparisonAnalysis, ImageComparisonConfig, GoldenConfig, ScenarioConfig, Dimensions } from './common.js';
declare const $configReader: unique symbol;
export declare type AnalysisResults = Array<Array<ImageComparisonAnalysis>>;
export interface ScenarioRecord extends ScenarioConfig {
    analysisResults: AnalysisResults;
}
export declare class ArtifactCreator {
    protected config: ImageComparisonConfig;
    protected rootDirectory: string;
    protected baseUrl: string;
    private [$configReader];
    constructor(config: ImageComparisonConfig, rootDirectory: string, baseUrl: string);
    protected readonly outputDirectory: string;
    protected readonly goldens: Array<GoldenConfig>;
    captureAndAnalyzeScreenshots(scenarioWhitelist?: Set<string> | null): Promise<ScenarioConfig[]>;
    protected analyze(screenshot: Buffer, goldens: Array<GoldenConfig>, scenario: ScenarioConfig, dimensions: Dimensions, analysisThresholds: Array<number>): Promise<AnalysisResults>;
    captureScreenshot(renderer: string, scenarioName: string, dimensions: Dimensions, outputPath?: string): Promise<any>;
}
export {};
