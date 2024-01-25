class CanvasRenderer extends Renderer {
    element: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor() {
        super();
        this.element = document.createElement('canvas');
        this.element.style.display = 'block';
        this.context = this.element.getContext('2d')!;
        this.setSize(this.element.width, this.element.height);
    }

    setSize(width: number, height: number) {
        super.setSize(width, height);
        this.element.width = width;
        this.element.height = height;
        this.context.setTransform(1, 0, 0, -1, this.halfWidth, this.halfHeight);
        return this;
    };

    clear() {
        super.clear();
        this.context.clearRect(-this.halfWidth, -this.halfHeight, this.width, this.height);
        return this;
    }

    render(scene: Scene) {
        super.render(scene);
        let m, mesh: Mesh, t, triangle: Triangle, color;

        // Clear Context
        this.clear();

        // Configure Context
        this.context.lineJoin = 'round';
        this.context.lineWidth = 1;

        // Update Meshes
        for (m = scene.meshes.length - 1; m >= 0; m--) {
            mesh = scene.meshes[m];
            if (mesh.visible) {
                mesh.update(scene.lights, true);

                // Render Triangles
                for (t = mesh.geometry.triangles.length - 1; t >= 0; t--) {
                    triangle = mesh.geometry.triangles[t];
                    color = triangle.color.format();
                    this.context.beginPath();
                    this.context.moveTo(triangle.a.position.x, triangle.a.position.y);
                    this.context.lineTo(triangle.b.position.x, triangle.b.position.y);
                    this.context.lineTo(triangle.c.position.x, triangle.c.position.y);
                    this.context.closePath();
                    this.context.strokeStyle = color;
                    this.context.fillStyle = color;
                    this.context.stroke();
                    this.context.fill();
                }
            }
        }
        return this;
    }
}
