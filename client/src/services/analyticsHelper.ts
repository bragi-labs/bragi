export enum EventCategory {
	SCORE = 'score',
	NA = 'NA',
}

export class AnalyticsHelper {
	static sendEvent(category: EventCategory, action: string, label: string = '', value: number = 0) {
		// @ts-ignore
		gtag('event', action, {
			event_category: category,
			event_label: label,
			value,
		});
	}
}
