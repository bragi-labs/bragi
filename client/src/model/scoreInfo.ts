import { AppDataHelper } from '../services/appDataHelper';
import { ScoreInfoModel } from './scoreModel';
import { NewScoreDialogResult } from '../services/newScoreDialogResult';

export class ScoreInfo implements ScoreInfoModel {
	scoreTitle: string = '';
	scoreCredits: string = '';
	arrangerName: string = '';
	softwareName: string = AppDataHelper.appName;
	softwareVersion: string = AppDataHelper.appVersion;

	initFromModel(scoreInfoModel: ScoreInfoModel) {
		this.scoreTitle = scoreInfoModel.scoreTitle || '';
		this.scoreCredits = scoreInfoModel.scoreCredits || '';
		this.arrangerName = scoreInfoModel.arrangerName || '';
		this.softwareName = scoreInfoModel.softwareName || AppDataHelper.appName;
		this.softwareVersion = scoreInfoModel.softwareVersion || AppDataHelper.appVersion;
	}

	initFromNewDialog(newScoreDialogResult: NewScoreDialogResult) {
		this.scoreTitle = newScoreDialogResult.scoreTitle || '';
		this.scoreCredits = newScoreDialogResult.scoreCredits || '';
		this.arrangerName = newScoreDialogResult.arrangerName || '';
	}
}
