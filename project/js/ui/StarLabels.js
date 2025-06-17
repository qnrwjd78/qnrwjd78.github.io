class StarLabels {
    constructor(camera) {
        this.camera = camera;
        this.labels = [];
    }

    createLabel(starMesh, number) {
        const label = document.createElement('div');
        label.className = 'star-number';
        label.textContent = number;
        label.style.position = 'absolute';
        document.getElementById('container').appendChild(label);
        
        this.labels.push({
            element: label,
            mesh: starMesh,
            number: number
        });
    }

    updateLabels() {
        this.labels.forEach(label => {
            const screenPosition = this.getScreenPosition(label.mesh);
            
            if (screenPosition.visible) {
                label.element.style.display = 'block';
                label.element.style.left = screenPosition.x + 'px';
                label.element.style.top = screenPosition.y + 'px';
            } else {
                label.element.style.display = 'none';
            }
        });
    }

    getScreenPosition(mesh) {
        const vector = new THREE.Vector3();
        mesh.getWorldPosition(vector);
        
        // 카메라 뒤에 있는지 확인
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        
        const starDirection = new THREE.Vector3();
        starDirection.subVectors(vector, this.camera.position).normalize();
        
        const visible = cameraDirection.dot(starDirection) > 0;
        
        // 화면 좌표로 변환
        vector.project(this.camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
        
        return { x, y, visible };
    }

    clear() {
        this.labels.forEach(label => {
            label.element.remove();
        });
        this.labels = [];
    }
}