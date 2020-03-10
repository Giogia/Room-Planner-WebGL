import { EventDispatcher, Texture } from 'three';
import { ExpressionNode, ExpressionTerm, FunctionNode, HexNode, IdentNode, Operator, OperatorNode } from '../styles/parsers.js';
export declare const elementFromLocalPoint: (document: Document | ShadowRoot, x: number, y: number) => Element | null;
export declare const pickShadowDescendant: (element: Element, x?: number, y?: number) => Element | null;
export declare const timePasses: (ms?: number) => Promise<void>;
export declare type PredicateFunction<T = void> = (value: T) => boolean;
/**
 * Three.js EventDispatcher and DOM EventTarget use different event patterns,
 * so AnyEvent covers the shape of both event types.
 */
export declare type AnyEvent = Event | CustomEvent<any> | {
    [index: string]: string;
};
export declare const until: (predicate: PredicateFunction<void>) => Promise<void>;
export declare const rafPasses: () => Promise<void>;
/**
 * Takes a texture and an object and returns a boolean indicating
 * if whether or not the texture's userData matches the fields
 * defined on the `meta` object.
 *
 * @param {THREE.Texture}
 * @param {Object}
 * @return {boolean}
 */
export declare const textureMatchesMeta: (texture: Texture, meta: {
    [index: string]: any;
}) => boolean;
/**
 * @param {EventTarget|EventDispatcher} target
 * @param {string} eventName
 * @param {?Function} predicate
 */
export declare const waitForEvent: <T extends AnyEvent = Event>(target: EventTarget | EventDispatcher, eventName: string, predicate?: PredicateFunction<T> | null) => Promise<T>;
export interface SyntheticEventProperties {
    clientX?: number;
    clientY?: number;
    deltaY?: number;
    keyCode?: number;
}
/**
 * Dispatch a synthetic event on a given element with a given type, and
 * optionally with custom event properties. Returns the dispatched event.
 *
 * @param {HTMLElement} element
 * @param {type} string
 * @param {*} properties
 */
export declare const dispatchSyntheticEvent: (target: EventTarget, type: string, properties?: SyntheticEventProperties) => CustomEvent<any>;
export declare const ASSETS_DIRECTORY = "../shared-assets/";
/**
 * Returns the full path for an asset by name. This is a convenience helper so
 * that we don't need to change paths throughout all test suites if we ever
 * decide to move files around.
 *
 * @param {string} name
 * @return {string}
 */
export declare const assetPath: (name: string) => string;
/**
 * Returns true if the given element is in the tree of the document of the
 * current frame.
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */
export declare const isInDocumentTree: (node: Node) => boolean;
/**
 * "Spies" on a particular object by replacing a specified part of its
 * implementation with a custom version. Returns a function that restores the
 * original implementation to the object when invoked.
 */
export declare const spy: (object: Object, property: string, descriptor: PropertyDescriptor) => () => void;
/**
 * Helpers to assist in generating AST test fixtures
 */
export declare const expressionNode: (terms: ExpressionTerm[]) => ExpressionNode;
export declare const hexNode: (value: string) => HexNode;
export declare const identNode: (value: string) => IdentNode;
export declare const operatorNode: (value: Operator) => OperatorNode;
export declare const functionNode: (name: string, args: ExpressionNode[]) => FunctionNode;
