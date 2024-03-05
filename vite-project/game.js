import { OpenAI } from 'openai'
const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true})

async function generateQuestionAndAnswers(selectedTopic, past, isFirstPrompt) {

    const question = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system', // this is basically background info for HOW the AI should respond
                content: import.meta.env.VITE_SYSTEM_CONTENT
            },
            {
                role: 'user', // this is where the user's prompt goes
                content: isFirstPrompt
                    ? import.meta.env.VITE_QUESTION_PROMPT_ONE
                        + selectedTopic
                    : import.meta.env.VITE_QUESTION_PROMPT_ONE
                        + selectedTopic
                        + import.meta.env.VITE_QUESTION_PROMPT_FOUR
                        + pastPrompts
            }
        ]
    })
    const questionContent = question.choices[0].message.content

    const answers = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: import.meta.env.VITE_SYSTEM_CONTENT
            },
            {
                role: 'user',
                content: import.meta.env.VITE_QUESTION_PROMPT_TWO
                    + questionContent
                    + import.meta.env.VITE_QUESTION_PROMPT_THREE
            }
        ]
    })
    const answerContent = answers.choices[0].message.content

    console.log(questionContent + answerContent)
    return questionContent + answerContent

}

const urlParams = new URLSearchParams(window.location.search);
const selectedTopic = urlParams.get('topic');
const numberofQuestions = parseInt(urlParams.get('num'))
console.log(numberofQuestions)

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
let previousPrompts = []

const firstPrompt = (await generateQuestionAndAnswers(selectedTopic, null, true)).split('@@')
let questions = [
    {
        question: firstPrompt[0],
        choice1: firstPrompt[1],
        choice2: firstPrompt[2],
        choice3: firstPrompt[3],
        choice4: firstPrompt[4],
        answer:parseInt(firstPrompt[5])
    },
]

for (let questionNum = 0; questionNum < numberofQuestions - 1; questionNum++) {
    let pastPrompts = ''
    for (let i = 0; i < questions.length; i++) {
        pastPrompts += (JSON.stringify(i + 1) + '. ' + questions[i][0] + ', ')
    }
    const newPrompt = (await generateQuestionAndAnswers(selectedTopic, pastPrompts, false)).split('@@')
    questions.push({
        question: newPrompt[0],
        choice1: newPrompt[1],
        choice2: newPrompt[2],
        choice3: newPrompt[3],
        choice4: newPrompt[4],
        answer:parseInt(newPrompt[5])
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