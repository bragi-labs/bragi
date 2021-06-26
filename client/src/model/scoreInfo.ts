import { EntityKind, ScoreInfoModel } from './scoreModel';
import { NewScoreData } from '../services/newScoreData';
import { AppDataHelper } from '../services/appDataHelper';

export class ScoreInfo implements ScoreInfoModel {
	kind: EntityKind = EntityKind.SCORE_INFO;

	constructor(public scoreTitle: string, public scoreCredits: string, public arrangerName: string, public softwareName: string, public softwareVersion: string) {}

	static createFromModel(im: ScoreInfoModel) {
		return new ScoreInfo(im.scoreTitle, im.scoreCredits, im.arrangerName, im.softwareName, im.softwareVersion);
	}

	static createFromNewDialog(newScoreData: NewScoreData) {
		return new ScoreInfo(newScoreData.scoreTitle, newScoreData.scoreCredits, newScoreData.arrangerName, AppDataHelper.appName, AppDataHelper.appVersion);
	}
}
