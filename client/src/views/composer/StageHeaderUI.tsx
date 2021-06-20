import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { ScoreInfo } from '../../model/scoreInfo';

export interface StageHeaderUIProps {
	scoreInfo: ScoreInfo;
}

export const StageHeaderUI = React.memo(({ scoreInfo }: StageHeaderUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			paddingBottom: 32,
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
		appName: {
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
			{scoreInfo.arrangerName && (
				<Typography variant="body2" className={classes.arrangerName}>
					Arranged by {scoreInfo.arrangerName}
				</Typography>
			)}
			<Typography variant="body2" className={classes.appName}>
				{`${scoreInfo.softwareName} v${scoreInfo.softwareVersion}`}
			</Typography>
		</Box>
	);
});
