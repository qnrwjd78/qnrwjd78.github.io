class SceneManager {
    constructor() {
        this.segments = 200;
        this.size = 2000;
        this.scene = new THREE.Scene();
        this.celestial = new THREE.Group();
        this.z_velocity = new Float32Array((this.segments + 1) ** 2);
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

    getPlane() {
        return this.plane;
    }

    getZVelocity() {
        return this.z_velocity;
    }

    getSegments() {
        return this.segments;
    }

    setupLights() {        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 20, 200, 2);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);

        // Spot light
        const spotLight = new THREE.SpotLight();
        spotLight.intensity = 70;
        spotLight.decay = 0;
        spotLight.position.set(0, 100, 0);
        spotLight.penumbra = 0.5;
        spotLight.angle = Math.PI / 2;
        this.scene.add( spotLight );

        const boatGeometry = new THREE.SphereGeometry(5);
        const boatMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 
        const boatMesh = new THREE.Mesh( boatGeometry, boatMaterial );
        boatMesh.position.set(0, 5, 0);
        this.scene.add( boatMesh );
    }

    
    setupPlane() {
        const geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
        const material = new THREE.MeshStandardMaterial({
            color: 0x5050ff,
            side: THREE.DoubleSide,
            metalness: 0.98,
            roughness: 0.0,
            transparent: true,
            opacity: 0.9
        });

        this.plane = new THREE.Mesh(geometry, material);
        this.plane.rotation.x = -Math.PI / 2;
        this.plane.position.y = -5;
        this.plane.receiveShadow = true;

        this.scene.add(this.plane);
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