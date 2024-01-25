class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static create() {
        return new Vector3(0, 0, 0);
    }

    set(x: number, y: number, z: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
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

    copy(a: Vector3) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        return this;
    }

    add(a: Vector3) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    }

    addVectors(a: Vector3, b: Vector3) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    addScalar(s: number) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }

    subtract(a: Vector3) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
    }

    subtractVectors(a: Vector3, b: Vector3) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    subtractScalar(s: number) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    }

    multiply(a: Vector3) {
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
        return this;
    }

    multiplyVectors(a: Vector3, b: Vector3) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }

    multiplyScalar(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    divide(a: Vector3) {
        this.x /= a.x;
        this.y /= a.y;
        this.z /= a.z;
        return this;
    }

    divideVectors(a: Vector3, b: Vector3) {
        this.x = a.x / b.x;
        this.y = a.y / b.y;
        this.z = a.z / b.z;
        return this;
    }

    divideScalar(s: number) {
        if (s !== 0) {
            this.x /= s;
            this.y /= s;
            this.z /= s;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    cross(a: Vector3) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        this.x = y * a.z - z * a.y;
        this.y = z * a.x - x * a.z;
        this.z = x * a.y - y * a.x;
        return this;
    }

    crossVectors(a: Vector3, b: Vector3) {
        this.x = a.y * b.z - a.z * b.y;
        this.y = a.z * b.x - a.x * b.z;
        this.z = a.x * b.y - a.y * b.x;
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
        return this;
    }

    clamp(min: number, max: number) {
        this.min(min);
        this.max(max);
        return this;
    }

    limit(min: number, max: number) {
        const length = this.length(this);
        if (min !== null && length < min) {
            this.setLength(min);
        } else if (max !== null && length > max) {
            this.setLength(max);
        }
        return this;
    }

    dot(b: Vector3) {
        return this.x * b.x + this.y * b.y + this.z * b.z;
    }

    normalise(this: Vector3) {
        return this.divideScalar(this.length(this));
    }

    negate(this: Vector3) {
        return this.multiplyScalar(-1);
    }

    distanceSquared(a: Vector3, b: Vector3) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }

    distance(a: Vector3, b: Vector3) {
        return Math.sqrt(this.distanceSquared(a, b));
    }

    lengthSquared(a: Vector3) {
        return a.x * a.x + a.y * a.y + a.z * a.z;
    }

    length(a: Vector3) {
        return Math.sqrt(this.lengthSquared(a));
    }

    setLength(l: number) {
        const length = this.length(this);
        if (length !== 0 && l !== length) {
            this.multiplyScalar(l / length);
        }
        return this;
    }
    toArray(){
        return [this.x,this.y,this.z];
    }
}
