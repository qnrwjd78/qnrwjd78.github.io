class CameraController {
    constructor(rendererDomElement) {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );

        this.camera.position.set(0, 200, 0);

        this.controls = new THREE.OrbitControls(this.camera, rendererDomElement);

        this.controls.target.set(0, 190, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = false;
        this.controls.minPolarAngle = Math.PI / 3
        this.controls.maxPolarAngle = Math.PI * 0.95;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 300;
    }

    getCamera() {
        return this.camera;
    }

    update() {
        this.controls.update();
    }
}
