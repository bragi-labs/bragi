import React, { useCallback, useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Modal } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import PrintIcon from '@material-ui/icons/Print';
import { Score } from '../../model/score';
import { NewScoreDialog } from './NewScoreDialog';
import { SaveScore } from './SaveScore';
import { AppDataHelper } from '../../services/appDataHelper';

export interface ComposerToolbarProps {
	score: Score | null;
	onChangeScore: (score: Score) => void;
}

export const ComposerToolbar = React.memo(({ score, onChangeScore }: ComposerToolbarProps) => {
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
			//opacity: 0.9,
			borderRadius: 16,
			backgroundColor: '#444',
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
			'&.disabled': {
				pointerEvents: 'none',
				color: '#666',
			},
		},
	}));
	const classes = useStyles();

	const [newScoreDialogVisible, setNewScoreDialogVisible] = useState(false);
	const openInputRef = useRef<any>();
	const [goSaveScore, setGoSaveScore] = useState(false);

	const handleClickNew = useCallback(() => {
		setNewScoreDialogVisible(true);
	}, []);

	const handleCloseNewScoreDialog = useCallback(() => {
		setNewScoreDialogVisible(false);
	}, []);

	const handleNewScoreDialogDone = useCallback(
		(newScore: Score | null) => {
			setNewScoreDialogVisible(false);
			if (newScore) {
				onChangeScore(newScore);
			}
		},
		[onChangeScore],
	);

	const handleClickOpen = useCallback(() => {
		const openInput: HTMLInputElement = openInputRef.current;
		openInput.click();
	}, [openInputRef]);

	const handleChangeOpenFile = useCallback(() => {
		const openInput: HTMLInputElement = openInputRef.current;
		if (!openInput.files || openInput.files.length !== 1) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			if (fileReader.result) {
				const openedScore = Score.createFromModel(JSON.parse(fileReader.result.toString()));
				onChangeScore(openedScore);
			}
		};
		fileReader.readAsText(openInput.files[0]);
	}, [openInputRef, onChangeScore]);

	const handleClickSave = useCallback(() => {
		setGoSaveScore(true);
	}, []);

	const handleSaveScoreDone = useCallback(() => {
		setGoSaveScore(false);
	}, []);

	const handleClickPrint = useCallback(() => {
		window.print();
	}, []);

	return (
		<Box id="ComposerToolbar" className={classes.root}>
			<Box className={classes.panel}>
				<AddCircleOutlineOutlinedIcon onClick={handleClickNew} className={classes.actionButton} titleAccess="New" />
				<FolderOpenOutlinedIcon onClick={handleClickOpen} className={classes.actionButton} titleAccess="Open" />
				<SaveOutlinedIcon onClick={handleClickSave} className={`${classes.actionButton} ${score ? '' : 'disabled'}`} titleAccess="Save" />
				<PrintIcon onClick={handleClickPrint} className={`${classes.actionButton} ${score ? '' : 'disabled'}`} titleAccess="Print" />
				<Modal open={newScoreDialogVisible} onClose={handleCloseNewScoreDialog}>
					<NewScoreDialog onNewScoreDialogDone={handleNewScoreDialogDone} />
				</Modal>
				<input ref={openInputRef} onChange={handleChangeOpenFile} type="file" accept={`.${AppDataHelper.scoreFileExt}`} style={{ display: 'none' }} />
				<SaveScore score={score} goSaveScore={goSaveScore} onSaveScoreDone={handleSaveScoreDone} />
			</Box>
		</Box>
	);
});
