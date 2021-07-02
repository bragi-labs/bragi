import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import * as Tone from 'tone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Score } from '../model/score';
import { uiSelection } from '../atoms/uiSelection';
import { MusicalHelper } from '../services/musicalHelper';
import { SoundHelper } from '../services/soundHelper';
import { Typography } from '@material-ui/core';
import { FigurenotesHelper } from '../services/figurenotesHelper';
import { DraggablePanel } from './DraggablePanel';
import { DraggedItem, uiDraggedItem } from '../atoms/uiDraggedItem';

export interface PianoProps {
	smallPiano: boolean;
	score?: Score;
	onUpdateScore?: () => void;
}

export const Piano = React.memo(({ smallPiano, score, onUpdateScore }: PianoProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'absolute',
			backgroundColor: '#222',
			userSelect: 'none',
			borderRadius: 8,
			padding: 24,
			'&.small-piano': {
				backgroundColor: '#222',
				borderRadius: 4,
				padding: 4,
			},
			//opacity: 0.9,
		},
		controls: {
			display: 'flex',
			alignItems: 'center',
			height: 24,
			borderTopLeftRadius: 4,
			borderTopRightRadius: 4,
			backgroundColor: '#444',
			padding: '0 6px',
			margin: '8px 8px 4px 8px',
			'&.small-piano': {
				margin: '0 8px 4px 8px',
			},
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
			padding: '0 8px 8px 8px',
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
			bottom: 7,
			'.small-piano &': {
				bottom: 3,
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

	const [draggedItem, setDraggedItem] = useRecoilState(uiDraggedItem);
	const resetDraggedItem = useResetRecoilState(uiDraggedItem);
	const [powerOn, setPowerOn] = useState(true);
	const [fnSymbolsOn, setFnSymbolsOn] = useState(true);
	const [synth, setSynth] = useState<any>(null);
	const [octaves, setOctaves] = useState<boolean[]>([false, true, true, true, false]);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const selection = useRecoilValue(uiSelection);

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
		(e) => {
			if (!powerOn) {
				return;
			}
			const newOctaves = [...octaves];
			const index = e.currentTarget.dataset['octaveIndex'];
			newOctaves[index] = !newOctaves[index];
			setOctaves(newOctaves);
		},
		[powerOn, octaves],
	);

	const startNote = useCallback(
		(noteName: string, octaveNumber: number) => {
			const noteFullName = noteName + octaveNumber;
			SoundHelper.startNote(noteFullName, synth);
			if (!score || selection.length !== 1) {
				return;
			}
			const note = Score.findNote(score, selection[0].noteId);
			if (!note) {
				return;
			}
			note.isRest = false;
			note.fullName = noteFullName;
			if (MusicalHelper.parseNote(noteFullName).alter === '#') {
				const measure = Score.findMeasure(score, note.measureId);
				if (measure && !MusicalHelper.isScaleUsesSharps(measure.musicalScale)) {
					note.fullName = MusicalHelper.toggleSharpAndFlat(note.fullName);
				}
			}
			if (onUpdateScore) {
				onUpdateScore();
			}
		},
		[score, selection, synth, onUpdateScore],
	);

	const stopNote = useCallback(
		(noteName: string, octaveNumber: number) => {
			SoundHelper.stopNote(noteName + octaveNumber, synth);
		},
		[synth],
	);

	const handleMouseDown = useCallback(
		(e) => {
			startNote(e.currentTarget.dataset['noteName'], e.currentTarget.dataset['octaveNumber']);
		},
		[startNote],
	);

	const handleMouseUp = useCallback(
		(e) => {
			stopNote(e.currentTarget.dataset['noteName'], e.currentTarget.dataset['octaveNumber']);
		},
		[stopNote],
	);

	const handleMouseEnter = useCallback(
		(e) => {
			const isMouseButtonPressed = 'buttons' in e ? e.buttons === 1 : (e.which || e.button) === 1;
			if (isMouseButtonPressed && draggedItem === DraggedItem.NA) {
				startNote(e.currentTarget.dataset['noteName'], e.currentTarget.dataset['octaveNumber']);
			}
		},
		[draggedItem, startNote],
	);

	const handleMouseLeave = useCallback(
		(e) => {
			stopNote(e.currentTarget.dataset['noteName'], e.currentTarget.dataset['octaveNumber']);
		},
		[stopNote],
	);

	const handleDragStart = useCallback(() => {
		setDraggedItem(DraggedItem.PIANO_PANEL);
	}, [setDraggedItem]);

	const handleDragMove = useCallback((deltaX: number, deltaY: number) => {
		setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }));
	}, []);

	const handleDragEnd = useCallback(() => {
		resetDraggedItem();
	}, [resetDraggedItem]);

	return (
		<Box
			id="Piano"
			className={`${classes.root} ${smallPiano ? 'small-piano' : ''}`}
			style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: draggedItem === DraggedItem.PIANO_PANEL ? 100 : 20 }}
		>
			{smallPiano && <DraggablePanel title="Piano" onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} />}
			<Box className={`${classes.controls} ${smallPiano ? 'small-piano' : ''}`}>
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
										...FigurenotesHelper.getSymbolStyle(`${whiteKey.noteName}${i + MusicalHelper.minOctave}`, smallPiano ? 16 : 32, 'px'),
										left: whiteKey.left + (smallPiano ? 3 : 7),
									}}
								/>
								<Box
									onMouseDown={handleMouseDown}
									onMouseUp={handleMouseUp}
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
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
								onMouseDown={handleMouseDown}
								onMouseUp={handleMouseUp}
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
								data-note-name={blackKey.noteName}
								data-octave-number={i + MusicalHelper.minOctave}
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
