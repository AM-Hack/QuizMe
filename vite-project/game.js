import { OpenAI } from 'openai'
const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true})

async function generateQuestionAndAnswers(selectedTopic, pastGeneratedResponse, isFirstGeneratedResponse) {

    const generatedQuestion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system', // this is basically background info for HOW the AI should respond
                content: import.meta.env.VITE_AI_SYSTEM_CONTENT
            },
            {
                role: 'user', // this is where the user's prompt goes
                content: isFirstGeneratedResponse
                    ? import.meta.env.VITE_AI_USER_CONTENT_ONE
                        + selectedTopic
                    : import.meta.env.VITE_AI_USER_CONTENT_ONE
                        + selectedTopic
                        + import.meta.env.VITE_AI_USER_CONTENT_TWO
                        + pastGeneratedResponse
            }
        ]
    })
    const generatedQuestionContent = generatedQuestion.choices[0].message.content

    const generatedAnswers = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: import.meta.env.VITE_AI_SYSTEM_CONTENT
            },
            {
                role: 'user',
                content: import.meta.env.VITE_AI_USER_CONTENT_THREE
                    + generatedQuestionContent
                    + import.meta.env.VITE_AI_USER_CONTENT_FOUR
            }
        ]
    })
    const generatedAnswersContent = generatedAnswers.choices[0].message.content

    return generatedQuestionContent + generatedAnswersContent

}

const urlParams = new URLSearchParams(window.location.search);
const selectedTopic = urlParams.get('topic');
const numberofQuestions = parseInt(urlParams.get('num'))
const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []

const firstGeneratedResponse = (await generateQuestionAndAnswers(selectedTopic, null, true)).split('@@')

let questions = [
    {
        question: firstGeneratedResponse[0],
        choice1: firstGeneratedResponse[1],
        choice2: firstGeneratedResponse[2],
        choice3: firstGeneratedResponse[3],
        choice4: firstGeneratedResponse[4],
        answer:parseInt(firstGeneratedResponse[5])
    },
]

for (let questionNum = 0; questionNum < numberofQuestions - 1; questionNum++) {
    let pastGeneratedResponses = ''
    for (let index = 0; index < questions.length; index++) {
        pastGeneratedResponses += (JSON.stringify(index + 1) + '. ' + questions[index][0] + ', ')
    }
    const newGeneratedResponse = (await generateQuestionAndAnswers(selectedTopic, pastGeneratedResponses, false)).split('@@')
    questions.push({
        question: newGeneratedResponse[0],
        choice1: newGeneratedResponse[1],
        choice2: newGeneratedResponse[2],
        choice3: newGeneratedResponse[3],
        choice4: newGeneratedResponse[4],
        answer:parseInt(newGeneratedResponse[5])
    })
}

const SCORE_POINTS = 100;
const MAX_QUESTIONS = questions.length;

let startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
}

let getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)

        return window.location.assign('/src/html/end.html')
    }

    questionCounter++
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionsIndex]
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}


choices.forEach(choice => {
    choice.addEventListener('click', e=>{
        if (!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct'){
            incrementScore(SCORE_POINTS)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 1000)
    })
})

let incrementScore = num => {
    score += num
    scoreText.innerText = score
}

startGame()


var icon = document.getElementById("icon");
icon.onclick = function(){
    console.log("clicked")
    document.body.classList.toggle("dark-theme") /* change all color things here. find the dark theme part in style.css*/
    if (document.body.classList.contains("dark-theme")){
        icon.src = "/src/images/light-mode.png"
    }
    else {
        document.body.classList.toggle("dark-theme")
        document.body.classList.toggle("light-theme")
        icon.src = "/src/images/night-mode.png"
        
    }
}