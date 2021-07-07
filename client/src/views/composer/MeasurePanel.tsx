import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { MeasureModel, PartType, ScoreModel } from '../../model/scoreModel';
import { Music } from '../../model/music';
import { Score } from '../../model/score';
import { selectionAtom } from '../../atoms/selectionAtom';
import { DraggedItemType } from '../../atoms/draggedItemAtom';
import { useDraggablePanel } from '../../components/useDraggablePanel';
import { DraggablePanel } from '../../components/DraggablePanel';

export interface MeasurePanelProps {
	score: ScoreModel;
	onUpdateScore: () => void;
}

export const MeasurePanel = ({ score, onUpdateScore }: MeasurePanelProps) => {
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
			gridTemplate: 'auto / 1fr',
			gap: '12px 0',
			backgroundColor: '#444',
			padding: 24,
		},
		panel: {
			display: 'inline-flex',
			alignItems: 'center',
			height: 32,
			borderRadius: 16,
			backgroundColor: '#333',
			padding: '0 12px 0 4px',
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
		buttonOnly: {
			padding: '0 4px',
		},
	}));
	const classes = useStyles();

	const selection = useRecoilValue(selectionAtom);
	const resetSelection = useResetRecoilState(selectionAtom);
	const [canAdd, setCanAdd] = useState(false);
	const [canDelete, setCanDelete] = useState(false);

	const { draggedItem, position, setPosition } = useDraggablePanel();
	const handleDragMove = useCallback(
		(deltaX: number, deltaY: number) => {
			setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }));
		},
		[setPosition],
	);

	const getSelectedMeasures = useCallback(() => {
		if (!score || !selection) {
			return [];
		}
		const measures: MeasureModel[] = [];
		selection.forEach((item) => {
			const m = Score.findMeasure(score, item.measureId);
			if (m) {
				measures.push(m);
			}
		});
		return measures;
	}, [score, selection]);

	useEffect(() => {
		setCanAdd(false);
		setCanDelete(false);
		if (score && selection && selection.length === 1 && selection[0].measureId && selection[0].partId) {
			const m = Score.findMeasure(score, selection[0].measureId);
			if (!m || m.isPickup) {
				return;
			}
			const p = Score.findPart(score, selection[0].partId);
			setCanAdd(!!(p && p.partType === PartType.FN_LVL_1));
			setCanDelete(!!(p && p.partType === PartType.FN_LVL_1 && !m.isPickup));
		}
	}, [selection, score]);

	const handleClickAdd = useCallback(() => {
		const measures: MeasureModel[] = getSelectedMeasures();
		if (!score || measures.length !== 1) {
			return;
		}
		Music.addMeasure(score.music, measures[0].id);
		onUpdateScore();
	}, [score, getSelectedMeasures, onUpdateScore]);

	const handleClickDelete = useCallback(() => {
		const measures: MeasureModel[] = getSelectedMeasures();
		if (!score || measures.length !== 1) {
			return;
		}
		Music.deleteMeasure(score.music, measures[0].id);
		resetSelection();
		onUpdateScore();
	}, [score, getSelectedMeasures, resetSelection, onUpdateScore]);

	return (
		<Box
			id="MeasurePanel"
			className={classes.root}
			style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: draggedItem === DraggedItemType.MEASURE_PANEL ? 100 : 20 }}
		>
			<DraggablePanel title="Measure" draggedItemType={DraggedItemType.MEASURE_PANEL} onDragMove={handleDragMove} />
			<Box className={classes.content}>
				<Box className={classes.buttonsRow}>
					<Box className={`${classes.panel} ${classes.buttonOnly}`}>
						<IconButton onClick={handleClickAdd} disabled={!canAdd} className={classes.actionButton}>
							<AddCircleOutlineIcon titleAccess="Add measure" />
						</IconButton>
					</Box>
					<Box className={`${classes.panel} ${classes.buttonOnly}`}>
						<IconButton onClick={handleClickDelete} disabled={!canDelete} className={classes.actionButton}>
							<DeleteForeverIcon titleAccess="Delete measure" />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
