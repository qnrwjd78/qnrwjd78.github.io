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

        this.rotAngle = 0;
        this.rotSpeed = 0.005;
        this.ifRotation = false;
        this.rotDirection = 1;
        
        this.score = 0;
        this.foundConstellations = [];

        this.setupRotationButtons();
    }

    init() {
        // Three.js 초기화
        this.initThreeJS();
        
        // 매니저들 초기화
        this.initManagers();
        
        // 이벤트 리스너
        this.setupEventListeners();
        
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

        // 렌더링
        this.renderer.render(this.scene, this.camera);

        if (this.sceneManager.oceanGeometry) {
            const pos = this.sceneManager.oceanGeometry.attributes.position;

            if(this.ifRotation){
                this.rotAngle += this.rotSpeed * this.rotDirection;
                console.log("rotating celestial");
                this.celestial.rotation.y = this.rotAngle;
                this.celestial.rotation.x = this.rotAngle * 0.5;
                this.celestial.rotation.z = this.rotAngle * 0.5;
            }
            
            // const time = performance.now() * 0.5;
            // for (let i = 0; i < pos.count; i++) {
            //     const x = pos.getX(i);
            //     const y = pos.getY(i); // CircleGeometry는 x, y 평면 위임

            //     // 중심에서 멀어질수록 높이 변화
            //     const dist = Math.sqrt(x * x + y * y);
            //     const wave = Math.sin(dist * 0.1 - time) * 20;

            //     pos.setZ(i, wave);
            // }

            pos.needsUpdate = true;
            this.sceneManager.oceanGeometry.computeVertexNormals();
        }

    }
}