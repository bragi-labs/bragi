import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Measure } from '../../model/measure';
import { MeasureUI } from './MeasureUI';

export interface MeasuresUIProps {
	measures: Measure[];
}

export const MeasuresUI = ({ measures }: MeasuresUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			display: 'grid',
			gridTemplate: 'auto / 1fr 1fr 1fr 1fr',
			textAlign: 'left',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="MeasuresUI" className={`${classes.root}`}>
			{measures.map((measure, i) => (
				<>
					{measure.isPickup && (
						<>
							<Box />
							<Box />
							<Box />
							<MeasureUI key={i} measure={measure} />
						</>
					)}
					{!measure.isPickup && <MeasureUI key={i} measure={measure} />}
				</>
			))}
		</Box>
	);
};
