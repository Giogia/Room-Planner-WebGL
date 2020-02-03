import { LitElement } from 'lit-element';
import { Pixel } from '../common.js';
import { ImageAccessor } from '../image-accessor.js';
export declare class MagnifyingGlass extends LitElement {
    imageAccessor: ImageAccessor | null;
    pixel: Pixel | null;
    direction: string;
    position: Pixel;
    protected context: CanvasRenderingContext2D | null;
    protected xRay: boolean;
    protected reticleSize: number;
    protected enhance(): void;
    toggleXRay(): void;
    protected hide(): void;
    readonly glassPosition: "left" | "right" | "top" | "bottom";
    render(): import("lit-element").TemplateResult;
}
