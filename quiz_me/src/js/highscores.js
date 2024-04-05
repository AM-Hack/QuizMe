const currentColorMode = JSON.stringify(
    localStorage.getItem("colorMode")
).substring(1, 2);
var icon = document.getElementById("icon");

if (currentColorMode == "d") {
    icon.innerText = "☀️";
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
} else {
    icon.innerText = "🌙";
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
}

icon.onclick = function () {
    if (icon.innerText == "🌙") {
        icon.innerText = "☀️";
        localStorage.setItem("colorMode", "d");
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    } else {
        icon.innerText = "🌙";
        localStorage.setItem("colorMode", "l");
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
    }
};
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
