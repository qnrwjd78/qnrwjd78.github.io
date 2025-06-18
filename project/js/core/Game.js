class ConstellationGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sceneManager = null;
        this.celestial = null;
        this.cameraController = null;
        this.starManager = null;
        this.constellationManager = null;
        this.uiManager = null;
        this.clock = new THREE.Clock();

        this.rotAngle = 0;
        this.rotSpeed = 0.005;
        this.ifRotation = false;
        this.rotDirection = 1;
        this.isPlaying = false;
        
        this.score = 0;
        this.foundConstellations = [];
        
    }

    init() {
        // Three.js 초기화
        this.initThreeJS();
        
        // 매니저들 초기화
        this.initManagers();
        
        // 이벤트 리스너
        this.setupEventListeners();
        
        this.initStartUi();
        this.setupRotationButtons();
        this.setupWave();

        // 로딩 완료
        document.getElementById('loading').style.display = 'none';
        
        // 애니메이션 시작
        this.animate();
    }

    initThreeJS() {
        // 렌더러 설정
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        // 씬 생성
        this.sceneManager = new SceneManager();
        this.scene = this.sceneManager.getScene();
        this.celestial = this.sceneManager.getCelestial();
        
        // 카메라 생성
        this.cameraController = new CameraController(this.renderer.domElement);
        this.camera = this.cameraController.getCamera();
    }

    initManagers() {
        // 별 관리자
        this.starManager = new StarManager(this.scene, this.camera, this.celestial);
        
        // 별자리 관리자
        this.constellationManager = new ConstellationManager(
            this.scene, 
            this.camera,
            this.starManager,
            this.celestial
        );

        
        // UI 관리자
        this.uiManager = new UIManager(
            this.constellationManager,
            this
        );
        
        // 첫 별자리 시작
        this.constellationManager.startNewConstellation();
    }

    initStartUi(){
        const textureLoader = new THREE.TextureLoader();
        const ui_0 = new THREE.Sprite(new THREE.SpriteMaterial({ map : textureLoader.load('js/textures/title.png') }));
        const ui_1 = new THREE.Sprite(new THREE.SpriteMaterial({ map : textureLoader.load('js/textures/click_to_start.png') }));

        ui_0.center = new THREE.Vector2(2, -4);
        ui_0.scale.set(window.innerWidth * 0.4, window.innerWidth * 0.08, 1);
        ui_0.position.set(window.innerWidth * 0.4, 0, 0);
        ui_0.material.transparent = true;

        ui_1.center = new THREE.Vector2(0.5, 0.5);
        ui_1.scale.set(window.innerWidth * 0.09, window.innerWidth * 0.018, 1);
        ui_1.position.set(0, -window.innerHeight * 0.4, 0);
        ui_1.material.transparent = true;

        this.scene.add(ui_0);
        this.scene.add(ui_1);
        const missionPanel = document.getElementById("mission-panel");

        window.onpointerdown = () => {
            if(!this.isPlaying) {
                gsap.to(this.camera.position, {
                    x: 0,
                    y: 400,
                    z: 0,
                    duration: 2,
                    ease: "power2.out",
                    onComplete: () => {
                        this.controls = this.cameraController.getControls();
                        this.controls.maxDistance = 300;
                        missionPanel.classList.add("hidden")
                    }
                });

                gsap.to(ui_0.material, {
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    onComplete: () => {
                        this.scene.remove(ui_0);
                    }
                });

                gsap.to(ui_1.material, {
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    onComplete: () => {
                        this.scene.remove(ui_1);
                    }
                });

                this.isPlaying = true;
                
            }
        }
    }

    setupRotationButtons() {
        const foward = document.getElementById("rot-fow");
        const reverse = document.getElementById("rot-rev");
        const stop = document.getElementById("rot-stop");

        foward.addEventListener("click", () => {
            this.ifRotation = true;
            this.rotDirection = 1; // 시계 방향
        });

        reverse.addEventListener("click", () => {
            this.ifRotation = true;
            this.rotDirection = -1; // 시계 방향
        });
        
        stop.addEventListener("click", () => {
            this.ifRotation = false;
        });

    }

    setupWave(){
        this.waveUtils = new WaveUtils(
            this.sceneManager.getPlane(),
            this.sceneManager.getZVelocity(),
            this.sceneManager.getSegments(),
            300
        );
    }

    setupEventListeners() {
        // 마우스 클릭
        this.renderer.domElement.addEventListener('click', (e) => {
            this.constellationManager.handleClick(e);
        });
        
        // 창 크기 변경
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // 힌트 버튼
        document.getElementById('hint-button').addEventListener('click', () => {
            this.showHint();
        });
    }

    showHint() {
        this.constellationManager.showHint();
        this.updateScore(-10); // 힌트 사용시 점수 차감
    }

    updateScore(points) {
        this.score = Math.max(0, this.score + points);
        this.uiManager.updateScore(this.score);
    }

    onConstellationFound() {
        this.updateScore(100);
        this.foundConstellations.push(this.constellationManager.currentConstellation);
        this.uiManager.updateFoundCount(this.foundConstellations.length);
        this.uiManager.showSuccessMessage();
        
        // 다음 별자리로
        setTimeout(() => {
            this.constellationManager.nextConstellation();
        }, 5000);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // 카메라 업데이트
        this.cameraController.update();
        console.log("camera postion: ", this.camera.position);
        console.log("camera rotation: ", this.camera.rotation);

        // 렌더링
        this.renderer.render(this.scene, this.camera);

        const delta = this.clock.getDelta();
        this.waveUtils.updateSurface(delta);

        if(this.ifRotation){
            this.rotAngle += this.rotSpeed * this.rotDirection;
            console.log("rotating celestial");
            this.celestial.rotation.y = this.rotAngle;
            this.celestial.rotation.x = this.rotAngle * 0.5;
            this.celestial.rotation.z = this.rotAngle * 0.5;
        }

    }
}