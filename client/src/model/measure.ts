import { MeasureModel, NoteModel, VoiceType } from './scoreModel';
import { Voice } from './voice';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';

export class Measure implements MeasureModel {
	constructor(
		public id: string,
		public scoreId: string,
		public partId: string,
		public number: number,
		public isPickup: boolean,
		public musicalScale: string,
		public timeSignature: string,
		public tempoBpm: number,
		public durationDivs: number,
		public voices: Voice[],
	) {}

	static createFromModel(mm: MeasureModel) {
		const voices: Voice[] = [];
		mm.voices.forEach((vm) => {
			const voice = Voice.createFromModel(vm);
			voices.push(voice);
		});
		return new Measure(mm.id, mm.scoreId, mm.partId, mm.number, mm.isPickup, mm.musicalScale, mm.timeSignature, mm.tempoBpm, mm.durationDivs, voices);
	}

	static createFromNewDialog(scoreId: string, partId: string, isPickupMeasure: boolean, measureNumber: number, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const durationDivs = MusicalHelper.parseTimeSignature(newScoreData.timeSignature).measureDurationDivs;
		const voice = Voice.createFromNewDialog(scoreId, partId, id, 'Melody', VoiceType.FN_LVL_1, newScoreData);
		return new Measure(id, scoreId, partId, measureNumber, isPickupMeasure, '', newScoreData.timeSignature, 120, durationDivs, [voice]);
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
