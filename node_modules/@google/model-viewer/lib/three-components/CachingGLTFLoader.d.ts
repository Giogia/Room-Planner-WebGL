import { Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CacheEvictionPolicy } from '../utilities/cache-eviction-policy.js';
import { Gltf } from './ModelUtils.js';
export declare type ProgressCallback = (progress: number) => void;
export declare const loadWithLoader: (url: string, loader: any, progressCallback?: ProgressCallback) => Promise<Gltf>;
export declare const $releaseFromCache: unique symbol;
export interface CacheRetainedScene extends Scene {
    [$releaseFromCache]: () => void;
}
export declare const $evictionPolicy: unique symbol;
export declare class CachingGLTFLoader {
    static [$evictionPolicy]: CacheEvictionPolicy;
    static readonly cache: Map<string, Promise<Gltf>>;
    /** @nocollapse */
    static clearCache(): void;
    static has(url: string): boolean;
    /** @nocollapse */
    static delete(url: string): Promise<void>;
    /**
     * Returns true if the model that corresponds to the specified url is
     * available in our local cache.
     */
    static hasFinishedLoading(url: string): boolean;
    protected loader: GLTFLoader;
    protected readonly [$evictionPolicy]: CacheEvictionPolicy;
    /**
     * Preloads a glTF, populating the cache. Returns a promise that resolves
     * when the cache is populated.
     */
    preload(url: string, progressCallback?: ProgressCallback): Promise<void>;
    /**
     * Loads a glTF from the specified url and resolves a unique clone of the
     * glTF. If the glTF has already been loaded, makes a clone of the cached
     * copy.
     */
    load(url: string, progressCallback?: ProgressCallback): Promise<CacheRetainedScene | null>;
}
