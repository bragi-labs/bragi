import { CommonHelper } from '../services/commonHelper';
import { NoteModel } from '../model/scoreModel';

export class Note implements NoteModel {
	id: number = CommonHelper.getRandomId();
	name: string = '';
	isRest: boolean = false;
	startDiv: number = 0;
	durationDivs: number = 24;
	isTiedToNext: boolean = false;
	isTiedToPrev: boolean = false;

	initFromModel(noteModel: NoteModel) {
		this.id = noteModel.id;
		this.name = noteModel.name;
		this.isRest = noteModel.isRest;
		this.startDiv = noteModel.startDiv;
		this.durationDivs = noteModel.durationDivs;
		this.isTiedToNext = noteModel.isTiedToNext;
		this.isTiedToPrev = noteModel.isTiedToPrev;
	}
}
