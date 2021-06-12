import React, { memo, useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Modal } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import PrintIcon from '@material-ui/icons/Print';
import { FileOperations } from './FileOperations';
import { NewScoreDialog } from './NewScoreDialog';

export const ComposerToolbar = memo(() => {
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

	const handleCloseNewScoreDialog = useCallback(() => {
		setNewScoreDialog(false);
	}, []);

	const handleNewScoreDialogDone = useCallback(() => {
		setNewScoreDialog(false);
	}, []);

	const handleClickOpen = useCallback(() => {
		setOpenScoreDialog(true);
	}, []);

	const handleOpenScoreDialogDone = useCallback(() => {
		setOpenScoreDialog(false);
	}, []);

	const handleClickSave = useCallback(() => {
		setSaveScoreDialog(true);
	}, []);

	const handleSaveScoreDialogDone = useCallback(() => {
		setSaveScoreDialog(false);
	}, []);

	const handleClickPrint = useCallback(() => {
		window.print();
	}, []);

	return (
		<Box id="ComposerToolbar" className={classes.root}>
			<Box className={classes.panel}>
				<AddCircleOutlineOutlinedIcon onClick={handleClickNew} className={classes.actionButton} titleAccess="New" />
				<FolderOpenOutlinedIcon onClick={handleClickOpen} className={classes.actionButton} titleAccess="Open" />
				<SaveOutlinedIcon onClick={handleClickSave} className={classes.actionButton} titleAccess="Save" />
				<PrintIcon onClick={handleClickPrint} className={classes.actionButton} titleAccess="Print" />
				<Modal open={newScoreDialog} onClose={handleCloseNewScoreDialog}>
					<NewScoreDialog onNewScoreDialogDone={handleNewScoreDialogDone} />
				</Modal>
				<FileOperations
					openDialog={openScoreDialog}
					onOpenScoreDialogDone={handleOpenScoreDialogDone}
					saveDialog={saveScoreDialog}
					onSaveScoreDialogDone={handleSaveScoreDialogDone}
				/>
			</Box>
		</Box>
	);
});
