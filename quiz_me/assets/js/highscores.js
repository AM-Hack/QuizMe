const highScoresList = document.querySelector("#highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
    .map((score) => {
        return `<li class="high-score">${score.name} - ${score.score + "%"}</li>`;
    })
    .join("");

function clearLeaderboard() {
    localStorage.removeItem("mostRecentScore");
    localStorage.removeItem("highScores");
    location.reload();
}


function goHome() {
    location.replace('index.html')
}