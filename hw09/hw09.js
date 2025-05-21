import * as THREE from 'three';  
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.fog = null;

const renderer = new THREE.WebGLRenderer();
const textureLoader = new THREE.TextureLoader();
const gui = new GUI();

renderer.setClearColor(0x111122); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

document.body.appendChild(renderer.domElement);

const orbitingSpheres = [];

const perspectiveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 8000);
perspectiveCamera.position.set(-40, 20, 40);
perspectiveCamera.lookAt(scene.position);
scene.add(perspectiveCamera);

const orthographicCamera = new THREE.OrthographicCamera(
    -window.innerWidth / 5,
    window.innerWidth / 5,
    window.innerHeight / 5,
    -window.innerHeight / 5,
    0.1,
    1000
);
orthographicCamera.position.set(-40, 20, 40);
scene.add(orthographicCamera);

let currentcamera = perspectiveCamera

window.addEventListener('resize', onResize, false);

function onResize() {
	let aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera.aspect = aspect;
    orthographicCamera.left = orthographicCamera.bottom * aspect;
    orthographicCamera.right = orthographicCamera.top * aspect;
    perspectiveCamera.updateProjectionMatrix();
    orthographicCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const stats = new Stats();
document.body.appendChild(stats.dom);

const orbitControls = new OrbitControls(perspectiveCamera, renderer.domElement);
orbitControls.enableDamping = true;

const cameraControl = {
    dir: null,
    fov: 75,
    'Current Camera': 'Perspective',
    'Switch Camera Type': function() {
        if(this['Current Camera'] == 'Perspective') {
            this['Current Camera'] = 'Orthographic';
            currentcamera = orthographicCamera;
            orthographicCamera.position.copy(perspectiveCamera.position);
            orthographicCamera.rotation.copy(perspectiveCamera.rotation);
            orbitControls.object = orthographicCamera;
        } else {
            this['Current Camera'] = 'Perspective';
            currentcamera = perspectiveCamera;
            orbitControls.object = perspectiveCamera;
        }
        orbitControls.update();
    }
};

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(cameraControl, 'Switch Camera Type');
cameraFolder.add(cameraControl, 'Current Camera').listen().disable();

const sunSphereGeometry = new THREE.SphereGeometry(10);
const sunSphereMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00
});

const sunSphere = new THREE.Mesh(sunSphereGeometry, sunSphereMaterial);
sunSphere.position.set(0, 0, 0);
sunSphere.castShadow = false;
sunSphere.receiveShadow = false;
scene.add(sunSphere);

const sunlight = new THREE.PointLight(0xffffff, 20000, 0, 2);
sunlight.position.set(0, 0, 0);
sunlight.castShadow = true;
scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(0x606060, 10);
scene.add(ambientLight);

function addOrbit({name, radius, distance, color, rotationSpeed, orbitSpeed, texurepath}){
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texurepath),
        roughness: 0.8,
        metalness: 0.2,
        color: color
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    const angle = 0;
    mesh.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
    );
    const orbitgui = gui.addFolder(name);
    
    const orbit = {
        mesh: mesh,
        distance: distance,
        rotationSpeed: rotationSpeed,
        orbitSpeed: orbitSpeed,
        angle: angle,
        gui: orbitgui
    }

    orbitgui.add(orbit, 'rotationSpeed', 0, 0.1, 0.001)
    orbitgui.add(orbit, 'orbitSpeed', 0, 0.1, 0.001)
    
    return orbit;
}

const mercury = addOrbit({
    name: "Mercury",
    radius: 1.5,
    distance: 20,
    color: '#a6a6a6',
    rotationSpeed: 0.02,
    orbitSpeed: 0.02,
    texurepath: 'Mercury.jpg'
});

const venus = addOrbit({
    name: 'Venus',
    radius: 3,
    distance: 35,
    color: '#e39e1c',
    rotationSpeed: 0.015,
    orbitSpeed: 0.015,
    texurepath: 'Venus.jpg'
});

const earth = addOrbit({
    name: 'Earth',
    radius: 3.5,
    distance: 50,
    color: '#3498db',
    rotationSpeed: 0.01,
    orbitSpeed: 0.01,
    texurepath: 'Earth.jpg'
});

const mars = addOrbit({
    name: 'Mars',
    radius: 2.5,
    distance: 65,
    color: '#c0392b',
    rotationSpeed: 0.008,
    orbitSpeed: 0.008,
    texurepath: 'Mars.jpg'
});

orbitingSpheres.push(mercury);
orbitingSpheres.push(venus);
orbitingSpheres.push(earth);
orbitingSpheres.push(mars);

for (const orbit of orbitingSpheres) scene.add(orbit.mesh);

function render() {
    stats.update();
    orbitControls.update();

    for (const orbit of orbitingSpheres) {
        orbit.mesh.rotation.y += orbit.rotationSpeed;  // rotationSpeed

        // 공전
        orbit.angle += orbit.orbitSpeed;  // orbitSpeed
        orbit.mesh.position.x = Math.cos(orbit.angle) * orbit.distance;
        orbit.mesh.position.z = Math.sin(orbit.angle) * orbit.distance;
        scene.add(orbit.mesh);
    }
        
    requestAnimationFrame(render);
    renderer.render(scene, currentcamera);
}

render();