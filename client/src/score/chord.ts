import { CommonHelper } from '../services/commonHelper';
import { ChordModel } from '../model/scoreModel';

export class Chord implements ChordModel {
	id: number = CommonHelper.getRandomId();
	name: string = '';
	isRest: boolean = false;
	startDiv: number = 0;
	durationDivs: number = 96;

	initFromModel(chordModel: ChordModel) {
		this.id = chordModel.id;
		this.name = chordModel.name;
		this.isRest = chordModel.isRest;
		this.startDiv = chordModel.startDiv;
		this.durationDivs = chordModel.durationDivs;
	}
}
