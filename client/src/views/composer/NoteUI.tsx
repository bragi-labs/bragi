import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Note } from '../../model/note';

export interface NoteUIProps {
	note: Note;
}

export const NoteUI = ({ note }: NoteUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="NoteUI" className={classes.root}>
			{note.durationDivs}
		</Box>
	);
};
