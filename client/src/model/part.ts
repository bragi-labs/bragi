import { EntityKind, NoteModel, PartModel, PartType } from './scoreModel';
import { Note } from './note';
import { Chord } from './chord';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';

export class Part implements PartModel {
	kind: EntityKind = EntityKind.PART;

	constructor(public id: string, public measureId: string, public partType: PartType, public lyrics: string, public notes: Note[], public chords: Chord[]) {}

	static createFromModel(v: PartModel) {
		const notes: Note[] = [];
		v.notes.forEach((n) => {
			const note = Note.createFromModel(n);
			notes.push(note);
		});
		const chords: Chord[] = [];
		v.chords.forEach((c) => {
			const chord = Chord.createFromModel(c);
			chords.push(chord);
		});
		return new Part(v.id, v.measureId, v.partType, v.lyrics, notes, chords);
	}

	static createFromNewDialog(measureId: string, partType: PartType, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const notes = [];
		if (partType === PartType.FN_LVL_1) {
			const { beats, beatDurationDivs } = MusicalHelper.parseTimeSignature(newScoreData.timeSignature);
			for (let i = 0; i < beats; i++) {
				const note = new Note(CommonHelper.getRandomId(), measureId, id, '', true, i * beatDurationDivs, beatDurationDivs, false, false);
				notes.push(note);
			}
		}
		return new Part(id, measureId, partType, '', notes, []);
	}

	static findNote(v: PartModel, noteId: string): NoteModel | null {
		return v.notes.find((n) => n.id === noteId) || null;
	}

	static canChangeNoteDuration(v: PartModel, noteId: string, newDurationDivs: number, measureDurationDivs: number): boolean {
		if (v.partType !== PartType.FN_LVL_1) {
			return false;
		}
		const n = Part.findNote(v, noteId);
		return !!n && n.durationDivs !== newDurationDivs && n.startDiv + newDurationDivs <= measureDurationDivs;
	}

	static changeNoteDuration(v: PartModel, noteId: string, newDurationDivs: number, measureTimeSignature: string, measureDurationDivs: number) {
		if (!Part.canChangeNoteDuration(v, noteId, newDurationDivs, measureDurationDivs)) {
			return;
		}
		const targetNote = Part.findNote(v, noteId);
		if (!targetNote) {
			return;
		}
		const targetNoteIndex = v.notes.findIndex((n) => n.id === noteId);
		const deltaDivs = newDurationDivs - targetNote.durationDivs;
		const isShorting = deltaDivs < 0;
		if (isShorting) {
			targetNote.durationDivs = newDurationDivs;
			const curStartDivs = targetNote.startDiv + targetNote.durationDivs;
			const newNote = new Note(CommonHelper.getRandomId(), targetNote.measureId, targetNote.partId, '', true, curStartDivs, -deltaDivs, false, false);
			v.notes.splice(targetNoteIndex + 1, 0, newNote);
		} else {
			targetNote.durationDivs = newDurationDivs;
			if (v.notes.length > targetNoteIndex + 1) {
				const nextNote = v.notes[targetNoteIndex + 1];
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
			v.notes[v.notes.length - 1].durationDivs = measureDurationDivs;
			v.notes.forEach((n, i) => {
				n.startDiv = i === 0 ? 0 : v.notes[i - 1].startDiv + v.notes[i - 1].durationDivs;
				const endDiv = n.startDiv + n.durationDivs;
				if (endDiv >= measureDurationDivs) {
					n.durationDivs = Math.max(n.durationDivs - (endDiv - measureDurationDivs), 0);
					if (n.durationDivs > 0) {
						lastOkIndex = i;
					}
				}
			});
			if (lastOkIndex > -1) {
				v.notes.length = lastOkIndex + 1;
			}
		}
	}
}
