import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { Measure } from '../../model/measure';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';

export interface MeasureUIProps {
	measure: Measure;
}

export const MeasureUI = ({ measure }: MeasureUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			border: '1px solid #ccc',
		},
		measureNumber: {
			position: 'absolute',
			left: 0,
			top: -20,
		},
		measurement: {
			textAlign: 'center',
		},
	}));
	const classes = useStyles();

	const { stageWidthCm, rowGapCm, totalDurationDivsPerRow } = SettingsContextContainer.useContainer();

	const measureWidthCm = (stageWidthCm * measure.durationDivs) / totalDurationDivsPerRow;
	const numberOfMeasuresPerRow = Math.trunc(totalDurationDivsPerRow / measure.durationDivs);

	return (
		<Box id="MeasureUI" className={`${classes.root}`} style={{ width: `${measureWidthCm}cm`, marginBottom: `${rowGapCm}cm` }}>
			{measure.number % numberOfMeasuresPerRow === 1 && (
				<Box className={classes.measureNumber}>
					<Typography variant="body2">{measure.number}</Typography>
				</Box>
			)}
			<Typography variant="body2" className={classes.measurement}>
				{measure.number}
			</Typography>
		</Box>
	);
};
