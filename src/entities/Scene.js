class Scene{
    constructor(){
        this.objects = new Map()
    }

    add(mesh){
        if(mesh.length>0)
            for(let object of mesh) this.objects.set(object.uuid, object);
        else
            this.objects.set(mesh.uuid, mesh);
    }

    remove(mesh){
        if(mesh.length>0)
            for(let object of mesh) this.objects.delete(object.uuid, object);
        else
        this.objects.delete(mesh.uuid, mesh);
    }
}

export default Scene;