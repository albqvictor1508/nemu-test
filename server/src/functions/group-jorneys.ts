import type { RawDataSchema } from "../types/journey";

export async function groupJourneys(
	rawData: RawDataSchema[],
): Promise<Map<string, RawDataSchema[]>> {
	const rawDataFormatted = new Map<string, RawDataSchema[]>();
	for (const data of rawData) {
		if (!rawDataFormatted.has(data.sessionId)) {
			rawDataFormatted.set(data.sessionId, []);
		}
		rawDataFormatted.get(data.sessionId)?.push(data);
	}
	return rawDataFormatted;
}
