class Vertex {
    position: Vector3;

    constructor(x?: number, y?: number, z?: number) {
        if (x && y && z) {
            this.position = new Vector3(x, y, z);
        } else {
            this.position = Vector3.create();
        }
    }

    setPosition(x: number, y: number, z: number) {
        this.position.set(x, y, z);
        return this;
    }
}
