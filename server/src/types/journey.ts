export type JourneySchema = {
	firstTouchpoint: string;
	lastTouchpoint: string;
	restTouchpoints: Set<string>;
	sessionId: string;
	createdAt: string;
	touchpoint: Touchpoint;
};

export type Touchpoint = {
	campaign: string;
	medium: string;
	content?: string;
};

export type RawDataSchema = {
	utm_source: string;
	utm_campaign: string;
	utm_medium: string;
	utm_content?: string;
	sessionId: string;
	createdAt: string;
};
