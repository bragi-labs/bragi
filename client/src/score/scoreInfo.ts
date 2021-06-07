import { AppDataHelper } from '../services/appDataHelper';
import { ScoreInfoModel } from '../model/scoreModel';
import { NewScoreDialogResult } from '../views/composer/NewScoreDialog';

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
