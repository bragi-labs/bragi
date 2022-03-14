import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';

export const AboutPage = React.memo(() => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			display: 'grid',
			placeItems: 'center',
			userSelect: 'none',
		},
		text: {
			margin: '0 auto',
			fontSize: 32,
			color: '#fff',
			textShadow: '2px 2px #000',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="AboutPage" className={classes.root}>
			<Box className={classes.text}>Figurenotes Composer by Uri Kalish</Box>
		</Box>
	);
});
