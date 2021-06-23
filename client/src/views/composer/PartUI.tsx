import React, { useCallback, useMemo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { PartModel, VoiceType } from '../../model/scoreModel';
import { Part } from '../../model/part';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';
import { FigurenotesHelper } from '../../services/figurenotesHelper';
import { MusicalHelper } from '../../services/musicalHelper';
import { CommonHelper } from '../../services/commonHelper';

export interface StageUIProps {
	part: PartModel;
}

export const PartUI = ({ part }: StageUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {},
		partName: {
			color: '#666',
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
	}));
	const classes = useStyles();

	const { stageWidthCm, rowGapCm, totalDurationDivsPerRow } = SettingsContextContainer.useContainer();
	const { setSelection, isSelected } = SelectionContextContainer.useContainer();

	const sizeVars = useMemo(() => {
		const measureDurationDivs = part.measures[0].isPickup ? part.measures[1].durationDivs : part.measures[0].durationDivs;
		const numberOfMeasuresPerRow = Math.trunc(totalDurationDivsPerRow / measureDurationDivs);
		const measureWidthCm = (stageWidthCm * measureDurationDivs) / totalDurationDivsPerRow;
		const quarterSizeCm = (measureWidthCm - CommonHelper.pxToCm(2)) / 4;
		const pickupMeasureLeftOverCm = measureWidthCm * (numberOfMeasuresPerRow - 1);
		const leftOverCm = (stageWidthCm - measureWidthCm * numberOfMeasuresPerRow) / 2;
		return {
			pickupMeasureLeftOverCm,
			leftOverCm,
			measureWidthCm,
			quarterSizeCm,
			numberOfMeasuresPerRow,
		};
	}, [part.measures, stageWidthCm, totalDurationDivsPerRow]);

	const handleClickNote = useCallback(
		(event) => {
			const note = Part.findNote(part, event.currentTarget.dataset.noteId);
			if (note) {
				setSelection({
					items: [{ partId: part.id, measureId: note.measureId, voiceId: note.voiceId, noteId: note.id }],
				});
			}
		},
		[setSelection, part],
	);

	return (
		<Box id="PartUI" className={classes.root}>
			<Typography variant="h6" className={classes.partName}>
				{part.name}
			</Typography>
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
													style={{ flex: `${note.durationDivs} 0 0`, height: `${sizeVars.quarterSizeCm}cm` }}
													onClick={handleClickNote}
													data-measure-id={measure.id}
													data-voice-id={voice.id}
													data-note-id={note.id}
												>
													{note.name && (
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
																		`${MusicalHelper.parseNote(note.name).step}${MusicalHelper.parseNote(note.name).octave}`,
																		sizeVars.quarterSizeCm - CommonHelper.pxToCm(2),
																		'cm',
																	),
																}}
															/>
														</Box>
													)}
													{!note.name && <Box>{``}</Box>}
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
