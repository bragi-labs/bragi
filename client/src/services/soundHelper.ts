import * as Tone from 'tone';
import { PolySynth, Synth } from 'tone';

export class SoundHelper {
	static synth: PolySynth = new Tone.PolySynth().toDestination();

	static getSynth(synth?: Synth) {
		return synth || SoundHelper.synth || new Tone.PolySynth().toDestination();
	}
	static start() {
		Tone.start().then(() => {});
	}
	static playShortNote(noteFullName: string, synth?: Synth) {
		SoundHelper.getSynth(synth).triggerAttackRelease(noteFullName, 0.1);
	}
	static startNote(noteFullName: string, synth?: Synth) {
		SoundHelper.getSynth(synth).triggerAttack(noteFullName);
	}
	static stopNote(noteFullName: string, synth?: Synth) {
		SoundHelper.getSynth(synth).triggerRelease(noteFullName);
	}
	static playMusic(notesForPlayer: any[], tempoBpm: number) {
		const synth = SoundHelper.getSynth();
		const q = 60 / 24 / tempoBpm;
		Tone.getTransport().stop();
		Tone.getTransport().cancel();
		notesForPlayer.forEach((n) => {
			Tone.getTransport().schedule((time) => {
				synth.triggerAttackRelease(n.fullName, q * n.durationDivs, time + q * n.divsFromFirstMeasureMusicStart);
			}, 0);
		});
		Tone.getTransport().start();
	}
	static stopMusic() {
		Tone.getTransport().stop();
		Tone.getTransport().cancel();
	}
}
