// 게임 시작
window.addEventListener('load', () => {
    const game = new ConstellationGame();
    window.game = game; // 전역 접근을 위해
    game.init();
});

const missionPanel = document.getElementById("mission-panel");
const openBtn = document.getElementById("open-panel");
const closeBtn = document.getElementById("close-panel");

openBtn.addEventListener("click", () => {
  missionPanel.classList.remove("hidden"); // 보이게
  openBtn.style.display = "none";          // 열기 버튼 숨김
});

closeBtn.addEventListener("click", () => {
  missionPanel.classList.add("hidden");    // 숨김 처리
  openBtn.style.display = "block";         // 열기 버튼 보이기
});