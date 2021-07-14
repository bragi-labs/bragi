import React, { useCallback, useEffect, useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { IconButton, TextField, Typography } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { ScoreModel } from '../../model/scoreModel';
import { DraggedItemType } from '../../atoms/draggedItemAtom';
import { DraggablePanel } from '../../components/DraggablePanel';
import { Music } from '../../model/music';

export interface PlayerPanelProps {
	score: ScoreModel;
}

export const PlayerPanel = ({ score }: PlayerPanelProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'absolute',
			width: 239,
			backgroundColor: '#222',
			borderRadius: 4,
			padding: 4,
			userSelect: 'none',
		},
		rootCollapsed: {
			width: 160,
			paddingBottom: 0,
		},
		expandCollapseButton: {
			position: 'absolute',
			top: 3,
			right: 6,
			cursor: 'pointer',
			color: '#ccc',
		},
		content: {
			display: 'grid',
			gridTemplate: 'auto / 1fr',
			gap: '12px 0',
			backgroundColor: '#444',
			padding: 8,
		},
		contentCollapsed: {
			height: 0,
			padding: 0,
			overflow: 'hidden',
		},
		panel: {
			display: 'inline-flex',
			alignItems: 'center',
			height: 32,
			borderRadius: 16,
			backgroundColor: '#333',
			padding: '0 16px 0 4px',
		},
		buttonsRow: {
			display: 'flex',
			justifyContent: 'space-between',
		},
		actionButton: {
			width: 24,
			height: 24,
			textAlign: 'center',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			color: '#ccc',
			'&:hover': {
				color: '#fff',
			},
			'&.disabled': {
				pointerEvents: 'none',
				color: '#666',
			},
		},
		tempoField: {
			height: 16,
			marginLeft: 8,
			width: 24,
			'& .MuiInputBase-input': {
				fontSize: 14,
				padding: 0,
			},
			'& .MuiInput-underline:after': {
				borderBottomColor: '#fff',
			},
		},
		panelText: {
			marginLeft: 8,
			color: '#aaa',
			transition: 'all 0.2s ease-in-out',
			'&.disabled': {
				color: '#666',
				pointerEvents: 'none',
			},
		},
	}));
	const classes = useStyles();

	const [isPlaying, setIsPLaying] = useState(false);
	const [canPlay, setCanPlay] = useState(false);
	const [canStop, setCanStop] = useState(false);
	const [tempoBpm, setTempoBpm] = useState<number>(120);
	const draggablePanelContentRef = useRef(null);

	const [isExpanded, setIsExpanded] = useState(true);
	const handleClickExpand = useCallback(function handleClickExpand() {
		setIsExpanded(true);
	}, []);
	const handleClickCollapse = useCallback(function handleClickCollapse() {
		setIsExpanded(false);
	}, []);

	// const getSelectedMeasures = useCallback(
	// 	function getSelectedMeasures() {
	// 		if (!score || !selection) {
	// 			return [];
	// 		}
	// 		const measures: MeasureModel[] = [];
	// 		selection.forEach((item) => {
	// 			const m = Score.findMeasure(score, item.measureId);
	// 			if (m) {
	// 				measures.push(m);
	// 			}
	// 		});
	// 		return measures;
	// 	},
	// 	[score, selection],
	// );

	useEffect(
		function enableMeasurePanelActions() {
			if (score && score.music && score.music.measures) {
				const exampleMeasure = Music.getExampleMeasure(score.music);
				setTempoBpm(exampleMeasure.tempoBpm);
			}
		},
		[score],
	);

	useEffect(
		function enableMeasurePanelActions() {
			setCanPlay(!isPlaying);
			setCanStop(isPlaying);
		},
		[tempoBpm, isPlaying],
	);

	const handleClickPlay = useCallback(function handleClickPlay() {
		setIsPLaying(true);
	}, []);

	const handleClickStop = useCallback(function handleClickPlay() {
		setIsPLaying(false);
	}, []);

	const handleChangeTempoBpm = useCallback(function handleChangeTempoBpm(e: any) {
		setTempoBpm((curTempo) => {
			return isNaN(e.target.value) ? curTempo : Math.max(0, Math.min(999, Number(e.target.value)));
		});
	}, []);

	return (
		<div id="PlayerPanel" ref={draggablePanelContentRef} className={`${classes.root} ${isExpanded ? '' : classes.rootCollapsed}`}>
			<DraggablePanel title="Player" contentRef={draggablePanelContentRef} draggedItemType={DraggedItemType.MEASURE_PANEL} initialZIndex={20} />
			{!isExpanded && <ExpandMoreIcon onClick={handleClickExpand} className={classes.expandCollapseButton} />}
			{isExpanded && <ExpandLessIcon onClick={handleClickCollapse} className={classes.expandCollapseButton} />}
			<Box className={`${classes.content} ${isExpanded ? '' : classes.contentCollapsed}`}>
				<Box className={classes.buttonsRow}>
					<Box className={classes.panel}>
						<IconButton onClick={handleClickPlay} disabled={!canPlay} className={classes.actionButton}>
							<PlayArrowIcon titleAccess="Play" />
						</IconButton>
						<IconButton onClick={handleClickStop} disabled={!canStop} className={classes.actionButton} style={{ marginLeft: '4px' }}>
							<StopIcon titleAccess="Stop" />
						</IconButton>
					</Box>
					<Box className={classes.panel}>
						<TextField value={tempoBpm} onChange={handleChangeTempoBpm} disabled={!canPlay} placeholder="120" label="" className={classes.tempoField} />
						<Typography variant="body1" className={`${classes.panelText} ${canPlay ? '' : 'disabled'}`}>
							bpm
						</Typography>
					</Box>
				</Box>
			</Box>
		</div>
	);
};
