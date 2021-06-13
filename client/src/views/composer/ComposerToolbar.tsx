import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Modal } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import PrintIcon from '@material-ui/icons/Print';
import { NewScoreDialog } from './NewScoreDialog';
import { FileOperations } from './FileOperations';

export const ComposerToolbar = () => {
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

	const [newScoreDialogVisible, setNewScoreDialogVisible] = useState(false);
	const [openScoreDialogVisible, setOpenScoreDialogVisible] = useState(false);
	const [goDownloadScore, setGoDownloadScore] = useState(false);

	const handleClickNew = useCallback(() => {
		setNewScoreDialogVisible(true);
	}, []);

	const handleCloseNewScoreDialog = useCallback(() => {
		setNewScoreDialogVisible(false);
	}, []);

	const handleNewScoreDialogDone = useCallback(() => {
		setNewScoreDialogVisible(false);
	}, []);

	const handleClickOpen = useCallback(() => {
		setOpenScoreDialogVisible(true);
	}, []);

	const handleOpenScoreDialogDone = useCallback(() => {
		setOpenScoreDialogVisible(false);
	}, []);

	const handleClickSave = useCallback(() => {
		setGoDownloadScore(true);
	}, []);

	const handleDownloadScoreDone = useCallback(() => {
		setGoDownloadScore(false);
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
				<Modal open={newScoreDialogVisible} onClose={handleCloseNewScoreDialog}>
					<NewScoreDialog onNewScoreDialogDone={handleNewScoreDialogDone} />
				</Modal>
				<FileOperations
					openScoreDialogVisible={openScoreDialogVisible}
					onOpenScoreDialogDone={handleOpenScoreDialogDone}
					goDownloadScore={goDownloadScore}
					onDownloadScoreDone={handleDownloadScoreDone}
				/>
			</Box>
		</Box>
	);
};
