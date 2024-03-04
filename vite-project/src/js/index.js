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
