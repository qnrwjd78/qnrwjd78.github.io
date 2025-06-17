class ConstellationRenderer {
    constructor(scene, celestial) {
        this.scene = scene;
        this.celestial = celestial;
        this.constellationLines = [];
        this.models = [];
    }

    drawLine(startStar, endStar) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            startStar.position, 
            endStar.position
        ]);
        
        const material = new THREE.LineBasicMaterial({ 
            color: 0x4FC3F7,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });
        
        const line = new THREE.Line(geometry, material);
        this.celestial.add(line);
        this.constellationLines.push(line);
    }

    showWrongAnswer() {
        this.constellationLines.forEach(line => {
            line.material.color.setHex(0xFF0000);
            line.material.opacity = 0.5;
        });
    }

    showHintLines(connections, starManager) {
        const hintLines = [];
        
        connections.forEach(connection => {
            const [start, end] = connection;
            const startStar = starManager.getStarByIndex(start);
            const endStar = starManager.getStarByIndex(end);

            const geometry = new THREE.BufferGeometry().setFromPoints([
                startStar.position,
                endStar.position
            ]);
            
            const material = new THREE.LineBasicMaterial({ 
                color: 0xFFFF00,
                linewidth: 2,
                transparent: true,
                opacity: 0.3
            });
            
            const hintLine = new THREE.Line(geometry, material);
            this.celestial.add(hintLine);
            hintLines.push(hintLine);
        });

        // 3초 후 힌트 제거
        setTimeout(() => {
            hintLines.forEach(line => {
                this.celestial.remove(line);
            });
        }, 3000);
    }

    create3DModel(modelType, position) {
        let model;
        const material = new THREE.MeshPhongMaterial({
            color: 0x4FC3F7,
            emissive: 0x2196F3,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8
        });

        switch(modelType) {
            case 'waterJug':
                model = this.createWaterJug(material);
                break;
            case 'lion':
                model = this.createLion(material);
                break;
            case 'fish':
                model = this.createFish(material);
                break;
            case 'ram':
                model = this.createRam(material);
                break;
            case 'bull':
                model = this.createBull(material);
                break;
            case 'twins':
                model = this.createTwins(material);
                break;
            case 'crab':
                model = this.createCrab(material);
                break;
            case 'maiden':
                model = this.createMaiden(material);
                break;
            case 'scales':
                model = this.createScales(material);
                break;
            case 'scorpion':
                model = this.createScorpion(material);
                break;
            case 'archer':
                model = this.createArcher(material);
                break;
            case 'seaGoat':
                model = this.createSeaGoat(material);
                break;
            default:
                model = new THREE.Mesh(
                    new THREE.BoxGeometry(50, 50, 50),
                    material
                );
        }

        model.position.copy(position);
        model.scale.set(2, 2, 2);
        this.scene.add(model);
        this.models.push(model);

        // 회전 애니메이션
        const animate = () => {
            model.rotation.y += 0.01;
            if (model.parent) {
                requestAnimationFrame(animate);
            }
        };
        animate();

        return model;
    }

    createWaterJug(material) {
        const jugGroup = new THREE.Group();
        
        const bodyGeometry = new THREE.CylinderGeometry(20, 25, 40, 16);
        const body = new THREE.Mesh(bodyGeometry, material);
        jugGroup.add(body);
        
        const neckGeometry = new THREE.CylinderGeometry(10, 20, 20, 16);
        const neck = new THREE.Mesh(neckGeometry, material);
        neck.position.y = 30;
        jugGroup.add(neck);
        
        return jugGroup;
    }

    createLion(material) {
        const lionGroup = new THREE.Group();
        
        // 몸통
        const bodyGeometry = new THREE.BoxGeometry(60, 30, 40);
        const body = new THREE.Mesh(bodyGeometry, material);
        lionGroup.add(body);
        
        // 머리
        const headGeometry = new THREE.SphereGeometry(25, 16, 16);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.set(40, 0, 0);
        lionGroup.add(head);
        
        return lionGroup;
    }

    createFish(material) {
        const fishGroup = new THREE.Group();
        
        // 물고기 몸통 (타원형)
        const bodyGeometry = new THREE.SphereGeometry(30, 16, 8);
        bodyGeometry.scale(1.5, 0.7, 0.5);
        const body = new THREE.Mesh(bodyGeometry, material);
        fishGroup.add(body);
        
        // 꼬리
        const tailGeometry = new THREE.ConeGeometry(15, 30, 8);
        const tail = new THREE.Mesh(tailGeometry, material);
        tail.position.set(-35, 0, 0);
        tail.rotation.z = -Math.PI / 2;
        fishGroup.add(tail);
        
        return fishGroup;
    }

    createRam(material) {
        const ramGroup = new THREE.Group();
        
        // 몸통
        const bodyGeometry = new THREE.BoxGeometry(50, 30, 30);
        const body = new THREE.Mesh(bodyGeometry, material);
        ramGroup.add(body);
        
        // 뿔 (나선형 간단화)
        const hornGeometry = new THREE.TorusGeometry(10, 3, 8, 16);
        const horn1 = new THREE.Mesh(hornGeometry, material);
        horn1.position.set(20, 20, 10);
        ramGroup.add(horn1);
        
        const horn2 = new THREE.Mesh(hornGeometry, material);
        horn2.position.set(20, 20, -10);
        ramGroup.add(horn2);
        
        return ramGroup;
    }

    createBull(material) {
        const bullGroup = new THREE.Group();
        
        // 몸통
        const bodyGeometry = new THREE.BoxGeometry(60, 40, 40);
        const body = new THREE.Mesh(bodyGeometry, material);
        bullGroup.add(body);
        
        // 뿔
        const hornGeometry = new THREE.ConeGeometry(5, 20, 8);
        const horn1 = new THREE.Mesh(hornGeometry, material);
        horn1.position.set(30, 30, 10);
        bullGroup.add(horn1);
        
        const horn2 = new THREE.Mesh(hornGeometry, material);
        horn2.position.set(30, 30, -10);
        bullGroup.add(horn2);
        
        return bullGroup;
    }

    createTwins(material) {
        const twinsGroup = new THREE.Group();
        
        // 첫 번째 사람
        const person1 = new THREE.Group();
        const body1 = new THREE.Mesh(new THREE.BoxGeometry(20, 40, 15), material);
        const head1 = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), material);
        head1.position.y = 30;
        person1.add(body1);
        person1.add(head1);
        person1.position.x = -20;
        
        // 두 번째 사람
        const person2 = person1.clone();
        person2.position.x = 20;
        
        twinsGroup.add(person1);
        twinsGroup.add(person2);
        
        return twinsGroup;
    }

    createCrab(material) {
        const crabGroup = new THREE.Group();
        
        // 몸통
        const bodyGeometry = new THREE.SphereGeometry(25, 16, 8);
        bodyGeometry.scale(1.5, 0.7, 1);
        const body = new THREE.Mesh(bodyGeometry, material);
        crabGroup.add(body);
        
        // 집게발
        const clawGeometry = new THREE.BoxGeometry(15, 5, 10);
        const claw1 = new THREE.Mesh(clawGeometry, material);
        claw1.position.set(30, 0, 15);
        crabGroup.add(claw1);
        
        const claw2 = new THREE.Mesh(clawGeometry, material);
        claw2.position.set(30, 0, -15);
        crabGroup.add(claw2);
        
        return crabGroup;
    }

    createMaiden(material) {
        const maidenGroup = new THREE.Group();
        
        // 몸통 (드레스 형태)
        const bodyGeometry = new THREE.ConeGeometry(20, 50, 16);
        const body = new THREE.Mesh(bodyGeometry, material);
        maidenGroup.add(body);
        
        // 머리
        const headGeometry = new THREE.SphereGeometry(12, 16, 16);
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 35;
        maidenGroup.add(head);
        
        return maidenGroup;
    }

    createScales(material) {
        const scalesGroup = new THREE.Group();
        
        // 저울대
        const beamGeometry = new THREE.BoxGeometry(80, 5, 5);
        const beam = new THREE.Mesh(beamGeometry, material);
        beam.position.y = 20;
        scalesGroup.add(beam);
        
        // 저울판
        const plateGeometry = new THREE.CylinderGeometry(15, 15, 3, 16);
        const plate1 = new THREE.Mesh(plateGeometry, material);
        plate1.position.set(-35, 10, 0);
        scalesGroup.add(plate1);
        
        const plate2 = new THREE.Mesh(plateGeometry, material);
        plate2.position.set(35, 10, 0);
        scalesGroup.add(plate2);
        
        // 중심 기둥
        const poleGeometry = new THREE.CylinderGeometry(3, 3, 40, 8);
        const pole = new THREE.Mesh(poleGeometry, material);
        scalesGroup.add(pole);
        
        return scalesGroup;
    }

    createScorpion(material) {
        const scorpionGroup = new THREE.Group();
        
        // 몸통 (여러 마디)
        for (let i = 0; i < 5; i++) {
            const segmentGeometry = new THREE.SphereGeometry(10 - i * 1.5, 8, 8);
            const segment = new THREE.Mesh(segmentGeometry, material);
            segment.position.x = -i * 15;
            scorpionGroup.add(segment);
        }
        
        // 꼬리 (곡선)
        const tailGeometry = new THREE.ConeGeometry(5, 20, 8);
        const tail = new THREE.Mesh(tailGeometry, material);
        tail.position.set(-70, 10, 0);
        tail.rotation.z = Math.PI / 4;
        scorpionGroup.add(tail);
        
        return scorpionGroup;
    }

    createArcher(material) {
        const archerGroup = new THREE.Group();
        
        // 활
        const bowGeometry = new THREE.TorusGeometry(30, 3, 8, 16, Math.PI);
        const bow = new THREE.Mesh(bowGeometry, material);
        bow.rotation.z = -Math.PI / 2;
        archerGroup.add(bow);
        
        // 화살
        const arrowGeometry = new THREE.CylinderGeometry(1, 1, 50, 8);
        const arrow = new THREE.Mesh(arrowGeometry, material);
        arrow.rotation.z = Math.PI / 2;
        archerGroup.add(arrow);
        
        return archerGroup;
    }

    createSeaGoat(material) {
        const seaGoatGroup = new THREE.Group();
        
        // 염소 상반신
        const upperGeometry = new THREE.BoxGeometry(30, 25, 20);
        const upper = new THREE.Mesh(upperGeometry, material);
        upper.position.y = 10;
        seaGoatGroup.add(upper);
        
        // 물고기 하반신
        const lowerGeometry = new THREE.ConeGeometry(15, 40, 8);
        const lower = new THREE.Mesh(lowerGeometry, material);
        lower.position.y = -20;
        lower.rotation.z = Math.PI;
        seaGoatGroup.add(lower);
        
        // 뿔
        const hornGeometry = new THREE.ConeGeometry(3, 15, 6);
        const horn1 = new THREE.Mesh(hornGeometry, material);
        horn1.position.set(10, 30, 5);
        seaGoatGroup.add(horn1);
        
        const horn2 = new THREE.Mesh(hornGeometry, material);
        horn2.position.set(10, 30, -5);
        seaGoatGroup.add(horn2);
        
        return seaGoatGroup;
    }

    clearLines() {
        this.constellationLines.forEach(line => {
            this.celestial.remove(line);
        });
        this.constellationLines = [];
    }

    clearAll() {
        this.clearLines();
        
        // 모델 제거
        this.models.forEach(model => {
            this.scene.remove(model);
        });
        this.models = [];
    }
}