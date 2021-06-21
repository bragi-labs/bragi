import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { NoteModel, ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';
import { ComposerToolbar } from './ComposerToolbar';
import { Piano } from '../../components/Piano';
import { StageUI } from './StageUI';
import { NoteToolbar } from './NoteToolbar';

export const ComposerPage = () => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			display: 'grid',
			gridTemplate: '40px 1fr / 1fr',
			gap: 16,
			userSelect: 'none',
		},
		toolbarContainer: {
			position: 'relative',
			'@media print': {
				display: 'none',
			},
		},
		stageContainer: {
			position: 'relative',
			minHeight: '100%',
			maxHeight: '100%',
		},
		pianoContainer: {
			position: 'absolute',
			left: '22cm',
			top: 56,
			'@media print': {
				display: 'none',
			},
		},
		noteToolbarContainer: {
			position: 'absolute',
			left: '22cm',
			top: 240,
			'@media print': {
				display: 'none',
			},
		},
	}));
	const classes = useStyles();

	const [score, setScore] = useState<ScoreModel | null>(null);
	const { selection, clearSelection } = SelectionContextContainer.useContainer();

	const handleChangeScore = useCallback(
		(changedScore: Score) => {
			setScore(changedScore);
			clearSelection();
		},
		[clearSelection],
	);

	const handlePianoNote = useCallback(
		(noteFullName: string) => {
			if (selection && selection.items && selection.items.length === 1) {
				setScore((sm) => {
					if (sm) {
						const note = Score.findNote(sm, selection.items[0].noteId);
						if (note) {
							note.name = noteFullName;
							note.isRest = false;
						}
					}
					return { ...sm } as ScoreModel;
				});
			}
		},
		[selection],
	);

	const handleDeleteNotes = useCallback((notes: NoteModel[]) => {
		notes.forEach((note) => {
			note.name = '';
			note.isRest = true;
		});
		setScore((sm) => {
			return { ...sm } as ScoreModel;
		});
	}, []);

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar score={score} onChangeScore={handleChangeScore} />
			</Box>
			{score && (
				<>
					<Box className={classes.stageContainer}>
						<StageUI score={score} />
					</Box>
					<Box className={classes.pianoContainer}>
						<Piano smallPiano={true} onPianoNote={handlePianoNote} />
					</Box>
					<Box className={classes.noteToolbarContainer}>
						<NoteToolbar score={score} onDeleteNotes={handleDeleteNotes} />
					</Box>
				</>
			)}
		</Box>
	);
};
