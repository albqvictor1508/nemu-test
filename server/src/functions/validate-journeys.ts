import type { JourneySchema, RawDataSchema } from "../types/journey";

export async function validateJourneys(
	rawDataFormatted: Map<string, RawDataSchema[]>,
): Promise<JourneySchema[] | null> {
	const jorneyValidatedData: JourneySchema[] = [];
	for (const [sessionId, item] of rawDataFormatted) {
		item.map((i) => {
			i.createdAt = new Date(i.createdAt).toISOString();
		});
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

		jorneyValidatedData.push({
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

	return jorneyValidatedData;
}
