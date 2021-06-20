import React, { useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { VoiceModel } from '../../model/scoreModel';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';

export interface VoiceFnLvl1UIProps {
	voice: VoiceModel;
}

export const VoiceFnLvl1UI = ({ voice }: VoiceFnLvl1UIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			display: 'flex',
			border: '1px solid #666',
		},
		note: {
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
		(event) => {
			const note = voice.notes[event.target.dataset.index];
			setSelection({
				items: [{ partId: note.partId, measureId: note.measureId, voiceId: note.voiceId, noteId: note.id }],
			});
		},
		[voice.notes, setSelection],
	);

	return (
		<Box id="VoiceFnLvl1UI" className={classes.root}>
			{voice.notes.map((note, i) => (
				<Box key={i} style={{ flex: `${note.durationDivs} 0 0` }}>
					<Box className={`${classes.note} ${isSelected(note.id) ? classes.selected : ''}`} data-index={i} onClick={handleClickNote}>
						{note.name || note.durationDivs}
					</Box>
				</Box>
			))}
		</Box>
	);
};
