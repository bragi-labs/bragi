import { CommonHelper } from '../services/commonHelper';
import { PartModel } from './scoreModel';
import { Measure } from './measure';
import { NewScoreData } from '../services/newScoreData';

export class Part implements PartModel {
	id: number = CommonHelper.getRandomId();
	scoreId: number = 0;
	name: string = '';
	measures: Measure[] = [];

	initFromModel(partModel: PartModel) {
		this.id = partModel.id;
		this.scoreId = partModel.scoreId;
		this.name = partModel.name || '';
		this.measures = [];
		partModel.measures.forEach((m) => {
			const measure = new Measure();
			measure.initFromModel(m);
			this.measures.push(measure);
		});
	}

	initFromNewDialog(newScoreData: NewScoreData) {
		this.measures = [];
		if (newScoreData.pickupMeasure !== 'no') {
			const pickupMeasure = new Measure();
			pickupMeasure.scoreId = this.scoreId;
			pickupMeasure.partId = this.id;
			pickupMeasure.initFromNewDialog(newScoreData, true, 0);
			this.addMeasure(pickupMeasure);
		}
		for (let i = 1; i <= newScoreData.numberOfMeasures; i++) {
			const measure = new Measure();
			measure.scoreId = this.scoreId;
			measure.partId = this.id;
			measure.initFromNewDialog(newScoreData, false, i);
			this.addMeasure(measure);
		}
	}

	addMeasure(measure: Measure) {
		this.measures.push(measure);
	}
}
