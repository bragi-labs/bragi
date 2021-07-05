import React, { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { IconButton, Slider, Typography } from '@material-ui/core';
import { DraggedItemType } from '../../atoms/uiDraggedItem';
import { Music } from '../../model/music';
import { DraggablePanel } from '../../components/DraggablePanel';
import { uiSelection } from '../../atoms/uiSelection';
import { PartType } from '../../model/scoreModel';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useDraggablePanel } from '../../components/useDraggablePanel';

export interface PartsPanelProps {
	music: Music;
	onUpdateScore: () => void;
}

export const PartsPanel = ({ music, onUpdateScore }: PartsPanelProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'absolute',
			width: 501,
			backgroundColor: '#222',
			borderRadius: 4,
			padding: 4,
			userSelect: 'none',
		},
		content: {
			display: 'grid',
			gridTemplate: 'auto auto / 1fr',
			gap: '1px 0',
			backgroundColor: '#444',
			padding: 24,
		},
		partRow: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			height: 32,
			backgroundColor: '#333',
			padding: '0 4px',
		},
		partRowLeftSection: {
			display: 'flex',
			alignItems: 'center',
		},
		partRowRightSection: {
			display: 'flex',
			alignItems: 'center',
		},
		partName: {
			marginLeft: 4,
			color: '#aaa',
			transition: 'all 0.2s ease-in-out',
			'&.selected': {
				color: '#fa3',
			},
			'&.disabled': {
				color: '#666',
				pointerEvents: 'none',
			},
		},
		buttonText: {
			color: '#aaa',
			transition: 'all 0.2s ease-in-out',
			'&.selected': {
				color: '#fa3',
			},
			marginLeft: 2,
			'&:not(.disabled)': {
				cursor: 'pointer',
			},
			'&:not(.disabled):hover': {
				color: '#fff',
			},
			'&.disabled': {
				color: '#666',
				pointerEvents: 'none',
			},
		},
		actionButton: {
			width: 24,
			height: 24,
			marginRight: 8,
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
		smallActionButton: {
			'&:first-of-type': {
				marginRight: 0,
			},
		},
		textButton: {
			marginLeft: 2,
			transition: 'all 0.2s ease-in-out',
			cursor: 'pointer',
			color: '#999',
			'&:hover': {
				color: '#fff',
			},
		},
		noteNameButton: {
			margin: '0 10px 0 0',
			width: 24,
			borderRadius: 4,
			textAlign: 'center',
			color: '#ccc',
			//border: '1px solid #ccc',
		},
		noteNameButtonActive: {
			backgroundColor: '#666',
		},
		boldButton: {
			margin: '0 10px 0 0',
			width: 24,
			borderRadius: 4,
			textAlign: 'center',
			color: '#ccc',
			fontWeight: 900,
		},
		boldButtonActive: {
			backgroundColor: '#666',
		},
		slider: {
			position: 'relative',
			top: 2,
			width: 100,
			marginLeft: 12,
			'& .MuiSlider-rail': {
				color: '#ccc',
			},
			'& .MuiSlider-root': {
				color: '#fff',
			},
			'& .MuiSlider-thumb': {
				boxShadow: 'none',
			},
			'& .MuiSlider-markLabel': {
				color: '#aaa',
			},
			'& .MuiSlider-markLabelActive': {
				color: '#fff',
			},
			'& .MuiSlider-root.Mui-disabled': {
				opacity: 0.5,
				'& .MuiSlider-thumb': {
					color: '#aaa',
				},
				'& .MuiSlider-markLabelActive': {
					color: '#aaa',
				},
			},
		},
	}));
	const classes = useStyles();

	const selection = useRecoilValue(uiSelection);

	const { draggedItem, position, setPosition } = useDraggablePanel();
	const handleDragMove = useCallback(
		(deltaX: number, deltaY: number) => {
			setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }));
		},
		[setPosition],
	);

	const handleClickUpOrDown = useCallback(
		(e) => {
			const partInfoId = e.currentTarget.dataset.partInfoId;
			const pi = music.partsInfo.find((pi) => pi.id === partInfoId);
			if (!pi) {
				return;
			}
			const isUp = e.currentTarget.dataset.direction === 'up';
			Music.movePart(music, partInfoId, isUp);
			onUpdateScore();
		},
		[music, onUpdateScore],
	);

	const handleClickToggleNoteName = useCallback(
		(e) => {
			const pi = music.partsInfo.find((pi) => pi.id === e.currentTarget.dataset.partInfoId);
			if (!pi) {
				return;
			}
			pi.fontSize = pi.fontSize === 0 ? 12 : 0;
			onUpdateScore();
		},
		[music.partsInfo, onUpdateScore],
	);

	const handleClickToggleBold = useCallback(
		(e) => {
			const pi = music.partsInfo.find((pi) => pi.id === e.currentTarget.dataset.partInfoId);
			if (!pi) {
				return;
			}
			pi.isBold = !pi.isBold;
			onUpdateScore();
		},
		[music.partsInfo, onUpdateScore],
	);

	const handleClickShowOrHide = useCallback(
		(e) => {
			const pi = music.partsInfo.find((pi) => pi.id === e.currentTarget.dataset.partInfoId);
			if (!pi) {
				return;
			}
			pi.isVisible = !pi.isVisible;
			onUpdateScore();
		},
		[music.partsInfo, onUpdateScore],
	);

	const handleChangeFontSize = useCallback(
		(e, value) => {
			const pi = music.partsInfo.find((pi) => pi.id === e.target.dataset.partInfoId);
			if (!pi || pi.fontSize === value) {
				return;
			}
			console.log(`font size changed from ${pi.fontSize} to ${value}`);
			pi.fontSize = value;
			onUpdateScore();
		},
		[music.partsInfo, onUpdateScore],
	);

	const handleClickDeletePart = useCallback(
		(e) => {
			const pi = music.partsInfo.find((pi) => pi.id === e.currentTarget.dataset.partInfoId);
			if (!pi) {
				return;
			}
			Music.deletePart(music, pi.id);
			onUpdateScore();
		},
		[music, onUpdateScore],
	);

	const handleClickAddMelodyPart = useCallback(() => {
		Music.addPart(music, PartType.FN_LVL_1, 'Melody', true);
		onUpdateScore();
	}, [music, onUpdateScore]);

	const handleClickAddTextPart = useCallback(() => {
		Music.addPart(music, PartType.TEXT, 'Text', true);
		onUpdateScore();
	}, [music, onUpdateScore]);

	return (
		<Box id="PartsPanel" className={classes.root} style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: draggedItem === DraggedItemType.PARTS_PANEL ? 100 : 10 }}>
			<DraggablePanel title="Parts" draggedItemType={DraggedItemType.PARTS_PANEL} onDragMove={handleDragMove} />
			<Box className={classes.content}>
				{music.partsInfo.map((pi, piIndex) => (
					<Box key={pi.id} className={classes.partRow}>
						<Box className={classes.partRowLeftSection}>
							<IconButton
								onClick={handleClickUpOrDown}
								disabled={piIndex === 0}
								data-part-info-id={pi.id}
								data-direction="up"
								className={`${classes.actionButton} ${classes.smallActionButton}`}
							>
								<ArrowUpwardIcon titleAccess="Move part up" />
							</IconButton>
							<IconButton
								onClick={handleClickUpOrDown}
								disabled={piIndex === music.partsInfo.length - 1}
								data-part-info-id={pi.id}
								data-direction="down"
								className={`${classes.actionButton} ${classes.smallActionButton}`}
							>
								<ArrowDownwardIcon titleAccess="Move part down" />
							</IconButton>
							{pi.partType === PartType.FN_LVL_1 && (
								<Typography
									variant="body1"
									title={pi.fontSize > 0 ? 'Hide note name' : 'Show note name'}
									onClick={handleClickToggleNoteName}
									data-part-info-id={pi.id}
									className={`${classes.textButton} ${classes.noteNameButton} ${pi.fontSize > 0 ? classes.noteNameButtonActive : ''}`}
								>
									N
								</Typography>
							)}
							{pi.partType === PartType.TEXT && (
								<Typography
									variant="body1"
									title={pi.isBold ? 'Use regular font' : 'Use bold font'}
									onClick={handleClickToggleBold}
									data-part-info-id={pi.id}
									className={`${classes.textButton} ${classes.boldButton} ${pi.isBold ? classes.boldButtonActive : ''}`}
								>
									B
								</Typography>
							)}
							{pi.isVisible && (
								<IconButton onClick={handleClickShowOrHide} data-part-info-id={pi.id} className={classes.actionButton}>
									<VisibilityIcon titleAccess="Hide part" />
								</IconButton>
							)}
							{!pi.isVisible && (
								<IconButton onClick={handleClickShowOrHide} data-part-info-id={pi.id} className={classes.actionButton}>
									<VisibilityOffIcon titleAccess="Show part" />
								</IconButton>
							)}
							<Typography
								variant="body1"
								className={`${classes.partName} ${selection.length === 1 && selection[0].partInfoId === pi.id ? 'selected' : ''} ${pi.isVisible ? '' : 'disabled'}`}
							>
								{pi.name}
							</Typography>
							{pi.partType === PartType.TEXT && (
								<Box className={classes.slider}>
									<Slider
										data-part-info-id={pi.id}
										onChange={handleChangeFontSize}
										min={6}
										max={18}
										step={1}
										value={pi.fontSize}
										marks={false}
										track={false}
										valueLabelDisplay="off"
									/>
								</Box>
							)}
						</Box>
						<Box className={classes.partRowRightSection}>
							<IconButton onClick={handleClickDeletePart} data-part-info-id={pi.id} className={classes.actionButton} style={{ marginRight: '0' }}>
								<DeleteForeverIcon titleAccess="Delete part" />
							</IconButton>
						</Box>
					</Box>
				))}
				<Box className={classes.partRow}>
					<Box className={classes.partRowLeftSection}>
						<IconButton onClick={handleClickAddMelodyPart} className={classes.actionButton} style={{ marginRight: '0' }}>
							<AddCircleOutlineIcon titleAccess="Add melody part" />
						</IconButton>
						<Typography onClick={handleClickAddMelodyPart} variant="body1" className={classes.textButton}>
							Melody
						</Typography>
						<IconButton onClick={handleClickAddTextPart} className={classes.actionButton} style={{ marginLeft: '16px', marginRight: '0' }}>
							<AddCircleOutlineIcon titleAccess="Add text part" />
						</IconButton>
						<Typography onClick={handleClickAddTextPart} variant="body1" className={classes.textButton}>
							Text
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
