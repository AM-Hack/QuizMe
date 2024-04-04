const playButton = document.querySelector('#playButton')
const topic = document.querySelector('#topic')
const num = document.querySelector('#qnum')
document.body.classList.toggle("dark-theme")
function SaveAndChange() {
    const topicValue = topic.value
    const numQ = num.value
    if (/^\d+$/.test(numQ)) { // check if numQ is a number
        location.replace(`/game.html?topic=${topicValue}&num=${numQ}`)
    } else {
        alert("Please enter a valid number!")
    }
}

topic.addEventListener('keyup', () => {
    playButton.disabled = !topic.value
})

var icon = document.getElementById("icon");
icon.onclick = function(){
    console.log("clicked")
    document.body.classList.toggle("dark-theme")
    document.body.classList.toggle("light-theme")

    icon.innerText = (icon.innerText == "🌜")
        ? "🌞"
        : "🌜"

}