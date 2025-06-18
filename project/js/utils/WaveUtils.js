class WaveUtils {
    constructor(plane, z_velocity, segments, size) {
        this.plane = plane;
        this.geometry = this.plane.geometry;
        this.z_velocity = z_velocity;
        this.segments = segments;
        this.size = size;
        this.timer = { time: 0.0, period: 0.1 };
    }

    indexOf(i, j) {
        return i + j * (this.segments + 1);
    }

    updateSurface(t) {
        const cutoff = 10;
        const speed = 8 * this.segments / this.size;

        const attr = this.geometry.getAttribute('position');
        const normal = this.geometry.getAttribute('normal');
        const new_z = new Float32Array((this.segments + 1) ** 2);
        const new_v = new Float32Array((this.segments + 1) ** 2);

        for (let i = 0; i <= this.segments; i++) {
            for (let j = 0; j <= this.segments; j++) {
                new_z[this.indexOf(i, j)] = attr.getZ(this.indexOf(i, j));
                new_v[this.indexOf(i, j)] = this.z_velocity[this.indexOf(i, j)];
            }
        }

        for (let i = 0; i <= this.segments; i++) {
            for (let j = 0; j <= this.segments; j++) {
                const x_minus = i > 0 ? new_z[this.indexOf(i - 1, j)] : 0;
                const x_plus = i < this.segments ? new_z[this.indexOf(i + 1, j)] : 0;
                const z_minus = j > 0 ? new_z[this.indexOf(i, j - 1)] : 0;
                const z_plus = j < this.segments ? new_z[this.indexOf(i, j + 1)] : 0;
                const center = new_z[this.indexOf(i, j)];

                new_v[this.indexOf(i, j)] += (x_minus + x_plus + z_minus + z_plus - 4 * center) * speed * speed * t * t;
            }
        }

        this.timer.time += t;
        if (this.timer.time > this.timer.period) {
            this.timer.time -= this.timer.period;
            const k = 2.5;
            const i = Math.floor(Math.random() * (this.segments - 1)) + 1;
            const j = Math.floor(Math.random() * (this.segments - 1)) + 1;
            if ((i - this.segments / 2) ** 2 + (j - this.segments / 2) ** 2 > (this.segments / 8) ** 2) {
                new_v[this.indexOf(i, j)] -= 4 * k;
                new_v[this.indexOf(i - 1, j)] += k;
                new_v[this.indexOf(i + 1, j)] += k;
                new_v[this.indexOf(i, j - 1)] += k;
                new_v[this.indexOf(i, j + 1)] += k;
            }
        }

        for (let i = 0; i <= this.segments; i++) {
            for (let j = 0; j <= this.segments; j++) {
                new_v[this.indexOf(i, j)] *= 0.99;
                new_z[this.indexOf(i, j)] += new_v[this.indexOf(i, j)];
                new_z[this.indexOf(i, j)] = Math.max(-cutoff, Math.min(cutoff, new_z[this.indexOf(i, j)]));
                attr.setZ(this.indexOf(i, j), new_z[this.indexOf(i, j)]);
            }
        }

        this.z_velocity.set(new_v);
        attr.needsUpdate = true;
        this.geometry.computeVertexNormals();
    }
}
