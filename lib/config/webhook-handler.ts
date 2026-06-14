import { processWebhook } from "corsair";
import { corsair } from "@/corsair";

export async function handleWebhook(req: Request) {
	const url = new URL(req.url);

    const result = await processWebhook(
        corsair,
        Object.fromEntries(req.headers),
        await req.json(),
        {
            tenantId: url.searchParams.get('tenantId')!
        }
    );

    if (result.plugin) {
        console.log(`Handled by ${result.plugin}.${result.action}`);
    }

    return result.response;
}