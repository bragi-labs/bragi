import { PartModel, MeasureModel, VoiceModel, NoteModel, EntityKind } from './scoreModel';
import { Measure } from './measure';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';

export class Part implements PartModel {
	kind: EntityKind = EntityKind.PART;

	constructor(public id: string, public scoreId: string, public name: string, public measures: Measure[]) {}

	static createFromModel(p: PartModel) {
		const measures: Measure[] = [];
		p.measures.forEach((m) => {
			const measure = Measure.createFromModel(m);
			measures.push(measure);
		});
		return new Part(p.id, p.scoreId, p.name, measures);
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

	static findMeasure(p: PartModel, measureId: string): MeasureModel | null {
		return p.measures.find((m) => m.id === measureId) || null;
	}

	static findVoice(p: PartModel, voiceId: string): VoiceModel | null {
		let result: VoiceModel | null = null;
		p.measures.forEach((m) => {
			if (!result) {
				result = Measure.findVoice(m, voiceId);
			}
		});
		return result;
	}

	static findNote(p: PartModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		p.measures.forEach((m) => {
			if (!result) {
				result = Measure.findNote(m, noteId);
			}
		});
		return result;
	}
}
