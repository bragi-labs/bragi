import React, { memo, useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ComposerToolbar } from './ComposerToolbar';
import { NewScoreDialog, NewScoreDialogResult } from './NewScoreDialog';
import { Modal } from '@material-ui/core';
import { Score } from '../../score/score';

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

	const [newScoreDialog, setNewScoreDialog] = useState(false);

	const handleClickNew = useCallback(() => {
		setNewScoreDialog(true);
	}, []);

	const handleDoneNewScoreDialog = useCallback<(newScoreDialogResult: NewScoreDialogResult | null) => void>((newScoreDialogResult: NewScoreDialogResult | null) => {
		setNewScoreDialog(false);
		if (newScoreDialogResult) {
			const score = new Score();
			score.initFromNewDialog(newScoreDialogResult);
			alert(JSON.stringify(score));
		}
	}, []);

	const handleClickOpen = useCallback(() => {
		alert('open');
	}, []);

	const handleClickSave = useCallback(() => {
		alert('save');
	}, []);

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar onClickNew={handleClickNew} onClickOpen={handleClickOpen} onClickSave={handleClickSave} />
				<Modal open={newScoreDialog}>
					<NewScoreDialog onDone={handleDoneNewScoreDialog} />
				</Modal>
			</Box>
		</Box>
	);
});
