class Geometry {
    vertices:Vertex[] = [];
    triangles:Triangle[] = [];
    dirty = false;

    update() {
        if (this.dirty) {
            var t, triangle;
            for (t = this.triangles.length - 1; t >= 0; t--) {
                triangle = this.triangles[t];
                triangle.computeCentroid();
                triangle.computeNormal();
            }
            this.dirty = false;
        }
        return this;
    }
}
