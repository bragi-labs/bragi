import { LineModel, EntityKind } from './scoreModel';

export class Line implements LineModel {
	kind: EntityKind = EntityKind.LINE;

	constructor(
		public id: string,
		public measureId: string,
		public partId: string,
		public text: string,
		public fontSize: number,
		public isBold: boolean,
		public textColor: string,
		public bgColor: string,
	) {}

	static createFromModel(l: LineModel) {
		return new Line(l.id, l.measureId, l.partId, l.text, l.fontSize, l.isBold, l.textColor, l.bgColor);
	}
}
