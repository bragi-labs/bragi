import { EntityKind, MeasureModel, NoteModel, PartModel } from './scoreModel';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';
import { PartInfo } from './partInfo';
import { Part } from './part';

export class Measure implements MeasureModel {
	kind: EntityKind = EntityKind.MEASURE;

	constructor(
		public id: string,
		public number: number,
		public isPickup: boolean,
		public timeSignature: string,
		public durationDivs: number,
		public tempoBpm: number,
		public scaleRoot: string,
		public scaleMode: string,
		public parts: Part[],
	) {}

	static createNew(isPickupMeasure: boolean, measureNumber: number, partsInfo: PartInfo[], timeSignature: string, tempoBpm: number, scaleRoot: string, scaleMode: string) {
		const id = CommonHelper.getRandomId();
		const durationDivs = MusicalHelper.parseTimeSignature(timeSignature).measureDurationDivs;
		const parts: Part[] = [];
		partsInfo.forEach((pi) => {
			const part = Part.createNew(id, pi, timeSignature);
			parts.push(part);
		});
		return new Measure(id, measureNumber, isPickupMeasure, timeSignature, durationDivs, tempoBpm, scaleRoot, scaleMode, parts);
	}

	static createFromModel(m: MeasureModel) {
		const parts: Part[] = [];
		const scaleRoot = m.scaleRoot || 'C';
		const scaleMode = m.scaleMode || 'Ionian';
		m.parts.forEach((p) => {
			const part = Part.createFromModel(p);
			parts.push(part);
		});
		return new Measure(m.id, m.number, m.isPickup, m.timeSignature, m.durationDivs, m.tempoBpm, scaleRoot, scaleMode, parts);
	}

	static findPart(m: MeasureModel, partId: string): PartModel | null {
		return m.parts.find((p) => p.id === partId) || null;
	}

	static findPartByPartInfoId(m: MeasureModel, partInfoId: string): PartModel | null {
		return m.parts.find((p) => p.partInfoId === partInfoId) || null;
	}

	static findNote(m: MeasureModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		m.parts.forEach((p) => {
			if (!result) {
				result = Part.findNote(p, noteId);
			}
		});
		return result;
	}

	static canChangeNoteDuration(m: MeasureModel, partId: string, noteId: string, newDurationDivs: number): boolean {
		const p = Measure.findPart(m, partId);
		if (!p) {
			return false;
		}
		return Part.canChangeNoteDuration(p, noteId, newDurationDivs, m.durationDivs);
	}

	static movePart(m: MeasureModel, partInfoId: string, isUp: boolean) {
		const partIndex = m.parts.findIndex((p) => p.partInfoId === partInfoId);
		if (partIndex === -1) {
			return;
		}
		CommonHelper.arrayMove(m.parts, partIndex, partIndex + (isUp ? -1 : 1));
	}

	static addPart(m: MeasureModel, partInfo: PartInfo) {
		const p = Part.createNew(m.id, partInfo, m.timeSignature);
		m.parts.push(p);
	}

	static deletePart(m: MeasureModel, partInfoId: string) {
		const partInfoIndex = m.parts.findIndex((pi) => pi.id === partInfoId);
		if (partInfoIndex === -1) {
			return;
		}
		m.parts.splice(partInfoIndex, 1);
	}

	static resetIds(m: MeasureModel) {
		m.id = CommonHelper.getRandomId();
		m.parts.forEach((p) => {
			Part.resetIds(p, m.id);
		});
	}
}
