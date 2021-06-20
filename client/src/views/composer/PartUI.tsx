import React, { useMemo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { PartModel, VoiceType } from '../../model/scoreModel';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';
import { VoiceFnLvl1UI } from './VoiceFnLvl1UI';

export interface StageUIProps {
	part: PartModel;
}

export const PartUI = ({ part }: StageUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
		},
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
	}));
	const classes = useStyles();

	const { stageWidthCm, rowGapCm, totalDurationDivsPerRow } = SettingsContextContainer.useContainer();

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

	return (
		<Box id="PartUI" className={classes.root}>
			<Typography variant="h6" className={classes.partName}>
				{part.name}
			</Typography>
			<Box className={classes.measures} style={{ marginLeft: `${sizeVars.leftOverCm}cm` }}>
				{part.measures.map((measure, i) => (
					<Box key={i} style={{ marginRight: `${measure.isPickup ? sizeVars.pickupMeasureLeftOverCm : 0}cm` }}>
						<Box id="MeasureUI" className={classes.measure} style={{ width: `${sizeVars.measureWidthCm}cm`, marginBottom: `${rowGapCm}cm` }}>
							{measure.number % sizeVars.numberOfMeasuresPerRow === 1 && (
								<Box className={classes.measureNumber}>
									<Typography variant="body2">{measure.number}</Typography>
								</Box>
							)}
							{measure.voices.map((voice, i) => (
								<Box key={i}>{voice.voiceType === VoiceType.FN_LVL_1 && <VoiceFnLvl1UI voice={voice} />}</Box>
							))}
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};
