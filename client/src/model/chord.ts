import { CommonHelper } from '../services/commonHelper';
import { ChordModel } from './scoreModel';

export class Chord implements ChordModel {
	id: number = CommonHelper.getRandomId();
	scoreId: number = 0;
	partId: number = 0;
	measureId: number = 0;
	voiceId: number = 0;
	name: string = '';
	isRest: boolean = false;
	startDiv: number = 0;
	durationDivs: number = 96;

	initFromModel(chordModel: ChordModel) {
		this.id = chordModel.id;
		this.scoreId = chordModel.scoreId;
		this.partId = chordModel.partId;
		this.measureId = chordModel.measureId;
		this.voiceId = chordModel.voiceId;
		this.name = chordModel.name || '';
		this.isRest = chordModel.isRest || false;
		this.startDiv = chordModel.startDiv || 0;
		this.durationDivs = chordModel.durationDivs || 96;
	}
}
