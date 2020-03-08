class Scene{
    constructor(){
        this.objects = new Map()
    }

    add(mesh){
        this.objects.set(mesh.name, mesh);
    }

    remove(mesh){
        this.objects.delete(mesh.name, mesh);
    }
}

export default Scene;