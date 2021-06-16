import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { Measure } from '../../model/measure';

export interface MeasureUIProps {
	measure: Measure;
}

export const MeasureUI = ({ measure }: MeasureUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			border: '1px solid #ccc',
			marginBottom: 16,
		},
	}));
	const classes = useStyles();

	return (
		<Box id="MeasureUI" className={`${classes.root}`}>
			<Typography variant="body2">{measure.number}</Typography>
		</Box>
	);
};
