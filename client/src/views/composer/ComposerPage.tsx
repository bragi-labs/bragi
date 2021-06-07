import React, { memo, useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Modal } from '@material-ui/core';
import { Score } from '../../score/score';
import { ComposerToolbar } from './ComposerToolbar';
import { NewScoreDialog, NewScoreDialogResult } from './NewScoreDialog';
import { FileOperations } from '../../components/FileOperations';

export const ComposerPage = memo(() => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			userSelect: 'none',
		},
		toolbarContainer: {},
	}));
	const classes = useStyles();

	const [score, setScore] = useState<Score>(new Score());
	const [newScoreDialog, setNewScoreDialog] = useState(false);
	const [openScoreDialog, setOpenScoreDialog] = useState(false);
	const [saveScoreDialog, setSaveScoreDialog] = useState(false);

	const handleClickNew = useCallback(() => {
		setNewScoreDialog(true);
	}, []);

	const handleDoneNewScoreDialog = useCallback<(newScoreDialogResult: NewScoreDialogResult | null) => void>((newScoreDialogResult: NewScoreDialogResult | null) => {
		setNewScoreDialog(false);
		if (!newScoreDialogResult) {
			return;
		}
		const newScore = new Score();
		newScore.initFromNewDialog(newScoreDialogResult);
		setScore(newScore);
	}, []);

	const handleClickOpen = useCallback(() => {
		setOpenScoreDialog(true);
	}, []);

	const handleOpenScoreDone = useCallback((openedScore: Score | null) => {
		if (openedScore) {
			setScore(openedScore);
		}
		setOpenScoreDialog(false);
	}, []);

	const handleClickSave = useCallback(() => {
		setSaveScoreDialog(true);
	}, []);

	const handleSaveScoreDone = useCallback(() => {
		setSaveScoreDialog(false);
	}, []);

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar onClickNew={handleClickNew} onClickOpen={handleClickOpen} onClickSave={handleClickSave} />
				<Modal open={newScoreDialog}>
					<NewScoreDialog onDone={handleDoneNewScoreDialog} />
				</Modal>
			</Box>
			<FileOperations score={score} openDialog={openScoreDialog} onOpenScoreDone={handleOpenScoreDone} saveDialog={saveScoreDialog} onSaveScoreDone={handleSaveScoreDone} />
		</Box>
	);
});
