export interface ScoreInfoModel {
	scoreName: string; //e.g. "Bohemian Rhapsody"
	scoreCredits: string; //e.g. "Queen - A Night at the Opera - 1975"
	arrangerName: string; //e.g. "Uri Kalish"
	softwareName: string; //e.g. "Figurenotes Composer"
	softwareVersion: string; //e.g. "1.0.0"
}
export interface ScoreSettings {
	divisionsPerQuarter: number; //e.g. 12
}
export interface NoteModel {
	id: number; //internal
	name?: string; //e.g. F#4
	isRest?: boolean; //e.g. false
	startDiv: number; //e.g. 0
	durationDivs: number; //e.g. 12
	isTiedToNext?: boolean; //e.g. false
	isTiedToPrev?: boolean; //e.g. false
}
export interface ChordModel {
	id: number; //internal
	name?: string; //e.g. Am
	isRest?: boolean; //e.g. false
	starDivs: number; //e.g. 0
	durationDivs: number; //e.g. 48
}
export enum VoiceType {
	FN_LVL_1 = 'FN_LVL_1',
	FN_CHORDS = 'FN_CHORDS',
	LYRICS = 'LYRICS',
	CHORD_NAMES = 'CHORD_NAMES',
	RHYTHM = 'RHYTHM',
}
export interface VoiceModel {
	id: number; //internal
	name: string; //e.g. "Piano"
	voiceType: VoiceType; //e.g. FN_LVL_1
	lyrics?: string; //e.g. "Is this the real life?"
	notes?: NoteModel[];
	chords?: ChordModel[];
}
export interface MeasureModel {
	id: number; //public
	isPickup?: boolean; //e.g. false
	scale?: string; //e.g. "Am"
	timeSignature: string; //e.g. "4/4"
	tempo?: number; //e.g. 120
	durationDivs: number; //e.g. 48
	voices: VoiceModel[];
}
export interface PartModel {
	id: number; //internal ID
	name: string; //e.g. "Part 1"
	measures: MeasureModel[];
}
export interface ScoreModel {
	version: number; //internal number
	id: number; //internal ID
	info: ScoreInfoModel;
	settings: ScoreSettings;
	parts: PartModel[];
}
