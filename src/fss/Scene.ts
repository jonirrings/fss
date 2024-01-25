class Scene {
    meshes: Mesh[] = [];
    lights: Light[] = [];

    add(object:Mesh|Light) {
        if (object instanceof Mesh && !~this.meshes.indexOf(object)) {
            this.meshes.push(object);
        } else if (object instanceof Light && !~this.lights.indexOf(object)) {
            this.lights.push(object);
        }
        return this;
    }

    remove(object:Mesh|Light) {
        if (object instanceof Mesh && ~this.meshes.indexOf(object)) {
            this.meshes.splice(this.meshes.indexOf(object), 1);
        } else if (object instanceof Light && ~this.lights.indexOf(object)) {
            this.lights.splice(this.lights.indexOf(object), 1);
        }
        return this;
    }
}
