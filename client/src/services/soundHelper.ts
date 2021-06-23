import * as Tone from 'tone';
import { Synth } from 'tone';

export class SoundHelper {
	static playShortNote(noteFullName: string, synth?: Synth) {
		if (synth) {
			synth.triggerAttackRelease(noteFullName, 0.1);
		} else {
			new Tone.Synth().toDestination().triggerAttackRelease(noteFullName, 0.1);
		}
	}
	static startNote(noteFullName: string, synth: Synth) {
		synth.triggerAttack(noteFullName);
	}
	static stopNote(noteFullName: string, synth: Synth) {
		synth.triggerRelease(noteFullName);
	}
}
