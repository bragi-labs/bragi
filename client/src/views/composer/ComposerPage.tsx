import React, { memo, useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ComposerToolbar } from './ComposerToolbar';
import { NewScoreDialog } from './NewScoreDialog';
import { Modal } from '@material-ui/core';

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

	const handleCloseNewScoreDialog = useCallback(() => {
		setNewScoreDialog(false);
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
				<Modal open={newScoreDialog} onClose={handleCloseNewScoreDialog}>
					<NewScoreDialog onClose={handleCloseNewScoreDialog} />
				</Modal>
			</Box>
		</Box>
	);
});
