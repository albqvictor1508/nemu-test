export type JourneySchema = {
	firstTouchpoint: string;
	lastTouchpoint: string;
	sessionId: string;
	createdAt: string;
	restTouchpoints: Set<string>;
};

export type RawDataSchema = {
	utm_source: string;
	utm_campaign: string;
	utm_medium: string;
	utm_content: string;
	sessionId: string;
	createdAt: string;
};
