export class RegularOctahedron {
    constructor(gl, options = {}) {
        this.gl = gl;

        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ebo = gl.createBuffer();

        let height = Math.sqrt(0.5);   // root(0.5)
        let base = 0.5;

        // 5 faces * 3 vertices = 15 vertices (no vertex sharing for flat shading)
        this.vertices = new Float32Array([

            // Top
            // front face
            -base, 0.0, -base,   base, 0.0, -base,   0.0, height,  0.0, // front
             base, 0.0, -base,   base, 0.0,  base,   0.0, height,  0.0, // right
             base, 0.0,  base,  -base, 0.0,  base,   0.0, height,  0.0, // back
            -base, 0.0,  base,  -base, 0.0, -base,   0.0, height,  0.0, // left
            
            // Bottom
            -base, 0.0, -base,   base, 0.0, -base,   0.0, -height,  0.0, // front
             base, 0.0, -base,   base, 0.0,  base,   0.0, -height,  0.0, // right
             base, 0.0,  base,  -base, 0.0,  base,   0.0, -height,  0.0, // back
            -base, 0.0,  base,  -base, 0.0, -base,   0.0, -height,  0.0 // left
        ]);

        this.normals = new Float32Array([
            
            //Top
            0, base, -base,  0, base, -base,  0, base, -base,   // front
            base, base, 0,   base, base, 0,   base, base, 0,    // right
            0, base, base,  0, base, base,  0, base, base,      // back
            -base, base, 0,  -base, base, 0,  -base, base, 0,   // left
            
            //Bottom
            0, base, -base,  0, base, -base,  0, base, -base,   // front
            base, base, 0,   base, base, 0,   base, base, 0,    // right
            0, base, base,  0, base, base,  0, base, base,     // back
            -base, base, 0,  -base, base, 0,  -base, base, 0    // left
        ]);

        this.colors = new Float32Array([

            //Top
            // front face - red
            1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,

            // right face - yellow,
            1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,

            // back face - blue
            0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,

            // left face - purple
            1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,

            //Bottom
            // front face - purple
            1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,

            // right face - red
            1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,

            // back face - yellow,
            1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,

            // left face - blue
            0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1

        ]);

        this.texCoords = new Float32Array([
            //Top
            // front
            0, 0,  1, 0,  0.5, 1,   // front
            0, 0,  1, 0,  0.5, 1,   // right
            0, 0,  1, 0,  0.5, 1,   // back
            0, 0,  1, 0,  0.5, 1,   // left

            //Bottom
            0, 0,  -1, 0,  0.5, -1, // front
            0, 0,  -1, 0,  0.5, -1, // right
            0, 0,  -1, 0,  0.5, -1, // back
            0, 0,  -1, 0,  0.5, -1  // left
        ]);

        this.indices = new Uint16Array([
            //Top
            0, 1, 2,    //front
            3, 4, 5,    // right
            6, 7, 8,    // back
            9, 10, 11,  // left

            //Bottom
            12, 13, 14, //front
            15, 16, 17, // right
            18, 19, 20, // back
            21, 22, 23  // left
        ]);

        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;

        const vSize = this.vertices.byteLength;
        const nSize = this.normals.byteLength;
        const cSize = this.colors.byteLength;
        const tSize = this.texCoords.byteLength;
        const totalSize = vSize + nSize + cSize + tSize;

        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, totalSize, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize, this.normals);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize, this.colors);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize + cSize, this.texCoords);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);  // position
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, vSize);  // normal
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, vSize + nSize);  // color
        gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, vSize + nSize + cSize);  // texCoord

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        gl.enableVertexAttribArray(3);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    draw(shader) {
        const gl = this.gl;
        shader.use();
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    delete() {
        const gl = this.gl;
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.ebo);
        gl.deleteVertexArray(this.vao);
    }
}
