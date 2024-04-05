var icon = document.getElementById("icon");
if (icon.innerText == "🌙") {
    document.body.classList.toggle("light-theme")
}
else {
    document.body.classList.toggle("dark-theme")
}
icon.onclick = function(){
    console.log("clicked")
    document.body.classList.toggle("dark-theme")
    document.body.classList.toggle("light-theme")

    icon.innerText = (icon.innerText == "🌙")
        ? "☀️"
        : "🌙"

}
const highScoresList = document.querySelector('#highScoresList')
const highScores = JSON.parse(localStorage.getItem('highScores')) || []

highScoresList.innerHTML = 
highScores.map(score => {
    return `<li class="high-score">${score.name} - ${score.score + "%"}</li>`
}).join('')

function clearLeaderboard() {
    localStorage.clear()
    location.reload()
}