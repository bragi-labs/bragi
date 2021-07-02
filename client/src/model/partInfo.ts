import { EntityKind, PartInfoModel, PartType } from './scoreModel';
import { CommonHelper } from '../services/commonHelper';

export class PartInfo implements PartInfoModel {
	kind: EntityKind = EntityKind.PART_INFO;

	constructor(public id: string, public partType: PartType, public name: string, public isVisible: boolean) {}

	static createFromModel(pi: PartInfoModel) {
		return new PartInfo(pi.id, pi.partType, pi.name, pi.isVisible);
	}

	static createFromNewDialog(partType: PartType, name: string, isVisible: boolean) {
		const id = CommonHelper.getRandomId();
		return new PartInfo(id, partType, name, isVisible);
	}
}
