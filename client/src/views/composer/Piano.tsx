import React, { memo, useState, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import * as Tone from 'tone';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';
import { Typography } from '@material-ui/core';

export const Piano = memo(() => {
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
		led: {
			position: 'relative',
			margin: '0 4px 0 6px',
			width: 12,
			height: 12,
			borderRadius: '50%',
			backgroundColor: '#c00',
			boxShadow: '0 0 10px #c00',
			transition: 'all 0.5s ease-in-out',
			cursor: 'pointer',
			'&:hover': {
				opacity: 0.8,
			},
			'&:before': {
				content: '""',
				position: 'absolute',
				top: 2,
				left: 2,
				width: 4,
				height: 4,
				borderRadius: '50%',
				backgroundColor: '#f00',
				boxShadow: '0 0 4px #f00',
				transition: 'all 0.5s ease-in-out',
			},
		},
		ledOn: {
			backgroundColor: '#0c0',
			boxShadow: '0 0 10px #0c0',
			'&:before': {
				backgroundColor: '#0f0',
				boxShadow: '0 0 4px #0f0',
			},
		},
		powerText: {
			color: '#ccc',
			fontSize: 12,
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
			'&:nth-of-type(1)': {
				borderRadius: '4px 0 0 4px',
			},
			'&:nth-of-type(5)': {
				borderRadius: '0 4px 4px 0',
			},
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

	useEffect(() => {
		if (powerOn) {
			setSynth(new Tone.PolySynth().toDestination());
		} else {
			setSynth(null);
		}
	}, [powerOn]);

	const octaves = [2, 3, 4, 5, 6].map((o) => ({ number: o }));

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

	const StartNote = useCallback(
		(event) => {
			if (!synth) {
				return;
			}
			SoundHelper.startNote(synth, event.currentTarget.dataset['noteName'], event.currentTarget.dataset['octaveNumber']);
		},
		[synth],
	);

	const StopNote = useCallback(
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
				<Box onClick={togglePower} className={`${classes.led} ${powerOn ? classes.ledOn : ''}`} />
				<Typography className={classes.powerText}>Power</Typography>
			</Box>
			<Box className={classes.keyboard}>
				{octaves.map((octave, i) => (
					<Box key={i} className={classes.octave}>
						{whiteKeys.map((whiteKey, j) => (
							<Box
								key={j}
								onMouseDown={StartNote}
								onMouseUp={StopNote}
								onMouseEnter={enterNote}
								onMouseLeave={StopNote}
								data-note-name={whiteKey.noteName}
								data-octave-number={octave.number}
								className={`${classes.octaveKey} ${classes.whiteKey}`}
								style={{ left: whiteKey.left }}
							/>
						))}
						{blackKeys.map((blackKey, j) => (
							<Box
								key={j}
								onMouseDown={StartNote}
								onMouseUp={StopNote}
								onMouseEnter={enterNote}
								onMouseLeave={StopNote}
								data-note-name={blackKey.noteName}
								data-octave-number={octave.number}
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
});
