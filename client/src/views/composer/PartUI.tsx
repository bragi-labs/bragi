import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Box from '@material-ui/core/Box';
import { Typography, TextField } from '@material-ui/core';
import { PartModel, VoiceType } from '../../model/scoreModel';
import { Part } from '../../model/part';
import { uiSizes } from '../../atoms/uiSizes';
import { uiSelection } from '../../atoms/uiSelection';
import { FigurenotesHelper } from '../../services/figurenotesHelper';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';

export interface StageUIProps {
	part: PartModel;
}

export const PartUI = ({ part }: StageUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {},
		partName: {
			color: '#666',
			marginBottom: 24,
		},
		measures: {
			position: 'relative',
			display: 'flex',
			flexWrap: 'wrap',
		},
		measure: {
			position: 'relative',
		},
		measureNumber: {
			position: 'absolute',
			left: 0,
			top: -14,
		},
		measureNumberText: {
			fontSize: '12px',
		},
		voice: {
			display: 'flex',
			borderTop: '1px solid #999',
			borderLeft: '1px solid #999',
			borderRight: '1px solid #999',
			'&:last-of-type': {
				borderBottom: '1px solid #999',
			},
		},
		note: {
			position: 'relative',
			fontSize: 10,
			border: '1px solid #eee',
			'&.selected': {
				backgroundColor: '#ddf',
				border: '1px solid #3f51b5',
			},
			'@media print': {
				backgroundColor: 'transparent !important',
				border: '1px solid #ddd !important',
			},
		},
		fnSymbolContainer: {
			position: 'absolute',
			left: 0,
			top: 0,
		},
		fnSymbol: {
			position: 'absolute',
		},
		longNoteTail: {
			position: 'absolute',
		},
		noteName: {
			fontSize: '12px',
			fontFamily: 'Arial, sans-serif',
			color: '#fff',
			position: 'absolute',
		},
		alter: {
			position: 'absolute',
			top: -20,
			transformOrigin: 'center',
			'&.sharp': {
				transform: 'rotate(-45deg)',
			},
			'&.flat': {
				transform: 'rotate(-135deg)',
			},
		},
		lyrics: {
			display: 'flex',
			width: '100%',
			'& .MuiTextField-root': {
				width: '100%',
				'&.lyricsSize-11 .MuiInput-input': {
					fontSize: '11px',
				},
				'&.lyricsSize-12 .MuiInput-input': {
					fontSize: '12px',
				},
				'&.lyricsSize-13 .MuiInput-input': {
					fontSize: '13px',
				},
				'&.lyricsSize-14 .MuiInput-input': {
					fontSize: '14px',
				},
				'&.lyricsSize-15 .MuiInput-input': {
					fontSize: '15px',
				},
			},
			'& .MuiInput-formControl': {
				width: '100%',
			},
			'& .MuiInput-input': {
				width: '100%',
				padding: 2,
				fontFamily: 'Arial, sans-serif',
				fontSize: '11px',
				color: '#000',
			},
		},
	}));
	const classes = useStyles();

	const { partsWidth, quarterSize, lyricsSize, rowGap } = useRecoilValue(uiSizes);
	const [selection, setSelection] = useRecoilState(uiSelection);

	const sizeVars = useMemo(() => {
		const exampleMeasure = part.measures[0].isPickup ? part.measures[1] : part.measures[0];
		const timeData = MusicalHelper.parseTimeSignature(exampleMeasure.timeSignature);
		const measureWidth = (4 * quarterSize * timeData.beats) / timeData.beatType + 2;
		const numberOfMeasuresPerRow = Math.trunc(partsWidth / measureWidth);
		const pickupMeasureLeftOver = measureWidth * (numberOfMeasuresPerRow - 1);
		const leftOver = (partsWidth - measureWidth * numberOfMeasuresPerRow) / 2;
		return {
			numberOfMeasuresPerRow,
			measureWidth,
			pickupMeasureLeftOver,
			leftOver,
		};
	}, [part.measures, partsWidth, quarterSize]);

	const handleClickNote = useCallback(
		(e) => {
			const note = Part.findNote(part, e.currentTarget.dataset.noteId);
			if (note) {
				setSelection([{ partId: part.id, measureId: note.measureId, voiceId: note.voiceId, noteId: note.id }]);
				if (!note.isRest) {
					SoundHelper.playShortNote(note.fullName);
				}
			}
		},
		[part, setSelection],
	);

	const handleLyricsFocus = useCallback(
		(e) => {
			const v = Part.findVoice(part, e.target.parentElement.parentElement.dataset.voiceId);
			if (v) {
				setSelection([{ partId: part.id, measureId: v.measureId, voiceId: v.id, noteId: '' }]);
			}
		},
		[part, setSelection],
	);

	const handleLyricsChange = useCallback(
		(e) => {
			const v = Part.findVoice(part, e.target.parentElement.parentElement.dataset.voiceId);
			if (v) {
				v.lyrics = e.target.value;
			}
		},
		[part],
	);

	return (
		<Box id="PartUI" className={classes.root} style={{ width: `${partsWidth}px` }}>
			{part.name && (
				<Typography variant="h6" className={classes.partName}>
					{part.name}
				</Typography>
			)}
			<Box className={classes.measures} style={{ marginLeft: `${sizeVars.leftOver}px` }}>
				{part.measures.map((measure, m) => (
					<Box key={m} style={{ marginRight: `${measure.isPickup ? sizeVars.pickupMeasureLeftOver : 0}px` }}>
						<Box className={classes.measure} style={{ width: `${sizeVars.measureWidth}px`, marginBottom: `${rowGap}px` }}>
							{measure.number % sizeVars.numberOfMeasuresPerRow === 1 && (
								<Box className={classes.measureNumber}>
									<Typography variant="body2" className={classes.measureNumberText}>
										{measure.number}
									</Typography>
								</Box>
							)}
							{measure.voices.map((voice, v) => (
								<Box key={v} className={classes.voice}>
									{voice.voiceType === VoiceType.FN_LVL_1 &&
										voice.notes.map((note, n) => (
											<Box
												key={n}
												className={`${classes.note} ${selection.find((si) => si.noteId === note.id) ? 'selected' : ''}`}
												style={{ flex: `${note.durationDivs} 0 0`, height: `${quarterSize}px` }}
												onClick={handleClickNote}
												data-measure-id={measure.id}
												data-voice-id={voice.id}
												data-note-id={note.id}
											>
												{note.fullName && (
													<Box
														className={classes.fnSymbolContainer}
														style={{
															transform: `scaleX(${note.durationDivs >= 24 ? 1 : note.durationDivs / 24})`,
														}}
													>
														<Box
															className={classes.fnSymbol}
															style={{
																...FigurenotesHelper.getSymbolStyle(
																	`${MusicalHelper.parseNote(note.fullName).step}${MusicalHelper.parseNote(note.fullName).octave}`,
																	quarterSize - 2,
																	'px',
																),
															}}
														/>
														{note.durationDivs > 24 && (
															<Box
																className={classes.longNoteTail}
																style={{
																	backgroundColor: `${FigurenotesHelper.getNoteColor(MusicalHelper.parseNote(note.fullName).step)}`,
																	top: `${quarterSize - 12}px`,
																	height: `10px`,
																	left: MusicalHelper.parseNote(note.fullName).octave <= 3 ? `${quarterSize - 2}px` : `${quarterSize / 2 - 1}px`,
																	width:
																		MusicalHelper.parseNote(note.fullName).octave <= 3
																			? `${((note.durationDivs - 24) * quarterSize) / 24 - 1}px`
																			: `${quarterSize / 2 - 1 + ((note.durationDivs - 24) * quarterSize) / 24 - 1}px`,
																}}
															/>
														)}
														{note.fullName.length >= 2 && note.fullName[1] === '#' && (
															<ArrowRightAltIcon className={`${classes.alter} sharp`} style={{ left: `${quarterSize / 2 - 8}px` }} />
														)}
														{note.fullName.length >= 2 && note.fullName[1] === 'b' && (
															<ArrowRightAltIcon className={`${classes.alter} flat`} style={{ left: `${quarterSize / 2 - 18}px` }} />
														)}
														<Box
															className={classes.noteName}
															style={{
																top: `${quarterSize / 2 - 9}px`,
																left: `${MusicalHelper.parseNote(note.fullName).alter ? quarterSize / 2 - 9 : quarterSize / 2 - 5.5}px`,
															}}
														>
															{MusicalHelper.parseNote(note.fullName).step}
															{MusicalHelper.parseNote(note.fullName).alter}
														</Box>
													</Box>
												)}
												{!note.fullName && <Box>{``}</Box>}
											</Box>
										))}
									{voice.voiceType === VoiceType.LYRICS && (
										<Box className={classes.lyrics}>
											<TextField
												data-voice-id={voice.id}
												defaultValue={voice.lyrics}
												onFocus={handleLyricsFocus}
												onChange={handleLyricsChange}
												label=""
												className={`lyricsSize-${lyricsSize}`}
											/>
										</Box>
									)}
								</Box>
							))}
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};
