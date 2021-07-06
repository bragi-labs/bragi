import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { IconButton, Modal } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import { ScoreModel } from '../../model/scoreModel';
import { TunePageDialog } from './TunePageDialog';
import { StageHeaderUI } from './StageHeaderUI';
import { MusicUI } from './MusicUI';
import { StageFooterUI } from './StageFooterUI';

export interface StageUIProps {
	score: ScoreModel;
	onUpdateScore: () => void;
}

export const StageUI = ({ score, onUpdateScore }: StageUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			textAlign: 'center',
			//backgroundColor: '#eee',
			backgroundColor: '#fff',
			//backgroundImage: 'linear-gradient(135deg, #fff 47.06%, #ccc 47.06%, #ccc 50%, #fff 50%, #fff 97.06%, #ccc 97.06%, #ccc 100%)',
			//backgroundSize: '24px 24px',
			padding: '2.54cm 1.32cm 3.67cm 1.9cm',
			overflow: 'auto',
			'@media print': {
				padding: '0 !important',
				opacity: 1,
				overflow: 'visible',
			},
		},
		content: {
			backgroundColor: '#fff',
			color: '#000',
		},
		tuneButton: {
			position: 'fixed',
			left: 16,
			top: 16,
			width: 24,
			height: 24,
			textAlign: 'center',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			color: '#333',
			'&:hover': {
				color: '#000',
			},
			'&.disabled': {
				pointerEvents: 'none',
				color: '#999',
			},
			'@media print': {
				display: 'none',
			},
		},
	}));
	const classes = useStyles();

	const pageWidth = 776;
	const stageWidth = 718;

	const [tuneStageDialogVisible, setTuneStageDialogVisible] = useState(false);

	const handleClickTune = useCallback(() => {
		setTuneStageDialogVisible(true);
	}, []);

	const handleScoreUpdated = useCallback(() => {
		onUpdateScore();
	}, [onUpdateScore]);

	const handleCloseTuneStageDialog = useCallback(() => {
		setTuneStageDialogVisible(false);
	}, []);

	const handleDoneTuneStageDialog = useCallback(() => {
		setTuneStageDialogVisible(false);
	}, []);

	return (
		<>
			{score && (
				<Box id="StageUI" className={`${classes.root} no-scrollbar`} style={{ width: `${pageWidth}px`, padding: `${(pageWidth - stageWidth) / 2}px` }}>
					<Box className={classes.content} style={{ width: `${stageWidth}px` }}>
						<IconButton onClick={handleClickTune} className={`${classes.tuneButton}`} disabled={!score}>
							<TuneIcon titleAccess="Tune Page" />
						</IconButton>
						<Modal open={tuneStageDialogVisible} onClose={handleCloseTuneStageDialog}>
							<TunePageDialog score={score} onUpdateScore={handleScoreUpdated} onDoneTuneStageDialog={handleDoneTuneStageDialog} />
						</Modal>
						<StageHeaderUI scoreInfo={score.scoreInfo} onUpdateScore={handleScoreUpdated} />
						<MusicUI music={score.music} scoreSettings={score.scoreSettings} />
						<StageFooterUI scoreInfo={score.scoreInfo} />
					</Box>
				</Box>
			)}
		</>
	);
};
