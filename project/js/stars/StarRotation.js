class StarRotationManager {
    constructor() {
        this.celestial = new THREE.Group();
        this.scene.add(this.celestial);

        this.isRotationEnabled = false;
    }

    update() {
        if (this.isRotationEnabled) {
            this.celestial.rotation.y += 0.0005;
        }
    }

    startRotation() {
        this.isRotationEnabled = true;
    }

    stopRotation() {
        this.isRotationEnabled = false;
    }
}