import * as Tone from 'tone';
import { PolySynth } from 'tone';

export class SoundHelper {
	static synth: PolySynth = new Tone.PolySynth().toDestination();
	static start() {
		Tone.start().then(() => {});
	}
	static playShortNote(noteFullName: string) {
		SoundHelper.synth.triggerAttackRelease(noteFullName, 0.1);
	}
	static startNote(noteFullName: string) {
		SoundHelper.synth.triggerAttack(noteFullName);
	}
	static stopNote(noteFullName: string) {
		SoundHelper.synth.triggerRelease(noteFullName);
	}
	static playMusic(notesForPlayer: any[], tempoBpm: number) {
		const q = 60 / 24 / tempoBpm;
		const time = Tone.now();
		notesForPlayer.forEach((n) => {
			SoundHelper.synth.triggerAttackRelease(n.fullName, q * n.durationDivs, time + q * n.divsFromFirstMeasureMusicStart);
		});
	}
	static stopMusic() {
		const time = Tone.now();
		SoundHelper.synth.releaseAll(time);
	}
}
