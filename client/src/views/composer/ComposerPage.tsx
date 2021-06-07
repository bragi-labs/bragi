import React, { memo, useCallback, useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Modal } from '@material-ui/core';
import { AppDataHelper } from '../../services/appDataHelper';
import { Score } from '../../score/score';
import { ComposerToolbar } from './ComposerToolbar';
import { NewScoreDialog, NewScoreDialogResult } from './NewScoreDialog';

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
	const openInputRef = useRef<any>();
	const saveLinkRef = useRef<any>();

	const handleClickNew = useCallback(() => {
		setNewScoreDialog(true);
	}, []);

	const handleDoneNewScoreDialog = useCallback<(newScoreDialogResult: NewScoreDialogResult | null) => void>((newScoreDialogResult: NewScoreDialogResult | null) => {
		setNewScoreDialog(false);
		if (newScoreDialogResult) {
			const newScore = new Score();
			newScore.initFromNewDialog(newScoreDialogResult);
			setScore(newScore);
		}
	}, []);

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
				setScore(JSON.parse(fileReader.result.toString()));
			}
		};
		fileReader.readAsText(openInput.files[0]);
	}, [openInputRef]);

	const handleClickSave = useCallback(() => {
		const saveLink: HTMLAnchorElement = saveLinkRef.current;
		saveLink.setAttribute('href', window.URL.createObjectURL(new Blob([JSON.stringify(score)], { type: 'application/json;charset=utf-8' })));
		saveLink.setAttribute('download', `${score.scoreInfo.scoreTitle || 'My Score'}.${AppDataHelper.scoreFileExt}`);
		saveLink.click();
	}, [score, saveLinkRef]);

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar onClickNew={handleClickNew} onClickOpen={handleClickOpen} onClickSave={handleClickSave} />
				<Modal open={newScoreDialog}>
					<NewScoreDialog onDone={handleDoneNewScoreDialog} />
				</Modal>
			</Box>
			<input ref={openInputRef} onChange={handleChangeOpenFile} type="file" accept={`.${AppDataHelper.scoreFileExt}`} style={{ display: 'none' }} />
			<a href="/#" ref={saveLinkRef} style={{ display: 'none' }}>
				save
			</a>
		</Box>
	);
});
