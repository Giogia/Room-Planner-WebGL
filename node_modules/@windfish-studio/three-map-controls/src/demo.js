import {
    Scene,
    Vector3,
    Vector2,
    Quaternion,
    Box2,
    Box3,
    PerspectiveCamera,
    SphereBufferGeometry,
    PlaneBufferGeometry,
    BufferGeometry,
    CubeGeometry,
    PointsMaterial,
    MeshBasicMaterial,
    MeshNormalMaterial,
    Color,
    DoubleSide,
    VertexColors,
    Mesh,
    Points,
    Raycaster,
    Float32BufferAttribute,
    Plane,
    Sphere,
    WebGLRenderer
} from 'three';
import MapControls from './three-map-controls.js';

const SPHERE_RADIUS = 10;

class MapControlsDemo {
    constructor (mode) {
        this.container = document.body;
        this.scene = new Scene();
        this.renderer = null;
        this.meshes = [];
        this.dims = 10;
        this.selectedObjectTween = 0;
        this.selectedObject = null;
        this.controls;
        this.mode;

        this.debugCamViewInterval;

        this.camViewMesh;
        this.camViewLines;

        this.init();
        this.setMode(mode);
        this.animate();
    }

    setMode(mode) {
        this.deselect();
        this.mode = mode;
        const links = {
            sphere: document.getElementById('sphere-link'),
            plane: document.getElementById('plane-link')
        };

        links[this.mode].style.display = 'none';
        links[(this.mode == 'plane')? 'sphere' : 'plane'].style.display = 'inline-block';

        this.meshes.concat([this.camViewLines, this.camViewMesh]).forEach((_m) => {
            if(_m === undefined){
                return;
            }

            this.scene.remove(_m);
            _m.geometry.dispose();
        });

        this.camViewLines = this.camViewMesh = undefined;

        switch(this.mode){
            case 'sphere':
                this.initSphere();
                break;
            case 'plane':
                this.initPlane();
                break;
        }
    }

    initSphere(){

        var camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 40;
        this.controls = new MapControls( camera, this.renderer.domElement, {
            target: new Sphere(new Vector3(0,0,0), SPHERE_RADIUS),
            mode: 'sphere',
            minDistance: 1,
            maxDistance: camera.position.z
        });

        const colors = [];

        const geometry = new SphereBufferGeometry(SPHERE_RADIUS, this.dims, this.dims);
        geometry.computeBoundingSphere();

        const vertices = geometry.getAttribute('position').array;
        for(var i = 0; i < vertices.length; i += 3){
            var color = new Color();
            var vert = new Vector3(vertices[i], vertices[i+1], vertices[i+2]);

            color.setRGB(
                ( vert.x / SPHERE_RADIUS ) + 0.5,
                ( vert.y / SPHERE_RADIUS ) + 0.5,
                ( vert.z / SPHERE_RADIUS ) + 0.5
            );

            colors.push( color.r, color.g, color.b );
        }

        geometry.addAttribute( 'color', new Float32BufferAttribute( Float32Array.from(colors), 3 ) );

        const points = new Points(
            geometry,
            new PointsMaterial( { size: 1, vertexColors: VertexColors } )
        );

        this.scene.add( points );
        this.meshes.push( points );

        const polys = new Mesh(
            geometry,
            new MeshBasicMaterial({
                vertexColors: VertexColors,
                transparent: true,
                opacity: 0.2

            })
        );

        polys.userData.selectable = true;

        this.meshes.push( polys );
        this.scene.add( polys );

        const lines = new Mesh(
            geometry,
            new MeshBasicMaterial({
                vertexColors: VertexColors,
                wireframe: true
            })
        );

        this.meshes.push( lines );
        this.scene.add( lines );

    }

