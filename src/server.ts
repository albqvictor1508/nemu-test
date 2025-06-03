import { fastify } from "fastify";
import multipart from "@fastify/multipart";
import { resolve } from "node:path";
import xlsx from "xlsx";
import type { JourneySchema, RawDataSchema } from "./types/journey";

export const app = fastify();
app.register(multipart);

try {
	const filePath = resolve(__dirname, "file", "Nemu-Base-de-dados.xlsx");
	const file = xlsx.readFile(filePath);
	const sheet = file.Sheets[file.SheetNames[0]];
	const json = xlsx.utils.sheet_to_json(sheet);
	const parsedJson = JSON.parse(JSON.stringify(json));
	validateJourneys(parsedJson).then();
} catch (error) {
	console.error(error);
	throw error;
}

// validar as jornadas
export async function validateJourneys(rawData: RawDataSchema[]) {
	const rawDataFormatted = new Map<string, RawDataSchema[]>();
	const jorneyAgrouped = new Map<string, JourneySchema[]>();
	for (let i = 0; i < rawData.length; i++) {
		const item = rawData[i];
		if (!rawDataFormatted.has(item.sessionId)) {
			rawDataFormatted.set(item.sessionId, []);
		}

		if (!rawDataFormatted.get(item.sessionId)) continue;
		rawDataFormatted.get(item.sessionId)?.push(item);
	}

	const restTouchpoints: string[] = [];
	for (const itemList of rawDataFormatted.values()) {
		const firstTouchpoint = itemList[0].utm_source;
		const lastTouchpoint = itemList[itemList.length - 1].utm_source;
		jorneyAgrouped.set(itemList[0].sessionId, []);

		for (const item of itemList) {
			if (item === itemList[0] || item === itemList[itemList.length - 1])
				return;
			//também vou percorrer pelo primeiro e o último, então vai ter chave repetida e vai dar erro
			jorneyAgrouped.get(itemList[0].sessionId)?.push({
				firstTouchpoint,
				lastTouchpoint,
				restTouchpoints,
				createdAt: itemList[0].createdAt,
				sessionId: itemList[0].sessionId,
			});
		}
		//validação
	}
}
//salvar elas no banco
//filtrar agrupando por sessão do usuário(sessionId)  e ordenando por criação(created_at)

app.get("/journeys", async (request, reply) => {});

app.listen({ port: 3333 }, () => {
	console.log("HTTP Server running!");
	console.log("POST /upload");
});
