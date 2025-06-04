import type { JourneySchema } from "../types/journey";
import { db } from "../drizzle/client";
import { journeys, touchpoints } from "../drizzle/schema";

export async function saveJourneys(journeysData: JourneySchema[]) {
	for (const journeyData of journeysData) {
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
			...Array.from(journeyData.restTouchpoints), //falar o porque dessa lógica
			journeyData.lastTouchpoint,
		];

		const { campaign, content, medium } = journeyData.touchpoint;

		for (const touchpointIndex in touchpointList) {
			await db.insert(touchpoints).values({
				sessionId: journey.sessionId,
				journeyId: journey.id,
				campaign,
				content,
				createdAt: journeyData.createdAt,
				medium,
				source: touchpointList[touchpointIndex],
				position: Number(touchpointIndex) + 1,
			});
		}
	}
}
