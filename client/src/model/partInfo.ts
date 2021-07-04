import { EntityKind, PartInfoModel, PartType } from './scoreModel';
import { CommonHelper } from '../services/commonHelper';

export class PartInfo implements PartInfoModel {
	kind: EntityKind = EntityKind.PART_INFO;

	constructor(
		public id: string,
		public partType: PartType,
		public name: string,
		public isVisible: boolean,
		public fontSize: number,
		public isBold: boolean,
		public textColor: string,
		public bgColor: string,
	) {}

	static createNew(partType: PartType, name: string, isVisible: boolean) {
		const id = CommonHelper.getRandomId();
		const fontSize = 12;
		const isBold = false;
		const textColor = '#000';
		const bgColor = partType === PartType.TEXT ? '#f6f6f6' : '#fff';
		return new PartInfo(id, partType, name, isVisible, fontSize, isBold, textColor, bgColor);
	}

	static createFromModel(pi: PartInfoModel) {
		return new PartInfo(pi.id, pi.partType, pi.name, pi.isVisible, pi.fontSize, pi.isBold, pi.textColor, pi.bgColor);
	}
}
