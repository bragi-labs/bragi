import { EntityKind, ScoreSettingsModel } from './scoreModel';

export class ScoreSettings implements ScoreSettingsModel {
	kind: EntityKind = EntityKind.SCORE_SETTINGS;

	constructor(public musicWidth: number, public rowGap: number, public quarterSize: number, public lyricsSize: number) {}

	static ranges = {
		musicWidth: { min: 400, max: 718, default: 718 },
		rowGap: { min: 16, max: 80, default: 36 },
		quarterSize: { min: 20, max: 44, default: 36 },
		lyricsSize: { min: 8, max: 16, default: 11 },
	};

	static createFromModel(ss: ScoreSettingsModel) {
		return new ScoreSettings(
			ss.musicWidth || ScoreSettings.ranges.musicWidth.default,
			ss.rowGap || ScoreSettings.ranges.rowGap.default,
			ss.quarterSize || ScoreSettings.ranges.quarterSize.default,
			ss.lyricsSize || ScoreSettings.ranges.lyricsSize.default,
		);
	}

	static createFromNewDialog() {
		return new ScoreSettings(
			ScoreSettings.ranges.musicWidth.default,
			ScoreSettings.ranges.rowGap.default,
			ScoreSettings.ranges.quarterSize.default,
			ScoreSettings.ranges.lyricsSize.default,
		);
	}
}
