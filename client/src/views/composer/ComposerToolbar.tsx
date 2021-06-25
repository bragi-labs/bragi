import React, { useCallback, useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Modal, Typography } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import PrintIcon from '@material-ui/icons/Print';
import { ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { NewScoreDialog } from './NewScoreDialog';
import { SaveScore } from './SaveScore';
import { AppDataHelper } from '../../services/appDataHelper';

export interface ComposerToolbarProps {
	score: ScoreModel | null;
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
			display: 'inline-flex',
			alignItems: 'center',
			height: 32,
			borderRadius: 16,
			backgroundColor: '#444',
			padding: '0 12px 0 4px',
			opacity: 0.9,
			marginLeft: 16,
			'&:first-of-type': {
				marginLeft: 0,
			},
		},
		panelText: {
			marginLeft: 2,
			color: '#999',
			'&.disabled': {
				color: '#666',
			},
		},
		actionButton: {
			width: 24,
			height: 24,
			textAlign: 'center',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			color: '#ccc',
			marginLeft: 12,
			'&:first-of-type': {
				marginLeft: 0,
			},
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
				<Typography variant="body1" className={classes.panelText}>
					New
				</Typography>
				<FolderOpenOutlinedIcon onClick={handleClickOpen} className={classes.actionButton} titleAccess="Open" />
				<Typography variant="body1" className={classes.panelText}>
					Open
				</Typography>
				<SaveOutlinedIcon onClick={handleClickSave} className={`${classes.actionButton} ${score ? '' : 'disabled'}`} titleAccess="Save" />
				<Typography variant="body1" className={`${classes.panelText} ${score ? '' : 'disabled'}`}>
					Save
				</Typography>
				<PrintIcon onClick={handleClickPrint} className={`${classes.actionButton} ${score ? '' : 'disabled'}`} titleAccess="Print" />
				<Typography variant="body1" className={`${classes.panelText} ${score ? '' : 'disabled'}`}>
					Print
				</Typography>
				<Modal open={newScoreDialogVisible} onClose={handleCloseNewScoreDialog}>
					<NewScoreDialog onNewScoreDialogDone={handleNewScoreDialogDone} />
				</Modal>
				<input ref={openInputRef} onChange={handleChangeOpenFile} type="file" accept={`.${AppDataHelper.scoreFileExt}`} style={{ display: 'none' }} />
				<SaveScore score={score} goSaveScore={goSaveScore} onSaveScoreDone={handleSaveScoreDone} />
			</Box>
		</Box>
	);
});
