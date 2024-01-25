class FSSObject {
    position = Vector3.create();

    setPosition(x: number, y: number, z: number) {
        this.position.set(x, y, z);
        return this;
    }
}
