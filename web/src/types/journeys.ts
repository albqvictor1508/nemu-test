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
