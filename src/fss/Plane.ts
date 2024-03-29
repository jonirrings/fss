class Plane extends Geometry {
    width: number;
    height: number;
    segments: number;
    slices: number;
    segmentWidth: number;
    sliceHeight: number;

    constructor(width: number, height: number, segments: number, slices: number) {
        super();
        this.width = width || 100;
        this.height = height || 100;
        this.segments = segments || 4;
        this.slices = slices || 4;
        this.segmentWidth = this.width / this.segments;
        this.sliceHeight = this.height / this.slices;
        // Cache Variables
        let x, y, v0, v1, v2, v3,
            vertex: Vertex, vertices: Vertex[][] = [],
            offsetX = this.width * -0.5,
            offsetY = this.height * 0.5;

        // Add Vertices
        for (x = 0; x <= this.segments; x++) {
            vertices.push([]);
            for (y = 0; y <= this.slices; y++) {
                vertex = new Vertex(offsetX + x * this.segmentWidth, offsetY - y * this.sliceHeight);
                vertices[x].push(vertex);
                this.vertices.push(vertex);
            }
        }

        // Add Triangles
        for (x = 0; x < this.segments; x++) {
            for (y = 0; y < this.slices; y++) {
                v0 = vertices[x + 0][y + 0];
                v1 = vertices[x + 0][y + 1];
                v2 = vertices[x + 1][y + 0];
                v3 = vertices[x + 1][y + 1];
                const t0 = new Triangle(v0, v1, v2);
                const t1 = new Triangle(v2, v1, v3);
                this.triangles.push(t0, t1);
            }
        }
    }
}
