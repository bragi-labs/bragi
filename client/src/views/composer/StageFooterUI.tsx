import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';

export const StageFooterUI = React.memo(() => {
	const useStyles = makeStyles(() => ({
		root: {},
	}));
	const classes = useStyles();

	return <Box id="StageFooterUI" className={classes.root} />;
});
