class Material {
    ambient: Color;
    diffuse: Color;
    slave: Color;

    constructor(ambient: string='', diffuse: string='') {
        this.ambient = new Color(ambient || '#FFFFFF');
        this.diffuse = new Color(diffuse || '#FFFFFF');
        this.slave = new Color();
    }
}
