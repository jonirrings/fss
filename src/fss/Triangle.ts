class Triangle {
    a: Vertex;
    b: Vertex;
    c: Vertex;
    vertices: Vertex[];
    u: Vector3;
    v: Vector3;
    centroid: Vector3;
    normal: Vector3;
    color: Color;
    polygon: SVGPolygonElement;

    constructor(a?: Vertex, b?: Vertex, c?: Vertex) {
        this.a = a || new Vertex();
        this.b = b || new Vertex();
        this.c = c || new Vertex();
        this.vertices = [this.a, this.b, this.c];
        this.u = Vector3.create();
        this.v = Vector3.create();
        this.centroid = Vector3.create();
        this.normal = Vector3.create();
        this.color = new Color();
        this.polygon = document.createElementNS(FSS.SVGNS, 'polygon');
        this.polygon.setAttributeNS(null, 'stroke-linejoin', 'round');
        this.polygon.setAttributeNS(null, 'stroke-miterlimit', '1');
        this.polygon.setAttributeNS(null, 'stroke-width', '1');
        this.computeCentroid();
        this.computeNormal();
    }

    computeCentroid() {
        this.centroid.x = this.a.position.x + this.b.position.x + this.c.position.x;
        this.centroid.y = this.a.position.y + this.b.position.y + this.c.position.y;
        this.centroid.z = this.a.position.z + this.b.position.z + this.c.position.z;
        this.centroid.divideScalar(3);
        return this;
    }

    computeNormal() {
        this.u.subtractVectors(this.b.position, this.a.position);
        this.v.subtractVectors(this.c.position, this.a.position);
        this.normal.crossVectors(this.u, this.v);
        this.normal.normalise();
        return this;
    }
}
