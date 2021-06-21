import { NoteModel, ScoreModel } from './scoreModel';
import { ScoreInfo } from './scoreInfo';
import { Part } from './part';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';

export class Score implements ScoreModel {
	constructor(public id: string, public scoreInfo: ScoreInfo, public parts: Part[]) {}

	static createFromModel(im: ScoreModel) {
		const scoreInfo = ScoreInfo.createFromModel(im.scoreInfo);
		const parts: Part[] = [];
		im.parts.forEach((pm) => {
			const part = Part.createFromModel(pm);
			parts.push(part);
		});
		return new Score(im.id, scoreInfo, parts);
	}

	static createFromNewDialog(newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const scoreInfo = ScoreInfo.createFromNewDialog(newScoreData);
		const part = Part.createFromNewDialog(id, newScoreData);
		return new Score(id, scoreInfo, [part]);
	}

	static findNote(sm: ScoreModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		sm.parts.forEach((pm) => {
			if (!result) {
				result = Part.findNote(pm, noteId);
			}
		});
		return result;
	}

	static findNotes(sm: ScoreModel, noteIds: string[]): NoteModel[] {
		const result: NoteModel[] = [];
		noteIds.forEach((noteId) => {
			const note = Score.findNote(sm, noteId);
			if (note) {
				result.push(note);
			}
		});
		return result;
	}
}
