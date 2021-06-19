import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Voice } from '../../model/voice';
import { NoteUI } from './NoteUI';

export interface VoiceFnLvl1UIProps {
	voice: Voice;
}

export const VoiceFnLvl1UI = ({ voice }: VoiceFnLvl1UIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			display: 'flex',
			border: '1px solid #666',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="VoiceFnLvl1UI" className={classes.root}>
			{voice.notes.map((note, i) => (
				<Box key={i} style={{ flex: `${note.durationDivs} 0 0` }}>
					<NoteUI note={note} />
				</Box>
			))}
		</Box>
	);
};
