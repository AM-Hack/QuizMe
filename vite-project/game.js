import { OpenAI } from 'openai';

const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

async function generateQuestionAndAnswers(prompt) {

    const question = await openai.chat.completions.create({
        model: 'gpt-4-0125-preview',
        messages: [
            {
                role: 'system', // this is basically background info for HOW the AI should respond
                content: import.meta.env.VITE_SYSTEM_CONTENT
            },
            {
                role: 'user', // this is where the user's prompt goes
                content: import.meta.env.VITE_QUESTION_PROMPT_ONE + prompt + import.meta.env.VITE_QUESTION_PROMPT_TWO
            },
        ],
    });

    return question.choices[0].message.content;

};

const questionAndAnswers = (await generateQuestionAndAnswers('biology')).split('@@@');

for (let i = 0; i < questionAndAnswers.length; i++) {
    console.log(questionAndAnswers[i]);
}







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
let questions = [
    {
        question: questionAndAnswers[0].trim('?') + '?',
        choice1: questionAndAnswers[1],
        choice2: questionAndAnswers[2],
        choice3: questionAndAnswers[3],
        choice4: questionAndAnswers[4],
        answer: parseInt(questionAndAnswers[5]),
    },

    {
        question: 'What is 1+1?',
        choice1: '2',
        choice2: '4',
        choice3: '21',
        choice4: '17',
        answer: 1,
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

        return window.location.assign('/quiz/end.html')
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

