import { fastify } from "fastify";
import multipart from "@fastify/multipart";
import { resolve } from "node:path";
import xlsx from "xlsx";
import { db } from "./drizzle/client";
import { journeys, touchpoints } from "./drizzle/schema";
import { validateJourneys } from "./functions/validate-journeys";
import { groupJourneys } from "./functions/group-jorneys";
import { saveJourneys } from "./functions/save-journeys";
import fastifyCors from "@fastify/cors";
import type { JourneySchema } from "./types/journey";

export const app = fastify();
app.register(fastifyCors);
app.register(multipart);
let x = 0;

async function readExcelFile() {
	try {
		const filePath = resolve(__dirname, "file", "Nemu-Base-de-dados.xlsx");
		const file = xlsx.readFile(filePath);
		const sheet = file.Sheets[file.SheetNames[0]];
		const json = xlsx.utils.sheet_to_json(sheet);
		const parsedJson = JSON.parse(JSON.stringify(json));
		return parsedJson;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function init(): Promise<JourneySchema[]> {
	const parsedData = await readExcelFile();
	const rawDataFormatted = await groupJourneys(parsedData);
	const jorneyValidatedData = await validateJourneys(rawDataFormatted);
	return jorneyValidatedData;
}
do {
	init().then((j) => saveJourneys(j).then());
	x++;
} while (x < 1);

app.get("/journeys", async (_, reply) => {
	const touchpointsGrouped = new Map<number, string[]>();
	const journeysReply = await db
		.select()
		.from(journeys)
		.orderBy(journeys.createdAt);

	const touchpointsByJourney = await db
		.select()
		.from(touchpoints)
		.orderBy(touchpoints.journeyId, touchpoints.position);

	for (const t of touchpointsByJourney) {
		const touchpointList: string[] = touchpointsGrouped.get(t.journeyId) || [];
		touchpointList.push(t.source);
		touchpointsGrouped.set(t.journeyId, touchpointList);
	}

	const touchpointResponse = Array.from(touchpointsByJourney).map(
		(touchpoint) => {
			return {
				journeyId: touchpoint.journeyId,
				content: touchpoint.content,
				medium: touchpoint.medium,
				campaign: touchpoint.campaign,
			};
		},
	);

	const response = journeysReply.map((journey) => {
		const touchpoints = touchpointsGrouped.get(journey.id) ?? [];
		return {
			id: journey.id,
			sessionId: journey.sessionId,
			firstTouchpoint: journey.firstTouchpoint,
			lastTouchpoint: journey.lastTouchpoint,
			touchpoints,
			touchpointQuantity: touchpoints.length,
			createdAt: journey.createdAt,
		};
	});

	reply.send({ journeys: response, touchpoints: touchpointResponse });
});

app.listen({ port: 3333 }, () => {
	console.log("HTTP Server running!");
});
