import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { Voice } from '../../model/voice';

export interface VoiceUIProps {
	voice: Voice;
}

export const VoiceUI = ({ voice }: VoiceUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="VoiceUI" className={classes.root}>
			<Typography variant="body2">${voice.voiceType.toString()}</Typography>
		</Box>
	);
};
