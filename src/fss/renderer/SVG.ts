class SVGRenderer extends Renderer {
    element: SVGSVGElement;

    constructor() {
        super();
        this.element = document.createElementNS(FSS.SVGNS, 'svg');
        this.element.setAttribute('xmlns', FSS.SVGNS);
        this.element.setAttribute('version', '1.1');
        this.element.style.display = 'block';
        this.setSize(300, 150);
    }

    setSize(width: number, height: number) {
        super.setSize(width, height);
        this.element.setAttribute('width', width.toString());
        this.element.setAttribute('height', height.toString());
        return this;
    }

    clear() {
        super.clear()
        for (let i = this.element.childNodes.length - 1; i >= 0; i--) {
            this.element.removeChild(this.element.childNodes[i]);
        }
        return this;
    }

    render(scene: Scene) {
        super.render(scene);
        let m, mesh: Mesh, t, triangle: Triangle, points, style;

        // Update Meshes
        for (m = scene.meshes.length - 1; m >= 0; m--) {
            mesh = scene.meshes[m];
            if (mesh.visible) {
                mesh.update(scene.lights, true);

                // Render Triangles
                for (t = mesh.geometry.triangles.length - 1; t >= 0; t--) {
                    triangle = mesh.geometry.triangles[t];
                    if (triangle.polygon.parentNode !== this.element) {
                        this.element.appendChild(triangle.polygon);
                    }
                    points = this.formatPoint(triangle.a) + ' ';
                    points += this.formatPoint(triangle.b) + ' ';
                    points += this.formatPoint(triangle.c);
                    style = this.formatStyle(triangle.color);
                    triangle.polygon.setAttributeNS(null, 'points', points);
                    triangle.polygon.setAttributeNS(null, 'style', style);
                }
            }
        }
        return this;
    }

    formatPoint(vertex: Vertex) {
        return (this.halfWidth + vertex.position.x) + ',' + (this.halfHeight - vertex.position.y);
    }

    formatStyle(color: Color) {
        const colorStr = color.format();
        let style = 'fill:' + colorStr + ';';
        style += 'stroke:' + colorStr + ';';
        return style;
    }
}
