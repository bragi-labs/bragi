import { CommonHelper } from '../services/commonHelper';
import { AppDataHelper } from '../services/appDataHelper';
import { ScoreModel } from '../model/scoreModel';
import { Part } from './part';
import { NewScoreDialogResult } from '../views/composer/NewScoreDialog';

export class Score implements ScoreModel {
	id: number = CommonHelper.getRandomId();
	scoreTitle: string = '';
	scoreCredits: string = '';
	arrangerName: string = '';
	softwareName: string = AppDataHelper.appName;
	softwareVersion: string = AppDataHelper.appVersion;
	parts: Part[] = [];

	initFromModel(scoreModel: ScoreModel) {
		this.id = scoreModel.id;
		this.scoreTitle = scoreModel.scoreTitle;
		this.scoreCredits = scoreModel.scoreCredits;
		this.arrangerName = scoreModel.arrangerName;
		this.softwareName = scoreModel.softwareName;
		this.softwareVersion = scoreModel.softwareVersion;
		this.parts = [];
		scoreModel.parts.forEach((partModel) => {
			const part = new Part();
			part.initFromModel(partModel);
			this.parts.push(part);
		});
	}

	initFromNewDialog(newScoreDialogResult: NewScoreDialogResult) {
		this.scoreTitle = newScoreDialogResult.scoreTitle || '';
		this.scoreCredits = newScoreDialogResult.scoreCredits || '';
		this.arrangerName = newScoreDialogResult.arrangerName || '';
		this.parts = [];
		const part = new Part();
		part.initFromNewDialog(newScoreDialogResult);
		this.addPart(part);
	}

	addPart(part: Part) {
		this.parts.push(part);
	}
}
