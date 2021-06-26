import { MeasureModel, VoiceModel, VoiceType, NoteModel, EntityKind } from './scoreModel';
import { Voice } from './voice';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';

export class Measure implements MeasureModel {
	kind: EntityKind = EntityKind.MEASURE;

	constructor(
		public id: string,
		public scoreId: string,
		public partId: string,
		public number: number,
		public isPickup: boolean,
		public timeSignature: string,
		public durationDivs: number,
		public tempoBpm: number,
		public musicalScale: string,
		public voices: Voice[],
	) {}

	static createFromModel(m: MeasureModel) {
		const voices: Voice[] = [];
		m.voices.forEach((v) => {
			const voice = Voice.createFromModel(v);
			voices.push(voice);
		});
		return new Measure(m.id, m.scoreId, m.partId, m.number, m.isPickup, m.timeSignature, m.durationDivs, m.tempoBpm, m.musicalScale, voices);
	}

	static createFromNewDialog(scoreId: string, partId: string, isPickupMeasure: boolean, measureNumber: number, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const durationDivs = MusicalHelper.parseTimeSignature(newScoreData.timeSignature).measureDurationDivs;
		const voice = Voice.createFromNewDialog(scoreId, partId, id, 'Melody', VoiceType.FN_LVL_1, newScoreData);
		return new Measure(id, scoreId, partId, measureNumber, isPickupMeasure, newScoreData.timeSignature, durationDivs, newScoreData.tempoBpm, newScoreData.musicalScale, [
			voice,
		]);
	}

	static findVoice(m: MeasureModel, voiceId: string): VoiceModel | null {
		return m.voices.find((v) => (v.id = voiceId)) || null;
	}

	static findNote(m: MeasureModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		m.voices.forEach((v) => {
			if (!result) {
				result = Voice.findNote(v, noteId);
			}
		});
		return result;
	}

	static canChangeNoteDuration(m: MeasureModel, voiceId: string, noteId: string, newDurationDivs: number): boolean {
		const v = Measure.findVoice(m, voiceId);
		if (!v) {
			return false;
		}
		return Voice.canChangeNoteDuration(v, noteId, newDurationDivs, m.durationDivs);
	}
}
