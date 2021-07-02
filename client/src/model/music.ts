import { EntityKind, MeasureModel, MusicModel, NoteModel, PartModel, PartType } from './scoreModel';
import { Measure } from './measure';
import { PartInfo } from './partInfo';

export class Music implements MusicModel {
	kind: EntityKind = EntityKind.MUSIC;

	constructor(public partsInfo: PartInfo[], public measures: Measure[]) {}

	static createNew(partTypes: PartType[], timeSignature: string, tempoBpm: number, hasPickupMeasure: boolean, numberOfMeasures: number, musicalScale: string) {
		const partsInfo: PartInfo[] = [];
		partTypes.forEach((pt) => {
			let partName;
			switch (pt) {
				case PartType.FN_LVL_1:
					partName = 'Melody';
					break;
				case PartType.LYRICS:
					partName = 'Lyrics';
					break;
				case PartType.FN_CHORDS:
					partName = 'Chords';
					break;
				case PartType.CHORD_NAMES:
					partName = 'Chords';
					break;
				case PartType.RHYTHM:
					partName = 'Rhythm';
					break;
				default:
					partName = '';
			}
			const partInfo = PartInfo.createNew(pt, partName, true);
			partsInfo.push(partInfo);
		});
		const measures: Measure[] = [];
		if (hasPickupMeasure) {
			const pickupMeasure = Measure.createNew(true, 0, partsInfo, timeSignature, tempoBpm, musicalScale);
			measures.push(pickupMeasure);
		}
		for (let i = 1; i <= numberOfMeasures; i++) {
			const measure = Measure.createNew(false, i, partsInfo, timeSignature, tempoBpm, musicalScale);
			measures.push(measure);
		}
		return new Music(partsInfo, measures);
	}

	static createFromModel(u: MusicModel) {
		const partsInfo: PartInfo[] = [];
		u.partsInfo.forEach((pi) => {
			const partInfo = PartInfo.createFromModel(pi);
			partsInfo.push(partInfo);
		});
		const measures: Measure[] = [];
		u.measures.forEach((m) => {
			const measure = Measure.createFromModel(m);
			measures.push(measure);
		});
		return new Music(partsInfo, measures);
	}

	static findMeasure(u: MusicModel, measureId: string): MeasureModel | null {
		return u.measures.find((m) => m.id === measureId) || null;
	}

	static findPart(u: MusicModel, partId: string): PartModel | null {
		let result: PartModel | null = null;
		u.measures.forEach((m) => {
			if (!result) {
				result = Measure.findPart(m, partId);
			}
		});
		return result;
	}

	static findNote(u: MusicModel, noteId: string): NoteModel | null {
		let result: NoteModel | null = null;
		u.measures.forEach((m) => {
			if (!result) {
				result = Measure.findNote(m, noteId);
			}
		});
		return result;
	}
}
