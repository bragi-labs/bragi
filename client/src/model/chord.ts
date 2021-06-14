import { CommonHelper } from '../services/commonHelper';
import { ChordModel } from './scoreModel';

export class Chord implements ChordModel {
	id: number = CommonHelper.getRandomId();
	name: string = '';
	isRest: boolean = false;
	startDiv: number = 0;
	durationDivs: number = 96;

	initFromModel(chordModel: ChordModel) {
		this.id = chordModel.id || CommonHelper.getRandomId();
		this.name = chordModel.name || '';
		this.isRest = chordModel.isRest || false;
		this.startDiv = chordModel.startDiv || 0;
		this.durationDivs = chordModel.durationDivs || 96;
	}
}
