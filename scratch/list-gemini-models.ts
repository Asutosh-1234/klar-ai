import 'dotenv/config';
import ENV from '../lib/config/ENV';

async function main() {
  const apiKey = ENV.GEMINI_API_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  if (data.models) {
    const geminiModels = data.models.filter((m: any) => m.name.includes('gemini'));
    console.log('Gemini Models found:', geminiModels.map((m: any) => m.name));
  } else {
    console.log('No models key found, error:', data);
  }
}

main().catch(console.error);
