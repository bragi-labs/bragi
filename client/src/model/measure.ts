import { EntityKind, MeasureModel, NoteModel, PartModel } from './scoreModel';
import { Part } from './part';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';

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

	static createFromModel(m: MeasureModel) {
		const parts: Part[] = [];
		m.parts.forEach((p) => {
			const part = Part.createFromModel(p);
			parts.push(part);
		});
		return new Measure(m.id, m.number, m.isPickup, m.timeSignature, m.durationDivs, m.tempoBpm, m.musicalScale, parts);
	}

	static createFromNewDialog(isPickupMeasure: boolean, measureNumber: number, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const durationDivs = MusicalHelper.parseTimeSignature(newScoreData.timeSignature).measureDurationDivs;
		const parts: Part[] = [];
		newScoreData.partTypes.forEach((pt) => {
			const part = Part.createFromNewDialog(id, pt, newScoreData);
			parts.push(part);
		});
		return new Measure(id, measureNumber, isPickupMeasure, newScoreData.timeSignature, durationDivs, newScoreData.tempoBpm, newScoreData.musicalScale, parts);
	}

	static findPart(m: MeasureModel, partId: string): PartModel | null {
		return m.parts.find((p) => p.id === partId) || null;
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
}
