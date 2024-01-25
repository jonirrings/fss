class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static create() {
        return new Vector4(0, 0, 0, 0);
    }

    set(x?: number, y?: number, z?: number, w?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
        return this;
    }

    setX(x: number) {
        this.x = x || 0;
        return this;
    }

    setY(y: number) {
        this.y = y || 0;
        return this;
    }

    setZ(z: number) {
        this.z = z || 0;
        return this;
    }

    setW(w: number) {
        this.w = w || 0;
        return this;
    }

    add(a: Vector4) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        this.w += a.w;
        return this;
    }

    multiplyVectors(a: Vector4, b: Vector4) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        this.w = a.w * b.w;
        return this;
    }

    multiplyScalar(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    }

    min(value: number) {
        if (this.x < value) {
            this.x = value;
        }
        if (this.y < value) {
            this.y = value;
        }
        if (this.z < value) {
            this.z = value;
        }
        if (this.w < value) {
            this.w = value;
        }
        return this;
    }

    max(value: number) {
        if (this.x > value) {
            this.x = value;
        }
        if (this.y > value) {
            this.y = value;
        }
        if (this.z > value) {
            this.z = value;
        }
        if (this.w > value) {
            this.w = value;
        }
        return this;
    }

    clamp(min: number, max: number) {
        this.min(min);
        this.max(max);
        return this;
    }

    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
}
