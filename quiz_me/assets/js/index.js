const playButton = document.querySelector("#playButton");
const topic = document.querySelector("#topic");
const num = document.querySelector("#qnum");
const currentColorMode = JSON.stringify(
    localStorage.getItem("colorMode")
).substring(1, 2);
var icon = document.getElementById("icon");

if (currentColorMode == "u") {
    localStorage.setItem("colorMode", "d");
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
} else if (currentColorMode == "d") {
    icon.innerText = "☀️";
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
} else if (currentColorMode == "l") {
    icon.innerText = "🌙";
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
}

function SaveAndChange() {
    const topicValue = topic.value;

    const numQ = num.value;
    if (/^\d+$/.test(numQ)) {
        location.replace(`/game.html?topic=${topicValue}&num=${numQ}`);
    } else {
        alert("Please enter a valid number!");
    }
}

topic.addEventListener("keyup", () => {
    playButton.disabled = !topic.value;
});

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


function goToLeaderboard() {
    location.replace('highscores.html')
}