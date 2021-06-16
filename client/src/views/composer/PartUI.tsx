import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { Part } from '../../model/part';
import { MeasuresUI } from './MeasuresUI';

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
	}));
	const classes = useStyles();

	return (
		<Box id="PartUI" className={`${classes.root}`}>
			<Typography variant="h6" className={classes.partName}>
				{part.name}
			</Typography>
			<MeasuresUI measures={part.measures} />
		</Box>
	);
};
