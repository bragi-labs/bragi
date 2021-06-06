import React, { memo, useState, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

interface NewScoreDialogProps {
	onClose: () => void;
}

export const NewScoreDialog = memo(({ onClose }: NewScoreDialogProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'fixed',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
			borderRadius: 8,
			backgroundColor: '#000',
			width: 800,
			display: 'grid',
			gridTemplate: 'auto 1fr auto / auto',
			color: '#fff',
			opacity: 0.6,
			padding: 24,
		},
		header: {},
		title: {
			fontSize: 32,
			fontFamily: 'Aguafina Script',
			userSelect: 'none',
		},
		body: {
			margin: '0 24px 48px 24px',
		},
		form: {
			display: 'grid',
			gridTemplateColumns: 'repeat(1, 1fr)',
			gap: '32px 32px',
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
		},
	}));
	const classes = useStyles();

	const [scoreTitle, setScoreTitle] = useState('');
	const [scoreCredits, setScoreCredits] = useState('');
	const [arrangerName, setArrangerName] = useState('');
	const [timeSignature, setTimeSignature] = useState('4/4');
	const [pickupMeasure, setPickupMeasure] = useState('no');

	const handleChangeScoreTitle = (event: any) => {
		setScoreTitle(event.target.value);
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

	const handleClickClose = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleClickOK = useCallback(() => {
		onClose();
	}, [onClose]);

	return (
		<Box id="NewScoreDialog" className={classes.root}>
			<Box className={classes.header}>
				<Box className={classes.title}>New Score</Box>
			</Box>
			<Box className={classes.body}>
				<form className={classes.form} noValidate autoComplete="off">
					<TextField label="Score Title" value={scoreTitle} onChange={handleChangeScoreTitle} placeholder="e.g. Bohemian Rhapsody" />
					<TextField label="Score Credits" value={scoreCredits} onChange={handleChangeScoreCredits} placeholder="e.g. Words & Music by Freddie Mercury" />
					<TextField label="Arranger Name" value={arrangerName} onChange={handleChangeArrangerName} placeholder="Your name" />
					<FormControl className={classes.formControl}>
						<InputLabel id="time-signature-label">Time Signature</InputLabel>
						<Select id="time-signature" value={timeSignature} onChange={handleChangeTimeSignature}>
							<MenuItem value="2/4">2/4</MenuItem>
							<MenuItem value="3/4">3/4</MenuItem>
							<MenuItem value="4/4">4/4</MenuItem>
							<MenuItem value="8/4">8/4</MenuItem>
							<MenuItem value="4/8">4/8</MenuItem>
							<MenuItem value="6/8">6/8</MenuItem>
							<MenuItem value="8/8">8/8</MenuItem>
						</Select>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel id="pickup-measure-label">Pickup Measure (initial bar)</InputLabel>
						<Select id="pickup-measure" value={pickupMeasure} onChange={handleChangePickupMeasure}>
							<MenuItem value="no">No</MenuItem>
							<MenuItem value="2/4">2/4</MenuItem>
							<MenuItem value="3/4">3/4</MenuItem>
							<MenuItem value="4/4">4/4</MenuItem>
							<MenuItem value="8/4">8/4</MenuItem>
							<MenuItem value="4/8">4/8</MenuItem>
							<MenuItem value="6/8">6/8</MenuItem>
							<MenuItem value="8/8">8/8</MenuItem>
						</Select>
					</FormControl>
				</form>
			</Box>
			<Box className={classes.footer}>
				<Button onClick={handleClickOK} variant="contained" size="small" className={classes.actionButton}>
					OK
				</Button>
				<Button onClick={handleClickClose} variant="contained" size="small" className={classes.actionButton}>
					Cancel
				</Button>
			</Box>
		</Box>
	);
});
