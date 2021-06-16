import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';
import { Measure } from '../../model/measure';
import { MeasureUI } from './MeasureUI';

export interface MeasuresUIProps {
	measures: Measure[];
}

export const MeasuresUI = ({ measures }: MeasuresUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			display: 'flex',
			flexWrap: 'wrap',
		},
	}));
	const classes = useStyles();

	const { stageWidthCm, totalDurationDivsPerRow } = SettingsContextContainer.useContainer();

	const measureDurationDivs = measures[0].isPickup ? measures[1].durationDivs : measures[0].durationDivs;
	const numberOfMeasuresPerRow = Math.trunc(totalDurationDivsPerRow / measureDurationDivs);
	const measureWidthCm = (stageWidthCm * measureDurationDivs) / totalDurationDivsPerRow;
	const pickupMeasureLeftMarginCm = measureWidthCm * (numberOfMeasuresPerRow - 1);

	return (
		<Box id="MeasuresUI" className={classes.root}>
			{measures.map((measure, i) => (
				<Box key={i}>
					{measure.isPickup && (
						<Box style={{ marginLeft: `${pickupMeasureLeftMarginCm}cm` }}>
							<MeasureUI key={i} measure={measure} />
						</Box>
					)}
					{!measure.isPickup && <MeasureUI key={i} measure={measure} />}
				</Box>
			))}
		</Box>
	);
};
