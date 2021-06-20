import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';
import { ComposerToolbar } from './ComposerToolbar';
import { Piano } from '../../components/Piano';
import { StageUI } from './StageUI';

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
			top: 56,
			left: '22cm',
			'@media print': {
				display: 'none',
			},
		},
	}));
	const classes = useStyles();

	const [score, setScore] = useState<ScoreModel | null>(null);
	const { selection } = SelectionContextContainer.useContainer();

	const handleChangeScore = useCallback((changedScore: Score) => {
		setScore(changedScore);
	}, []);

	const handlePianoNote = useCallback(
		(noteName: string) => {
			if (selection && selection.items && selection.items.length === 1) {
				setScore((sm) => {
					if (sm) {
						const note = Score.findNote(sm, selection.items[0].noteId);
						if (note) {
							note.name = noteName;
						}
					}
					return { ...sm } as ScoreModel;
				});
			}
		},
		[selection],
	);

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
				</>
			)}
		</Box>
	);
};
