import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Measure } from '../../model/measure';
import { MeasureUI } from './MeasureUI';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';

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

	return (
		<Box id="MeasuresUI" className={`${classes.root}`}>
			{measures.map((measure, i) => (
				<Box key={i}>
					{measure.isPickup && (
						<Box style={{ marginLeft: `${(stageWidthCm * (totalDurationDivsPerRow - measure.durationDivs)) / totalDurationDivsPerRow}cm` }}>
							<MeasureUI key={i} measure={measure} />
						</Box>
					)}
					{!measure.isPickup && <MeasureUI key={i} measure={measure} />}
				</Box>
			))}
		</Box>
	);
};
