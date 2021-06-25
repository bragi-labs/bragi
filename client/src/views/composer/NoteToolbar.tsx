import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Button, Typography } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { NoteModel, ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';

export interface NoteToolbarProps {
	score: ScoreModel | null;
	onUpdateScore: () => void;
}

export const NoteToolbar = ({ score, onUpdateScore }: NoteToolbarProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			//width: 827,
			display: 'grid',
			gridTemplate: 'auto auto auto / 1fr',
			gap: '24px 0',
			//opacity: 0.9,
			borderRadius: 16,
			backgroundColor: '#333',
			padding: 24,
		},
		panel: {
			display: 'inline-flex',
			alignItems: 'center',
			height: 32,
			marginRight: 24,
			backgroundColor: '#222',
			padding: '0 4px',
			borderRadius: 16,
			textShadow: '1px 1px #000',
		},
		panelText: {
			color: '#ccc',
			'&.disabled': {
				color: '#666',
			},
		},
		noteLengthControl: {
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
		actionButton: {
			margin: '0 4px',
			width: 24,
			height: 24,
			textAlign: 'center',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			color: '#ccc',
			'&:hover': {
				color: '#fff',
			},
			'&.disabled': {
				pointerEvents: 'none',
				color: '#666',
			},
		},
		noteLengthButton: {
			borderRadius: 24,
		},
	}));
	const classes = useStyles();

	const { selection } = SelectionContextContainer.useContainer();
	const [canChangeLength, setCanChangeLength] = useState(false);
	const [canPitchDown, setCanPitchDown] = useState(false);
	const [canPitchUp, setCanPitchUp] = useState(false);
	const [canOctaveDown, setCanOctaveDown] = useState(false);
	const [canOctaveUp, setCanOctaveUp] = useState(false);
	const [canDelete, setCanDelete] = useState(false);

	const noteLengthOptions = [
		{ duration: 6, label: '1/16' },
		{ duration: 12, label: '1/8' },
		{ duration: 18, label: '3/16' },
		{ duration: 24, label: '1/4' },
		{ duration: 36, label: '3/8' },
		{ duration: 48, label: '1/2' },
		{ duration: 72, label: '3/4' },
		{ duration: 96, label: '1' },
	];

	useEffect(() => {
		setCanChangeLength(false);
		setCanPitchDown(false);
		setCanPitchUp(false);
		setCanOctaveDown(false);
		setCanOctaveUp(false);
		setCanDelete(false);
		if (!score || !selection || selection.items.length === 0) {
			return;
		}
		let note;
		let noteDetails;
		setCanChangeLength(
			selection.items.every((item) => {
				note = item.noteId && Score.findNote(score, item.noteId);
				return note && !note.isRest;
			}),
		);
		setCanPitchDown(
			selection.items.every((item) => {
				note = item.noteId && Score.findNote(score, item.noteId);
				if (!note || note.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(note.fullName);
				return !(noteDetails.step === 'C' && !noteDetails.alter && noteDetails.octave === MusicalHelper.minOctave);
			}),
		);
		setCanPitchUp(
			selection.items.every((item) => {
				note = item.noteId && Score.findNote(score, item.noteId);
				if (!note || note.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(note.fullName);
				return !(noteDetails.step === 'B' && !noteDetails.alter && noteDetails.octave === MusicalHelper.maxOctave);
			}),
		);
		setCanOctaveDown(
			selection.items.every((item) => {
				note = item.noteId && Score.findNote(score, item.noteId);
				if (!note || note.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(note.fullName);
				return noteDetails.octave !== MusicalHelper.minOctave;
			}),
		);
		setCanOctaveUp(
			selection.items.every((item) => {
				note = item.noteId && Score.findNote(score, item.noteId);
				if (!note || note.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(note.fullName);
				return noteDetails.octave !== MusicalHelper.maxOctave;
			}),
		);
		setCanDelete(
			selection.items.every((item) => {
				note = item.noteId && Score.findNote(score, item.noteId);
				return note && !note.isRest;
			}),
		);
	}, [selection, score]);

	const getSelectedNonRestNotes = useCallback(() => {
		if (!score || !selection) {
			return [];
		}
		const notes: NoteModel[] = [];
		selection.items.forEach((item) => {
			const note = Score.findNote(score, item.noteId);
			if (note && !note.isRest) {
				notes.push(note);
			}
		});
		return notes;
	}, [score, selection]);

	const handleClickDelete = useCallback(() => {
		const notes: NoteModel[] = getSelectedNonRestNotes();
		if (notes.length) {
			notes.forEach((note) => {
				note.fullName = '';
				note.isRest = true;
			});
			onUpdateScore();
		}
	}, [getSelectedNonRestNotes, onUpdateScore]);

	const handleChangePitch = useCallback(
		(event) => {
			const notes: NoteModel[] = getSelectedNonRestNotes();
			if (notes.length) {
				notes.forEach((note) => {
					if (!score) {
						return;
					}
					const measure = Score.findMeasure(score, note.measureId);
					if (!measure) {
						return;
					}
					if (event.currentTarget.dataset.amount === 'octave') {
						const noteDetails = MusicalHelper.parseNote(note.fullName);
						note.fullName = `${noteDetails.step}${noteDetails.alter}${
							event.currentTarget.dataset.direction === 'up' ? noteDetails.octave + 1 : noteDetails.octave - 1
						}`;
					} else {
						note.fullName = MusicalHelper.changePitch(note.fullName, measure.musicalScale, event.currentTarget.dataset.direction === 'up');
					}
					SoundHelper.playShortNote(note.fullName);
				});
				onUpdateScore();
			}
		},
		[getSelectedNonRestNotes, score, onUpdateScore],
	);

	const handleClickNoteLength = useCallback(() => {}, []);

	return (
		<Box id="NoteToolbar" className={classes.root}>
			<Box>
				<Box className={classes.panel}>
					{noteLengthOptions.map((o, i) => (
						<Button
							key={i}
							onClick={handleClickNoteLength}
							disabled={!canChangeLength}
							className={`${classes.actionButton} ${classes.noteLengthButton} ${canChangeLength ? '' : 'disabled'}`}
						>
							{o.label}
						</Button>
					))}
				</Box>
			</Box>
			<Box>
				<Box className={classes.panel}>
					<ArrowDownwardIcon
						onClick={handleChangePitch}
						data-direction="down"
						data-amount="semitone"
						className={`${classes.actionButton} ${canPitchDown ? '' : 'disabled'}`}
						titleAccess="Pitch Down"
					/>
					<Typography variant="body1" className={`${classes.panelText} ${canPitchUp || canPitchDown ? '' : 'disabled'}`}>
						pitch
					</Typography>
					<ArrowUpwardIcon
						onClick={handleChangePitch}
						data-direction="up"
						data-amount="semitone"
						className={`${classes.actionButton}
						${canPitchUp ? '' : 'disabled'}`}
						titleAccess="Pitch Up"
					/>
				</Box>
				<Box className={classes.panel}>
					<ArrowDownwardIcon
						onClick={handleChangePitch}
						data-direction="down"
						data-amount="octave"
						className={`${classes.actionButton} ${canOctaveDown ? '' : 'disabled'}`}
						titleAccess="Octave Down"
					/>
					<Typography variant="body1" className={`${classes.panelText} ${canPitchUp || canPitchDown ? '' : 'disabled'}`}>
						octave
					</Typography>
					<ArrowUpwardIcon
						onClick={handleChangePitch}
						data-direction="up"
						data-amount="octave"
						className={`${classes.actionButton}	${canOctaveUp ? '' : 'disabled'}`}
						titleAccess="Octave Up"
					/>
				</Box>
			</Box>
			<Box>
				<Box className={classes.panel}>
					<DeleteForeverIcon onClick={handleClickDelete} className={`${classes.actionButton} ${canDelete ? '' : 'disabled'}`} titleAccess="Delete" />
				</Box>
			</Box>
		</Box>
	);
};
