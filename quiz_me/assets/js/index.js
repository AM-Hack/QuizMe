const playButton = document.querySelector("#playButton");
const topic = document.querySelector("#topic");
const num = document.querySelector("#qnum");

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
    playButton.disabled = !(!!topic.value && !!num.value);
});

num.addEventListener("keyup", () => {
    playButton.disabled = !(!!topic.value && !!num.value);
});

function goToLeaderboard() {
    location.replace("highscores.html");
}

topic.addEventListener("input", () => {
    if (topic.value.length > 0) {
      num.style.opacity = 1;
    } else {
      num.style.opacity = 0;
    }
});