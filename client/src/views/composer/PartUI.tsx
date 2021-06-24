import React, { useCallback, useMemo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { PartModel, VoiceType } from '../../model/scoreModel';
import { Part } from '../../model/part';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';
import { FigurenotesHelper } from '../../services/figurenotesHelper';
import { MusicalHelper } from '../../services/musicalHelper';
import { CommonHelper } from '../../services/commonHelper';
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
			top: -20,
		},
		voice: {
			display: 'flex',
			border: '1px solid #999',
		},
		note: {
			position: 'relative',
			fontSize: 10,
			border: '1px solid #eee',
			'&.selected': {
				backgroundColor: '#ddf',
				border: '1px solid #33f',
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
			left: 0,
			top: 0,
		},
		noteName: {
			fontSize: '11px',
			fontFamily: 'Arial, sans-serif',
			color: '#fff',
			position: 'absolute',
			top: 10,
			left: 14,
			'&.alter': {
				left: 11,
			},
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
	}));
	const classes = useStyles();

	const { partsWidthCm, quarterSizeCm, rowGapCm } = SettingsContextContainer.useContainer();
	const { setSelection, isSelected } = SelectionContextContainer.useContainer();

	const sizeVars = useMemo(() => {
		const exampleMeasure = part.measures[0].isPickup ? part.measures[1] : part.measures[0];
		const timeData = MusicalHelper.parseTimeSignature(exampleMeasure.timeSignature);
		const measureWidthCm = (4 * quarterSizeCm * timeData.beats) / timeData.beatType + CommonHelper.pxToCm(2);
		const numberOfMeasuresPerRow = Math.trunc(partsWidthCm / measureWidthCm);
		const pickupMeasureLeftOverCm = measureWidthCm * (numberOfMeasuresPerRow - 1);
		const leftOverCm = (partsWidthCm - measureWidthCm * numberOfMeasuresPerRow) / 2;
		return {
			numberOfMeasuresPerRow,
			measureWidthCm,
			pickupMeasureLeftOverCm,
			leftOverCm,
		};
	}, [part.measures, partsWidthCm, quarterSizeCm]);

	const handleClickNote = useCallback(
		(event) => {
			const note = Part.findNote(part, event.currentTarget.dataset.noteId);
			if (note) {
				setSelection({
					items: [{ partId: part.id, measureId: note.measureId, voiceId: note.voiceId, noteId: note.id }],
				});
				if (!note.isRest) {
					SoundHelper.playShortNote(note.fullName);
				}
			}
		},
		[setSelection, part],
	);

	return (
		<Box id="PartUI" className={classes.root} style={{ width: `${partsWidthCm}cm` }}>
			{part.name && (
				<Typography variant="h6" className={classes.partName}>
					{part.name}
				</Typography>
			)}
			<Box className={classes.measures} style={{ marginLeft: `${sizeVars.leftOverCm}cm` }}>
				{part.measures.map((measure, m) => (
					<Box key={m} style={{ marginRight: `${measure.isPickup ? sizeVars.pickupMeasureLeftOverCm : 0}cm` }}>
						<Box id="MeasureUI" className={classes.measure} style={{ width: `${sizeVars.measureWidthCm}cm`, marginBottom: `${rowGapCm}cm` }}>
							{measure.number % sizeVars.numberOfMeasuresPerRow === 1 && (
								<Box className={classes.measureNumber}>
									<Typography variant="body2">{measure.number}</Typography>
								</Box>
							)}
							{measure.voices.map((voice, v) => (
								<Box key={v}>
									{voice.voiceType === VoiceType.FN_LVL_1 && (
										<Box id="VoiceFnLvl1UI" className={classes.voice}>
											{voice.notes.map((note, n) => (
												<Box
													key={n}
													className={`${classes.note} ${isSelected(note.id) ? 'selected' : ''}`}
													style={{ flex: `${note.durationDivs} 0 0`, height: `${quarterSizeCm}cm` }}
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
																		quarterSizeCm - CommonHelper.pxToCm(2),
																		'cm',
																	),
																}}
															/>
															{note.fullName.length >= 2 && note.fullName[1] === '#' && (
																<ArrowRightAltIcon className={`${classes.alter} sharp`} style={{ left: `calc(${quarterSizeCm / 2}cm - 8px)` }} />
															)}
															{note.fullName.length >= 2 && note.fullName[1] === 'b' && (
																<ArrowRightAltIcon className={`${classes.alter} flat`} style={{ left: `calc(${quarterSizeCm / 2}cm - 18px)` }} />
															)}
															<Box className={`${classes.noteName} ${MusicalHelper.parseNote(note.fullName).alter ? 'alter' : ''}`}>
																{MusicalHelper.parseNote(note.fullName).step}
																{MusicalHelper.parseNote(note.fullName).alter}
															</Box>
														</Box>
													)}
													{!note.fullName && <Box>{``}</Box>}
												</Box>
											))}
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
