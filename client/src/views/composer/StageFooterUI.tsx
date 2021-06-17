import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { AppDataHelper } from '../../services/appDataHelper';
import { ScoreInfo } from '../../model/scoreInfo';

export interface StageFooterUIProps {
	scoreInfo: ScoreInfo;
}

export const StageFooterUI = ({ scoreInfo }: StageFooterUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			color: '#666',
			textAlign: 'left',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="StageFooterUI" className={classes.root}>
			{scoreInfo.arrangerName && (
				<Typography variant="body2">{`Arranged by ${scoreInfo.arrangerName} using ${AppDataHelper.appName} v${AppDataHelper.appVersion}`}</Typography>
			)}
			{!scoreInfo.arrangerName && <Typography variant="body2">{`${AppDataHelper.appName} v${AppDataHelper.appVersion}`}</Typography>}
		</Box>
	);
};
