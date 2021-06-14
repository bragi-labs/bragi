import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Piano } from '../../components/Piano';

export const PlayPage = () => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			userSelect: 'none',
		},
		pianoContainer: {},
	}));
	const classes = useStyles();

	return (
		<Box id="PlayPage" className={classes.root}>
			<Box className={classes.pianoContainer}>
				<Piano smallPiano={false} />
			</Box>
		</Box>
	);
};
