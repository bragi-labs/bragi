import { Synth } from 'tone';

export class SoundHelper {
	static playShortNote(synth: Synth, noteName: string, octaveNumber: number) {
		synth.triggerAttackRelease(`${noteName}${octaveNumber}`, 0.25);
	}

	static startNote(synth: Synth, noteName: string, octaveNumber: number) {
		synth.triggerAttack(`${noteName}${octaveNumber}`);
	}

	static stopNote(synth: Synth, noteName: string, octaveNumber: number) {
		synth.triggerRelease(`${noteName}${octaveNumber}`);
	}
}
