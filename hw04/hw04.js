import { resizeAspectRatio, setupText, updateText, Axes } from '../util/util.js';
import { Shader, readShaderFile } from '../util/shader.js';

let isInitialized = false;
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;
let axesVAO;
let sunVAO;
let earthVAO;
let moonVAO;
let sun;
let earth;
let moon;
let rotationAngle = 0;
let TransformType = null;
let lastTime = 0;

const RED = mat4.fromValues(1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1);

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) {
        console.log("Already initialized");
        return;
    }

    main().then(success => {
        if (!success) {
            console.log('프로그램을 종료합니다.');
            return;
        }
        isInitialized = true;
        requestAnimationFrame(animate);
    }).catch(error => {
        console.error('프로그램 실행 중 오류 발생:', error);
    });
});

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;
    resizeAspectRatio(gl, canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.3, 0.4, 1.0);
    
    return true;
}

function setupAxesBuffers(shader) {
    axesVAO = gl.createVertexArray();
    gl.bindVertexArray(axesVAO);

    const axesVertices = new Float32Array([
        -0.8, 0.0, 0.8, 0.0,  // x축
        0.0, -0.8, 0.0, 0.8   // y축
    ]);

    const axesColors = new Float32Array([
        1.0, 0.3, 0.0, 1.0, 1.0, 0.3, 0.0, 1.0,  // x축 색상
        0.0, 1.0, 0.5, 1.0, 0.0, 1.0, 0.5, 1.0   // y축 색상
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axesVertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axesColors, gl.STATIC_DRAW);
    shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
}

function setupCubeBuffers(shader) {
    const cubeVertices = new Float32Array([
        -0.05,  0.05,  // 좌상단
        -0.05, -0.05,  // 좌하단
         0.05, -0.05,  // 우하단
         0.05,  0.05   // 우상단
    ]);

    const indices = new Uint16Array([
        0, 1, 2,    // 첫 번째 삼각형
        0, 2, 3     // 두 번째 삼각형
    ]);


    const colors = {
        sun_color: new Float32Array([
            1.0, 0.0, 0.0, 1.0,  // 빨간색 (SUN)
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0
        ]),
        earth_color: new Float32Array([
            0.0, 1.0, 1.0, 1.0,  // 청록색 (EARTH)
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0
        ]),
        moon_color: new Float32Array([
            1.0, 1.0, 0.0, 1.0,  // 노란색 (MOON)
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0
        ])
    };

    function createVAO(positionData, colorData) {
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
        shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

        
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
        shader.setAttribPointer("a_color", 4, gl.FLOAT, false, 0, 0);

        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        return vao;
    }

    
    sunVAO = createVAO(cubeVertices, colors.sun_color);
    earthVAO = createVAO(cubeVertices, colors.earth_color);
    moonVAO = createVAO(cubeVertices, colors.moon_color);
}


function getTransformMatrices() {
    const S = mat4.create();
    const E = mat4.create();
    const M = mat4.create();
    
    mat4.rotate(S, S, rotationAngle/4, [0, 0, 1]);
    mat4.scale(S, S, [2, 2, 1]);
    
    mat4.rotate(E, E, rotationAngle/6, [0, 0, 1]);
    mat4.translate(E, E, [0.7, 0, 0]);
    mat4.rotate(E, E, rotationAngle, [0, 0, 1]);

    mat4.rotate(M, M, rotationAngle/6, [0, 0, 1]);
    mat4.translate(M, M, [0.7, 0, 0]);
    mat4.rotate(M, M, rotationAngle*2, [0, 0, 1]);
    mat4.translate(M, M, [0.2, 0, 0]);
    mat4.rotate(M, M, rotationAngle, [0, 0, 1]);
    mat4.scale(M, M, [0.5, 0.5, 1]);


    
    return { S, E, M };
}

function applyTransform(type) {
    sun = mat4.create();
    earth = mat4.create();
    moon = mat4.create();
    
    const { S, E, M } = getTransformMatrices();
    
    const transformOrder = {
        'sun': [S],
        'earth': [E],
        'moon': [M],
    };

    if (transformOrder[type[0]]) {
        transformOrder[type[0]].forEach(matrix => {
            mat4.multiply(sun, matrix, sun);
        });
    }
    if (transformOrder[type[1]]) {
        transformOrder[type[1]].forEach(matrix => {
            mat4.multiply(earth, matrix, earth);
        });
    }
    if (transformOrder[type[2]]) {
        transformOrder[type[2]].forEach(matrix => {
            mat4.multiply(moon, matrix, moon);
        });
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    shader.use();

    // 축 그리기
    shader.setMat4("u_transform", mat4.create());
    shader.setVec4("u_color",  RED);
    gl.bindVertexArray(axesVAO);
    gl.drawArrays(gl.LINES, 0, 4);

    // 정사각형 그리기
    shader.setMat4("u_transform", sun);
    gl.bindVertexArray(sunVAO);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);    
    
    // 정사각형 그리기
    shader.setMat4("u_transform", earth);
    gl.bindVertexArray(earthVAO);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // 정사각형 그리기
    shader.setMat4("u_transform", moon);
    gl.bindVertexArray(moonVAO);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (TransformType) {
        rotationAngle += Math.PI * deltaTime;
        applyTransform(TransformType);
    }
    render();
    requestAnimationFrame(animate);
}

async function initShader() {
    const vertexShaderSource = await readShaderFile('shVert.glsl');
    const fragmentShaderSource = await readShaderFile('shFrag.glsl');
    return new Shader(gl, vertexShaderSource, fragmentShaderSource);
}

async function main() {
    try {
        if (!initWebGL()) {
            throw new Error('WebGL 초기화 실패');
        }
        
        sun = mat4.create();
        earth = mat4.create();
        moon = mat4.create();
        
        shader = await initShader();
        setupAxesBuffers(shader);
        setupCubeBuffers(shader);

        let sunTransformType = 'sun';
        let earthTransformType = 'earth';
        let moonTransformType = 'moon';
        
        TransformType = [sunTransformType, earthTransformType, moonTransformType];

        applyTransform(TransformType); // 초기 변환 적용

        shader.use();
        requestAnimationFrame(animate); // 애니메이션 시작

        return true;
    } catch (error) {
        console.error('Failed to initialize program:', error);
        alert('프로그램 초기화에 실패했습니다.');
        return false;
    }
}
