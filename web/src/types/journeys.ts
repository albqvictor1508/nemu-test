export type Journey = {
	id: number;
	sessionId: string;
	firstTouchpoint: string;
	lastTouchpoint: string;
	touchpoints: string[];
	touchpointQuantity: number;
	createdAt: string;
};

export type Touchpoint = {
	journeyId: number;
	content: string;
	medium: string;
	campaign: string;
};

export type TouchpointSchema = {
	touchpoints: string[],
	firstTouchpoint: string,
	lastTouchpoint: string
}

export type JourneyResponse = {
	journeys: Journey[];
	touchpoints: Touchpoint[];
};
