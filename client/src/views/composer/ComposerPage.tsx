import React, { useCallback, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { uiSelection } from '../../atoms/uiSelection';
import { ComposerToolbar } from './ComposerToolbar';
import { Piano } from '../../components/Piano';
import { StageUI } from './StageUI';
import { NoteToolbar } from './NoteToolbar';
import { MusicalHelper } from '../../services/musicalHelper';

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
		pianoAnchor: {
			position: 'absolute',
			left: 824,
			top: 56,
			'@media print': {
				display: 'none',
			},
		},
		noteToolbarAnchor: {
			position: 'absolute',
			left: 824,
			top: 256,
			'@media print': {
				display: 'none',
			},
		},
	}));
	const classes = useStyles();

	const [score, setScore] = useState<ScoreModel | null>(null);
	const selection = useRecoilValue(uiSelection);
	const resetSelection = useResetRecoilState(uiSelection);

	const handleScoreChanged = useCallback(
		(changedScore: Score) => {
			resetSelection();
			setScore(null);
			setTimeout(() => {
				setScore(changedScore);
			}, 0);
		},
		[resetSelection],
	);

	const handleScoreUpdated = useCallback(() => {
		setScore((s) => {
			return { ...s } as ScoreModel;
		});
	}, []);

	const handlePianoNote = useCallback(
		(noteFullName: string) => {
			if (score && selection && selection.length === 1) {
				const note = Score.findNote(score, selection[0].noteId);
				if (note) {
					note.isRest = false;
					note.fullName = noteFullName;
					if (MusicalHelper.parseNote(noteFullName).alter === '#') {
						const measure = Score.findMeasure(score, note.measureId);
						if (measure && !MusicalHelper.isScaleUsesSharps(measure.musicalScale)) {
							note.fullName = MusicalHelper.toggleSharpAndFlat(note.fullName);
						}
					}
				}
				handleScoreUpdated();
			}
		},
		[selection, score, handleScoreUpdated],
	);

	return (
		<Box id="ComposerPage" className={classes.root} key={score ? `${score.id}-${score.timestamp}` : null}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar score={score} onChangeScore={handleScoreChanged} />
			</Box>
			{score && (
				<>
					<Box className={classes.stageContainer}>
						<StageUI score={score} />
					</Box>
					<Box className={classes.pianoAnchor}>
						<Piano smallPiano={true} onPianoNote={handlePianoNote} />
					</Box>
					<Box className={classes.noteToolbarAnchor}>
						<NoteToolbar score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
				</>
			)}
		</Box>
	);
};
