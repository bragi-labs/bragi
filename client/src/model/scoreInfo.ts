import { AppDataHelper } from '../services/appDataHelper';
import { ScoreInfoModel } from './scoreModel';
import { NewScoreData } from '../services/newScoreData';

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

	initFromNewDialog(newScoreData: NewScoreData) {
		this.scoreTitle = newScoreData.scoreTitle || '';
		this.scoreCredits = newScoreData.scoreCredits || '';
		this.arrangerName = newScoreData.arrangerName || '';
	}
}
