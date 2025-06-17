class ConstellationManager {
    constructor(scene, camera, starManager, celestial) {
        this.scene = scene;
        this.camera = camera;
        this.starManager = starManager;
        this.constellationRenderer = new ConstellationRenderer(scene, celestial);
        
        this.currentConstellation = null;
        this.drawnConnections = []; // 그려진 연결선들
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.constellationGuide = new ConstellationGuide();
        
        // 선택 모드
        this.firstSelectedStar = null; // 첫 번째 선택한 별
    }

    startNewConstellation() {
        // 랜덤으로 별자리 선택
        const availableConstellations = ConstellationNames.filter(name => 
            !window.game.foundConstellations.includes(name)
        );
        
        if (availableConstellations.length === 0) {
            this.onGameComplete();
            return;
        }
        
        this.currentConstellation = availableConstellations[
            Math.floor(Math.random() * availableConstellations.length)
        ];
        
        // 별자리 데이터 가져오기
        const constellation = ConstellationData[this.currentConstellation];
        
        // UI 업데이트
        document.getElementById('current-mission').textContent = 
            `${constellation.name}를 찾아보세요!`;
        document.getElementById('mission-hint').textContent = '두 별을 순서대로 클릭하여 연결하세요.';
        
        // 별 생성
        this.starManager.createConstellationStars(constellation);
        
        // 가이드 그리기
        this.constellationGuide.drawGuide(constellation);
        
        // 선택 초기화
        this.drawnConnections = [];
        this.firstSelectedStar = null;
    }

    handleClick(event) {
        // 마우스 좌표 정규화
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycasting
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.starManager.getStars());

        if (intersects.length > 0) {
            const clickedStar = intersects[0].object;
            if (clickedStar.userData && clickedStar.userData.isClickable) {
                this.selectStar(clickedStar);
            }
        }
    }

    selectStar(star) {
        const starIndex = star.userData.index;
        
        if (this.firstSelectedStar === null) {
            // 첫 번째 별 선택
            this.firstSelectedStar = starIndex;
            this.starManager.highlightStar(starIndex);
            document.getElementById('mission-hint').textContent = 
                `별 ${starIndex + 1}을 선택했습니다. 연결할 다음 별을 선택하세요.`;
        } else if (this.firstSelectedStar === starIndex) {
            // 같은 별을 다시 클릭하면 선택 취소
            this.starManager.resetStarHighlight(starIndex);
            this.firstSelectedStar = null;
            document.getElementById('mission-hint').textContent = '두 별을 순서대로 클릭하여 연결하세요.';
        } else {
            // 두 번째 별 선택 - 연결선 그리기
            this.drawConnection(this.firstSelectedStar, starIndex);
            
            // 첫 번째 별 하이라이트 제거
            this.starManager.resetStarHighlight(this.firstSelectedStar);
            this.firstSelectedStar = null;
            
            // 별자리 완성 체크
            this.checkConstellation();
        }
    }

    drawConnection(star1Index, star2Index) {
        // 이미 그려진 연결인지 확인
        const connectionExists = this.drawnConnections.some(conn =>
            (conn[0] === star1Index && conn[1] === star2Index) ||
            (conn[0] === star2Index && conn[1] === star1Index)
        );
        
        if (!connectionExists) {
            // 연결선 그리기
            this.constellationRenderer.drawLine(
                this.starManager.getStarByIndex(star1Index),
                this.starManager.getStarByIndex(star2Index)
            );
            
            // 연결 저장
            this.drawnConnections.push([star1Index, star2Index]);
            
            document.getElementById('mission-hint').textContent = 
                `연결 완료! 계속해서 별들을 연결하세요. (${this.drawnConnections.length}개 연결됨)`;
        }
    }

    checkConstellation() {
        const constellation = ConstellationData[this.currentConstellation];
        
        // 필요한 모든 연결이 그려졌는지 확인
        let correctConnections = 0;
        
        constellation.connections.forEach(requiredConn => {
            const found = this.drawnConnections.some(drawnConn =>
                (drawnConn[0] === requiredConn[0] && drawnConn[1] === requiredConn[1]) ||
                (drawnConn[0] === requiredConn[1] && drawnConn[1] === requiredConn[0])
            );
            if (found) correctConnections++;
        });
        
        // 모든 연결이 맞았는지 확인
        if (correctConnections === constellation.connections.length) {
            this.onConstellationFound();
        } else if (this.drawnConnections.length >= constellation.connections.length) {
            // 필요한 수만큼 그렸지만 틀린 경우
            document.getElementById('mission-hint').textContent = 
                `잘못된 연결이 있습니다. 다시 시도해보세요.`;
            setTimeout(() => {
                this.showWrongAnswer();
            }, 1000);
        }
    }

    onConstellationFound() {
        const constellation = ConstellationData[this.currentConstellation];
        
        document.getElementById('mission-hint').textContent = '정답입니다! 🎉';
        
        // 3D 모델 표시
        this.show3DModel(constellation);
        
        // 게임에 알림
        window.game.onConstellationFound();
    }

    show3DModel(constellation) {
        // 별자리 중심점 계산
        let centerPos = new THREE.Vector3();
        const stars = this.starManager.getStars();
        stars.forEach(star => {
            centerPos.add(star.position);
        });
        centerPos.divideScalar(stars.length);

        // 3D 모델 생성
        const model = this.constellationRenderer.create3DModel(
            constellation.modelType, 
            centerPos
        );
        
        // 별자리 정보 표시
        const infoPanel = document.getElementById('constellation-info');
        document.getElementById('constellation-name').textContent = constellation.name;
        document.getElementById('constellation-description').textContent = constellation.description;
        infoPanel.style.display = 'block';
        
        setTimeout(() => {
            infoPanel.style.display = 'none';
        }, 4000);
    }

    showWrongAnswer() {
        this.constellationRenderer.showWrongAnswer();
        
        setTimeout(() => {
            this.resetCurrentAttempt();
        }, 2000);
    }

    resetCurrentAttempt() {
        // 현재 시도 초기화
        this.drawnConnections = [];
        this.firstSelectedStar = null;
        
        // 별 상태 초기화
        this.starManager.stars.forEach((star) => {
            this.starManager.resetStarHighlight(star.userData.index);
        });
        
        // 연결선 제거
        this.constellationRenderer.clearLines();
        
        document.getElementById('mission-hint').textContent = '두 별을 순서대로 클릭하여 연결하세요.';
    }

    showHint() {
        const constellation = ConstellationData[this.currentConstellation];
        const hintText = `이 별자리는 ${constellation.connections.length}개의 연결선으로 이루어져 있습니다.`;
        document.getElementById('mission-hint').textContent = hintText;

        // 힌트 선 표시
        this.constellationRenderer.showHintLines(
            constellation.connections,
            this.starManager
        );
    }

    nextConstellation() {
        // 정리
        this.clearConstellation();
        
        // 새 별자리 시작
        this.startNewConstellation();
    }

    clearConstellation() {
        this.drawnConnections = [];
        this.firstSelectedStar = null;
        this.starManager.clearStars();
        this.constellationRenderer.clearAll();
    }

    onGameComplete() {
        alert(`축하합니다! 모든 별자리를 찾았습니다!\n최종 점수: ${window.game.score}`);
    }
}