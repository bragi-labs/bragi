import { CommonHelper } from '../services/commonHelper';
import { ChordModel, NoteModel, VoiceModel, VoiceType } from './scoreModel';
import { Note } from './note';
import { Chord } from './chord';
import { NewScoreData } from '../services/newScoreData';
import { MusicalHelper } from '../services/musicalHelper';

export class Voice implements VoiceModel {
	id: number = CommonHelper.getRandomId();
	name: string = '';
	voiceType: VoiceType = VoiceType.FN_LVL_1;
	lyrics: string = '';
	notes: NoteModel[] = [];
	chords: ChordModel[] = [];

	initFromModel(voiceModel: VoiceModel) {
		this.id = voiceModel.id || CommonHelper.getRandomId();
		this.name = voiceModel.name || '';
		this.voiceType = voiceModel.voiceType || VoiceType.FN_LVL_1;
		this.lyrics = voiceModel.lyrics || '';
		this.notes = [];
		voiceModel.notes.forEach((noteModel) => {
			const note = new Note();
			note.initFromModel(noteModel);
			this.notes.push(note);
		});
		this.chords = [];
		voiceModel.chords.forEach((chordModel) => {
			const chord = new Chord();
			chord.initFromModel(chordModel);
			this.chords.push(chord);
		});
	}

	initFromNewDialog(newScoreData: NewScoreData) {
		this.name = 'Melody';
		this.voiceType = VoiceType.FN_LVL_1;
		this.notes = [];
		const { beats, beatDurationDivs } = MusicalHelper.parseTimeSignature(newScoreData.timeSignature);
		for (let i = 0; i < beats; i++) {
			const note = new Note();
			note.isRest = true;
			note.startDiv = i * beatDurationDivs;
			note.durationDivs = beatDurationDivs;
			this.notes.push(note);
		}
	}
}
