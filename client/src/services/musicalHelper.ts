export class MusicalHelper {
	static minOctave = 2;
	static maxOctave = 6;
	static getNoteNameByIndex(index: number, useSharps = true): string {
		if (index >= 0 && index <= 11) {
			return useSharps ? ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][index] : ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'][index];
		} else {
			return '';
		}
	}
	static getIndexByNoteName(noteName: string): number {
		const notes = [['C'], ['C#', 'Db'], ['D'], ['D#', 'Eb'], ['E'], ['F'], ['F#', 'Gb'], ['G'], ['G#', 'Ab'], ['A'], ['A#', 'Bb'], ['B']];
		return notes.findIndex((ns) => ns.includes(noteName));
	}
	static getWhiteIndices(): number[] {
		return [0, 2, 4, 5, 7, 9, 11];
	}
	static getBlackIndices(): number[] {
		return [1, 3, 6, 8, 10];
	}
	static parseNote(noteFullName: string): { step: string; alter: string; octave: number } {
		if (!noteFullName) {
			return {
				step: '',
				alter: '',
				octave: -1,
			};
		}
		if (noteFullName.length === 1) {
			return {
				step: noteFullName[0],
				alter: '',
				octave: -1,
			};
		}
		if (noteFullName.length === 2 && (noteFullName[1] === '#' || noteFullName[1] === 'b')) {
			return {
				step: noteFullName[0],
				alter: noteFullName[1],
				octave: -1,
			};
		}
		if (noteFullName.length === 2) {
			return {
				step: noteFullName[0],
				alter: '',
				octave: Number(noteFullName[1]),
			};
		}
		if (noteFullName.length === 3) {
			return {
				step: noteFullName[0],
				alter: noteFullName[1],
				octave: Number(noteFullName[2]),
			};
		}
		return {
			step: '',
			alter: '',
			octave: -1,
		};
	}
	static getNoteFullNameFromParsedDetails(noteDetails: { step: string; alter: string; octave: number }) {
		return noteDetails.step + noteDetails.alter + (noteDetails.octave !== -1 ? noteDetails.octave : '');
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
	static isScaleUsesSharps(musicalScale: string): boolean {
		if (!musicalScale) {
			return true;
		}
		if (['C', 'Am'].includes(musicalScale)) {
			return true;
		}
		if (musicalScale.length === 1) {
			return musicalScale !== 'F';
		} else if (musicalScale.length === 2) {
			return ['Em', 'Bm'].includes(musicalScale);
		} else if (musicalScale.length === 3) {
			return musicalScale[1] === '#';
		} else {
			return true;
		}
	}
	static toggleSharpAndFlat(noteFullName: string) {
		const noteDetails = MusicalHelper.parseNote(noteFullName);
		if (!noteDetails.alter) {
			return noteFullName;
		}
		const index = MusicalHelper.getIndexByNoteName(noteDetails.step + noteDetails.alter);
		const noteName = MusicalHelper.getNoteNameByIndex(index, noteDetails.alter !== '#');
		return MusicalHelper.getNoteFullNameFromParsedDetails({
			step: noteName[0],
			alter: noteName[1],
			octave: noteDetails.octave,
		});
	}
	static changePitch(fullNoteName: string, musicalScale: string, pitchUp: boolean): string {
		const noteDetails = MusicalHelper.parseNote(fullNoteName);
		const curIndex = MusicalHelper.getIndexByNoteName(noteDetails.step + noteDetails.alter);
		if ((pitchUp && noteDetails.octave === MusicalHelper.maxOctave && curIndex === 11) || (!pitchUp && noteDetails.octave === MusicalHelper.minOctave && curIndex === 0)) {
			return fullNoteName;
		}
		const newIndex = (curIndex + (pitchUp ? 1 : -1) + 12) % 12;
		const useSharps = MusicalHelper.isScaleUsesSharps(musicalScale);
		const newNoteName = MusicalHelper.getNoteNameByIndex(newIndex, useSharps);
		let newOctave = noteDetails.octave;
		if (pitchUp && curIndex === 11) {
			newOctave++;
		} else if (!pitchUp && curIndex === 0) {
			newOctave--;
		}
		return newNoteName + newOctave;
	}
}
