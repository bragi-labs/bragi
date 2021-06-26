import { ChordModel, EntityKind } from './scoreModel';

export class Chord implements ChordModel {
	kind: EntityKind = EntityKind.CHORD;

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
	) {}

	static createFromModel(c: ChordModel) {
		return new Chord(c.id, c.scoreId, c.partId, c.measureId, c.voiceId, c.name, c.isRest, c.startDiv, c.durationDivs);
	}
}
