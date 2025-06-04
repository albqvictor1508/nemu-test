import { fastify } from "fastify";
import multipart from "@fastify/multipart";
import { resolve } from "node:path";
import xlsx from "xlsx";
import type { JourneySchema, RawDataSchema, Touchpoint } from "./types/journey";
import { db } from "./drizzle/client";
import { journeys, touchpoints } from "./drizzle/schema";
import { eq } from "drizzle-orm";

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
		if (!journeys) return;
		await saveJourneys(journeys);
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

		const firstTouchpoint = sortByCreatedAt[0];
		const lastTouchpoint = sortByCreatedAt[sortByCreatedAt.length - 1];

		const restTouchpoints = new Set<string>();
		for (let i = 1; i < sortByCreatedAt.length - 1; i++) {
			const item = sortByCreatedAt[i];
			if (
				item.utm_source === firstTouchpoint.utm_source ||
				item.utm_source === lastTouchpoint.utm_source
			)
				continue;
			restTouchpoints.add(sortByCreatedAt[i].utm_source);
		}

		jorneyAgrouped.push({
			firstTouchpoint: firstTouchpoint.utm_source,
			lastTouchpoint: lastTouchpoint.utm_source,
			restTouchpoints,
			sessionId,
			createdAt: firstTouchpoint.createdAt,
			touchpoint: {
				campaign: firstTouchpoint.utm_campaign,
				content: firstTouchpoint.utm_content,
				medium: firstTouchpoint.utm_medium,
			},
		});
	}

	return jorneyAgrouped;
}

//salvar elas no banco
export async function saveJourneys(journeysData: JourneySchema[]) {
	//redefinir a lógica de position
	await db.delete(journeys);
	await db.delete(touchpoints);
	for (let i = 0; i < journeysData.length; i++) {
		const journeyData = journeysData[i];
		const [journey] = await db
			.insert(journeys)
			.values({
				firstTouchpoint: journeyData.firstTouchpoint,
				lastTouchpoint: journeyData.lastTouchpoint,
				sessionId: journeyData.sessionId,
				createdAt: journeyData.createdAt,
			})
			.returning({ id: journeys.id, sessionId: journeys.sessionId });
		const touchpointList: string[] = [
			journeyData.firstTouchpoint,
			...journeyData.restTouchpoints,
			journeyData.lastTouchpoint,
		];

		const { campaign, content, medium } = journeyData.touchpoint;

		await db.insert(touchpoints).values({
			sessionId: journey.sessionId,
			journeyId: journey.id,
			campaign,
			content,
			createdAt: journeyData.createdAt,
			medium,
			source: touchpointList[i],
			position: i + 1,
		});
	}
}
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
		console.log("touchpoint group " + touchpointsGrouped.get(t.journeyId));
	}
	console.log(touchpointsGrouped);
	const response = journeysReply.map((j) => {
		return {
			id: j.id,
			sessionId: j.sessionId,
			firstTouchpoint: j.firstTouchpoint,
			lastTouchpoint: j.lastTouchpoint,
			touchpoints: "",
			createdAt: j.createdAt,
		};
	});

	reply.send(response);
});

app.listen({ port: 3333 }, () => {
	console.log("HTTP Server running!");
	console.log("POST /upload");
});
