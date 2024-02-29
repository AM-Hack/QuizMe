require('dotenv').config();

const OpenAI = require('openai').OpenAI;
const openai = new OpenAI(); // no arguments are needed because this automatically accesses .env

async function main() {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system', // this is basically background info for HOW the AI should respond
                content: 'You are a cool chatbot named Aadi that always uses emojis'
            },
            {
                role: 'user', // this is where the user's prompt goes
                content: 'Tell me a joke about monkeys'
            },
        ],
    });

    console.log(response.choices[0].message.content);

};

main();