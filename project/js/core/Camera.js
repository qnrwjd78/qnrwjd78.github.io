class CameraController {
    constructor(rendererDomElement) {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );

        this.camera.position.set(-715, 195, -75);

        this.controls = new THREE.OrbitControls(this.camera, rendererDomElement);

        this.controls.target.set(0, 190, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = false;
        
        this.controls.maxPolarAngle = Math.PI *0.87; // 최대 세로 회전 각도
        this.controls.minDistance = 50;
    }

    getCamera() {
        return this.camera;
    }

    getControls() {
        return this.controls;
    }

    update() {
        this.controls.update();
    }
}
