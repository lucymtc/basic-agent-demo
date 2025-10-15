import 'dotenv/config';
import { runLLM } from './src/llm';
import { addMessages, getMessages } from './src/memory';

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

// Save the new user message to the messages db file.
await addMessages([{ role: 'user', content: userMessage }]);

// Get all messages and send them to the LLM.
const messages = await getMessages();
const response = await runLLM({ messages });

// Save the response from LLM.
await addMessages([{ role: 'assistant', content: response }]);

console.log(response);
