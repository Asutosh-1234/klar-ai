import { processWebhook } from "corsair";
import { corsair } from "@/corsair";

export async function handleWebhook(req: Request) {
	const url = new URL(req.url);

	let body: any = {};
	try {
		const text = await req.text();
		if (text) {
			body = JSON.parse(text);
		}
	} catch (err) {
		// Suppress JSON parse error for empty body/ping requests
	}

	const result = await processWebhook(
		corsair,
		Object.fromEntries(req.headers),
		body,
		{
			tenantId: url.searchParams.get('tenantId')!
		}
	);

	if (result.plugin) {
		console.log(`Handled by ${result.plugin}.${result.action}`);
	}

	return result.response;
}