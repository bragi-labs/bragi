import React, { memo, useCallback, useEffect, useRef } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { AppDataHelper } from '../../services/appDataHelper';
import { Score } from '../../score/score';

export interface FileOperationsProps {
	score: Score;
	openDialog: boolean;
	onOpenScoreDone: (score: Score | null) => void;
	saveDialog: boolean;
	onSaveScoreDone: () => void;
}

export const FileOperations = memo(({ score, openDialog, onOpenScoreDone, saveDialog, onSaveScoreDone }: FileOperationsProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			display: 'none',
		},
	}));
	const classes = useStyles();

	const openInputRef = useRef<any>();
	const saveLinkRef = useRef<any>();

	useEffect(() => {
		if (openDialog) {
			const openInput: HTMLInputElement = openInputRef.current;
			openInput.click();
		}
	}, [openDialog]);

	const handleChangeOpenFile = useCallback(() => {
		const openInput: HTMLInputElement = openInputRef.current;
		if (!openInput.files || openInput.files.length !== 1) {
			onOpenScoreDone(null);
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			if (fileReader.result) {
				const openedScore = new Score();
				openedScore.initFromModel(JSON.parse(fileReader.result.toString()));
				onOpenScoreDone(openedScore);
			} else {
				onOpenScoreDone(null);
			}
		};
		fileReader.readAsText(openInput.files[0]);
	}, [openInputRef, onOpenScoreDone]);

	useEffect(() => {
		if (saveDialog) {
			const saveLink: HTMLAnchorElement = saveLinkRef.current;
			saveLink.setAttribute('href', window.URL.createObjectURL(new Blob([JSON.stringify(score)], { type: 'application/json;charset=utf-8' })));
			saveLink.setAttribute('download', `${score.scoreInfo.scoreTitle || 'My Score'}.${AppDataHelper.scoreFileExt}`);
			saveLink.click();
			onSaveScoreDone();
		}
	}, [score, saveDialog, onSaveScoreDone]);

	return (
		<Box id="FileOperations" className={`${classes.root}`}>
			<input ref={openInputRef} onChange={handleChangeOpenFile} type="file" accept={`.${AppDataHelper.scoreFileExt}`} style={{ display: 'none' }} />
			<a href="/#" ref={saveLinkRef} style={{ display: 'none' }}>
				save
			</a>
		</Box>
	);
});
