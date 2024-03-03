import { topicInput } from './getTopic';
import { OpenAI } from 'openai';

const openai = new OpenAI({apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

async function generateQuestionAndAnswers(prompt) {

    const question = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system', // this is basically background info for HOW the AI should respond
                content: 'You are a chatbot made for quizzing students on topics they ask you for that does not add anything else to the response and responds in one line.'
            },
            {
                role: 'user', // this is where the user's prompt goes
                content: 'Ask me a quiz question about' + prompt,
            },
        ],
    });
    const questionContent = question.choices[0].message.content;

    const answers = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a chatbot made for quizzing students on topics they ask you for that does not add anything else to the response and responds in one line.'
            },
            {
                role: 'user',
                content: 'Generate four possible answers to the question: '
                    + questionContent
                    + '. Only one answer should be right. Separate each answer with "@@@".'
            },
        ],
    });
    const answersContent = answers.choices[0].message.content;

    return [questionContent, answersContent];

};

const questionAndAnswers = await generateQuestionAndAnswers(topicInput);
const generatedQuestion = questionAndAnswers[0];
const generatedAnswers = questionAndAnswers[1].split('@@@');

for (let i = 0; i < generatedAnswers.length; i++) {
    console.log(generatedAnswers[i]);
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
        question: generatedQuestion,
        choice1: generatedAnswers[0],
        choice2: generatedAnswers[1],
        choice3: generatedAnswers[2],
        choice4: generatedAnswers[3],
        answer: 2,
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

