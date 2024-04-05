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
const username = document.querySelector("#username");
const saveScoreBtn = document.querySelector("#saveScoreBtn");
const finalScore = document.querySelector("#finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore + "%";

username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };

    highScores.push(score);

    highScores.sort((a, b) => {
        return b.score - a.score;
    });

    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    saveScoreBtn.disabled = true;
    alert("Your score has been saved!");
};
