const playButton = document.querySelector('#playButton')
const topic = document.querySelector('#topic')
function SaveAndChange() {
    const topicValue = topic.value
    location.replace(`/game.html?topic=${topicValue}`)
}

topic.addEventListener('keyup', () => {
    playButton.disabled = !topic.value
})

