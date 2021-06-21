import { VoiceType } from '../model/scoreModel';

export interface NewScoreData {
	scoreTitle: string;
	scoreCredits: string;
	arrangerName: string;
	voiceTypes: VoiceType[];
	musicalScale: string;
	tempoBpm: number;
	timeSignature: string;
	pickupMeasure: string;
	numberOfMeasures: number;
}
