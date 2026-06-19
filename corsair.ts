import 'dotenv/config';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { Pool } from 'pg';
import ENV from './lib/config/ENV';
import { z } from 'zod';

const originalUrl = process.env.DATABASE_URL;
let sslConfig: any = undefined;

if (originalUrl) {
	try {
		const parsed = new URL(originalUrl);
		if (parsed.hostname.includes("neon.tech")) {
			sslConfig = {
				servername: parsed.hostname,
				rejectUnauthorized: true,
			};
		}
	} catch (e) {}
}

const pool = new Pool({
	connectionString: ENV.DATABASE_URL,
	ssl: sslConfig,
});

function getModifiedCalendarPlugin(): ReturnType<typeof googlecalendar> {
	const plugin = googlecalendar() as any;

	if (plugin && plugin.schema && plugin.schema.entities) {
		// 1. Update DB entity schema
		const originalEventSchema = plugin.schema.entities.events as z.ZodObject<any>;
		const extendedEventSchema = originalEventSchema.extend({
			eventType: z.string().optional()
		});
		plugin.schema.entities.events = extendedEventSchema;
	}

	// 2. Update endpoint output/input schemas if present
	if (plugin.endpointSchemas) {
		const newEventTypeSchema = z.string().optional();

		// Helper to update eventType inside a schema that has it in its shape
		const updateEventInSchema = (schema: any) => {
			if (schema && schema.shape && schema.shape.eventType) {
				return schema.extend({ eventType: newEventTypeSchema });
			}
			return schema;
		};

		// Update events.create input and output
		if (plugin.endpointSchemas['events.create']) {
			const ep = plugin.endpointSchemas['events.create'];
			if (ep.input && ep.input.shape && ep.input.shape.event) {
				ep.input = ep.input.extend({
					event: ep.input.shape.event.extend({ eventType: newEventTypeSchema })
				});
			}
			ep.output = updateEventInSchema(ep.output);
		}

		// Update events.get output
		if (plugin.endpointSchemas['events.get']) {
			plugin.endpointSchemas['events.get'].output = updateEventInSchema(plugin.endpointSchemas['events.get'].output);
		}

		// Update events.getMany output (which contains items array of events)
		if (plugin.endpointSchemas['events.getMany']) {
			const ep = plugin.endpointSchemas['events.getMany'];
			if (ep.output && ep.output.shape && ep.output.shape.items) {
				const itemsSchema = ep.output.shape.items;
				const innerArray = itemsSchema._def.innerType || itemsSchema;
				if (innerArray && innerArray.element) {
					const updatedElement = innerArray.element.extend({ eventType: newEventTypeSchema });
					ep.output = ep.output.extend({
						items: z.array(updatedElement).optional()
					});
				}
			}
		}

		// Update events.update input and output
		if (plugin.endpointSchemas['events.update']) {
			const ep = plugin.endpointSchemas['events.update'];
			if (ep.input && ep.input.shape && ep.input.shape.event) {
				ep.input = ep.input.extend({
					event: ep.input.shape.event.extend({ eventType: newEventTypeSchema })
				});
			}
			ep.output = updateEventInSchema(ep.output);
		}
	}

	return plugin as ReturnType<typeof googlecalendar>;
}

export const corsair = createCorsair({
	multiTenancy: true,
	plugins: [gmail(), getModifiedCalendarPlugin()],
	database: pool,
	kek: ENV.CORSAIR_KEK,
});