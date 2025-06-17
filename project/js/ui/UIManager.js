class UIManager {
    constructor(constellationManager, game) {
        this.constellationManager = constellationManager;
        this.game = game;
    }
    
    updateScore(score) {
        // document.getElementById('score').textContent = score;
    }

    updateFoundCount(count) {
        document.getElementById('found').textContent = count;
    }

    showSuccessMessage() {
        const successMsg = document.getElementById('success-message');
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    }

    updateMission(constellationName) {
        document.getElementById('current-mission').textContent = 
            `${constellationName}를 찾아보세요!`;
        document.getElementById('mission-hint').textContent = '';
    }

    showHint(hintText) {
        document.getElementById('mission-hint').textContent = hintText;
    }
}