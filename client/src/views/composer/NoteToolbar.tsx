import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { NoteModel, ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';

export interface NoteToolbarProps {
	score: ScoreModel | null;
	onDeleteNotes: (notes: NoteModel[]) => void;
}

export const NoteToolbar = ({ score, onDeleteNotes }: NoteToolbarProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			width: 827,
		},
		panel: {
			display: 'grid',
			gridTemplate: '80px auto / 1fr',
			//opacity: 0.9,
			borderRadius: 4,
			backgroundColor: '#333',
			padding: 24,
		},
		noteLengthControl: {
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
		actionButton: {
			marginRight: 20,
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

	const { selection } = SelectionContextContainer.useContainer();
	const [canChangeLength, setCanChangeLength] = useState(false);
	const [canMoveLeft, setCanMoveLeft] = useState(false);
	const [canMoveRight, setCanMoveRight] = useState(false);
	const [canPitchUp, setCanPitchUp] = useState(false);
	const [canPitchDown, setCanPitchDown] = useState(false);
	const [canDelete, setCanDelete] = useState(false);

	const marks = [
		{ value: 6, label: '1/16' },
		{ value: 12, label: '1/8' },
		{ value: 18, label: '1/8.' },
		{ value: 24, label: '1/4' },
		{ value: 36, label: '1/4.' },
		{ value: 48, label: '1/2' },
		{ value: 72, label: '3/4' },
		{ value: 96, label: '1' },
	];

	useEffect(() => {
		let hasRealNotes = false;
		if (selection) {
			hasRealNotes = selection.items.some((item) => {
				if (score && item.noteId) {
					const note = Score.findNote(score, item.noteId);
					return note && !note.isRest;
				}
				return false;
			});
		}
		setCanChangeLength(hasRealNotes);
		setCanMoveLeft(hasRealNotes);
		setCanMoveRight(hasRealNotes);
		setCanPitchUp(hasRealNotes);
		setCanPitchDown(hasRealNotes);
		setCanDelete(hasRealNotes);
	}, [selection, score]);

	const handleClickDelete = useCallback(() => {
		if (!score || !selection) {
			return;
		}
		const notes: NoteModel[] = [];
		selection.items.forEach((item) => {
			const note = Score.findNote(score, item.noteId);
			if (note && !note.isRest) {
				notes.push(note);
			}
		});
		if (notes.length) {
			onDeleteNotes(notes);
		}
	}, [score, selection, onDeleteNotes]);

	return (
		<Box id="NoteToolbar" className={classes.root}>
			<Box className={classes.panel}>
				<Box className={classes.noteLengthControl}>
					<Slider
						className={`${canChangeLength ? '' : 'disabled'}`}
						defaultValue={24}
						step={null}
						track={false}
						valueLabelDisplay="off"
						marks={marks}
						disabled={!canChangeLength}
					/>
				</Box>
				<Box>
					<ArrowBackIcon className={`${classes.actionButton} ${canMoveLeft ? '' : 'disabled'}`} titleAccess="Move Left" />
					<ArrowForwardIcon className={`${classes.actionButton} ${canMoveRight ? '' : 'disabled'}`} titleAccess="Move Right" />
					<ArrowUpwardIcon className={`${classes.actionButton} ${canPitchUp ? '' : 'disabled'}`} titleAccess="Pitch Up" />
					<ArrowDownwardIcon className={`${classes.actionButton} ${canPitchDown ? '' : 'disabled'}`} titleAccess="Pitch Down" />
					<DeleteForeverIcon onClick={handleClickDelete} className={`${classes.actionButton} ${canDelete ? '' : 'disabled'}`} titleAccess="Delete" />
				</Box>
			</Box>
		</Box>
	);
};
