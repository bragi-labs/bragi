import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Button, IconButton, Typography } from '@material-ui/core';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';
import { NoteModel, ScoreModel } from '../../model/scoreModel';
import { Score } from '../../model/score';
import { Measure } from '../../model/measure';
import { Part } from '../../model/part';
import { selectionAtom } from '../../atoms/selectionAtom';
import { DraggedItemType } from '../../atoms/draggedItemAtom';
import { useDraggablePanel } from '../../components/useDraggablePanel';
import { DraggablePanel } from '../../components/DraggablePanel';

export interface NotePanelProps {
	score: ScoreModel | null;
	onUpdateScore: () => void;
}

export const NotePanel = ({ score, onUpdateScore }: NotePanelProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'absolute',
			width: 501,
			backgroundColor: '#222',
			borderRadius: 4,
			padding: 4,
			userSelect: 'none',
		},
		content: {
			display: 'grid',
			gridTemplate: 'auto auto / 1fr',
			gap: '12px 0',
			backgroundColor: '#444',
			padding: 24,
		},
		panel: {
			display: 'inline-flex',
			alignItems: 'center',
			height: 32,
			borderRadius: 16,
			backgroundColor: '#333',
			padding: '0 12px 0 4px',
			marginLeft: 16,
			'&:first-of-type': {
				marginLeft: 0,
			},
		},
		panelDuration: {
			paddingRight: 4,
			'& .MuiButton-root': {
				minWidth: 55,
			},
		},
		buttonsRow: {
			display: 'flex',
			justifyContent: 'space-between',
		},
		panelText: {
			marginLeft: 4,
			color: '#aaa',
			transition: 'all 0.2s ease-in-out',
			'&.disabled': {
				color: '#666',
				pointerEvents: 'none',
			},
		},
		actionButton: {
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
		noteDurationButton: {
			borderRadius: 24,
			'&.current': {
				color: '#fa3',
			},
		},
		buttonOnly: {
			padding: '0 4px',
		},
	}));
	const classes = useStyles();

	const selection = useRecoilValue(selectionAtom);
	const [canChangeDuration, setCanChangeDuration] = useState<any>({
		6: false,
		12: false,
		18: false,
		24: false,
		36: false,
		48: false,
		72: false,
		96: false,
	});
	const [canPitchDown, setCanPitchDown] = useState(false);
	const [canPitchUp, setCanPitchUp] = useState(false);
	const [canOctaveDown, setCanOctaveDown] = useState(false);
	const [canOctaveUp, setCanOctaveUp] = useState(false);
	const [canDelete, setCanDelete] = useState(false);
	const [curDuration, setCurDuration] = useState(0);

	const { draggedItem, position, setPosition } = useDraggablePanel();
	const handleDragMove = useCallback(
		(deltaX: number, deltaY: number) => {
			setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }));
		},
		[setPosition],
	);

	const noteDurationOptions = useMemo(
		() => [
			{ durationDivs: 6, label: '1/16' },
			{ durationDivs: 12, label: '1/8' },
			{ durationDivs: 18, label: '3/16' },
			{ durationDivs: 24, label: '1/4' },
			{ durationDivs: 36, label: '3/8' },
			{ durationDivs: 48, label: '1/2' },
			{ durationDivs: 72, label: '3/4' },
			{ durationDivs: 96, label: '1' },
		],
		[],
	);

	useEffect(() => {
		setCurDuration(0);
		setCanPitchDown(false);
		setCanPitchUp(false);
		setCanOctaveDown(false);
		setCanOctaveUp(false);
		setCanDelete(false);
		if (!score || !selection || selection.length === 0) {
			return;
		}
		let m;
		let n;
		let noteDetails;
		if (selection.length === 1 && selection[0].noteId) {
			n = Score.findNote(score, selection[0].noteId);
			if (n) {
				setCurDuration(n.durationDivs);
			}
		}
		let noteDurationsOK: any = {};
		noteDurationOptions.forEach((o) => {
			noteDurationsOK[o.durationDivs] = selection.every((item) => {
				m = item.measureId && Score.findMeasure(score, item.measureId);
				if (!m) return false;
				return Measure.canChangeNoteDuration(m, item.partId, item.noteId, o.durationDivs);
			});
		});
		setCanChangeDuration(noteDurationsOK);
		setCanPitchDown(
			selection.every((item) => {
				n = item.noteId && Score.findNote(score, item.noteId);
				if (!n || n.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(n.fullName);
				return !(noteDetails.step === 'C' && !noteDetails.alter && noteDetails.octave === MusicalHelper.minOctave);
			}),
		);
		setCanPitchUp(
			selection.every((item) => {
				n = item.noteId && Score.findNote(score, item.noteId);
				if (!n || n.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(n.fullName);
				return !(noteDetails.step === 'B' && !noteDetails.alter && noteDetails.octave === MusicalHelper.maxOctave);
			}),
		);
		setCanOctaveDown(
			selection.every((item) => {
				n = item.noteId && Score.findNote(score, item.noteId);
				if (!n || n.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(n.fullName);
				return noteDetails.octave !== MusicalHelper.minOctave;
			}),
		);
		setCanOctaveUp(
			selection.every((item) => {
				n = item.noteId && Score.findNote(score, item.noteId);
				if (!n || n.isRest) {
					return false;
				}
				noteDetails = MusicalHelper.parseNote(n.fullName);
				return noteDetails.octave !== MusicalHelper.maxOctave;
			}),
		);
		setCanDelete(
			selection.every((item) => {
				n = item.noteId && Score.findNote(score, item.noteId);
				return n && !n.isRest;
			}),
		);
	}, [selection, score, noteDurationOptions]);

	const getSelectedNotes = useCallback(
		(includeRests: boolean) => {
			if (!score || !selection) {
				return [];
			}
			const notes: NoteModel[] = [];
			selection.forEach((item) => {
				const n = Score.findNote(score, item.noteId);
				if (n && (!n.isRest || includeRests)) {
					notes.push(n);
				}
			});
			return notes;
		},
		[score, selection],
	);

	const handleClickDelete = useCallback(() => {
		const notes: NoteModel[] = getSelectedNotes(false);
		if (!notes.length) {
			return;
		}
		notes.forEach((n) => {
			n.fullName = '';
			n.isRest = true;
		});
		onUpdateScore();
	}, [getSelectedNotes, onUpdateScore]);

	const handleChangePitch = useCallback(
		(e) => {
			const notes: NoteModel[] = getSelectedNotes(true);
			if (!notes.length) {
				return;
			}
			notes.forEach((n) => {
				if (!score) {
					return;
				}
				const measure = Score.findMeasure(score, n.measureId);
				if (!measure) {
					return;
				}
				if (e.currentTarget.dataset.amount === 'octave') {
					const noteDetails = MusicalHelper.parseNote(n.fullName);
					n.fullName = `${noteDetails.step}${noteDetails.alter}${e.currentTarget.dataset.direction === 'up' ? noteDetails.octave + 1 : noteDetails.octave - 1}`;
				} else {
					n.fullName = MusicalHelper.changePitch(n.fullName, measure.musicalScale, e.currentTarget.dataset.direction === 'up');
				}
				SoundHelper.playShortNote(n.fullName);
			});
			onUpdateScore();
		},
		[getSelectedNotes, score, onUpdateScore],
	);

	const handleClickNoteDuration = useCallback(
		(e) => {
			const notes: NoteModel[] = getSelectedNotes(true);
			if (!notes.length) {
				return;
			}
			notes.forEach((n) => {
				if (!score) {
					return;
				}
				const m = Score.findMeasure(score, n.measureId);
				if (!m) {
					return;
				}
				const p = Measure.findPart(m, n.partId);
				if (!p) {
					return;
				}
				Part.changeNoteDuration(p, n.id, Number(e.currentTarget.dataset['durationDivs']), m.timeSignature, m.durationDivs);
				onUpdateScore();
			});
		},
		[getSelectedNotes, score, onUpdateScore],
	);

	return (
		<Box id="NotePanel" className={classes.root} style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: draggedItem === DraggedItemType.NOTE_PANEL ? 100 : 30 }}>
			<DraggablePanel title="Note" draggedItemType={DraggedItemType.NOTE_PANEL} onDragMove={handleDragMove} />
			<Box className={classes.content}>
				<Box className={`${classes.panel} ${classes.panelDuration}`}>
					{noteDurationOptions.map((ndo) => (
						<Button
							key={ndo.durationDivs}
							data-duration-divs={ndo.durationDivs}
							onClick={handleClickNoteDuration}
							disabled={!canChangeDuration[ndo.durationDivs]}
							className={`${classes.actionButton} ${classes.noteDurationButton} ${canChangeDuration[ndo.durationDivs] ? '' : 'disabled'} ${
								ndo.durationDivs === curDuration ? 'current' : ''
							}`}
						>
							{ndo.label}
						</Button>
					))}
				</Box>
				<Box className={classes.buttonsRow}>
					<Box>
						<Box className={classes.panel}>
							<IconButton onClick={handleChangePitch} data-direction="down" data-amount="semitone" className={`${classes.actionButton}`} disabled={!canPitchDown}>
								<ArrowDropDownOutlinedIcon titleAccess="Semitone down" />
							</IconButton>
							<IconButton onClick={handleChangePitch} data-direction="up" data-amount="semitone" className={`${classes.actionButton}`} disabled={!canPitchUp}>
								<ArrowDropUpOutlinedIcon titleAccess="Semitone up" />
							</IconButton>
							<Typography variant="body1" className={`${classes.panelText} ${canPitchUp || canPitchDown ? '' : 'disabled'}`}>
								Semitone
							</Typography>
						</Box>
						<Box className={classes.panel}>
							<IconButton onClick={handleChangePitch} data-direction="down" data-amount="octave" className={`${classes.actionButton}`} disabled={!canOctaveDown}>
								<ArrowDropDownOutlinedIcon titleAccess="Octave down" />
							</IconButton>
							<IconButton onClick={handleChangePitch} data-direction="up" data-amount="octave" className={`${classes.actionButton}`} disabled={!canOctaveUp}>
								<ArrowDropUpOutlinedIcon titleAccess="Octave up" />
							</IconButton>
							<Typography variant="body1" className={`${classes.panelText} ${canPitchUp || canPitchDown ? '' : 'disabled'}`}>
								Octave
							</Typography>
						</Box>
					</Box>
					<Box className={`${classes.panel} ${classes.buttonOnly}`}>
						<IconButton onClick={handleClickDelete} className={classes.actionButton} disabled={!canDelete}>
							<DeleteForeverIcon titleAccess="Delete note" />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
