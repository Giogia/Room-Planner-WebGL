import ModelViewerElementBase from '../model-viewer-base.js';
import { Constructor } from '../utilities.js';
export declare interface MagicLeapInterface {
    magicLeap: boolean;
}
/**
 * In order to use Magic Leap support, please include prismatic.js in your
 * page. If you do not include prismatic.js, Magic Leap support will not work.
 *
 * @see https://www.npmjs.com/package/@magicleap/prismatic
 */
export declare const MagicLeapMixin: <T extends Constructor<ModelViewerElementBase, object>>(ModelViewerElement: T) => {
    new (...args: any[]): MagicLeapInterface;
    prototype: MagicLeapInterface;
} & object & T;
