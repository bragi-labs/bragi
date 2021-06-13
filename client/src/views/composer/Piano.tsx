import React, { useState, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import * as Tone from 'tone';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';
import { Typography } from '@material-ui/core';
import { FigurenotesHelper } from '../../services/figurenotesHelper';

export const Piano = () => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			display: 'inline-block',
			marginTop: 16,
			borderRadius: 4,
			opacity: 0.8,
			backgroundColor: '#111',
			padding: 16,
			userSelect: 'none',
			'@media print': {
				display: 'none',
			},
		},
		controls: {
			display: 'flex',
			alignItems: 'center',
			height: 24,
			marginBottom: 4,
			borderRadius: 4,
			backgroundColor: '#222',
		},
		powerSwitch: {
			display: 'flex',
			alignItems: 'center',
		},
		powerText: {
			margin: '0 6px',
			color: '#ccc',
			fontSize: 12,
		},
		octaveControls: {
			marginLeft: 40,
			display: 'flex',
			alignItems: 'center',
			height: '100%',
		},
		octaveSwitchesText: {
			margin: '0 6px',
			color: '#ccc',
			fontSize: 12,
		},
		octaveSwitchLed: {
			margin: '0 2px',
		},
		keyboard: {
			position: 'relative',
			height: 100,
			display: 'flex',
		},
		octave: {
			position: 'relative',
			width: 159,
			height: 100,
			backgroundImage: 'url("/img/piano-small.jpg")',
			backgroundPosition: '0 -32px',
			backgroundRepeat: 'no-repeat',
			//transition: 'all 0.1s ease',
			'&:nth-of-type(1)': {
				borderRadius: '4px 0 0 4px',
			},
			'&:nth-of-type(5)': {
				borderRadius: '0 4px 4px 0',
			},
		},
		hideOctave: {
			width: 0,
		},
		octaveKey: {
			position: 'absolute',
			color: '#333',
			bottom: 0,
			width: 22,
			cursor: 'pointer',
		},
		whiteKey: {
			width: 159 / 7,
			top: 0,
			bottom: 0,
			backgroundColor: '#000',
			opacity: 0,
			'&:hover': {
				opacity: 0.2,
			},
		},
		blackKey: {
			width: 18,
			top: 0,
			height: 54,
			backgroundColor: '#fff',
			opacity: 0,
			'&:hover': {
				opacity: 0.2,
			},
		},
		figureNoteSymbol: {
			position: 'absolute',
			bottom: 4,
			transition: 'all 1s ease',
		},
		keyboardCover: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			height: 100,
			backgroundColor: '#000',
			opacity: 0.6,
			transition: 'all 1s ease',
		},
		keyboardCoverOff: {
			height: 0,
		},
	}));
	const classes = useStyles();

	const [powerOn, setPowerOn] = useState(false);
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
			left: index * 22.7,
		};
	});
	const blackKeys = MusicalHelper.getBlackIndices().map((i, index) => {
		return {
			noteName: MusicalHelper.getNoteNameByIndex(i),
			left: [12, 40, 80, 105, 130][index],
		};
	});

	const togglePower = useCallback(() => {
		setPowerOn((status) => !status);
	}, []);

	const toggleOctave = useCallback(
		(event) => {
			const newOctaves = [...octaves];
			const index = event.currentTarget.dataset['octaveIndex'];
			newOctaves[index] = !newOctaves[index];
			setOctaves(newOctaves);
		},
		[octaves],
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
		<Box id="Piano" className={classes.root}>
			<Box className={classes.controls}>
				<Box className={classes.powerSwitch}>
					<Typography className={classes.powerText}>Power</Typography>
					<Box onClick={togglePower} className={`led ${powerOn ? 'led--on' : 'led--off'}`} />
				</Box>
				<Box className={classes.octaveControls}>
					<Typography className={classes.octaveSwitchesText}>Octaves</Typography>
					{octaves.map((octave, octaveIndex) => (
						<Box
							key={octaveIndex}
							onClick={toggleOctave}
							data-octave-index={octaveIndex}
							className={`${classes.octaveSwitchLed} led ${powerOn && octave ? 'led--on' : ''} ${powerOn && !octave ? 'led--off' : ''}`}
						/>
					))}
				</Box>
			</Box>
			<Box className={classes.keyboard}>
				{octaves.map((oct, octaveIndex) => (
					<Box key={octaveIndex} className={`${classes.octave} ${oct ? '' : classes.hideOctave}`}>
						{whiteKeys.map((whiteKey, j) => (
							<Box key={j}>
								<Box
									className={`${classes.figureNoteSymbol} ${oct ? '' : 'display-none'}`}
									style={{
										...FigurenotesHelper.getSymbolStyle(
											FigurenotesHelper.getNoteColor(whiteKey.noteName),
											FigurenotesHelper.getOctaveShape(octaveIndex + 2),
											14,
										),
										left: whiteKey.left + 4,
									}}
								/>
								<Box
									onMouseDown={startNote}
									onMouseUp={stopNote}
									onMouseEnter={enterNote}
									onMouseLeave={stopNote}
									data-note-name={whiteKey.noteName}
									data-octave-number={octaveIndex + 2}
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
								data-octave-number={octaveIndex + 2}
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
