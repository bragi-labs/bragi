import { CommonHelper } from '../services/commonHelper';
import { ScoreModel } from '../model/scoreModel';
import { ScoreInfo } from './scoreInfo';
import { Part } from './part';
import { NewScoreDialogResult } from '../views/composer/NewScoreDialog';

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

	initFromNewDialog(newScoreDialogResult: NewScoreDialogResult) {
		this.scoreInfo = new ScoreInfo();
		this.scoreInfo.initFromNewDialog(newScoreDialogResult);
		this.parts = [];
		const part = new Part();
		part.initFromNewDialog(newScoreDialogResult);
		this.addPart(part);
	}

	addPart(part: Part) {
		this.parts.push(part);
	}
}
