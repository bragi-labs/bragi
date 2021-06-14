import { CommonHelper } from '../services/commonHelper';
import { NoteModel } from './scoreModel';

export class Note implements NoteModel {
	id: number = CommonHelper.getRandomId();
	name: string = '';
	isRest: boolean = false;
	startDiv: number = 0;
	durationDivs: number = 24;
	isTiedToNext: boolean = false;
	isTiedToPrev: boolean = false;

	initFromModel(noteModel: NoteModel) {
		this.id = noteModel.id || CommonHelper.getRandomId();
		this.name = noteModel.name || '';
		this.isRest = noteModel.isRest || false;
		this.startDiv = noteModel.startDiv || 0;
		this.durationDivs = noteModel.durationDivs || 24;
		this.isTiedToNext = noteModel.isTiedToNext || false;
		this.isTiedToPrev = noteModel.isTiedToPrev || false;
	}
}
