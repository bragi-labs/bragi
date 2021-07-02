import { PartType } from '../model/scoreModel';

export interface NewScoreData {
	scoreTitle: string;
	scoreCredits: string;
	arrangerName: string;
	partTypes: PartType[];
	musicalScale: string;
	tempoBpm: number;
	timeSignature: string;
	pickupMeasure: string;
	numberOfMeasures: number;
}
