import React, { useCallback, useEffect, useRef } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { AppDataHelper } from '../../services/appDataHelper';
import { Score } from '../../model/score';

export interface OpenScoreDialogProps {
	openScoreDialogVisible: boolean;
	onOpenScoreDialogDone: (score: Score | null) => void;
}

export const OpenScoreDialog = ({ openScoreDialogVisible, onOpenScoreDialogDone }: OpenScoreDialogProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			display: 'none',
		},
	}));
	const classes = useStyles();

	const openInputRef = useRef<any>();

	useEffect(() => {
		if (openScoreDialogVisible) {
			const openInput: HTMLInputElement = openInputRef.current;
			openInput.click();
		}
	}, [openScoreDialogVisible, openInputRef]);

	const handleChangeOpenFile = useCallback(() => {
		const openInput: HTMLInputElement = openInputRef.current;
		if (!openInput.files || openInput.files.length !== 1) {
			onOpenScoreDialogDone(null);
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			let openedScore = null;
			if (fileReader.result) {
				openedScore = new Score();
				openedScore.initFromModel(JSON.parse(fileReader.result.toString()));
			}
			onOpenScoreDialogDone(openedScore);
		};
		fileReader.readAsText(openInput.files[0]);
	}, [openInputRef, onOpenScoreDialogDone]);

	return (
		<Box id="OpenScoreDialog" className={`${classes.root}`}>
			<input ref={openInputRef} onChange={handleChangeOpenFile} type="file" accept={`.${AppDataHelper.scoreFileExt}`} style={{ display: 'none' }} />
		</Box>
	);
};
