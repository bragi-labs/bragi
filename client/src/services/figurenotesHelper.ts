export enum FnOctaveShape {
	'X' = 'X',
	'SQUARE' = 'SQUARE',
	'CIRCLE' = 'CIRCLE',
	'TRIANGLE' = 'TRIANGLE',
	'RHOMBUS' = 'RHOMBUS',
	'NA' = 'NA',
}

export class FigurenotesHelper {
	static getOctaveShape(octaveNumber: number): FnOctaveShape {
		if (octaveNumber >= 0 && octaveNumber <= 6) {
			return [FnOctaveShape.NA, FnOctaveShape.NA, FnOctaveShape.X, FnOctaveShape.SQUARE, FnOctaveShape.CIRCLE, FnOctaveShape.TRIANGLE, FnOctaveShape.RHOMBUS][octaveNumber];
		} else {
			return FnOctaveShape.NA;
		}
	}
	static getNoteColor(noteName: string): string {
		return (
			{
				C: '#c33',
				D: '#963',
				E: '#999',
				F: '#39c',
				G: '#333',
				A: '#c93',
				B: '#693',
			}[noteName[0]] || ''
		);
	}
	static getWhiteIndices(): number[] {
		return [0, 2, 4, 5, 7, 9, 11];
	}
	static getBlackIndices(): number[] {
		return [1, 3, 6, 8, 10];
	}
	static getSymbolStyle(noteColor: string, octaveShape: FnOctaveShape, size: number, units: string) {
		let style: any;
		switch (octaveShape) {
			case FnOctaveShape.X: {
				style = {
					width: `${size}${units}`,
					height: `${size}${units}`,
					background: `linear-gradient(45deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, ${noteColor} 35%, ${noteColor} 65%, rgba(0,0,0,0) 65%, rgba(0,0,0,0) 100%), linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, ${noteColor} 35%, ${noteColor} 65%, rgba(0,0,0,0) 65%, rgba(0,0,0,0) 100%)`,
				};
				break;
			}
			case FnOctaveShape.SQUARE: {
				style = {
					width: `${size}${units}`,
					height: `${size}${units}`,
					backgroundColor: `${noteColor}`,
					borderRadius: `2px`,
				};
				break;
			}
			case FnOctaveShape.CIRCLE: {
				style = {
					width: `${size}${units}`,
					height: `${size}${units}`,
					backgroundColor: `${noteColor}`,
					borderRadius: `50%`,
				};
				break;
			}
			case FnOctaveShape.TRIANGLE: {
				style = {
					width: `0`,
					height: `0`,
					borderLeft: `${size / 2}${units} solid transparent`,
					borderRight: `${size / 2}${units} solid transparent`,
					borderBottom: `${size}${units} solid ${noteColor}`,
				};
				break;
			}
			case FnOctaveShape.RHOMBUS: {
				style = {
					width: `${size}${units}`,
					height: `${size}${units}`,
					backgroundColor: `${noteColor}`,
					transform: `rotate(45deg) scale(0.71)`,
					transformOrigin: `${size / 2}${units} ${size / 2}${units}`,
				};
				break;
			}
			default: {
				style = {};
				break;
			}
		}

		return style;
	}
}
