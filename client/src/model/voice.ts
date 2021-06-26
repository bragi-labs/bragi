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

	static createFromModel(vm: VoiceModel) {
		const notes: Note[] = [];
		vm.notes.forEach((nm) => {
			const note = Note.createFromModel(nm);
			notes.push(note);
		});
		const chords: Chord[] = [];
		vm.chords.forEach((cm) => {
			const chord = Chord.createFromModel(cm);
			chords.push(chord);
		});
		return new Voice(vm.id, vm.scoreId, vm.partId, vm.measureId, vm.name, vm.voiceType, vm.lyrics, notes, chords);
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

	static findNote(vm: VoiceModel, noteId: string): NoteModel | null {
		return vm.notes.find((nm) => nm.id === noteId) || null;
	}
}
