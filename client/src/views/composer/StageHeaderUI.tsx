import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { AppDataHelper } from '../../services/appDataHelper';
import { ScoreInfo } from '../../model/scoreInfo';

export interface StageHeaderUIProps {
	scoreInfo: ScoreInfo;
}

export const StageHeaderUI = ({ scoreInfo }: StageHeaderUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			padding: '0 0 16px 0',
		},
		scoreTitle: {
			display: 'flex',
			justifyContent: 'center',
			color: '#000',
		},
		scoreCredits: {
			display: 'flex',
			justifyContent: 'center',
			color: '#666',
		},
		arrangerName: {
			display: 'flex',
			justifyContent: 'flex-end',
			color: '#666',
		},
		softwareCredits: {
			display: 'flex',
			justifyContent: 'flex-end',
			color: '#666',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="StageHeaderUI" className={classes.root}>
			<Typography variant="h4" className={classes.scoreTitle}>
				{scoreInfo.scoreTitle}
			</Typography>
			<Typography variant="h6" className={classes.scoreCredits}>
				{scoreInfo.scoreCredits}
			</Typography>
			<Typography variant="body2" className={classes.arrangerName}>
				{`Arranged by ${scoreInfo.arrangerName}`}
			</Typography>
			<Typography variant="body2" className={classes.softwareCredits}>
				{`${AppDataHelper.appName} v${AppDataHelper.appVersion}`}
			</Typography>
		</Box>
	);
};
