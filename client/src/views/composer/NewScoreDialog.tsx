import React, { useState, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Score } from '../../model/score';

interface NewScoreDialogProps {
	onNewScoreDialogDone: (newScore: Score | null) => void;
}

export const NewScoreDialog = React.forwardRef(({ onNewScoreDialogDone }: NewScoreDialogProps, _ref) => {
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
			opacity: 0.85,
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
			gridTemplateColumns: 'repeat(2, 1fr)',
			gap: '40px 40px',
			userSelect: 'none',
			'& label.Mui-focused': {
				color: '#fa3',
			},
			'& .MuiInput-underline:after': {
				borderBottomColor: '#fff',
			},
		},
		formControl: {},
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

	const [isOk, setIsOk] = useState(false);
	const [scoreTitle, setScoreTitle] = useState('');
	const [scoreCredits, setScoreCredits] = useState('');
	const [arrangerName, setArrangerName] = useState('');
	const [timeSignature, setTimeSignature] = useState('4/4');
	const [pickupMeasure, setPickupMeasure] = useState('no');
	const [numberOfMeasures, setNumberOfMeasures] = useState<string>('16');

	const handleChangeScoreTitle = (event: any) => {
		setScoreTitle(event.target.value);
		setIsOk(!!event.target.value);
	};

	const handleChangeScoreCredits = (event: any) => {
		setScoreCredits(event.target.value);
	};

	const handleChangeArrangerName = (event: any) => {
		setArrangerName(event.target.value);
	};

	const handleChangeTimeSignature = (event: any) => {
		setTimeSignature(event.target.value);
	};

	const handleChangePickupMeasure = (event: any) => {
		setPickupMeasure(event.target.value);
	};

	const handleChangeNumberOfMeasurements = (event: any) => {
		setNumberOfMeasures(event.target.value);
	};

	const handleClickCancel = useCallback(() => {
		onNewScoreDialogDone(null);
	}, [onNewScoreDialogDone]);

	const handleClickOK = useCallback(() => {
		const newScore = Score.createFromNewDialog({ scoreTitle, scoreCredits, arrangerName, timeSignature, pickupMeasure, numberOfMeasures: Number(numberOfMeasures) || 16 });
		onNewScoreDialogDone(newScore);
	}, [scoreTitle, scoreCredits, arrangerName, timeSignature, pickupMeasure, numberOfMeasures, onNewScoreDialogDone]);

	return (
		<Box id="NewScoreDialog" className={classes.root}>
			<Box className={classes.header}>
				<Box className={classes.title}>New Score</Box>
			</Box>
			<Box className={classes.body}>
				<form className={classes.form} noValidate autoComplete="off">
					<TextField label="Score Title" value={scoreTitle} onChange={handleChangeScoreTitle} placeholder="e.g. Bohemian Rhapsody" autoFocus={true} />
					<TextField label="Score Credits" value={scoreCredits} onChange={handleChangeScoreCredits} placeholder="e.g. Words & Music by Freddie Mercury" />
					<TextField label="Arranger Name" value={arrangerName} onChange={handleChangeArrangerName} placeholder="Your name" />
					<FormControl className={classes.formControl}>
						<InputLabel id="time-signature-label">Time Signature</InputLabel>
						<Select id="time-signature" value={timeSignature} onChange={handleChangeTimeSignature}>
							<MenuItem value="2/4">2/4</MenuItem>
							<MenuItem value="3/4">3/4</MenuItem>
							<MenuItem value="4/4">4/4</MenuItem>
							<MenuItem value="5/4">5/4</MenuItem>
							<MenuItem value="7/4">7/4</MenuItem>
							<MenuItem value="8/4">8/4</MenuItem>
							<MenuItem value="3/8">3/8</MenuItem>
							<MenuItem value="4/8">4/8</MenuItem>
							<MenuItem value="6/8">6/8</MenuItem>
							<MenuItem value="7/8">7/8</MenuItem>
							<MenuItem value="8/8">8/8</MenuItem>
						</Select>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel id="pickup-measure-label">Pickup Measure (initial bar)</InputLabel>
						<Select id="pickup-measure" value={pickupMeasure} onChange={handleChangePickupMeasure}>
							<MenuItem value="yes">Yes</MenuItem>
							<MenuItem value="no">No</MenuItem>
						</Select>
					</FormControl>
					<TextField label="Number of Measurements" value={numberOfMeasures} onChange={handleChangeNumberOfMeasurements} placeholder="e.g. 16" />
				</form>
			</Box>
			<Box className={classes.footer}>
				<Button disabled={!isOk} onClick={handleClickOK} variant="contained" size="small" className={classes.actionButton}>
					OK
				</Button>
				<Button onClick={handleClickCancel} variant="contained" size="small" className={classes.actionButton}>
					Cancel
				</Button>
			</Box>
		</Box>
	);
});
