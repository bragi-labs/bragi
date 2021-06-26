import { ScoreModel, PartModel, MeasureModel, VoiceModel, NoteModel, EntityKind } from './scoreModel';
import { ScoreInfo } from './scoreInfo';
import { Part } from './part';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';

export class Score implements ScoreModel {
	kind: EntityKind = EntityKind.SCORE;

	constructor(public id: string, public scoreInfo: ScoreInfo, public parts: Part[]) {}

	static createFromModel(s: ScoreModel) {
		const scoreInfo = ScoreInfo.createFromModel(s.scoreInfo);
		const parts: Part[] = [];
		s.parts.forEach((p) => {
			const part = Part.createFromModel(p);
			parts.push(part);
		});
		return new Score(s.id, scoreInfo, parts);
	}

	static createFromNewDialog(newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const scoreInfo = ScoreInfo.createFromNewDialog(newScoreData);
		const part = Part.createFromNewDialog(id, newScoreData);
		return new Score(id, scoreInfo, [part]);
	}

	static findPart(s: ScoreModel, partId: string): PartModel | null {
		return s.parts.find((p) => (p.id = partId)) || null;
	}

	static findMeasure(s: ScoreModel, measureId: string): MeasureModel | null {
		let result: MeasureModel | null = null;
		s.parts.forEach((p) => {
			if (!result) {
				result = Part.findMeasure(p, measureId);
			}
		});
		return result;
	}

	static findVoice(s: ScoreModel, voiceId: string): VoiceModel | null {
		let result: VoiceModel | null = null;
		s.parts.forEach((p) => {
			if (!result) {
				result = Part.findVoice(p, voiceId);
			}
		});
		return result;
	}

	static findNote(s: ScoreModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		s.parts.forEach((p) => {
			if (!result) {
				result = Part.findNote(p, noteId);
			}
		});
		return result;
	}

	static findNotes(s: ScoreModel, noteIds: string[]): NoteModel[] {
		const result: NoteModel[] = [];
		noteIds.forEach((noteId) => {
			const n = Score.findNote(s, noteId);
			if (n) {
				result.push(n);
			}
		});
		return result;
	}
}
