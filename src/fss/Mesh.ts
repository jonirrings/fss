class Mesh extends FSSObject {
    geometry: Geometry;
    material: Material;
    side: FSS;
    visible = true;

    constructor(geometry?: Geometry, material?: Material) {
        super();
        this.geometry = geometry || new Geometry();
        this.material = material || new Material();
        this.side = FSS.FRONT;
    }

    update(lights: Light[], calculate: boolean) {
        var t, triangle, l, light: Light, illuminance;

        // Update Geometry
        this.geometry.update();

        // Calculate the triangle colors
        if (calculate) {

            // Iterate through Triangles
            for (t = this.geometry.triangles.length - 1; t >= 0; t--) {
                triangle = this.geometry.triangles[t];

                // Reset Triangle Color
                triangle.color.rgba.set();

                // Iterate through Lights
                for (l = lights.length - 1; l >= 0; l--) {
                    light = lights[l];

                    // Calculate Illuminance
                    light.ray.subtractVectors(light.position, triangle.centroid);
                    light.ray.normalise();
                    illuminance = triangle.normal.dot(light.ray);
                    if (this.side === FSS.FRONT) {
                        illuminance = Math.max(illuminance, 0);
                    } else if (this.side === FSS.BACK) {
                        illuminance = Math.abs(Math.min(illuminance, 0));
                    } else if (this.side === FSS.DOUBLE) {
                        illuminance = Math.max(Math.abs(illuminance), 0);
                    }

                    // Calculate Ambient Light
                    this.material.slave.rgba.multiplyVectors(this.material.ambient.rgba, light.ambient.rgba);
                    triangle.color.rgba.add(this.material.slave.rgba);

                    // Calculate Diffuse Light
                    this.material.slave.rgba.multiplyVectors(this.material.diffuse.rgba, light.diffuse.rgba);
                    this.material.slave.rgba.multiplyScalar(illuminance);
                    triangle.color.rgba.add(this.material.slave.rgba);
                }

                // Clamp & Format Color
                triangle.color.rgba.clamp(0, 1);
            }
        }
        return this;
    }
}
