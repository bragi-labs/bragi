import React, { useCallback, useRef, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { IconButton, Modal, TextField, Typography } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import { ScoreModel } from '../../model/scoreModel';
import { MusicUI } from './MusicUI';
import { AppDataHelper } from '../../services/appDataHelper';
import { TunePageDialog } from './TunePageDialog';

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
		header: {
			paddingBottom: 32,
		},
		scoreTitle: {
			display: 'flex',
			justifyContent: 'center',
			color: '#000',
			cursor: 'pointer',
		},
		scoreTitleInput: {
			top: -6,
			'& .MuiInput-input': {
				color: '#000',
				fontSize: 34,
			},
		},
		scoreCredits: {
			display: 'flex',
			justifyContent: 'center',
			color: '#666',
			cursor: 'pointer',
		},
		scoreCreditsInput: {
			top: -4,
			'& .MuiInput-input': {
				color: '#000',
				fontSize: 20,
			},
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
	const scoreTitleTextRef = useRef<HTMLHeadingElement | null>(null);
	const scoreTitleInputRef = useRef<HTMLInputElement | null>(null);
	const scoreCreditsTextRef = useRef<HTMLHeadingElement | null>(null);
	const scoreCreditsInputRef = useRef<HTMLInputElement | null>(null);

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

	const handleClickScoreTitle = useCallback(() => {
		const scoreTitleText = scoreTitleTextRef.current;
		const scoreTitleInput = scoreTitleInputRef.current;
		if (!scoreTitleText || !scoreTitleInput) {
			return;
		}
		scoreTitleText.style.display = 'none';
		scoreTitleInput.style.display = 'inline-flex';
		(scoreTitleInput.children[0].children[0] as HTMLInputElement).focus();
	}, [scoreTitleTextRef, scoreTitleInputRef]);

	const handleBlurScoreTitle = useCallback(() => {
		const scoreTitleText = scoreTitleTextRef.current;
		const scoreTitleInput = scoreTitleInputRef.current;
		if (!scoreTitleText || !scoreTitleInput) {
			return;
		}
		scoreTitleText.style.display = 'flex';
		scoreTitleInput.style.display = 'none';
		score.scoreInfo.scoreTitle = (scoreTitleInput.children[0].children[0] as HTMLInputElement).value || `<SCORE TITLE>`;
		onUpdateScore();
	}, [scoreTitleTextRef, scoreTitleInputRef, score, onUpdateScore]);

	const handleClickScoreCredits = useCallback(() => {
		const scoreCreditsText = scoreCreditsTextRef.current;
		const scoreCreditsInput = scoreCreditsInputRef.current;
		if (!scoreCreditsText || !scoreCreditsInput) {
			return;
		}
		scoreCreditsText.style.display = 'none';
		scoreCreditsInput.style.display = 'inline-flex';
		(scoreCreditsInput.children[0].children[0] as HTMLInputElement).focus();
	}, [scoreCreditsTextRef, scoreCreditsInputRef]);

	const handleBlurScoreCredits = useCallback(() => {
		const scoreCreditsText = scoreCreditsTextRef.current;
		const scoreCreditsInput = scoreCreditsInputRef.current;
		if (!scoreCreditsText || !scoreCreditsInput) {
			return;
		}
		scoreCreditsText.style.display = 'flex';
		scoreCreditsInput.style.display = 'none';
		score.scoreInfo.scoreCredits = (scoreCreditsInput.children[0].children[0] as HTMLInputElement).value || `<SCORE CREDITS>`;
		onUpdateScore();
	}, [scoreCreditsTextRef, scoreCreditsInputRef, score, onUpdateScore]);

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
						<Box className={classes.header}>
							<Typography ref={scoreTitleTextRef} onClick={handleClickScoreTitle} variant="h4" className={classes.scoreTitle}>
								{score.scoreInfo.scoreTitle}
							</Typography>
							<TextField
								ref={scoreTitleInputRef}
								defaultValue={score.scoreInfo.scoreTitle}
								onBlur={handleBlurScoreTitle}
								className={classes.scoreTitleInput}
								style={{ display: 'none' }}
								label=""
							/>
							<Typography ref={scoreCreditsTextRef} onClick={handleClickScoreCredits} variant="h6" className={classes.scoreCredits}>
								{score.scoreInfo.scoreCredits}
							</Typography>
							<TextField
								ref={scoreCreditsInputRef}
								defaultValue={score.scoreInfo.scoreCredits}
								onBlur={handleBlurScoreCredits}
								className={classes.scoreCreditsInput}
								style={{ display: 'none' }}
								label=""
							/>
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
