const playButton = document.querySelector('#playButton')
const topic = document.querySelector('#topic')
const num = document.querySelector('#qnum')

function SaveAndChange() {
    const topicValue = topic.value
    const numQ = num.value
    location.replace(`/game.html?topic=${topicValue}&num=${numQ}`)
}

topic.addEventListener('keyup', () => {
    playButton.disabled = !topic.value
})

var icon = document.getElementById("icon");
icon.onclick = function(){
    console.log("clicked")
    document.body.classList.toggle("dark-theme"); /* change all color things here. find the dark theme part in style.css*/
    if (document.body.classList.contains("dark-theme")){
        icon.src = "/src/images/light-mode.png"
    }
    else {
        icon.src = "/src/images/night-mode.png"
    }

}