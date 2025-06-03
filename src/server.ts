import { fastify } from "fastify";
import multipart from "@fastify/multipart";
import { resolve } from "node:path";
import xlsx from "xlsx";
import type { JourneySchema, RawDataSchema } from "./types/journey";

export const app = fastify();
app.register(multipart);

export async function main() {
	try {
		const filePath = resolve(__dirname, "file", "Nemu-Base-de-dados.xlsx");
		const file = xlsx.readFile(filePath);
		const sheet = file.Sheets[file.SheetNames[0]];
		const json = xlsx.utils.sheet_to_json(sheet);
		const parsedJson = JSON.parse(JSON.stringify(json));
		const journeys = await validateJourneys(parsedJson);
		console.log(`JOURNEYS: ${journeys}`);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function validateJourneys(rawData: RawDataSchema[]) {
	const rawDataFormatted = new Map<string, RawDataSchema[]>();
	const jorneyAgrouped: JourneySchema[] = [];
	for (let i = 0; i < rawData.length; i++) {
		const item = rawData[i];
		if (!rawDataFormatted.has(item.sessionId)) {
			rawDataFormatted.set(item.sessionId, []);
		}

		rawDataFormatted.get(item.sessionId)?.push(item);
	}

	for (const [sessionId, item] of rawDataFormatted) {
		const sortByCreatedAt = item.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		);
		const firstTouchpoint = sortByCreatedAt.shift()?.utm_source;
		const lastTouchpoint = sortByCreatedAt.pop()?.utm_source;

		const restTouchpoints = new Set<string>(
			sortByCreatedAt
				.slice(-1, 1)
				.filter(
					(item) =>
						item.utm_source !== firstTouchpoint ||
						item.utm_source !== lastTouchpoint,
				)
				//garantir o funcionamento, persistir os dados, consultá-los pra retornar via GET
				.map((item) => item.utm_source),
		);
		const createdAt = item.map((i) => i.createdAt).shift();
		if (!createdAt) return;
		jorneyAgrouped.push({
			firstTouchpoint: firstTouchpoint as string,
			lastTouchpoint: lastTouchpoint as string,
			restTouchpoints,
			sessionId,
			createdAt,
		});
	}
	return jorneyAgrouped;
}

//salvar elas no banco
export async function saveJourneys(journeys: JourneySchema[]) {}
//filtrar agrupando por sessão do usuário(sessionId)  e ordenando por criação(created_at)

app.get("/journeys", async (request, reply) => {});

app.listen({ port: 3333 }, () => {
	console.log("HTTP Server running!");
	console.log("POST /upload");
});
