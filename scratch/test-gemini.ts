import 'dotenv/config';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import ENV from '../lib/config/ENV';

const google = createGoogleGenerativeAI({
  apiKey: ENV.GEMINI_API_KEY,
});

async function main() {
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt: 'Hello! Who are you?',
  });
  console.log('Gemini response:', text);
}

main().catch(console.error);
