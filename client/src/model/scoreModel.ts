export interface ScoreInfoModel {
	scoreTitle: string; //e.g. "Bohemian Rhapsody"
	scoreCredits: string; //e.g. "Queen - A Night at the Opera - 1975"
	arrangerName: string; //e.g. "Uri Kalish"
	softwareName: string; //e.g. "Figurenotes Composer"
	softwareVersion: string; //e.g. "1.0.0"
}
export interface NoteModel {
	id: string; //internal ID
	scoreId: string; //internal ID
	partId: string; //internal ID
	measureId: string; //internal ID
	voiceId: string; //internal ID
	name: string; //e.g. "F#4"
	isRest: boolean; //e.g. false
	startDiv: number; //e.g. 0
	durationDivs: number; //e.g. 24
	isTiedToNext: boolean; //e.g. false
	isTiedToPrev: boolean; //e.g. false
}
export interface ChordModel {
	id: string; //internal ID
	scoreId: string; //internal ID
	partId: string; //internal ID
	measureId: string; //internal ID
	voiceId: string; //internal ID
	name: string; //e.g. "Am"
	isRest: boolean; //e.g. false
	startDiv: number; //e.g. 0
	durationDivs: number; //e.g. 96
}
export enum VoiceType {
	FN_LVL_1 = 'FN_LVL_1',
	FN_CHORDS = 'FN_CHORDS',
	LYRICS = 'LYRICS',
	CHORD_NAMES = 'CHORD_NAMES',
	RHYTHM = 'RHYTHM',
	NA = 'NA',
}
export interface VoiceModel {
	id: string; //internal ID
	scoreId: string; //internal ID
	partId: string; //internal ID
	measureId: string; //internal ID
	name: string; //e.g. "Piano"
	voiceType: VoiceType; //e.g. FN_LVL_1
	lyrics: string; //e.g. "Is this the real life?"
	notes: NoteModel[];
	chords: ChordModel[];
}
export interface MeasureModel {
	id: string; //internal ID
	scoreId: string; //internal ID
	partId: string; //internal ID
	number: number; //e.g. 1
	isPickup: boolean; //e.g. false
	timeSignature: string; //e.g. "4/4"
	durationDivs: number; //e.g. 96
	tempoBpm: number; //e.g. 120
	musicalScale: string; //e.g. "Am"
	voices: VoiceModel[];
}
export interface PartModel {
	id: string; //internal ID
	scoreId: string; //internal ID
	name: string; //e.g. "Part 1"
	measures: MeasureModel[];
}
export interface ScoreModel {
	id: string; //internal ID
	scoreInfo: ScoreInfoModel;
	parts: PartModel[];
}
