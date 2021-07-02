import React, { useCallback, useState } from 'react';
import { useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { uiSelection } from '../../atoms/uiSelection';
import { ComposerToolbar } from './ComposerToolbar';
import { Piano } from '../../components/Piano';
import { StageUI } from './StageUI';
import { NotePanel } from './NotePanel';
import { PartsPanel } from './PartsPanel';

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
		notePanelAnchor: {
			position: 'absolute',
			left: 824,
			top: 256,
			'@media print': {
				display: 'none',
			},
		},
		partsPanelAnchor: {
			position: 'absolute',
			left: 824,
			top: 441,
			'@media print': {
				display: 'none',
			},
		},
	}));
	const classes = useStyles();

	const [score, setScore] = useState<ScoreModel | null>(null);
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

	return (
		<Box id="ComposerPage" className={classes.root} key={score ? `${score.id}-${score.timestamp}` : null}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar score={score} onChangeScore={handleScoreChanged} />
			</Box>
			{score && (
				<>
					<Box className={classes.stageContainer}>
						<StageUI score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
					<Box className={classes.pianoAnchor}>
						<Piano smallPiano={true} score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
					<Box className={classes.notePanelAnchor}>
						<NotePanel score={score} onUpdateScore={handleScoreUpdated} />
					</Box>
					<Box className={classes.partsPanelAnchor}>
						<PartsPanel partsInfo={score.music.partsInfo} onUpdateScore={handleScoreUpdated} />
					</Box>
				</>
			)}
		</Box>
	);
};
