import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as Tone from 'tone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { MusicalHelper } from '../services/musicalHelper';
import { SoundHelper } from '../services/soundHelper';
import { FigurenotesHelper } from '../services/figurenotesHelper';
import { draggedItemAtom, DraggedItemType } from '../atoms/draggedItemAtom';
import { DraggablePanel } from './DraggablePanel';

export interface PianoProps {
	smallPiano: boolean;
	onPianoNote?: (noteFullName: string) => void;
}

export const Piano = React.memo(({ smallPiano, onPianoNote }: PianoProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'absolute',
			left: 0,
			top: 0,
			backgroundColor: '#222',
			userSelect: 'none',
			borderRadius: 8,
			padding: 24,
			'&.small-piano': {
				backgroundColor: '#222',
				borderRadius: 4,
				padding: 4,
			},
		},
		rootCollapsed: {
			width: 200,
			paddingBottom: '0 !important',
		},
		expandCollapseButton: {
			position: 'absolute',
			top: 3,
			right: 6,
			cursor: 'pointer',
			color: '#ccc',
		},
		content: {},
		contentCollapsed: {
			height: 0,
			padding: 0,
			overflow: 'hidden',
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
			display: 'flex',
			alignItems: 'center',
			marginLeft: 32,
			'&.small-piano': {
				marginLeft: 16,
			},
		},
		fnSymbolsSwitchText: {
			margin: '0 4px',
			color: '#ccc',
			fontSize: 12,
		},
		octaveSwitches: {
			display: 'flex',
			alignItems: 'center',
			height: '100%',
			marginLeft: 32,
			'&.small-piano': {
				marginLeft: 16,
			},
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
		hideContent: {
			width: '0 !important',
			overflow: 'hidden',
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

	const [powerOn, setPowerOn] = useState(true);
	const [fnSymbolsOn, setFnSymbolsOn] = useState(true);
	const [synth, setSynth] = useState<any>(null);
	const [octaves, setOctaves] = useState<boolean[]>([false, true, true, true, false]);

	const draggedItem = useRecoilValue(draggedItemAtom);
	const draggablePanelContentRef = useRef(null);

	const [isExpanded, setIsExpanded] = useState(true);
	const handleClickExpand = useCallback(function handleClickExpand() {
		setIsExpanded(true);
	}, []);
	const handleClickCollapse = useCallback(function handleClickCollapse() {
		setIsExpanded(false);
	}, []);

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
			if (onPianoNote) {
				onPianoNote(noteFullName);
			}
		},
		[synth, onPianoNote],
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
			if (isMouseButtonPressed && draggedItem === DraggedItemType.NA) {
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

	return (
		<div id="Piano" ref={draggablePanelContentRef} className={`${classes.root} ${isExpanded ? '' : classes.rootCollapsed} ${smallPiano ? 'small-piano' : ''}`}>
			{smallPiano && <DraggablePanel contentRef={draggablePanelContentRef} title="Piano" draggedItemType={DraggedItemType.PIANO_PANEL} initialZIndex={40} />}
			{!isExpanded && <ExpandMoreIcon onClick={handleClickExpand} className={classes.expandCollapseButton} />}
			{isExpanded && <ExpandLessIcon onClick={handleClickCollapse} className={classes.expandCollapseButton} />}
			<Box className={`${classes.content} ${isExpanded ? '' : classes.contentCollapsed}`}>
				<Box className={`${classes.controls} ${smallPiano ? 'small-piano' : ''}`}>
					<Box className={classes.powerSwitch}>
						<Box onClick={togglePower} className={`led ${powerOn ? 'led--on' : 'led--off'}`} />
						<Typography className={classes.powerSwitchText}>Power</Typography>
					</Box>
					<Box className={`${classes.fnSymbolsSwitch} ${smallPiano ? 'small-piano' : ''}`}>
						<Box
							onClick={toggleFnSymbols}
							className={`led ${powerOn && fnSymbolsOn ? 'led--on' : ''} ${powerOn && !fnSymbolsOn ? 'led--off' : ''} ${powerOn ? '' : 'pointer-events-none'}`}
						/>
						<Typography className={classes.fnSymbolsSwitchText}>Figurenotes</Typography>
					</Box>
					<Box className={`${classes.octaveSwitches} ${smallPiano ? 'small-piano' : ''}`}>
						{octaves.map((oct, octIndex) => (
							<Box
								key={octIndex}
								onClick={toggleOctave}
								data-octave-index={octIndex}
								className={`${classes.octaveSwitchLed} led ${powerOn && oct ? 'led--on' : ''} ${powerOn && !oct ? 'led--off' : ''} ${
									powerOn ? '' : 'pointer-events-none'
								}`}
							/>
						))}
						<Typography className={classes.octaveSwitchesText}>Octaves</Typography>
					</Box>
				</Box>
				<Box className={classes.keyboard}>
					{octaves.map((oct, octIndex) => (
						<Box key={octIndex} className={`${classes.octave} ${oct ? '' : classes.hideContent}`}>
							{whiteKeys.map((wk) => (
								<Box key={wk.noteName}>
									<Box
										className={`${classes.figureNoteSymbol} ${oct && fnSymbolsOn ? '' : 'display-none'}`}
										style={{
											...FigurenotesHelper.getSymbolStyle(`${wk.noteName}${octIndex + MusicalHelper.minOctave}`, smallPiano ? 16 : 32, 'px'),
											left: wk.left + (smallPiano ? 3 : 7),
										}}
									/>
									<Box
										onMouseDown={handleMouseDown}
										onMouseUp={handleMouseUp}
										onMouseEnter={handleMouseEnter}
										onMouseLeave={handleMouseLeave}
										data-note-name={wk.noteName}
										data-octave-number={octIndex + MusicalHelper.minOctave}
										className={`${classes.octaveKey} ${classes.whiteKey}`}
										style={{ left: wk.left }}
									/>
								</Box>
							))}
							{blackKeys.map((bk) => (
								<Box
									key={bk.noteName}
									onMouseDown={handleMouseDown}
									onMouseUp={handleMouseUp}
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
									data-note-name={bk.noteName}
									data-octave-number={octIndex + MusicalHelper.minOctave}
									className={`${classes.octaveKey} ${classes.blackKey}`}
									style={{ left: bk.left }}
								/>
							))}
						</Box>
					))}
					<Box className={`${classes.keyboardCover} ${powerOn ? classes.keyboardCoverOff : ''}`} />
				</Box>
			</Box>
		</div>
	);
});
