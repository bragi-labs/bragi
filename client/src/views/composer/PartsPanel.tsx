import React, { useCallback, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { DraggablePanel } from '../../components/DraggablePanel';
import { DraggedItem, uiDraggedItem } from '../../atoms/uiDraggedItem';
import { PartInfo } from '../../model/partInfo';
import { IconButton, Typography } from '@material-ui/core';

export interface PartsPanelProps {
	partsInfo: PartInfo[];
	onUpdateScore: () => void;
}

export const PartsPanel = ({ partsInfo, onUpdateScore }: PartsPanelProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'absolute',
			width: 501,
			backgroundColor: '#333',
			userSelect: 'none',
			borderRadius: 4,
			padding: 4,
			//opacity: 0.9,
		},
		content: {
			display: 'grid',
			gridTemplate: 'auto auto / 1fr',
			gap: '16px 0',
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
		panelText: {
			marginLeft: 4,
			color: '#999',
			transition: 'all 0.2s ease-in-out',
			'&.clickable': {
				marginLeft: 2,
			},
			'&.clickable:not(.disabled)': {
				cursor: 'pointer',
			},
			'&.clickable:not(.disabled):hover': {
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
		partName: {
			color: '#999',
		},
	}));
	const classes = useStyles();

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
			const pi = partsInfo.find((pi) => pi.id === e.currentTarget.dataset.partId);
			if (!pi) {
				return;
			}
			pi.isVisible = !pi.isVisible;
			onUpdateScore();
		},
		[partsInfo, onUpdateScore],
	);

	return (
		<Box id="PartsPanel" className={classes.root} style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: draggedItem === DraggedItem.PARTS_PANEL ? 100 : 5 }}>
			<DraggablePanel onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} />
			<Box className={classes.content}>
				{partsInfo.map((pi, i) => (
					<Box key={i} className={classes.panel}>
						{pi.isVisible && (
							<IconButton onClick={handleClickShowOrHide} data-part-id={pi.id} className={classes.actionButton}>
								<VisibilityIcon titleAccess="Show" />
							</IconButton>
						)}
						{!pi.isVisible && (
							<IconButton onClick={handleClickShowOrHide} data-part-id={pi.id} className={classes.actionButton}>
								<VisibilityOffIcon titleAccess="Hide" />
							</IconButton>
						)}
						<Typography variant="body1" className={classes.partName}>
							{pi.name}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
};
