import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { VoiceType, VoiceModel } from '../../model/scoreModel';
import { VoiceFnLvl1UI } from './VoiceFnLvl1UI';

export interface VoiceUIProps {
	voice: VoiceModel;
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
			{voice.voiceType === VoiceType.FN_LVL_1 && <VoiceFnLvl1UI voice={voice} />}
		</Box>
	);
};
