import React, { useState, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import * as Tone from 'tone';
import { MusicalHelper } from '../services/musicalHelper';
import { SoundHelper } from '../services/soundHelper';
import { Typography } from '@material-ui/core';
import { FigurenotesHelper } from '../services/figurenotesHelper';

export interface PianoProps {
	smallPiano: boolean;
}

export const Piano = ({ smallPiano }: PianoProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			display: 'inline-block',
			opacity: 0.85,
			backgroundColor: '#111',
			userSelect: 'none',
			borderRadius: 8,
			padding: 32,
			'&.small-piano': {
				borderRadius: 4,
				padding: 16,
			},
		},
		controls: {
			display: 'flex',
			alignItems: 'center',
			height: 24,
			marginBottom: 4,
			borderRadius: 4,
			backgroundColor: '#222',
			padding: '0 6px',
		},
		powerSwitch: {
			display: 'flex',
			alignItems: 'center',
		},
		powerSwitchText: {
			margin: '0 4px',
			color: '#ccc',
			fontSize: 12,
		},
		fnSymbolsSwitch: {
			marginLeft: 32,
			display: 'flex',
			alignItems: 'center',
		},
		fnSymbolsSwitchText: {
			margin: '0 4px',
			color: '#ccc',
			fontSize: 12,
		},
		octaveSwitches: {
			marginLeft: 32,
			display: 'flex',
			alignItems: 'center',
			height: '100%',
		},
		octaveSwitchesText: {
			margin: '0 4px',
			color: '#ccc',
			fontSize: 12,
		},
		octaveSwitchLed: {
			margin: '0 2px',
		},
		keyboard: {
			position: 'relative',
			display: 'flex',
		},
		octave: {
			position: 'relative',
			backgroundRepeat: 'no-repeat',
			'&:nth-of-type(1)': {
				borderRadius: '4px 0 0 4px',
			},
			'&:nth-of-type(5)': {
				borderRadius: '0 4px 4px 0',
			},
			width: 318,
			height: 200,
			backgroundImage: 'url("/img/piano-octave.jpg")',
			backgroundPosition: '0 -64px',
			'.small-piano &': {
				width: 159,
				height: 100,
				backgroundSize: '159px 132px',
				backgroundPosition: '0 -32px',
			},
		},
		hideOctave: {
			width: '0 !important',
		},
		octaveKey: {
			position: 'absolute',
			color: '#333',
			bottom: 0,
			cursor: 'pointer',
		},
		whiteKey: {
			top: 0,
			bottom: 0,
			backgroundColor: '#000',
			opacity: 0,
			width: 318 / 7,
			'.small-piano &': {
				width: 159 / 7,
			},
			'&:hover': {
				opacity: 0.25,
			},
		},
		blackKey: {
			top: 0,
			backgroundColor: '#fff',
			opacity: 0,
			width: 318 / 10,
			height: 108,
			'.small-piano &': {
				width: 159 / 10,
				height: 54,
			},
			'&:hover': {
				opacity: 0.25,
			},
		},
		figureNoteSymbol: {
			position: 'absolute',
			bottom: 8,
			'.small-piano &': {
				bottom: 4,
			},
		},
		keyboardCover: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			backgroundColor: '#000',
			opacity: 0.5,
			transition: 'all 1s ease',
			height: 200,
			'.small-piano &': {
				height: 100,
			},
		},
		keyboardCoverOff: {
			height: '0 !important',
		},
	}));
	const classes = useStyles();

	const [powerOn, setPowerOn] = useState(false);
	const [fnSymbolsOn, setFnSymbolsOn] = useState(true);
	const [synth, setSynth] = useState<any>(null);
	const [octaves, setOctaves] = useState<boolean[]>([true, true, true, true, true]);

	useEffect(() => {
		if (powerOn) {
			setSynth(new Tone.PolySynth().toDestination());
		} else {
			setSynth(null);
		}
	}, [powerOn]);

	const whiteKeys = MusicalHelper.getWhiteIndices().map((i, index) => {
		return {
			noteName: MusicalHelper.getNoteNameByIndex(i),
			left: smallPiano ? (index * 159) / 7 : (index * 318) / 7,
		};
	});
	const blackKeys = MusicalHelper.getBlackIndices().map((i, index) => {
		return {
			noteName: MusicalHelper.getNoteNameByIndex(i),
			left: smallPiano ? [12, 40, 80, 105, 130][index] : [24, 80, 160, 210, 260][index],
		};
	});

	const togglePower = useCallback(() => {
		setPowerOn((status) => !status);
	}, []);

	const toggleFnSymbols = useCallback(() => {
		setFnSymbolsOn((status) => !status);
	}, []);

	const toggleOctave = useCallback(
		(event) => {
			if (!powerOn) {
				return;
			}
			const newOctaves = [...octaves];
			const index = event.currentTarget.dataset['octaveIndex'];
			newOctaves[index] = !newOctaves[index];
			setOctaves(newOctaves);
		},
		[powerOn, octaves],
	);

	const startNote = useCallback(
		(event) => {
			if (!synth) {
				return;
			}
			SoundHelper.startNote(synth, event.currentTarget.dataset['noteName'], event.currentTarget.dataset['octaveNumber']);
		},
		[synth],
	);

	const stopNote = useCallback(
		(event) => {
			if (!synth) {
				return;
			}
			SoundHelper.stopNote(synth, event.currentTarget.dataset['noteName'], event.currentTarget.dataset['octaveNumber']);
		},
		[synth],
	);

	const enterNote = useCallback(
		(event) => {
			if (!synth) {
				return;
			}
			const isMouseButtonPressed = 'buttons' in event ? event.buttons === 1 : (event.which || event.button) === 1;
			if (isMouseButtonPressed) {
				SoundHelper.startNote(synth, event.currentTarget.dataset['noteName'], event.currentTarget.dataset['octaveNumber']);
			}
		},
		[synth],
	);

	return (
		<Box id="Piano" className={`${classes.root} ${smallPiano ? 'small-piano' : ''}`}>
			<Box className={classes.controls}>
				<Box className={classes.powerSwitch}>
					<Box onClick={togglePower} className={`led ${powerOn ? 'led--on' : 'led--off'}`} />
					<Typography className={classes.powerSwitchText}>Power</Typography>
				</Box>
				<Box className={classes.fnSymbolsSwitch}>
					<Box
						onClick={toggleFnSymbols}
						className={`led ${powerOn && fnSymbolsOn ? 'led--on' : ''} ${powerOn && !fnSymbolsOn ? 'led--off' : ''} ${powerOn ? '' : 'pointer-events-none'}`}
					/>
					<Typography className={classes.fnSymbolsSwitchText}>Figurenotes</Typography>
				</Box>
				<Box className={classes.octaveSwitches}>
					{octaves.map((octave, i) => (
						<Box
							key={i}
							onClick={toggleOctave}
							data-octave-index={i}
							className={`${classes.octaveSwitchLed} led ${powerOn && octave ? 'led--on' : ''} ${powerOn && !octave ? 'led--off' : ''} ${
								powerOn ? '' : 'pointer-events-none'
							}`}
						/>
					))}
					<Typography className={classes.octaveSwitchesText}>Octaves</Typography>
				</Box>
			</Box>
			<Box className={classes.keyboard}>
				{octaves.map((oct, i) => (
					<Box key={i} className={`${classes.octave} ${oct ? '' : classes.hideOctave}`}>
						{whiteKeys.map((whiteKey, j) => (
							<Box key={j}>
								<Box
									className={`${classes.figureNoteSymbol} ${oct && fnSymbolsOn ? '' : 'display-none'}`}
									style={{
										...FigurenotesHelper.getSymbolStyle(
											FigurenotesHelper.getNoteColor(whiteKey.noteName),
											FigurenotesHelper.getOctaveShape(i + 2),
											smallPiano ? 14 : 28,
										),
										left: whiteKey.left + (smallPiano ? 4 : 8),
									}}
								/>
								<Box
									onMouseDown={startNote}
									onMouseUp={stopNote}
									onMouseEnter={enterNote}
									onMouseLeave={stopNote}
									data-note-name={whiteKey.noteName}
									data-octave-number={i + 2}
									className={`${classes.octaveKey} ${classes.whiteKey}`}
									style={{ left: whiteKey.left }}
								/>
							</Box>
						))}
						{blackKeys.map((blackKey, j) => (
							<Box
								key={j}
								onMouseDown={startNote}
								onMouseUp={stopNote}
								onMouseEnter={enterNote}
								onMouseLeave={stopNote}
								data-note-name={blackKey.noteName}
								data-octave-number={i + 2}
								className={`${classes.octaveKey} ${classes.blackKey}`}
								style={{ left: blackKey.left }}
							/>
						))}
					</Box>
				))}
				<Box className={`${classes.keyboardCover} ${powerOn ? classes.keyboardCoverOff : ''}`} />
			</Box>
		</Box>
	);
};
