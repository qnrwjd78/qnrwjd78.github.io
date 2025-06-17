class MathUtils {
    /**
     * RA/Dec 좌표를 3D 좌표로 변환
     * @param {number} ra - Right Ascension (시간 단위)
     * @param {number} dec - Declination (도 단위)
     * @param {number} radius - 구의 반경
     * @returns {Object} {x, y, z} 좌표
     */
    static raDecTo3D(ra, dec, radius) {
        // RA를 라디안으로 변환 (시간 -> 도 -> 라디안)
        const theta = ra * 15 * Math.PI / 180;
        
        // Dec를 라디안으로 변환
        const phi = (90 - dec) * Math.PI / 180;
        
        // 구면 좌표를 직교 좌표로 변환
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        return { x, y, z };
    }

    /**
     * 두 점 사이의 거리 계산
     * @param {THREE.Vector3} point1
     * @param {THREE.Vector3} point2
     * @returns {number} 거리
     */
    static distance(point1, point2) {
        return point1.distanceTo(point2);
    }

    /**
     * 각도를 라디안으로 변환
     * @param {number} degrees
     * @returns {number} 라디안
     */
    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    /**
     * 라디안을 각도로 변환
     * @param {number} radians
     * @returns {number} 각도
     */
    static radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    /**
     * 범위 제한
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number} 제한된 값
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * 선형 보간
     * @param {number} start
     * @param {number} end
     * @param {number} t - 0~1 사이의 값
     * @returns {number} 보간된 값
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    /**
     * 벡터 정규화
     * @param {Object} vector - {x, y, z} 벡터
     * @returns {Object} 정규화된 벡터
     */
    static normalize(vector) {
        const length = Math.sqrt(
            vector.x * vector.x + 
            vector.y * vector.y + 
            vector.z * vector.z
        );
        
        if (length === 0) return { x: 0, y: 0, z: 0 };
        
        return {
            x: vector.x / length,
            y: vector.y / length,
            z: vector.z / length
        };
    }
}