import React, { useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Button, Slider, Typography } from '@material-ui/core';
import { Score } from '../../model/score';
import { ScoreSettings } from '../../model/scoreSettings';

interface TunePageDialogProps {
	score: Score;
	onUpdateScore: () => void;
	onDoneTuneStageDialog: () => void;
}

export const TunePageDialog = React.forwardRef(({ score, onUpdateScore, onDoneTuneStageDialog }: TunePageDialogProps, _ref) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'fixed',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
			borderRadius: 8,
			width: 800,
			display: 'grid',
			gridTemplate: 'auto 1fr auto / auto',
			border: '1px solid #666',
			backgroundColor: '#222',
			padding: 24,
			color: '#fff',
			//opacity: 0.9,
		},
		header: {},
		title: {
			fontSize: 24,
			// fontFamily: 'Aguafina Script',
			userSelect: 'none',
		},
		body: {
			margin: '40px 24px 48px 24px',
		},
		form: {
			display: 'grid',
			gridTemplateColumns: 'repeat(1, 1fr)',
			gap: '16px 16px',
			userSelect: 'none',
		},
		section: {},
		label: {
			color: '#fa3',
		},
		value: {},
		formControl: {},
		slider: {
			'& .MuiSlider-rail': {
				color: '#ccc',
			},
			'& .MuiSlider-root': {
				color: '#fff',
			},
			'& .MuiSlider-thumb': {
				boxShadow: 'none',
			},
			'& .MuiSlider-markLabel': {
				color: '#aaa',
			},
			'& .MuiSlider-markLabelActive': {
				color: '#fff',
			},
			'& .MuiSlider-root.Mui-disabled': {
				opacity: 0.5,
				'& .MuiSlider-thumb': {
					color: '#aaa',
				},
				'& .MuiSlider-markLabelActive': {
					color: '#aaa',
				},
			},
		},
		footer: {
			display: 'flex',
			justifyContent: 'flex-end',
		},
		actionButton: {
			height: 32,
			marginLeft: 16,
			'&.MuiButton-contained.Mui-disabled': {
				backgroundColor: '#333',
			},
		},
	}));
	const classes = useStyles();

	const handleChangeMusicWidth = useCallback(
		(_e, value) => {
			if (score.scoreSettings.musicWidth === value) {
				return;
			}
			score.scoreSettings.musicWidth = value;
			onUpdateScore();
		},
		[score, onUpdateScore],
	);

	const handleChangeRowGap = useCallback(
		(_e, value) => {
			if (score.scoreSettings.rowGap === value) {
				return;
			}
			score.scoreSettings.rowGap = value;
			onUpdateScore();
		},
		[score, onUpdateScore],
	);

	const handleChangeQuarterSize = useCallback(
		(_e, value) => {
			if (score.scoreSettings.quarterSize === value) {
				return;
			}
			score.scoreSettings.quarterSize = value;
			onUpdateScore();
		},
		[score, onUpdateScore],
	);

	const handleChangeLyricsSize = useCallback(
		(_e, value) => {
			if (score.scoreSettings.lyricsSize === value) {
				return;
			}
			score.scoreSettings.lyricsSize = value;
			onUpdateScore();
		},
		[score, onUpdateScore],
	);

	const handleClickClose = useCallback(() => {
		onDoneTuneStageDialog();
	}, [onDoneTuneStageDialog]);

	return (
		<Box id="TunePageDialog" className={classes.root}>
			<Box className={classes.header}>
				<Box className={classes.title}>Tune Page</Box>
			</Box>
			<Box className={classes.body}>
				<form className={classes.form} noValidate autoComplete="off">
					<Box className={classes.section}>
						<Typography variant="body1" className={classes.label}>
							Music Section Width
						</Typography>
						<Typography variant="body2" className={classes.value}>
							{score.scoreSettings.musicWidth}
						</Typography>
						<Box className={classes.slider}>
							<Slider
								onChange={handleChangeMusicWidth}
								min={ScoreSettings.ranges.musicWidth.min}
								max={ScoreSettings.ranges.musicWidth.max}
								step={1}
								value={score.scoreSettings.musicWidth}
								marks
								track={false}
								valueLabelDisplay="off"
							/>
						</Box>
					</Box>
					<Box className={classes.section}>
						<Typography variant="body1" className={classes.label}>
							Gap Between Rows
						</Typography>
						<Typography variant="body2" className={classes.value}>
							{score.scoreSettings.rowGap}
						</Typography>
						<Box className={classes.slider}>
							<Slider
								onChange={handleChangeRowGap}
								min={ScoreSettings.ranges.rowGap.min}
								max={ScoreSettings.ranges.rowGap.max}
								step={1}
								value={score.scoreSettings.rowGap}
								marks
								track={false}
								valueLabelDisplay="off"
							/>
						</Box>
					</Box>
					<Box className={classes.section}>
						<Typography variant="body1" className={classes.label}>
							Quarter Note Size
						</Typography>
						<Typography variant="body2" className={classes.value}>
							{score.scoreSettings.quarterSize}
						</Typography>
						<Box className={classes.slider}>
							<Slider
								onChange={handleChangeQuarterSize}
								min={ScoreSettings.ranges.quarterSize.min}
								max={ScoreSettings.ranges.quarterSize.max}
								step={1}
								value={score.scoreSettings.quarterSize}
								marks
								track={false}
								valueLabelDisplay="off"
							/>
						</Box>
					</Box>
					<Box className={classes.section}>
						<Typography variant="body1" className={classes.label}>
							Lyrics Font Size
						</Typography>
						<Typography variant="body2" className={classes.value}>
							{score.scoreSettings.lyricsSize}
						</Typography>
						<Box className={classes.slider}>
							<Slider
								onChange={handleChangeLyricsSize}
								min={ScoreSettings.ranges.lyricsSize.min}
								max={ScoreSettings.ranges.lyricsSize.max}
								step={1}
								marks
								value={score.scoreSettings.lyricsSize}
								track={false}
								valueLabelDisplay="off"
							/>
						</Box>
					</Box>
				</form>
			</Box>
			<Box className={classes.footer}>
				<Button onClick={handleClickClose} variant="contained" size="small" className={classes.actionButton}>
					Close
				</Button>
			</Box>
		</Box>
	);
});
