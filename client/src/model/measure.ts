import { EntityKind, MeasureModel, NoteModel, VoiceModel, VoiceType } from './scoreModel';
import { Voice } from './voice';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';

export class Measure implements MeasureModel {
	kind: EntityKind = EntityKind.MEASURE;

	constructor(
		public id: string,
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
		return new Measure(m.id, m.number, m.isPickup, m.timeSignature, m.durationDivs, m.tempoBpm, m.musicalScale, voices);
	}

	static createFromNewDialog(scoreId: string, partId: string, isPickupMeasure: boolean, measureNumber: number, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const durationDivs = MusicalHelper.parseTimeSignature(newScoreData.timeSignature).measureDurationDivs;
		const voices: Voice[] = [];
		newScoreData.voiceTypes.forEach((vt) => {
			let voiceName;
			switch (vt) {
				case VoiceType.FN_LVL_1:
					voiceName = 'Melody';
					break;
				case VoiceType.LYRICS:
					voiceName = 'Lyrics';
					break;
				default:
					voiceName = '';
			}
			const voice = Voice.createFromNewDialog(id, voiceName, vt, newScoreData);
			voices.push(voice);
		});
		return new Measure(id, measureNumber, isPickupMeasure, newScoreData.timeSignature, durationDivs, newScoreData.tempoBpm, newScoreData.musicalScale, voices);
	}

	static findVoice(m: MeasureModel, voiceId: string): VoiceModel | null {
		return m.voices.find((v) => v.id === voiceId) || null;
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
