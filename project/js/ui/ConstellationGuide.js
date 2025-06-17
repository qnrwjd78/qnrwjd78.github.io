class ConstellationGuide {
    constructor() {
        this.canvas = document.getElementById('guide-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    drawGuide(constellation) {
        // 캔버스 크기 설정
        this.canvas.width = 260;
        this.canvas.height = 150;
        
        // 배경
        this.ctx.fillStyle = 'rgba(0, 0, 20, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 별 위치 계산 (2D 투영)
        const padding = 25; // 적당한 패딩
        const stars2D = this.projectStarsTo2D(constellation.stars, padding);
        
        // 모든 연결선 그리기
        this.drawAllConnections(stars2D, constellation.connections);
        
        // 별 그리기
        this.drawStars(stars2D, constellation.stars);
    }

    projectStarsTo2D(stars, padding) {
        const stars2D = [];
        
        // RA/Dec 범위 찾기
        const raValues = stars.map(s => s.ra);
        const decValues = stars.map(s => s.dec);
        const minRa = Math.min(...raValues);
        const maxRa = Math.max(...raValues);
        const minDec = Math.min(...decValues);
        const maxDec = Math.max(...decValues);
        
        // 중심점
        const centerRa = (minRa + maxRa) / 2;
        const centerDec = (minDec + maxDec) / 2;
        
        // 범위 (StarManager와 동일한 스케일 적용)
        const scaleFactor = 1.5;
        const raRange = (maxRa - minRa) * scaleFactor || 1;
        const decRange = (maxDec - minDec) * scaleFactor || 1;
        
        stars.forEach((star, index) => {
            // 중심 기준으로 확대
            const adjustedRa = centerRa + (star.ra - centerRa) * scaleFactor;
            const adjustedDec = centerDec + (star.dec - centerDec) * scaleFactor;
            
            // 정규화된 좌표 계산
            const x = padding + ((adjustedRa - (centerRa - raRange/2)) / raRange) * 
                     (this.canvas.width - 2 * padding);
            const y = padding + (((centerDec + decRange/2) - adjustedDec) / decRange) * 
                     (this.canvas.height - 2 * padding);
            
            stars2D.push({ x, y, index, mag: star.mag });
        });
        
        return stars2D;
    }

    drawAllConnections(stars2D, connections) {
        this.ctx.strokeStyle = '#4FC3F7';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        connections.forEach((connection) => {
            const [start, end] = connection;
            
            if (start < stars2D.length && end < stars2D.length) {
                this.ctx.beginPath();
                this.ctx.moveTo(stars2D[start].x, stars2D[start].y);
                this.ctx.lineTo(stars2D[end].x, stars2D[end].y);
                this.ctx.stroke();
            }
        });
        
        this.ctx.setLineDash([]);
    }

    drawStars(stars2D, starsData) {
        stars2D.forEach((star, index) => {
            // 별 크기를 등급에 따라 조정 (적당한 크기로)
            const radius = 8 / (star.mag * 0.5);
            
            // 별 그리기
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fill();
            
            // 별 테두리
            this.ctx.strokeStyle = '#4FC3F7';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
            
            // 별 번호
            this.ctx.fillStyle = '#000000';
            this.ctx.font = `bold ${Math.min(12, radius * 1.8)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(index + 1, star.x, star.y);
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}