import React, { useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';
import { Note } from '../../model/note';

export interface NoteUIProps {
	note: Note;
}

export const NoteUI = ({ note }: NoteUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			border: '1px solid #ccc',
		},
		selected: {
			border: '1px solid red',
		},
	}));
	const classes = useStyles();

	const { setSelection, isSelected } = SelectionContextContainer.useContainer();

	const handleClickNote = useCallback(
		() => {
			setSelection({
				items: [{ partId: note.partId, measureId: note.measureId, voiceId: note.voiceId, noteId: note.id }],
			});
		},
		[setSelection, note.partId, note.measureId, note.voiceId, note.id],
	);

	return (
		<Box id="NoteUI" className={`${classes.root} ${isSelected(note.id) ? classes.selected : ''}`} onClick={handleClickNote}>
			{note.name || note.durationDivs}
		</Box>
	);
};
