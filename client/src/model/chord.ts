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

	static createFromModel(cm: ChordModel) {
		return new Chord(cm.id, cm.scoreId, cm.partId, cm.measureId, cm.voiceId, cm.name, cm.isRest, cm.startDiv, cm.durationDivs);
	}
}
