import { NoteModel, PartModel } from './scoreModel';
import { Measure } from './measure';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';

export class Part implements PartModel {
	constructor(public id: string, public scoreId: string, public name: string, public measures: Measure[]) {}

	static createFromModel(pm: PartModel) {
		const measures: Measure[] = [];
		pm.measures.forEach((mm) => {
			const measure = Measure.createFromModel(mm);
			measures.push(measure);
		});
		return new Part(pm.id, pm.scoreId, pm.name, measures);
	}

	static createFromNewDialog(scoreId: string, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const measures: Measure[] = [];
		if (newScoreData.pickupMeasure !== 'no') {
			const pickupMeasure = Measure.createFromNewDialog(scoreId, id, true, 0, newScoreData);
			measures.push(pickupMeasure);
		}
		for (let i = 1; i <= newScoreData.numberOfMeasures; i++) {
			const measure = Measure.createFromNewDialog(scoreId, id, false, i, newScoreData);
			measures.push(measure);
		}
		return new Part(id, scoreId, '', measures);
	}

	static findNote(pm: PartModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		pm.measures.forEach((mm) => {
			if (!result) {
				result = Measure.findNote(mm, noteId);
			}
		});
		return result;
	}
}
