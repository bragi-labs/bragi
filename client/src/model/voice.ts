import { EntityKind, NoteModel, VoiceModel, VoiceType } from './scoreModel';
import { Note } from './note';
import { Chord } from './chord';
import { NewScoreData } from '../services/newScoreData';
import { CommonHelper } from '../services/commonHelper';
import { MusicalHelper } from '../services/musicalHelper';

export class Voice implements VoiceModel {
	kind: EntityKind = EntityKind.VOICE;

	constructor(
		public id: string,
		public scoreId: string,
		public partId: string,
		public measureId: string,
		public name: string,
		public voiceType: VoiceType,
		public lyrics: string,
		public notes: Note[],
		public chords: Chord[],
	) {}

	static createFromModel(v: VoiceModel) {
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
		return new Voice(v.id, v.scoreId, v.partId, v.measureId, v.name, v.voiceType, v.lyrics, notes, chords);
	}

	static createFromNewDialog(scoreId: string, partId: string, measureId: string, name: string, voiceType: VoiceType, newScoreData: NewScoreData) {
		const id = CommonHelper.getRandomId();
		const notes = [];
		const { beats, beatDurationDivs } = MusicalHelper.parseTimeSignature(newScoreData.timeSignature);
		for (let i = 0; i < beats; i++) {
			const note = new Note(CommonHelper.getRandomId(), scoreId, partId, measureId, id, '', true, i * beatDurationDivs, beatDurationDivs, false, false);
			notes.push(note);
		}
		return new Voice(id, scoreId, partId, measureId, name, voiceType, '', notes, []);
	}

	static findNote(v: VoiceModel, noteId: string): NoteModel | null {
		return v.notes.find((n) => n.id === noteId) || null;
	}

	static canChangeNoteDuration(v: VoiceModel, noteId: string, newDurationDivs: number, measureDurationDivs: number): boolean {
		if (v.voiceType !== VoiceType.FN_LVL_1) {
			return false;
		}
		const n = Voice.findNote(v, noteId);
		return !!n && n.durationDivs !== newDurationDivs && n.startDiv + newDurationDivs <= measureDurationDivs;
	}

	static changeNoteDuration(v: VoiceModel, noteId: string, newDurationDivs: number, measureDurationDivs: number) {
		if (!Voice.canChangeNoteDuration(v, noteId, newDurationDivs, measureDurationDivs)) {
			return;
		}
	}
}
