class Renderer {
    width = 0;
    height = 0;
    halfWidth = 0;
    halfHeight = 0;

    setSize(width: number, height: number) {
        if (this.width === width && this.height === height) return;
        this.width = width;
        this.height = height;
        this.halfWidth = this.width * 0.5;
        this.halfHeight = this.height * 0.5;
        return this;
    }

    clear() {
        return this;
    }

    render(_scene:Scene) {
        return this;
    }
}
