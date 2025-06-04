import { fastify } from "fastify";
import multipart from "@fastify/multipart";
import { resolve } from "node:path";
import xlsx from "xlsx";
import type { JourneySchema, RawDataSchema, Touchpoint } from "./types/journey";
import { db } from "./drizzle/client";
import { journeys, touchpoints } from "./drizzle/schema";
import { validateJourneys } from "./functions/validate-journeys";

export const app = fastify();
app.register(multipart);

export async function readExcelFile() {
	try {
		const filePath = resolve(__dirname, "file", "Nemu-Base-de-dados.xlsx");
		const file = xlsx.readFile(filePath);
		const sheet = file.Sheets[file.SheetNames[0]];
		const json = xlsx.utils.sheet_to_json(sheet);
		const parsedJson = JSON.parse(JSON.stringify(json));
		if (!journeys) return;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

//salvar elas no banco
//filtrar agrupando por sessão do usuário(sessionId)  e ordenando por criação(created_at)
app.get("/journeys", async (request, reply) => {
	const touchpointsGrouped = new Map<number, string[]>();
	const journeysReply = await db.select().from(journeys);

	const touchpointsByJourney = await db
		.select()
		.from(touchpoints)
		.orderBy(touchpoints.journeyId, touchpoints.position);

	for (const t of touchpointsByJourney) {
		const touchpointList: string[] = touchpointsGrouped.get(t.journeyId) || [];
		touchpointList.push(t.source);
		touchpointsGrouped.set(t.journeyId, touchpointList);
	}

	const response = journeysReply.map((j) => {
		return {
			id: j.id,
			sessionId: j.sessionId,
			firstTouchpoint: j.firstTouchpoint,
			lastTouchpoint: j.lastTouchpoint,
			touchpoints: touchpointsGrouped.get(j.id) ?? [],
			createdAt: j.createdAt,
		};
	});

	reply.send(response);
});

app.listen({ port: 3333 }, () => {
	console.log("HTTP Server running!");
	console.log("POST /upload");
});
