import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ScoreModel } from '../../model/scoreModel';
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

	const handleScoreChanged = useCallback(
		(changedScore: Score) => {
			setScore(changedScore);
			clearSelection();
		},
		[clearSelection],
	);

	const handleScoreUpdated = useCallback(() => {
		setScore((sm) => {
			return { ...sm } as ScoreModel;
		});
	}, []);

	const handlePianoNote = useCallback(
		(noteFullName: string) => {
			if (score && selection && selection.items && selection.items.length === 1) {
				const note = Score.findNote(score, selection.items[0].noteId);
				if (note) {
					note.fullName = noteFullName;
					note.isRest = false;
				}
				handleScoreUpdated();
			}
		},
		[selection, score, handleScoreUpdated],
	);

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar score={score} onChangeScore={handleScoreChanged} />
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
						<NoteToolbar score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
				</>
			)}
		</Box>
	);
};
