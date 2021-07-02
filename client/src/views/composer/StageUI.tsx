import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { IconButton, Modal, Typography } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import { ScoreModel } from '../../model/scoreModel';
import { MusicUI } from './MusicUI';
import { AppDataHelper } from '../../services/appDataHelper';
import { TuneStageDialog } from './TuneStageDialog';

export interface StageUIProps {
	score: ScoreModel;
	onUpdateScore: () => void;
}

export const StageUI = ({ score, onUpdateScore }: StageUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			//width: '21cm',
			//height: '29.7cm',
			height: '100%',
			textAlign: 'center',
			//backgroundColor: '#eee',
			backgroundColor: '#fff',
			//backgroundImage: 'linear-gradient(135deg, #fff 47.06%, #ccc 47.06%, #ccc 50%, #fff 50%, #fff 97.06%, #ccc 97.06%, #ccc 100%)',
			//backgroundSize: '24px 24px',
			padding: '2.54cm 1.32cm 3.67cm 1.9cm',
			//opacity: 0.9,
			overflow: 'auto',
			'@media print': {
				padding: '0 !important',
				opacity: 1,
				overflow: 'visible',
			},
		},
		content: {
			maxHeight: '27.7cm',
			overflow: 'hidden',
			backgroundColor: '#fff',
			color: '#000',
		},
		tuneButton: {
			position: 'absolute',
			left: 16,
			top: 16,
			width: 24,
			height: 24,
			textAlign: 'center',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			color: '#666',
			'&:hover': {
				color: '#333',
			},
			'&.disabled': {
				pointerEvents: 'none',
				color: '#999',
			},
			'@media print': {
				display: 'none',
			},
		},
		header: {
			paddingBottom: 32,
		},
		scoreTitle: {
			display: 'flex',
			justifyContent: 'center',
			color: '#000',
		},
		scoreCredits: {
			display: 'flex',
			justifyContent: 'center',
			color: '#666',
		},
		arrangedBy: {
			display: 'flex',
			justifyContent: 'center',
			color: '#999',
			fontSize: '12px',
		},
		musicContainer: {
			display: 'flex',
			justifyContent: 'center',
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
							<TuneStageDialog score={score} onUpdateScore={handleScoreUpdated} onDoneTuneStageDialog={handleDoneTuneStageDialog} />
						</Modal>
						<Box className={classes.header}>
							<Typography variant="h4" className={classes.scoreTitle}>
								{score.scoreInfo.scoreTitle}
							</Typography>
							<Typography variant="h6" className={classes.scoreCredits}>
								{score.scoreInfo.scoreCredits}
							</Typography>
						</Box>
						<Box className={classes.musicContainer}>
							<MusicUI music={score.music} scoreSettings={score.scoreSettings} />
						</Box>
						{score.scoreInfo.arrangerName && (
							<Typography variant="body2" className={classes.arrangedBy}>{`Arranged by ${score.scoreInfo.arrangerName} using ${AppDataHelper.appName}`}</Typography>
						)}
						{!score.scoreInfo.arrangerName && (
							<Typography variant="body2" className={classes.arrangedBy}>
								{AppDataHelper.appName}
							</Typography>
						)}
					</Box>
				</Box>
			)}
		</>
	);
};
