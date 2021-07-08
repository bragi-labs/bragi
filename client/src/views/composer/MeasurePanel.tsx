import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { MeasureModel, PartType, ScoreModel } from '../../model/scoreModel';
import { Music } from '../../model/music';
import { Score } from '../../model/score';
import { selectionAtom } from '../../atoms/selectionAtom';
import { DraggedItemType } from '../../atoms/draggedItemAtom';
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
			padding: '0 6px 0 4px',
		},
		panelButtonOnly: {
			padding: '0 4px',
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
	}));
	const classes = useStyles();

	const selection = useRecoilValue(selectionAtom);
	const resetSelection = useResetRecoilState(selectionAtom);
	const [canAdd, setCanAdd] = useState(false);
	const [canDuplicate, setCanDuplicate] = useState(false);
	const [canDelete, setCanDelete] = useState(false);

	const draggablePanelContentRef = useRef(null);

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
		setCanDuplicate(false);
		setCanDelete(false);
		if (score && selection && selection.length === 1 && selection[0].measureId && selection[0].partId) {
			const m = Score.findMeasure(score, selection[0].measureId);
			if (!m) {
				return;
			}
			const p = Score.findPart(score, selection[0].partId);
			setCanAdd(!!(p && p.partType === PartType.FN_LVL_1));
			setCanDuplicate(!!(p && p.partType === PartType.FN_LVL_1 && !m.isPickup));
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

	const handleClickDuplicate = useCallback(() => {
		const measures: MeasureModel[] = getSelectedMeasures();
		if (!score || measures.length !== 1) {
			return;
		}
		Music.duplicateMeasure(score.music, measures[0].id);
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
		<div id="MeasurePanel" ref={draggablePanelContentRef} className={classes.root}>
			<DraggablePanel title="Measure" contentRef={draggablePanelContentRef} draggedItemType={DraggedItemType.MEASURE_PANEL} initialZIndex={20} />
			<Box className={classes.content}>
				<Box className={classes.buttonsRow}>
					<Box className={classes.panel}>
						<IconButton onClick={handleClickAdd} disabled={!canAdd} className={classes.actionButton}>
							<AddCircleOutlineIcon titleAccess="Add measure" />
						</IconButton>
						<IconButton onClick={handleClickDuplicate} disabled={!canDuplicate} className={classes.actionButton} style={{ marginLeft: '12px' }}>
							<AddToPhotosIcon titleAccess="Duplicate measure" />
						</IconButton>
					</Box>
					<Box className={`${classes.panel} ${classes.panelButtonOnly}`}>
						<IconButton onClick={handleClickDelete} disabled={!canDelete} className={classes.actionButton}>
							<DeleteForeverIcon titleAccess="Delete measure" />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</div>
	);
};
