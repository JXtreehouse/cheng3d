export class Vector3 {
    public v: Float32Array;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.v = new Float32Array([x, y, z]);
    }

    public set(x, y, z): Vector3 {
        this.v[0] = x;
        this.v[1] = y;
        this.v[2] = z;
        return this;
    }

    public add(vec): Vector3 {
        this.v[0] += vec.x;
        this.v[1] += vec.y;
        this.v[2] += vec.z;
        return this;
    }

    public sub(vec): Vector3 {
        this.v[0] -= vec.x;
        this.v[1] -= vec.y;
        this.v[2] -= vec.z;
        return this;
    }

    public negate(): Vector3 {
        this.v[0] = -this.v[0];
        this.v[1] = -this.v[1];
        this.v[2] = -this.v[2];
        return this;
    }

    public  mul(d): Vector3 {
        this.v[0] *= d;
        this.v[1] *= d;
        this.v[2] *= d;
        return this;
    }

    public dot(vec): number {
        return this.v[0] * vec.x + this.v[1] * vec.y + this.v[2] * vec.z;
    }

    public cross(vec3): Vector3 {
        let ax = this.v[0], ay = this.v[1], az = this.v[2],
            bx = vec3.x, by = vec3.y, bz = vec3.z;
        let vec = new Vector3();
        vec.x = ay * bz - az * by;
        vec.y = az * bx - ax * bz;
        vec.z = ax * by - ay * bx;
        return vec;
    }

    public length(): number {
        return Math.sqrt(this.v[0] * this.v[0] + this.v[1] * this.v[1] + this.v[2] * this.v[2]); 
    }

    public normalize(): Vector3 {
        let length = this.length();
        if (length == 0) return this;
        let length_inverse = 1.0 / length;
        this.v[0] *= length_inverse;
        this.v[1] *= length_inverse;
        this.v[2] *= length_inverse;
        return this;
    }

    public applyMatrix4(matrix): Vector3 {
        let x = this.v[0], y = this.v[1], z = this.v[2];
        let m = matrix.m;
        this.v[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
        this.v[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
        this.v[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
        return this;
    }

    public applyQuaternion(quat): Vector3 {
        let x = this.v[0], y = this.v[1], z = this.v[2],
            qx = quat.x, qy = quat.y, qz = quat.z, qw = quat.w;

        let ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;

        this.v[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.v[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.v[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    }

    public clone(): Vector3 {
        let vec = new Vector3();
        vec.x = this.v[0];
        vec.y = this.v[1];
        vec.z = this.v[2];
        return vec;
    }

    public copy(vec3): Vector3 {
        this.v[0] = vec3.x;
        this.v[1] = vec3.y;
        this.v[2] = vec3.z;
        return this;
    }

    public equal(vec3): boolean {
        return this.v[0] === vec3.x && this.v[1] === vec3.y && this.v[2] === vec3.z;
    }

    public set x(value: number) {
        this.v[0] = value;
    }
    
    public get x() {
        return this.v[0];
    }

    public set y(value: number) {
        this.v[1] = value;
    }
    
    public get y() {
        return this.v[1];
    }

    public set z(value: number) {
        this.v[2] = value;
    }
    
    public get z() {
        return this.v[2];
    }

    public get data() {
        return this.v;
    }
}