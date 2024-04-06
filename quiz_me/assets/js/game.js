const currentColorMode = JSON.stringify(
    localStorage.getItem("colorMode")
).substring(1, 2);
var icon = document.getElementById("icon");

if (currentColorMode == "d") {
    icon.innerText = "☀️";
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
} else {
    icon.innerText = "🌙";
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
}

icon.onclick = function () {
    if (icon.innerText == "🌙") {
        icon.innerText = "☀️";
        localStorage.setItem("colorMode", "d");
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    } else {
        icon.innerText = "🌙";
        localStorage.setItem("colorMode", "l");
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
    }
};

import { OpenAI } from "openai";
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

async function generateQuestionAndAnswers(selectedTopic, pastGeneratedResponse, isFirstGeneratedResponse) {
    const generatedQuestion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
        {
            role: "system", // this is basically background info for HOW the AI should respond
            content:
            "You are a chatbot made for quizzing students on topics they ask you for. You respond in only one line",
        },
        {
            role: "user", // this is where the user's prompt goes
            content: isFirstGeneratedResponse
            ? "Ask me very long quiz question (do not include any unnecessary words in response) about " +
                selectedTopic
            : "Ask me very long quiz question (do not include any unnecessary words in response) about " +
                selectedTopic +
                ". Please do not generate any questions that are in this list: " +
                pastGeneratedResponse,
        }]
    });
    const generatedQuestionContent = generatedQuestion.choices[0].message.content;

    const generatedAnswers = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
        {
            role: "system",
            content:
            "You are a chatbot made for quizzing students on topics they ask you for. You respond in only one line",
        },
        {
            role: "user",
            content:
            "Generate four multiple choice answers for this question: " +
            generatedQuestionContent +
            "Respond in this form: @@[answer_1]@@[answer2]@@[answer_3]@@[answer_4]@@[correct_answer_number]. Make sure only one answer is correct. Do NOT add any punctuation or extra characters or numbers to the responses",
        }]
  });
  const generatedAnswersContent = generatedAnswers.choices[0].message.content;

  return generatedQuestionContent + generatedAnswersContent;
}

const urlParams = new URLSearchParams(window.location.search);
const selectedTopic = urlParams.get("topic");
const numberofQuestions = parseInt(urlParams.get("num"));
const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text"));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

const firstGeneratedResponse = (
    await generateQuestionAndAnswers(selectedTopic, null, true)
).split("@@");

let questions = [
    {
        question: firstGeneratedResponse[0],
        choice1: firstGeneratedResponse[1],
        choice2: firstGeneratedResponse[2],
        choice3: firstGeneratedResponse[3],
        choice4: firstGeneratedResponse[4],
        answer: parseInt(firstGeneratedResponse[5]),
    },
];

for (let questionNum = 0; questionNum < numberofQuestions - 1; questionNum++) {
    let pastGeneratedResponses = "";
    for (let index = 0; index < questions.length; index++) {
        pastGeneratedResponses +=
        JSON.stringify(index + 1) + ". " + questions[index][0] + ", ";
    }
    const newGeneratedResponse = (
        await generateQuestionAndAnswers(
        selectedTopic,
        pastGeneratedResponses,
        false
        )
    ).split("@@");
    questions.push({
        question: newGeneratedResponse[0],
        choice1: newGeneratedResponse[1],
        choice2: newGeneratedResponse[2],
        choice3: newGeneratedResponse[3],
        choice4: newGeneratedResponse[4],
        answer: parseInt(newGeneratedResponse[5]),
    });
}

const SCORE_POINTS = 100;
const MAX_QUESTIONS = questions.length;

let startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

let getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        const MAX_SCORE = MAX_QUESTIONS * 100;
        let scorePercentage = Math.round((score / MAX_SCORE) * 100);
        localStorage.setItem("mostRecentScore", scorePercentage);

        return window.location.assign("end.html");
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionsIndex, 1);

    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        let classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(SCORE_POINTS);
            var correctSound = new Audio('/assets/audio/correct.mp3');
            correctSound.play();
        } else {
            var incorrectSound = new Audio('/assets/audio/incorrect.mp3');
            incorrectSound.play();
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

let incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

startGame();