    toggleDebugCamView(e){
        if(!e.target.checked){
            clearInterval(this.debugCamViewInterval);
            this.scene.remove( this.camViewMesh );
            this.scene.remove( this.camViewLines );
            this.camViewMesh.geometry.dispose();
            this.camViewLines.geometry.dispose();
            this.camViewLines = this.camViewMesh = undefined;
            return true;
        }

        this.debugCamViewInterval = setInterval(() => {
            const bbox = this.controls.targetAreaVisible();
            console.log(`${bbox.min.x}, ${bbox.min.y}, ${bbox.max.x}, ${bbox.max.y}`);

            let geometry, position;
            position = new Vector3(0,0,0);

            switch (this.mode) {
                case 'sphere':
                    let phidelta = Math.abs(bbox.max.x - bbox.min.x);
                    if(phidelta > Math.PI){
                        phidelta = Math.abs((bbox.max.x + Math.PI*2) - bbox.min.x);
                    }
                    geometry = new SphereBufferGeometry(SPHERE_RADIUS, this.dims, this.dims,
                        bbox.min.x + Math.PI/2, //phistart
                        phidelta, //philength
                        -bbox.max.y + Math.PI/2, //thetastart
                        Math.abs(bbox.max.y - bbox.min.y) //thetalength
                    );
                    break;
                case 'plane':

                    geometry = new PlaneBufferGeometry(
                        (bbox.max.x - bbox.min.x),
                        (bbox.max.y - bbox.min.y),
                        this.dims, this.dims
                    );

                    position.copy(this.controls.camera.position);
                    position.z = 0;

                    break;
            }

            if(this.camViewMesh == undefined){
                this.camViewMesh = new Mesh(
                    geometry,
                    new MeshBasicMaterial({
                        color: new Color(1, 0, 0),
                        side: DoubleSide,
                        transparent: true,
                        opacity: 0.5
                    })
                );

                this.camViewLines = new Mesh(
                    geometry,
                    new MeshBasicMaterial({
                        color: new Color(1, 0, 0),
                        wireframe: true
                    })
                );

                this.scene.add( this.camViewMesh );
                this.scene.add( this.camViewLines );
            }else{

                this.camViewMesh.geometry.copy(geometry);
                this.camViewLines.geometry.copy(geometry);

                geometry.dispose();
            }

            this.camViewMesh.geometry.computeBoundingSphere();
            this.camViewMesh.position.copy(position);
            this.camViewLines.position.copy(position);

        }, 1000);
    }

    initPlane(){

        var camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 20;
        this.controls = new MapControls( camera, this.renderer.domElement, {
            target: new Plane(new Vector3(0,0,1), 0),
            mode: 'plane',
            minDistance: 2.0,
            maxDistance: 20
        });

        var offset = 3;

        for(var x = 0; x < this.dims; x++){
            for(var y = 0; y < this.dims; y++){
                var geometry = new CubeGeometry(1, 1, 1);
                var material = new MeshNormalMaterial();

                var mesh = new Mesh( geometry, material );
                mesh.position.x += ((-0.5 * this.dims * offset) + (x * offset));
                mesh.position.y += ((-0.5 * this.dims * offset) + (y * offset));
                mesh.userData.selectable = true;
                this.meshes.push( mesh );
                this.scene.add( mesh );

                mesh.geometry.computeBoundingSphere();
            }
        }
    }

    init () {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.container.appendChild( this.renderer.domElement );

        window.addEventListener( 'resize', ()=>{
            this.onWindowResize();
        }, false );

        this.renderer.domElement.addEventListener( 'mousedown', (_e) => {this.pick(_e)} );
        this.renderer.domElement.addEventListener( 'dblclick', (_e) => {this.zoomTo(_e)} );

        const cb = document.getElementById('toggleCamDebug');
        cb.addEventListener('click', this.toggleDebugCamView.bind(this));
    }

    zoomTo(){
        if(!this.selectedObject)
            return;

        switch(this.mode){
            case 'sphere':
                this.controls.zoomToFit(
                    this.selectedObject,
                    this.selectedObject.userData.zoom.center,
                    this.selectedObject.userData.zoom.dims
                );
                break;
            case 'plane':
                this.controls.zoomToFit( this.selectedObject );
                break;
        }
    }

    deselect() {
        if(this.selectedObject){
            switch (this.mode) {
                case 'sphere':
                    this.selectedObject.parent.remove(this.selectedObject);
                    this.selectedObject.geometry.dispose();
                    this.selectedObject.material.dispose();
                    break;
                case 'plane':
                    this.selectedObject.material.dispose();
                    this.selectedObject.material = new MeshNormalMaterial();
                    break;
            }
        }

        this.selectedObject = null;
    }

