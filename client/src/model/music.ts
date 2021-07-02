import { MusicModel, MeasureModel, VoiceModel, NoteModel, EntityKind } from './scoreModel';
import { Measure } from './measure';
import { NewScoreData } from '../services/newScoreData';

export class Music implements MusicModel {
	kind: EntityKind = EntityKind.MUSIC;

	constructor(public measures: Measure[]) {}

	static createFromModel(u: MusicModel) {
		const measures: Measure[] = [];
		u.measures.forEach((m) => {
			const measure = Measure.createFromModel(m);
			measures.push(measure);
		});
		return new Music(measures);
	}

	static createFromNewDialog(scoreId: string, newScoreData: NewScoreData) {
		const measures: Measure[] = [];
		if (newScoreData.pickupMeasure !== 'no') {
			const pickupMeasure = Measure.createFromNewDialog(true, 0, newScoreData);
			measures.push(pickupMeasure);
		}
		for (let i = 1; i <= newScoreData.numberOfMeasures; i++) {
			const measure = Measure.createFromNewDialog(false, i, newScoreData);
			measures.push(measure);
		}
		return new Music(measures);
	}

	static findMeasure(u: MusicModel, measureId: string): MeasureModel | null {
		return u.measures.find((m) => m.id === measureId) || null;
	}

	static findVoice(u: MusicModel, voiceId: string): VoiceModel | null {
		let result: VoiceModel | null = null;
		u.measures.forEach((m) => {
			if (!result) {
				result = Measure.findVoice(m, voiceId);
			}
		});
		return result;
	}

	static findNote(u: MusicModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		u.measures.forEach((m) => {
			if (!result) {
				result = Measure.findNote(m, noteId);
			}
		});
		return result;
	}
}
