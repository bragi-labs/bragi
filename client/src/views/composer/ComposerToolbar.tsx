import { AnalyticsHelper, EventCategory } from '../../services/analyticsHelper';
import React, { useCallback, useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { IconButton, Modal } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import PrintIcon from '@material-ui/icons/Print';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { AppDataHelper } from '../../services/appDataHelper';
import { SoundHelper } from '../../services/soundHelper';
import { ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { NewScoreDialog } from './NewScoreDialog';
import { SaveScore } from './SaveScore';
import { ExampleScore } from '../../services/exampleScore';

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
			border: '1px solid #666',
			borderRadius: 16,
			backgroundColor: '#444',
			padding: '0 12px 0 4px',
			//opacity: 0.9,
			marginLeft: 16,
			'&:first-of-type': {
				marginLeft: 0,
			},
		},
		// panelText: {
		// 	marginLeft: 2,
		// 	color: '#999',
		// 	transition: 'all 0.2s ease-in-out',
		// 	'&.clickable:not(.disabled)': {
		// 		cursor: 'pointer',
		// 	},
		// 	'&.clickable:not(.disabled):hover': {
		// 		color: '#fff',
		// 	},
		// 	'&.disabled': {
		// 		color: '#666',
		// 		pointerEvents: 'none',
		// 	},
		// },
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

	const handleClickNew = useCallback(function handleClickNew() {
		setNewScoreDialogVisible(true);
	}, []);

	const handleCloseNewScoreDialog = useCallback(function handleCloseNewScoreDialog() {
		SoundHelper.start();
		setNewScoreDialogVisible(false);
	}, []);

	const handleDoneNewScoreDialog = useCallback(
		function handleDoneNewScoreDialog(newScore: Score | null) {
			setNewScoreDialogVisible(false);
			if (newScore) {
				AnalyticsHelper.sendEvent(EventCategory.SCORE, 'new score', newScore.scoreInfo.scoreTitle);
				onChangeScore(newScore);
			}
		},
		[onChangeScore],
	);

	const handleClickOpen = useCallback(
		function handleClickOpen() {
			SoundHelper.start();
			const openInput: HTMLInputElement = openInputRef.current;
			openInput.click();
		},
		[openInputRef],
	);

	const handleChangeOpenFile = useCallback(
		function handleChangeOpenFile() {
			const openInput: HTMLInputElement = openInputRef.current;
			if (!openInput.files || openInput.files.length !== 1) {
				return;
			}
			const fileReader = new FileReader();
			fileReader.onload = () => {
				if (fileReader.result) {
					const openedScore = Score.createFromModel(JSON.parse(fileReader.result.toString()));
					AnalyticsHelper.sendEvent(EventCategory.SCORE, 'open score', openedScore.scoreInfo.scoreTitle);
					onChangeScore(openedScore);
				}
			};
			fileReader.readAsText(openInput.files[0]);
		},
		[openInputRef, onChangeScore],
	);

	const handleClickSave = useCallback(function handleClickSave() {
		setGoSaveScore(true);
	}, []);

	const handleSaveScoreDone = useCallback(
		function handleSaveScoreDone() {
			setGoSaveScore(false);
			if (score) {
				AnalyticsHelper.sendEvent(EventCategory.SCORE, 'save score', score.scoreInfo.scoreTitle);
			}
		},
		[score],
	);

	const handleClickPrint = useCallback(
		function handleClickPrint() {
			alert('IMPORTANT: Please make sure background graphics are enabled in the browser print settings dialog.');
			window.print();
			if (score) {
				AnalyticsHelper.sendEvent(EventCategory.SCORE, 'print score', score.scoreInfo.scoreTitle);
			}
		},
		[score],
	);

	const handleClickExample = useCallback(
		function handleClickExample() {
			SoundHelper.start();
			const openedScore = Score.createFromModel(ExampleScore.getExampleScore());
			onChangeScore(openedScore);
		},
		[onChangeScore],
	);

	return (
		<Box id="ComposerToolbar" className={classes.root}>
			<Box className={classes.panel}>
				<IconButton onClick={handleClickNew} className={classes.actionButton}>
					<AddCircleOutlineOutlinedIcon titleAccess="New" />
				</IconButton>
				{/*<Typography onClick={handleClickNew} variant="body1" className={`${classes.panelText} clickable`}>*/}
				{/*	New*/}
				{/*</Typography>*/}
				<Modal open={newScoreDialogVisible} onClose={handleCloseNewScoreDialog}>
					<NewScoreDialog onDoneNewScoreDialog={handleDoneNewScoreDialog} />
				</Modal>
				<IconButton onClick={handleClickOpen} className={classes.actionButton}>
					<FolderOpenOutlinedIcon titleAccess="Open" />
				</IconButton>
				{/*<Typography onClick={handleClickOpen} variant="body1" className={`${classes.panelText} clickable`}>*/}
				{/*	Open*/}
				{/*</Typography>*/}
				<IconButton onClick={handleClickSave} className={classes.actionButton} disabled={!score}>
					<SaveOutlinedIcon titleAccess="Save" />
				</IconButton>
				{/*<Typography onClick={handleClickSave} variant="body1" className={`${classes.panelText} clickable ${score ? '' : 'disabled'}`}>*/}
				{/*	Save*/}
				{/*</Typography>*/}
				<input ref={openInputRef} onChange={handleChangeOpenFile} type="file" accept={`.${AppDataHelper.scoreFileExt}`} style={{ display: 'none' }} />
				<SaveScore score={score} goSaveScore={goSaveScore} onSaveScoreDone={handleSaveScoreDone} />
				<IconButton onClick={handleClickPrint} className={classes.actionButton} disabled={!score}>
					<PrintIcon titleAccess="Print" />
				</IconButton>
				{/*<Typography onClick={handleClickPrint} variant="body1" className={`${classes.panelText} clickable ${score ? '' : 'disabled'}`}>*/}
				{/*	Print*/}
				{/*</Typography>*/}
				<IconButton onClick={handleClickExample} className={classes.actionButton} disabled={!!score}>
					<MenuBookIcon titleAccess="Example" />
				</IconButton>
			</Box>
		</Box>
	);
});
