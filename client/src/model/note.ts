import { NoteModel } from './scoreModel';

export class Note implements NoteModel {
	constructor(
		public id: string,
		public scoreId: string,
		public partId: string,
		public measureId: string,
		public voiceId: string,
		public name: string,
		public isRest: boolean,
		public startDiv: number,
		public durationDivs: number,
		public isTiedToNext: boolean,
		public isTiedToPrev: boolean,
	) {}

	static createFromModel(nm: NoteModel) {
		return new Note(nm.id, nm.scoreId, nm.partId, nm.measureId, nm.voiceId, nm.name, nm.isRest, nm.startDiv, nm.durationDivs, nm.isTiedToNext, nm.isTiedToPrev);
	}
}
