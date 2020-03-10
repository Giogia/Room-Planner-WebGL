/* @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _a, _b;
import { BackSide, DoubleSide, FrontSide, Mesh } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
import { CacheEvictionPolicy } from '../utilities/cache-eviction-policy.js';
import { cloneGltf } from './ModelUtils.js';
import { Renderer } from './Renderer.js';
/**
 * A helper to Promise-ify a Three.js GLTFLoader
 */
export const loadWithLoader = (url, loader, progressCallback = () => { }) => {
    const onProgress = (event) => {
        progressCallback(event.loaded / event.total);
    };
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, onProgress, reject);
    });
};
export const $releaseFromCache = Symbol('releaseFromCache');
const cache = new Map();
const preloaded = new Map();
export const $evictionPolicy = Symbol('evictionPolicy');
let dracoDecoderLocation;
const dracoLoader = new DRACOLoader();
export const $loader = Symbol('loader');
export class CachingGLTFLoader {
    constructor() {
        this[_b] = new GLTFLoader();
        this.roughnessMipmapper = new RoughnessMipmapper(Renderer.singleton.threeRenderer);
        this[$loader].setDRACOLoader(dracoLoader);
    }
    static setDRACODecoderLocation(url) {
        dracoDecoderLocation = url;
        dracoLoader.setDecoderPath(url);
    }
    static getDRACODecoderLocation() {
        return dracoDecoderLocation;
    }
    static get cache() {
        return cache;
    }
    /** @nocollapse */
    static clearCache() {
        cache.forEach((_value, url) => {
            this.delete(url);
        });
        this[$evictionPolicy].reset();
    }
    static has(url) {
        return cache.has(url);
    }
    /** @nocollapse */
    static async delete(url) {
        if (!this.has(url)) {
            return;
        }
        const gltfLoads = cache.get(url);
        preloaded.delete(url);
        cache.delete(url);
        const gltf = await gltfLoads;
        // Dispose of the cached glTF's materials and geometries:
        gltf.scenes.forEach(scene => {
            scene.traverse(object3D => {
                if (!object3D.isMesh) {
                    return;
                }
                const mesh = object3D;
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach(material => {
                    material.dispose();
                });
                mesh.geometry.dispose();
            });
        });
    }
    /**
     * Returns true if the model that corresponds to the specified url is
     * available in our local cache.
     */
    static hasFinishedLoading(url) {
        return !!preloaded.get(url);
    }
    get [(_a = $evictionPolicy, _b = $loader, $evictionPolicy)]() {
        return this.constructor[$evictionPolicy];
    }
    /**
     * Preloads a glTF, populating the cache. Returns a promise that resolves
     * when the cache is populated.
     */
    async preload(url, progressCallback = () => { }) {
        if (!cache.has(url)) {
            cache.set(url, loadWithLoader(url, this[$loader], (progress) => {
                progressCallback(progress * 0.9);
            }));
        }
        await cache.get(url);
        if (progressCallback) {
            progressCallback(1.0);
        }
        preloaded.set(url, true);
    }
    /**
     * Loads a glTF from the specified url and resolves a unique clone of the
     * glTF. If the glTF has already been loaded, makes a clone of the cached
     * copy.
     */
    async load(url, progressCallback = () => { }) {
        await this.preload(url, progressCallback);
        const gltf = await cache.get(url);
        const meshesToDuplicate = [];
        if (gltf.scene != null) {
            gltf.scene.traverse((node) => {
                // Three.js seems to cull some animated models incorrectly. Since we
                // expect to view our whole scene anyway, we turn off the frustum
                // culling optimization here.
                node.frustumCulled = false;
                // Animations for objects without names target their UUID instead. When
                // objects are cloned, they get new UUIDs which the animation can't
                // find. To fix this, we assign their UUID as their name.
                if (!node.name) {
                    node.name = node.uuid;
                }
                if (!node.isMesh) {
                    return;
                }
                node.castShadow = true;
                const mesh = node;
                let transparent = false;
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach(material => {
                    if (material.isMeshStandardMaterial) {
                        if (material.transparent && material.side === DoubleSide) {
                            transparent = true;
                            material.side = FrontSide;
                        }
                        this.roughnessMipmapper.generateMipmaps(material);
                    }
                });
                if (transparent) {
                    meshesToDuplicate.push(mesh);
                }
            });
        }
        // We duplicate transparent, double-sided meshes and render the back face
        // before the front face. This creates perfect triangle sorting for all
        // convex meshes. Sorting artifacts can still appear when you can see
        // through more than two layers of a given mesh, but this can usually be
        // mitigated by the author splitting the mesh into mostly convex regions.
        // The performance cost is not too great as the same shader is reused and
        // the same number of fragments are processed; only the vertex shader is run
        // twice. @see https://threejs.org/examples/webgl_materials_physical_transparency.html
        for (const mesh of meshesToDuplicate) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            const duplicateMaterials = materials.map((material) => {
                const backMaterial = material.clone();
                backMaterial.side = BackSide;
                return backMaterial;
            });
            const duplicateMaterial = Array.isArray(mesh.material) ?
                duplicateMaterials :
                duplicateMaterials[0];
            const meshBack = new Mesh(mesh.geometry, duplicateMaterial);
            meshBack.renderOrder = -1;
            mesh.add(meshBack);
        }
        const clone = cloneGltf(gltf);
        const model = clone.scene ? clone.scene : null;
        if (model != null) {
            model.userData.animations = clone.animations; // save animations
            this[$evictionPolicy].retain(url);
            model[$releaseFromCache] = (() => {
                let released = false;
                return () => {
                    if (released) {
                        return;
                    }
                    // We manually dispose cloned materials because Three.js keeps
                    // an internal count of materials using the same program, so it's
                    // safe to dispose of them incrementally. Geometry clones are not
                    // accounted for, so they cannot be disposed of incrementally.
                    model.traverse((object3D) => {
                        if (!object3D.isMesh) {
                            return;
                        }
                        const mesh = object3D;
                        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                        materials.forEach(material => {
                            material.dispose();
                        });
                    });
                    this[$evictionPolicy].release(url);
                    released = true;
                };
            })();
        }
        return model;
    }
}
CachingGLTFLoader[_a] = new CacheEvictionPolicy(CachingGLTFLoader);
//# sourceMappingURL=CachingGLTFLoader.js.map