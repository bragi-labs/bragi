import { EntityKind, MeasureModel, NoteModel, PartModel } from './scoreModel';
import { Part } from './part';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';
import { PartInfo } from './partInfo';

export class Measure implements MeasureModel {
	kind: EntityKind = EntityKind.MEASURE;

	constructor(
		public id: string,
		public number: number,
		public isPickup: boolean,
		public timeSignature: string,
		public durationDivs: number,
		public tempoBpm: number,
		public musicalScale: string,
		public parts: Part[],
	) {}

	static createNew(isPickupMeasure: boolean, measureNumber: number, partsInfo: PartInfo[], timeSignature: string, tempoBpm: number, musicalScale: string) {
		const id = CommonHelper.getRandomId();
		const durationDivs = MusicalHelper.parseTimeSignature(timeSignature).measureDurationDivs;
		const parts: Part[] = [];
		partsInfo.forEach((pi) => {
			const part = Part.createNew(id, pi, timeSignature);
			parts.push(part);
		});
		return new Measure(id, measureNumber, isPickupMeasure, timeSignature, durationDivs, tempoBpm, musicalScale, parts);
	}

	static createFromModel(m: MeasureModel) {
		const parts: Part[] = [];
		m.parts.forEach((p) => {
			const part = Part.createFromModel(p);
			parts.push(part);
		});
		return new Measure(m.id, m.number, m.isPickup, m.timeSignature, m.durationDivs, m.tempoBpm, m.musicalScale, parts);
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

	static movePart(m: Measure, partInfoId: string, isUp: boolean) {
		const partIndex = m.parts.findIndex((p) => p.partInfoId === partInfoId);
		if (partIndex === -1) {
			return;
		}
		CommonHelper.arrayMove(m.parts, partIndex, partIndex + (isUp ? -1 : 1));
	}
}
