class Light extends FSSObject {
    ambient: Color;
    diffuse: Color;
    ray: Vector3

    constructor(ambient: string='', diffuse: string='') {
        super();
        this.ambient = new Color(ambient || '#FFFFFF');
        this.diffuse = new Color(diffuse || '#FFFFFF');
        this.ray = Vector3.create();
    }
}
