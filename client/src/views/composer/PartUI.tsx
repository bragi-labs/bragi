import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';
import { Part } from '../../model/part';
import { MeasureUI } from './MeasureUI';

export interface StageUIProps {
	part: Part;
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
	}));
	const classes = useStyles();

	const { stageWidthCm, totalDurationDivsPerRow } = SettingsContextContainer.useContainer();

	const measureDurationDivs = part.measures[0].isPickup ? part.measures[1].durationDivs : part.measures[0].durationDivs;
	const numberOfMeasuresPerRow = Math.trunc(totalDurationDivsPerRow / measureDurationDivs);
	const measureWidthCm = (stageWidthCm * measureDurationDivs) / totalDurationDivsPerRow;
	const pickupMeasureLeftOverCm = measureWidthCm * (numberOfMeasuresPerRow - 1);
	const leftOverCm = (stageWidthCm - measureWidthCm * numberOfMeasuresPerRow) / 2;

	return (
		<Box id="PartUI" className={classes.root}>
			<Typography variant="h6" className={classes.partName}>
				{part.name}
			</Typography>
			<Box className={classes.measures} style={{ marginLeft: `${leftOverCm}cm` }}>
				{part.measures.map((measure, i) => (
					<Box key={i}>
						{measure.isPickup && (
							<Box style={{ marginRight: `${pickupMeasureLeftOverCm}cm` }}>
								<MeasureUI key={i} measure={measure} />
							</Box>
						)}
						{!measure.isPickup && <MeasureUI key={i} measure={measure} />}
					</Box>
				))}
			</Box>
		</Box>
	);
};
