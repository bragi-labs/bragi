import React, { useCallback, useMemo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { PartModel, VoiceType } from '../../model/scoreModel';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';
import { SelectionContextContainer } from '../../hooks/useSelectionContext';

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
			border: '1px solid #666',
		},
		note: {
			border: '1px solid #ccc',
			'&.selected': {
				border: '1px solid red',
			},
		},
	}));
	const classes = useStyles();

	const { stageWidthCm, rowGapCm, totalDurationDivsPerRow } = SettingsContextContainer.useContainer();
	const { setSelection, isSelected } = SelectionContextContainer.useContainer();

	const sizeVars = useMemo(() => {
		const measureDurationDivs = part.measures[0].isPickup ? part.measures[1].durationDivs : part.measures[0].durationDivs;
		const numberOfMeasuresPerRow = Math.trunc(totalDurationDivsPerRow / measureDurationDivs);
		const measureWidthCm = (stageWidthCm * measureDurationDivs) / totalDurationDivsPerRow;
		const pickupMeasureLeftOverCm = measureWidthCm * (numberOfMeasuresPerRow - 1);
		const leftOverCm = (stageWidthCm - measureWidthCm * numberOfMeasuresPerRow) / 2;
		return {
			pickupMeasureLeftOverCm,
			leftOverCm,
			measureWidthCm,
			numberOfMeasuresPerRow,
		};
	}, [part.measures, stageWidthCm, totalDurationDivsPerRow]);

	const handleClickNote = useCallback(
		(event) => {
			const m = part.measures.find((m) => m.id === event.target.dataset.measureId);
			if (!m) {
				return;
			}
			const v = m.voices.find((v) => v.id === event.target.dataset.voiceId);
			if (!v) {
				return;
			}
			const n = v.notes.find((n) => n.id === event.target.dataset.noteId);
			if (!n) {
				return;
			}
			setSelection({
				items: [{ partId: part.id, measureId: m.id, voiceId: v.id, noteId: n.id }],
			});
		},
		[setSelection, part.id, part.measures],
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
												<Box key={n} style={{ flex: `${note.durationDivs} 0 0` }}>
													<Box
														className={`${classes.note} ${isSelected(note.id) ? 'selected' : ''}`}
														data-measure-id={measure.id}
														data-voice-id={voice.id}
														data-note-id={note.id}
														onClick={handleClickNote}
													>
														{note.name || note.durationDivs}
													</Box>
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
