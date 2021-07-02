import { ScoreModel, MeasureModel, PartModel, NoteModel, EntityKind } from './scoreModel';
import { ScoreInfo } from './scoreInfo';
import { ScoreSettings } from './scoreSettings';
import { Music } from './music';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';

export class Score implements ScoreModel {
	kind: EntityKind = EntityKind.SCORE;
	timestamp: number = Date.now();

	constructor(public id: string, public scoreInfo: ScoreInfo, public scoreSettings: ScoreSettings, public music: Music) {}

	static createFromModel(s: ScoreModel) {
		const scoreInfo = ScoreInfo.createFromModel(s.scoreInfo || {});
		const scoreSettings = ScoreSettings.createFromModel(s.scoreSettings || {});
		const music = Music.createFromModel(s.music || {});
		return new Score(s.id, scoreInfo, scoreSettings, music);
	}

	static createFromNewDialog(newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const scoreInfo = ScoreInfo.createFromNewDialog(newScoreData);
		const scoreSettings = ScoreSettings.createFromNewDialog();
		const music = Music.createFromNewDialog(newScoreData);
		return new Score(id, scoreInfo, scoreSettings, music);
	}

	static findMeasure(s: ScoreModel, measureId: string): MeasureModel | null {
		return Music.findMeasure(s.music, measureId) || null;
	}

	static findPart(s: ScoreModel, partId: string): PartModel | null {
		return Music.findPart(s.music, partId) || null;
	}

	static findNote(s: ScoreModel, noteId: string): NoteModel | null {
		return Music.findNote(s.music, noteId) || null;
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
