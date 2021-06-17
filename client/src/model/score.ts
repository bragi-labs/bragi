import { CommonHelper } from '../services/commonHelper';
import { ScoreModel } from './scoreModel';
import { ScoreInfo } from './scoreInfo';
import { Part } from './part';
import { NewScoreData } from '../services/newScoreData';

export class Score implements ScoreModel {
	id: number = CommonHelper.getRandomId();
	scoreInfo: ScoreInfo = new ScoreInfo();
	parts: Part[] = [];

	initFromModel(scoreModel: ScoreModel) {
		this.id = scoreModel.id;
		this.scoreInfo = new ScoreInfo();
		this.scoreInfo.initFromModel(scoreModel.scoreInfo);
		this.parts = [];
		scoreModel.parts.forEach((p) => {
			const part = new Part();
			part.initFromModel(p);
			this.parts.push(part);
		});
	}

	initFromNewDialog(newScoreData: NewScoreData) {
		this.scoreInfo = new ScoreInfo();
		this.scoreInfo.initFromNewDialog(newScoreData);
		this.parts = [];
		const part = new Part();
		part.scoreId = this.id;
		part.initFromNewDialog(newScoreData);
		this.addPart(part);
	}

	addPart(part: Part) {
		this.parts.push(part);
	}
}
