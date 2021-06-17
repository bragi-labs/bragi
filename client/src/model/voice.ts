import { CommonHelper } from '../services/commonHelper';
import { ChordModel, NoteModel, VoiceModel, VoiceType } from './scoreModel';
import { Note } from './note';
import { Chord } from './chord';
import { NewScoreData } from '../services/newScoreData';
import { MusicalHelper } from '../services/musicalHelper';

export class Voice implements VoiceModel {
	id: number = CommonHelper.getRandomId();
	scoreId: number = 0;
	partId: number = 0;
	measureId: number = 0;
	name: string = '';
	voiceType: VoiceType = VoiceType.FN_LVL_1;
	lyrics: string = '';
	notes: NoteModel[] = [];
	chords: ChordModel[] = [];

	initFromModel(voiceModel: VoiceModel) {
		this.id = voiceModel.id;
		this.scoreId = voiceModel.scoreId;
		this.partId = voiceModel.partId;
		this.measureId = voiceModel.measureId;
		this.name = voiceModel.name || '';
		this.voiceType = voiceModel.voiceType;
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
			note.scoreId = this.scoreId;
			note.partId = this.partId;
			note.measureId = this.measureId;
			note.voiceId = this.id;
			note.isRest = true;
			note.startDiv = i * beatDurationDivs;
			note.durationDivs = beatDurationDivs;
			this.notes.push(note);
		}
	}
}