    pick(event){
        this.deselect();

        const mouse = new Vector2();

        mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

        const raycaster = new Raycaster();

        raycaster.setFromCamera(mouse, this.controls.camera);

        // calculate objects intersecting the picking ray
        const intersect = (raycaster.intersectObjects( this.scene.children, true )).filter(_int => {
            return _int.object.userData.selectable;
        })[0];

        if(intersect !== undefined && intersect.face){
            switch (this.mode) {
                case 'sphere':
                    //create a new selectedObject from the triangle that was raycasted.
                    const geo = new BufferGeometry();
                    const orig_geo = intersect.object.geometry;
                    const orig_vtx_ar = orig_geo.getAttribute('position').array;
                    const f = intersect.face;
                    const new_vtx_ar = [f.a, f.b, f.c].map(_idx => {
                        const vtx_ar = [];
                        for(let i = 0; i < 3; i++){
                            vtx_ar.push(orig_vtx_ar[(_idx * 3) + i]);
                        }
                        return vtx_ar;
                    }).flat();

                    geo.setIndex([0,1,2]);
                    geo.addAttribute('position', new Float32BufferAttribute(Float32Array.from(new_vtx_ar), 3));

                    geo.computeBoundingSphere();
                    geo.computeVertexNormals();
                    geo.computeBoundingBox();

                    this.selectedObject = new Mesh(geo, new MeshBasicMaterial({
                        color: new Color(1,0,0),
                        transparent: true,
                        opacity: 0.5
                    }));

                    const projected = this.projectTriangleToPlane(new_vtx_ar);

                    Object.assign(this.selectedObject.userData, {
                        zoom: {
                            center: projected.center,
                            dims: projected.projection_size
                        }
                    });

                    this.scene.add(this.selectedObject);
                    break;
                case 'plane':
                    this.selectedObject = intersect.object;
                    this.selectedObject.material.dispose();
                    this.selectedObject.material = new MeshBasicMaterial({
                        color: new Color(1,0,0),
                        wireframe: true
                    });
                    break;
            }

        }else{
            this.deselect();
        }

    }

    projectTriangleToPlane(verts_ar){
        const centroid = this.findTriangleCentroid(verts_ar);

        const vecs = [0,1,2].map(_t => {
            return new Vector3().fromArray([0,1,2].map(_v => {
                return verts_ar[(_t*3)+_v];
            })).sub(centroid);
        });

        const norm = new Vector3().crossVectors(vecs[1], vecs[0]).normalize();
        const right = new Vector3().crossVectors(new Vector3(0,1,0), norm).normalize();
        const up = new Vector3().crossVectors(norm, right).normalize();
        const prj_vecs = vecs.map(_v => {
            return new Vector2(
                _v.dot(right),
                _v.dot(up)
            );
        });

        const prj_bbox = new Box2().setFromPoints(prj_vecs);
        const prj_dims = new Vector2();
        prj_bbox.getSize(prj_dims);

        const prj_center = new Vector2(
            prj_bbox.min.x + (prj_dims.x / 2),
            prj_bbox.min.y + (prj_dims.y / 2)
        );

        const prj_delta = new Vector2().subVectors(prj_center,  prj_vecs[0]);

        //translate the 3d centroid to the position of the 2d projected center via prj_delta, up, and right.
        const center = vecs[0].clone().add(centroid);
        center.add(up.clone().multiplyScalar(prj_delta.y));
        center.add(right.clone().multiplyScalar(prj_delta.x));

        return {
            center: center,
            projection: prj_vecs,
            projection_bbox: prj_bbox,
            projection_size: prj_dims
        };

    }

    findTriangleCentroid (verts_ar) {
        let center = [0,0,0];

        [0,1,2].forEach(_v => {
            [0,1,2].forEach(_d => {
                center[_d] += verts_ar[(_v*3) + _d];
            });
        });

        center = center.map(_d => {return _d / 3;});

        return (new Vector3()).fromArray(center);
    }

    onWindowResize(){
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.controls.camera.aspect = this.renderer.domElement.clientWidth / this.renderer.domElement.clientHeight;
        this.controls.camera.updateProjectionMatrix();
        this.renderer.setSize( this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight );
    }

    animate(){
        requestAnimationFrame( () => {
            this.animate();
        } );

        if(this.selectedObject){
            const currentColor = this.selectedObject.material.color;
            this.selectedObjectTween += 0.025;
            currentColor.g = Math.abs(1 - (this.selectedObjectTween % 2));
        }

        if(this.mode == 'plane'){
            this.meshes.forEach(( mesh ) => {
                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.01;
            });
        }

        this.controls.update();
        this.renderer.render( this.scene, this.controls.camera );
    }
};

window.addEventListener('load', () => {
    window.demo = new MapControlsDemo('sphere');
});