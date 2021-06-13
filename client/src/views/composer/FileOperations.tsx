import React, { useCallback, useEffect, useRef } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { AppDataHelper } from '../../services/appDataHelper';
import { Score } from '../../score/score';
import { ScoreContextContainer } from '../../hooks/useScoreContext';

export interface FileOperationsProps {
	openScoreDialogVisible: boolean;
	onOpenScoreDialogDone: () => void;
	goDownloadScore: boolean;
	onDownloadScoreDone: () => void;
}

export const FileOperations = ({ openScoreDialogVisible, onOpenScoreDialogDone, goDownloadScore, onDownloadScoreDone }: FileOperationsProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			display: 'none',
		},
	}));
	const classes = useStyles();

	const { score, setScore } = ScoreContextContainer.useContainer();
	const openInputRef = useRef<any>();
	const downloadLinkRef = useRef<any>();

	useEffect(() => {
		if (openScoreDialogVisible) {
			const openInput: HTMLInputElement = openInputRef.current;
			openInput.click();
		}
	}, [openScoreDialogVisible, openInputRef]);

	const handleChangeOpenFile = useCallback(() => {
		const openInput: HTMLInputElement = openInputRef.current;
		if (!openInput.files || openInput.files.length !== 1) {
			onOpenScoreDialogDone();
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			if (fileReader.result) {
				const openedScore = new Score();
				openedScore.initFromModel(JSON.parse(fileReader.result.toString()));
				setScore(openedScore);
			}
			onOpenScoreDialogDone();
		};
		fileReader.readAsText(openInput.files[0]);
	}, [openInputRef, onOpenScoreDialogDone, setScore]);

	useEffect(() => {
		if (goDownloadScore) {
			const downloadLink: HTMLAnchorElement = downloadLinkRef.current;
			downloadLink.setAttribute('href', window.URL.createObjectURL(new Blob([JSON.stringify(score)], { type: 'application/json;charset=utf-8' })));
			downloadLink.setAttribute('download', `${score?.scoreInfo.scoreTitle || 'My Score'}.${AppDataHelper.scoreFileExt}`);
			downloadLink.click();
			onDownloadScoreDone();
		}
	}, [downloadLinkRef, score, goDownloadScore, onDownloadScoreDone]);

	return (
		<Box id="FileOperations" className={`${classes.root}`}>
			<input ref={openInputRef} onChange={handleChangeOpenFile} type="file" accept={`.${AppDataHelper.scoreFileExt}`} style={{ display: 'none' }} />
			<a href="/#" ref={downloadLinkRef} style={{ display: 'none' }}>
				save
			</a>
		</Box>
	);
};
