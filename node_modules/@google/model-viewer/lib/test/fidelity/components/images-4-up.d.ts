import '../image-accessor.js';
import './magnifying-glass.js';
import { LitElement } from 'lit-element';
import { Dimensions, Pixel, Rect } from '../common.js';
import { ImageAccessor } from '../image-accessor.js';
export declare class Images4Up extends LitElement {
    topLeftImageAccessor: ImageAccessor | null;
    topRightImageAccessor: ImageAccessor | null;
    bottomLeftImageAccessor: ImageAccessor | null;
    bottomRightImageAccessor: ImageAccessor | null;
    magnifiedPixel: Pixel | null;
    dimensions: Dimensions;
    protected containerRect: Rect;
    localCoordinateToImagePixel(localX: number, localY: number): Pixel;
    protected selectPixel(pixel: Pixel): void;
    onPointerEvent(event: PointerEvent): void;
    connectedCallback(): void;
    updateSize(): void;
    updated(changedProperties: Map<string, any>): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
