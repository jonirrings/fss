class Color {
    rgba: Vector4;
    hex: string;
    opacity: number;

    constructor(hex: string='', opacity: number = 0) {
        this.rgba = Vector4.create();
        this.hex = hex || '#000000';
        this.opacity = isNumber(opacity) ? opacity : 1;
        this.set(this.hex, this.opacity);
    }

    set(hex: string, opacity: number) {
        hex = hex.replace('#', '');
        const size = hex.length / 3;
        this.rgba.x = parseInt(hex.substring(size * 0, size * 1), 16) / 255;
        this.rgba.y = parseInt(hex.substring(size * 1, size * 2), 16) / 255;
        this.rgba.z = parseInt(hex.substring(size * 2, size * 3), 16) / 255;
        this.rgba.w = isNumber(opacity) ? opacity : this.rgba.w;
        return this;
    }

    hexify(channel: number) {
        let hex = Math.ceil(channel * 255).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    }

    format() {
        const r = this.hexify(this.rgba.x);
        const g = this.hexify(this.rgba.y);
        const b = this.hexify(this.rgba.z);
        this.hex = '#' + r + g + b;
        return this.hex;
    }
}
