class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.celestial = new THREE.Group();
        this.scene.add(this.celestial);
        this.scene.fog = new THREE.FogExp2(0x000000, 0.00005);
        
        this.setupLights();
        this.setupPlane();
        this.createStarfield();
    }

    getScene() {
        return this.scene;
    }

    getCelestial() {
        return this.celestial;
    }

    setupPlane() {
        const geometry = new THREE.CircleGeometry(4000, 128).toNonIndexed(); // 세그먼트 높게
        const material = new THREE.MeshStandardMaterial({
            color: 0x204080,
            side: THREE.DoubleSide,
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 1
        });

        const ocean = new THREE.Mesh(geometry, material);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = -150;
        this.scene.add(ocean);
        this.oceanGeometry = geometry;
    }

    setupLights() {
        // 환경광
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // 점광원
        const pointLight = new THREE.PointLight(0xffffff, 2.5, 2000, 2);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }

    createStarfield() {
        // StarField 클래스를 사용하지 않고 직접 생성
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 2,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0.8
        });

        const starsVertices = [];
        for (let i = 0; i < 500; i++) {
            const radius = 5000 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(starsVertices, 3));
        
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.celestial.add(starField);
    }
}