class StarManager {
    constructor(scene, camera, celestial) {
        this.scene = scene;
        this.camera = camera;
        this.celestial = celestial;
        this.stars = [];
        this.starMeshes = new Map();
        this.starLights = [];
        this.starLabels = null;
    }

    createConstellationStars(constellation) {
        this.clearStars();
        
        const sphereRadius = 5000;
        
        // 별 라벨 관리자 생성
        this.starLabels = new StarLabels(this.camera);

        // 별자리의 크기 계산 (RA/Dec 범위)
        const raValues = constellation.stars.map(s => s.ra);
        const decValues = constellation.stars.map(s => s.dec);
        const raRange = Math.max(...raValues) - Math.min(...raValues);
        const decRange = Math.max(...decValues) - Math.min(...decValues);
        
        // 별자리 크기에 따른 동적 스케일 팩터
        // 작은 별자리는 더 확대, 큰 별자리는 덜 확대
        const baseScale = 1.2;
        const sizeFactorRa = Math.max(1, 3 / raRange);  // RA 범위가 작으면 스케일 증가
        const sizeFactorDec = Math.max(1, 30 / decRange); // Dec 범위가 작으면 스케일 증가
        const scaleFactor = baseScale * Math.min(sizeFactorRa, sizeFactorDec, 2.5); // 최대 2.5배
        
        // 별자리의 중심점 찾기
        let centerRa = 0, centerDec = 0;
        constellation.stars.forEach(star => {
            centerRa += star.ra;
            centerDec += star.dec;
        });
        centerRa /= constellation.stars.length;
        centerDec /= constellation.stars.length;

        console.log(`${constellation.name}: 스케일 팩터 = ${scaleFactor.toFixed(2)}`);

        constellation.stars.forEach((star, index) => {
            // 중심점 기준으로 확대
            const adjustedRa = centerRa + (star.ra - centerRa) * scaleFactor;
            const adjustedDec = centerDec + (star.dec - centerDec) * scaleFactor;
            
            // RA/Dec를 3D 좌표로 변환
            const coords = MathUtils.raDecTo3D(adjustedRa, adjustedDec, sphereRadius);
            
            // 별 크기도 별자리 크기에 맞게 조정
            // const baseSize = 40 + (scaleFactor * 2); // 스케일이 클수록 별도 약간 크게
            const baseSize = 40// 스케일이 클수록 별도 약간 크게
            const size = baseSize / (star.mag * 0.6);
            
            // 별 메쉬 생성
            const starMesh = this.createStarMesh(size, coords, index, star);
            
            this.celestial.add(starMesh);
            this.stars.push(starMesh);
            this.starMeshes.set(index, starMesh);

            // 별 주위 광원 효과
            const starLight = new THREE.PointLight(0xFFFFFF, 0.4, size * 8);
            starLight.position.copy(starMesh.position);
            this.scene.add(starLight);
            this.starLights.push(starLight);
        });

        // 별자리 크기 정보 저장 (가이드에서 사용)
        this.currentScaleFactor = scaleFactor;
    }

    createStarMesh(size, position, index, starData) {
        // 별 형태
        const starGeometry = new THREE.SphereGeometry(size, 24, 24);
        
        // 별의 색상을 등급에 따라 다르게
        let starColor = 0xFFFFFF;
        if (starData.mag < 1.5) {
            starColor = 0xFFFFCC; // 매우 밝은 별은 노란빛
        } else if (starData.mag < 2.5) {
            starColor = 0xFFFFEE; // 밝은 별은 약간 노란빛
        } else if (starData.mag > 3.5) {
            starColor = 0xEEEEFF; // 어두운 별은 약간 파란빛
        }
        
        const starMaterial = new THREE.MeshPhongMaterial({
            color: starColor,
            emissive: starColor,
            emissiveIntensity: 0.5,
            shininess: 100
        });
        
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.set(position.x, position.y, position.z);
        starMesh.userData = { 
            index: index, 
            isClickable: true,
            name: starData.name,
            magnitude: starData.mag
        };
        
        return starMesh;
    }

    highlightStar(starIndex) {
        const star = this.starMeshes.get(starIndex);
        if (star) {
            star.material.color.setHex(0xFFD700);
            star.material.emissive.setHex(0xFFD700);
            star.scale.set(1.4, 1.4, 1.4);
        }
    }

    resetStarHighlight(starIndex) {
        const star = this.starMeshes.get(starIndex);
        if (star) {
            // 원래 색상으로 복원
            let originalColor = 0xFFFFFF;
            if (star.userData.magnitude < 1.5) {
                originalColor = 0xFFFFCC;
            } else if (star.userData.magnitude < 2.5) {
                originalColor = 0xFFFFEE;
            } else if (star.userData.magnitude > 3.5) {
                originalColor = 0xEEEEFF;
            }
            
            star.material.color.setHex(originalColor);
            star.material.emissive.setHex(originalColor);
            star.scale.set(1, 1, 1);
        }
    }

    clearStars() {
        // 별 제거
        this.stars.forEach(star => {
            this.scene.remove(star);
        });
        this.stars = [];
        this.starMeshes.clear();

        // 광원 제거
        this.starLights.forEach(light => {
            this.scene.remove(light);
        });
        this.starLights = [];

        // 라벨 제거
        if (this.starLabels) {
            this.starLabels.clear();
            this.starLabels = null;
        }
    }

    getStars() {
        return this.stars;
    }

    getStarByIndex(index) {
        return this.starMeshes.get(index);
    }

    getCurrentScaleFactor() {
        return this.currentScaleFactor || 1.5;
    }
}