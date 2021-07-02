import { EntityKind, NoteModel, PartModel, PartType } from './scoreModel';
import { Note } from './note';
import { Chord } from './chord';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';
import { PartInfo } from './partInfo';

export class Part implements PartModel {
	kind: EntityKind = EntityKind.PART;

	constructor(
		public id: string,
		public partInfoId: string,
		public measureId: string,
		public partType: PartType,
		public lyrics: string,
		public notes: Note[],
		public chords: Chord[],
	) {}

	static createFromModel(p: PartModel) {
		const notes: Note[] = [];
		p.notes.forEach((n) => {
			const note = Note.createFromModel(n);
			notes.push(note);
		});
		const chords: Chord[] = [];
		p.chords.forEach((c) => {
			const chord = Chord.createFromModel(c);
			chords.push(chord);
		});
		return new Part(p.id, p.partInfoId, p.measureId, p.partType, p.lyrics, notes, chords);
	}

	static createFromNewDialog(measureId: string, partInfo: PartInfo, timeSignature: string) {
		const id = CommonHelper.getRandomId();
		const notes = [];
		if (partInfo.partType === PartType.FN_LVL_1) {
			const { beats, beatDurationDivs } = MusicalHelper.parseTimeSignature(timeSignature);
			for (let i = 0; i < beats; i++) {
				const note = new Note(CommonHelper.getRandomId(), measureId, id, '', true, i * beatDurationDivs, beatDurationDivs, false, false);
				notes.push(note);
			}
		}
		return new Part(id, partInfo.id, measureId, partInfo.partType, '', notes, []);
	}

	static findNote(p: PartModel, noteId: string): NoteModel | null {
		return p.notes.find((n) => n.id === noteId) || null;
	}

	static canChangeNoteDuration(p: PartModel, noteId: string, newDurationDivs: number, measureDurationDivs: number): boolean {
		if (p.partType !== PartType.FN_LVL_1) {
			return false;
		}
		const n = Part.findNote(p, noteId);
		return !!n && n.durationDivs !== newDurationDivs && n.startDiv + newDurationDivs <= measureDurationDivs;
	}

	static changeNoteDuration(p: PartModel, noteId: string, newDurationDivs: number, measureTimeSignature: string, measureDurationDivs: number) {
		if (!Part.canChangeNoteDuration(p, noteId, newDurationDivs, measureDurationDivs)) {
			return;
		}
		const targetNote = Part.findNote(p, noteId);
		if (!targetNote) {
			return;
		}
		const targetNoteIndex = p.notes.findIndex((n) => n.id === noteId);
		const deltaDivs = newDurationDivs - targetNote.durationDivs;
		const isShorting = deltaDivs < 0;
		if (isShorting) {
			targetNote.durationDivs = newDurationDivs;
			const curStartDivs = targetNote.startDiv + targetNote.durationDivs;
			const newNote = new Note(CommonHelper.getRandomId(), targetNote.measureId, targetNote.partId, '', true, curStartDivs, -deltaDivs, false, false);
			p.notes.splice(targetNoteIndex + 1, 0, newNote);
		} else {
			targetNote.durationDivs = newDurationDivs;
			if (p.notes.length > targetNoteIndex + 1) {
				const nextNote = p.notes[targetNoteIndex + 1];
				nextNote.durationDivs = nextNote.durationDivs - deltaDivs;
				if (nextNote.durationDivs <= 0) {
					if ([6, 18].includes(newDurationDivs)) {
						nextNote.durationDivs = 6;
					} else if ([12, 36].includes(newDurationDivs)) {
						nextNote.durationDivs = 12;
					} else {
						nextNote.durationDivs = 24;
					}
				}
			}
			let lastOkIndex = -1;
			p.notes[p.notes.length - 1].durationDivs = measureDurationDivs;
			p.notes.forEach((n, i) => {
				n.startDiv = i === 0 ? 0 : p.notes[i - 1].startDiv + p.notes[i - 1].durationDivs;
				const endDiv = n.startDiv + n.durationDivs;
				if (endDiv >= measureDurationDivs) {
					n.durationDivs = Math.max(n.durationDivs - (endDiv - measureDurationDivs), 0);
					if (n.durationDivs > 0) {
						lastOkIndex = i;
					}
				}
			});
			if (lastOkIndex > -1) {
				p.notes.length = lastOkIndex + 1;
			}
		}
	}
}
