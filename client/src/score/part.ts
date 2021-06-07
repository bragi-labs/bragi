import { CommonHelper } from '../services/commonHelper';
import { PartModel } from '../model/scoreModel';
import { Measure } from './measure';
import { NewScoreDialogResult } from '../views/composer/NewScoreDialog';

export class Part implements PartModel {
	id: number = CommonHelper.getRandomId();
	name: string = '';
	measures: Measure[] = [];

	initFromModel(partModel: PartModel) {
		this.id = partModel.id || CommonHelper.getRandomId();
		this.name = partModel.name || '';
		this.measures = [];
		partModel.measures.forEach((m) => {
			const measure = new Measure();
			measure.initFromModel(m);
			this.measures.push(measure);
		});
	}

	initFromNewDialog(newScoreDialogResult: NewScoreDialogResult) {
		this.measures = [];
		if (newScoreDialogResult.pickupMeasure !== 'no') {
			const pickupMeasure = new Measure();
			pickupMeasure.initFromNewDialog(newScoreDialogResult, true);
			this.addMeasure(pickupMeasure);
		}
		const firstMeasure = new Measure();
		firstMeasure.initFromNewDialog(newScoreDialogResult, false);
		this.addMeasure(firstMeasure);
	}

	addMeasure(measure: Measure) {
		this.measures.push(measure);
	}
}
