import React, { memo, useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Score } from '../../score/score';
import { FileOperations } from './FileOperations';
import { NewScoreDialog, NewScoreDialogResult } from './NewScoreDialog';
import { Modal } from '@material-ui/core';

interface ComposerToolbarProps {
	score: Score;
	onChangeScore: (score: Score) => void;
}

export const ComposerToolbar = memo(({ score, onChangeScore }: ComposerToolbarProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			position: 'relative',
			height: '100%',
		},
		panel: {
			display: 'flex',
			alignItems: 'center',
			marginRight: 24,
			height: 32,
			opacity: 0.5,
			borderRadius: 16,
			backgroundColor: '#222',
			padding: '0 4px',
		},
		actionButton: {
			margin: '0 4px',
			width: 24,
			height: 24,
			textAlign: 'center',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			color: '#ccc',
			'&:hover': {
				color: '#fff',
			},
		},
		actionButtonDisabled: {
			pointerEvents: 'none',
			color: '#666',
		},
	}));
	const classes = useStyles();

	const [newScoreDialog, setNewScoreDialog] = useState(false);
	const [openScoreDialog, setOpenScoreDialog] = useState(false);
	const [saveScoreDialog, setSaveScoreDialog] = useState(false);

	const handleClickNew = useCallback(() => {
		setNewScoreDialog(true);
	}, []);

	const handleDoneNewScoreDialog = useCallback<(newScoreDialogResult: NewScoreDialogResult | null) => void>(
		(newScoreDialogResult: NewScoreDialogResult | null) => {
			setNewScoreDialog(false);
			if (!newScoreDialogResult) {
				return;
			}
			const newScore = new Score();
			newScore.initFromNewDialog(newScoreDialogResult);
			onChangeScore(newScore);
		},
		[onChangeScore],
	);

	const handleClickOpen = useCallback(() => {
		setOpenScoreDialog(true);
	}, []);

	const handleOpenScoreDialogDone = useCallback(
		(openedScore: Score | null) => {
			setOpenScoreDialog(false);
			if (openedScore) {
				onChangeScore(openedScore);
			}
		},
		[onChangeScore],
	);

	const handleClickSave = useCallback(() => {
		setSaveScoreDialog(true);
	}, []);

	const handleSaveScoreDialogDone = useCallback(() => {
		setSaveScoreDialog(false);
	}, []);

	return (
		<Box id="ComposerToolbar" className={classes.root}>
			<Box className={classes.panel}>
				<AddCircleOutlineOutlinedIcon onClick={handleClickNew} className={classes.actionButton} titleAccess="New" />
				<FolderOpenOutlinedIcon onClick={handleClickOpen} className={classes.actionButton} titleAccess="Open" />
				<SaveOutlinedIcon onClick={handleClickSave} className={classes.actionButton} titleAccess="Save" />
				<Modal open={newScoreDialog}>
					<NewScoreDialog onDone={handleDoneNewScoreDialog} />
				</Modal>
				<FileOperations
					score={score}
					openDialog={openScoreDialog}
					onOpenScoreDone={handleOpenScoreDialogDone}
					saveDialog={saveScoreDialog}
					onSaveScoreDone={handleSaveScoreDialogDone}
				/>
			</Box>
		</Box>
	);
});
