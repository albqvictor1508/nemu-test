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
		const journeys = (await validateJourneys(parsedJson)) || null;
		if (!journeys) {
			return;
		}
		console.log(journeys);
	} catch (error) {
		console.error(error);
		throw error;
	}
}
main().then();

export async function validateJourneys(
	rawData: RawDataSchema[],
): Promise<JourneySchema[] | null> {
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
		const sortByCreatedAt: RawDataSchema[] = item.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		);

		const firstTouchpoint = sortByCreatedAt[0].utm_source;
		const lastTouchpoint =
			sortByCreatedAt[sortByCreatedAt.length - 1].utm_source;

		if (
			typeof firstTouchpoint !== "string" ||
			typeof lastTouchpoint !== "string"
		) {
			return null;
		}

		const restTouchpoints = new Set<string>();

		for (const i of item) {
			jorneyAgrouped.push({
				firstTouchpoint,
				lastTouchpoint,
				restTouchpoints,
				sessionId,
				createdAt: i.createdAt,
			});
		}

		//todo: analisar esse for, acredito que ele seja o causador do problema
		for (let i = 1; i < sortByCreatedAt.length - 2; i++) {
			const item = sortByCreatedAt[i];
			if (
				item.utm_source === firstTouchpoint ||
				item.utm_source === lastTouchpoint
			)
				continue;
			restTouchpoints.add(sortByCreatedAt[i].utm_source);
		}
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
