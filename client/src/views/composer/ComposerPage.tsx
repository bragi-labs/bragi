import React, { useCallback, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { selectionAtom } from '../../atoms/selectionAtom';
import { ComposerToolbar } from './ComposerToolbar';
import { StageUI } from './StageUI';
import { Piano } from '../../components/Piano';
import { NotePanel } from './NotePanel';
import { MeasurePanel } from './MeasurePanel';
import { PartsPanel } from './PartsPanel';
import { MusicalHelper } from '../../services/musicalHelper';

export const ComposerPage = () => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			userSelect: 'none',
		},
		toolbarContainer: {
			position: 'absolute',
			left: 0,
			top: -48,
			'@media print': {
				display: 'none',
			},
		},
		stageContainer: {
			position: 'relative',
			height: '100%',
			transform: 'translate(0, 0)',
		},
		pianoAnchor: {
			position: 'absolute',
			left: 800,
			top: 0,
			'@media print': {
				display: 'none',
			},
		},
		notePanelAnchor: {
			position: 'absolute',
			left: 800,
			top: 196,
			'@media print': {
				display: 'none',
			},
		},
		measurePanelAnchor: {
			position: 'absolute',
			left: 800,
			top: 380,
			'@media print': {
				display: 'none',
			},
		},
		partsPanelAnchor: {
			position: 'absolute',
			left: 800,
			top: 520,
			'@media print': {
				display: 'none',
			},
		},
	}));
	const classes = useStyles();

	const [score, setScore] = useState<ScoreModel | null>(null);
	const selection = useRecoilValue(selectionAtom);
	const resetSelection = useResetRecoilState(selectionAtom);

	const handleScoreChanged = useCallback(
		(changedScore: Score) => {
			resetSelection();
			setScore(changedScore);
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
			if (!score || selection.length !== 1) {
				return;
			}
			const note = Score.findNote(score, selection[0].noteId);
			if (!note) {
				return;
			}
			note.isRest = false;
			note.fullName = noteFullName;
			if (MusicalHelper.parseNote(noteFullName).alter === '#') {
				const measure = Score.findMeasure(score, note.measureId);
				if (measure && !MusicalHelper.isScaleUsesSharps(measure.musicalScale)) {
					note.fullName = MusicalHelper.toggleSharpAndFlat(note.fullName);
				}
			}
			handleScoreUpdated();
		},
		[score, selection, handleScoreUpdated],
	);

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar score={score} onChangeScore={handleScoreChanged} />
			</Box>
			{score && (
				<>
					<Box className={classes.stageContainer}>
						<StageUI score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
					<Box className={classes.pianoAnchor}>
						<Piano smallPiano={true} onPianoNote={handlePianoNote} />
					</Box>
					<Box className={classes.notePanelAnchor}>
						<NotePanel score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
					<Box className={classes.measurePanelAnchor}>
						<MeasurePanel score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
					<Box className={classes.partsPanelAnchor}>
						<PartsPanel music={score.music} onUpdateScore={handleScoreUpdated} />
					</Box>
				</>
			)}
		</Box>
	);
};
