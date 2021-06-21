import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
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
			display: 'grid',
		},
		panel: {
			display: 'flex',
			alignItems: 'center',
			marginRight: 24,
			height: 32,
			//opacity: 0.9,
			borderRadius: 16,
			backgroundColor: '#444',
			padding: '0 4px',
		},
		actionButton: {
			margin: '0 4px',
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
	const [canDelete, setCanDelete] = useState(false);

	useEffect(() => {
		let enableDelete = false;
		if (selection) {
			enableDelete = selection.items.some((item) => {
				if (score && item.noteId) {
					const note = Score.findNote(score, item.noteId);
					return note && !note.isRest;
				}
				return false;
			});
		}
		setCanDelete(enableDelete);
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
				<DeleteForeverIcon onClick={handleClickDelete} className={`${classes.actionButton} ${canDelete ? '' : 'disabled'}`} titleAccess="Delete" />
			</Box>
		</Box>
	);
};
