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

	static createFromModel(mm: MeasureModel) {
		const voices: Voice[] = [];
		mm.voices.forEach((vm) => {
			const voice = Voice.createFromModel(vm);
			voices.push(voice);
		});
		return new Measure(mm.id, mm.scoreId, mm.partId, mm.number, mm.isPickup, mm.timeSignature, mm.durationDivs, mm.tempoBpm, mm.musicalScale, voices);
	}

	static createFromNewDialog(scoreId: string, partId: string, isPickupMeasure: boolean, measureNumber: number, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const durationDivs = MusicalHelper.parseTimeSignature(newScoreData.timeSignature).measureDurationDivs;
		const voice = Voice.createFromNewDialog(scoreId, partId, id, 'Melody', VoiceType.FN_LVL_1, newScoreData);
		return new Measure(id, scoreId, partId, measureNumber, isPickupMeasure, newScoreData.timeSignature, durationDivs, newScoreData.tempoBpm, newScoreData.musicalScale, [
			voice,
		]);
	}

	static findVoice(mm: MeasureModel, voiceId: string): VoiceModel | null {
		return mm.voices.find((v) => (v.id = voiceId)) || null;
	}

	static findNote(mm: MeasureModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		mm.voices.forEach((vm) => {
			if (!result) {
				result = Voice.findNote(vm, noteId);
			}
		});
		return result;
	}
}
