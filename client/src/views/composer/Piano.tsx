import React, { memo, useState, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import * as Tone from 'tone';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';

export const Piano = memo(() => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			display: 'inline-flex',
			userSelect: 'none',
			justifyContent: 'flex-start',
			alignItems: 'flex-end',
			marginTop: 16,
			opacity: 0.8,
			'@media print': {
				display: 'none',
			},
		},
		keyboard: {
			height: 100,
			display: 'flex',
			borderRadius: '16',
		},
		octave: {
			position: 'relative',
			width: 159,
			height: 100,
			backgroundImage: 'url("/img/piano-small.jpg")',
			backgroundPosition: '0 -32px',
			backgroundRepeat: 'no-repeat',
			'&:first-of-type': {
				borderRadius: '4px 0 0 4px',
			},
			'&:last-of-type': {
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
	}));
	const classes = useStyles();

	const [synth /*,setSynth*/] = useState<any>(new Tone.PolySynth().toDestination());

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

	const StartNote = useCallback(
		(event) => {
			SoundHelper.startNote(synth, event.currentTarget.dataset['noteName'], event.currentTarget.dataset['octaveNumber']);
		},
		[synth],
	);

	const StopNote = useCallback(
		(event) => {
			SoundHelper.stopNote(synth, event.currentTarget.dataset['noteName'], event.currentTarget.dataset['octaveNumber']);
		},
		[synth],
	);

	const enterNote = useCallback(
		(event) => {
			const isMouseButtonPressed = 'buttons' in event ? event.buttons === 1 : (event.which || event.button) === 1;
			if (isMouseButtonPressed) {
				SoundHelper.startNote(synth, event.currentTarget.dataset['noteName'], event.currentTarget.dataset['octaveNumber']);
			}
		},
		[synth],
	);

	return (
		<Box id="Piano" className={classes.root}>
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
			</Box>
		</Box>
	);
});
