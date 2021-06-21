export class MusicalHelper {
	static getNoteNameByIndex(index: number, useSharps = true): string {
		if (index >= 0 && index <= 11) {
			return useSharps ? ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][index] : ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'][index];
		} else {
			return '';
		}
	}
	static getIndexByNoteName(noteName: string): number {
		return (
			{
				C: 0,
				'C#': 1,
				'Db#': 1,
				D: 2,
				'D#': 3,
				Eb: 3,
				E: 4,
				F: 5,
				'F#': 6,
				Gb: 6,
				G: 7,
				'G#': 8,
				Ab: 8,
				A: 9,
				'A#': 10,
				Bb: 10,
				B: 11,
			}[noteName] || -1
		);
	}
	static getWhiteIndices(): number[] {
		return [0, 2, 4, 5, 7, 9, 11];
	}
	static getBlackIndices(): number[] {
		return [1, 3, 6, 8, 10];
	}
	static getNoteOctave(noteFullName: string): number {
		if (noteFullName && noteFullName.length === 2) {
			return Number(noteFullName[1]);
		}
		if (noteFullName && noteFullName.length === 3) {
			return Number(noteFullName[2]);
		}
		return 0;
	}
	static parseTimeSignature(timeSignature: string) {
		const beats = parseInt(timeSignature[0]);
		const beatType = parseInt(timeSignature[2]);
		const measureDurationDivs = beats * (96 / beatType);
		const beatDurationDivs = measureDurationDivs / beats;
		return {
			beats,
			beatType,
			measureDurationDivs,
			beatDurationDivs,
		};
	}
}
