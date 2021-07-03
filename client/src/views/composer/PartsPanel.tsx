import React, { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { IconButton, Typography } from '@material-ui/core';
import { DraggedItem, uiDraggedItem } from '../../atoms/uiDraggedItem';
import { Music } from '../../model/music';
import { DraggablePanel } from '../../components/DraggablePanel';
import { uiSelection } from '../../atoms/uiSelection';

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
			//opacity: 0.9,
		},
		content: {
			display: 'grid',
			gridTemplate: 'auto auto / 1fr',
			gap: '4px 0',
			backgroundColor: '#444',
			padding: 24,
			//opacity: 0.9,
			//width: 827,
		},
		panel: {
			display: 'inline-flex',
			alignItems: 'center',
			height: 32,
			borderRadius: 16,
			backgroundColor: '#333',
			padding: '0 12px 0 12px',
		},
		partName: {
			marginLeft: 4,
			color: '#aaa',
			transition: 'all 0.2s ease-in-out',
			// '&.clickable': {
			// 	marginLeft: 2,
			// },
			// '&.clickable:not(.disabled)': {
			// 	cursor: 'pointer',
			// },
			// '&.clickable:not(.disabled):hover': {
			// 	color: '#fff',
			// },
			'&.selected': {
				color: '#fa3',
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
	}));
	const classes = useStyles();

	const selection = useRecoilValue(uiSelection);
	const [draggedItem, setDraggedItem] = useRecoilState(uiDraggedItem);
	const resetDraggedItem = useResetRecoilState(uiDraggedItem);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleDragStart = useCallback(() => {
		setDraggedItem(DraggedItem.PARTS_PANEL);
	}, [setDraggedItem]);

	const handleDragMove = useCallback((deltaX: number, deltaY: number) => {
		setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }));
	}, []);

	const handleDragEnd = useCallback(() => {
		resetDraggedItem();
	}, [resetDraggedItem]);

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

	return (
		<Box id="PartsPanel" className={classes.root} style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: draggedItem === DraggedItem.PARTS_PANEL ? 100 : 5 }}>
			<DraggablePanel title="Parts" onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} />
			<Box className={classes.content}>
				{music.partsInfo.map((pi, piIndex) => (
					<Box key={pi.id} className={classes.panel}>
						<IconButton
							onClick={handleClickUpOrDown}
							disabled={piIndex === 0}
							data-part-info-id={pi.id}
							data-direction="up"
							className={`${classes.actionButton} ${classes.smallActionButton}`}
						>
							<ArrowDropUpIcon titleAccess="Move up" />
						</IconButton>
						<IconButton
							onClick={handleClickUpOrDown}
							disabled={piIndex === music.partsInfo.length - 1}
							data-part-info-id={pi.id}
							data-direction="down"
							className={`${classes.actionButton} ${classes.smallActionButton}`}
						>
							<ArrowDropDownIcon titleAccess="Move down" />
						</IconButton>
						{pi.isVisible && (
							<IconButton onClick={handleClickShowOrHide} data-part-info-id={pi.id} className={classes.actionButton}>
								<VisibilityIcon titleAccess="Hide" />
							</IconButton>
						)}
						{!pi.isVisible && (
							<IconButton onClick={handleClickShowOrHide} data-part-info-id={pi.id} className={classes.actionButton}>
								<VisibilityOffIcon titleAccess="Show" />
							</IconButton>
						)}
						<Typography
							variant="body1"
							className={`${classes.partName} ${selection.length === 1 && selection[0].partInfoId === pi.id ? 'selected' : ''} ${pi.isVisible ? '' : 'disabled'}`}
						>
							{pi.name}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
};
