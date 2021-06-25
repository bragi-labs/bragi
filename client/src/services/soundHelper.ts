import * as Tone from 'tone';
import { Synth } from 'tone';

export class SoundHelper {
	static synth = new Tone.PolySynth().toDestination();
	static playShortNote(noteFullName: string, synth?: Synth) {
		if (synth) {
			synth.triggerAttackRelease(noteFullName, 0.1);
		} else {
			SoundHelper.synth.triggerAttackRelease(noteFullName, 0.1);
		}
	}
	static startNote(noteFullName: string, synth: Synth) {
		synth.triggerAttack(noteFullName);
	}
	static stopNote(noteFullName: string, synth: Synth) {
		synth.triggerRelease(noteFullName);
	}
}
