import { OpenAI } from 'openai'
const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true})

async function generateQuestionAndAnswers(prompt, pastPrompts, isFirstPrompt) {

    const question = await openai.chat.completions.create({
        model: 'gpt-4-0125-preview',
        messages: [
            {
                role: 'system', // this is basically background info for HOW the AI should respond
                content: import.meta.env.VITE_SYSTEM_CONTENT
            },
            {
                role: 'user', // this is where the user's prompt goes
                content: isFirstPrompt
                    ? import.meta.env.VITE_QUESTION_PROMPT_ONE
                        + prompt
                        + import.meta.env.VITE_QUESTION_PROMPT_TWO
                    : import.meta.env.VITE_QUESTION_PROMPT_ONE
                        + prompt
                        + import.meta.env.VITE_QUESTION_PROMPT_TWO
                        + import.meta.env.VITE_QUESTION_PROMPT_THREE 
                        + pastPrompts
            },
        ],
    })

    return question.choices[0].message.content

}

const urlParams = new URLSearchParams(window.location.search);
const selectedTopic = urlParams.get('topic');

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
//const questionAndAnswers = (await generateQuestionAndAnswers(selectedTopic)).split('@@@');

let prompts = [
    (await generateQuestionAndAnswers(selectedTopic, null, true)).split('@@@'),
]

for (let i = 0; i < 2; i++) { // loops with # of questions as i
    let pastPrompts = ''
    for (let j = 0; j < prompts.length; j++) {
        pastPrompts += (JSON.stringify(j + 1) + '. ' + prompts[j][0] + ', ')
    }
    prompts.push((await generateQuestionAndAnswers(selectedTopic, pastPrompts, false)).split('@@@'))
}

let questions = [
    {
        question: prompts[0][0].trim('?') + '?',
        choice1: prompts[0][1],
        choice2: prompts[0][2],
        choice3: prompts[0][3],
        choice4: prompts[0][4],
        answer: parseInt(prompts[0][5]),
    },

    {
        a: 'a',
        question: prompts[1][0].trim('?') + '?',
        choice1: prompts[1][1],
        choice2: prompts[1][2],
        choice3: prompts[1][3],
        choice4: prompts[1][4],
        answer: parseInt(prompts[1][5]),
    }
]


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

