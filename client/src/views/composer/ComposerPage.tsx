import React, { memo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';

export const ComposerPage = memo(() => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			userSelect: 'none',
		},
	}));
	const classes = useStyles();

	return <Box id="ComposerPage" className={classes.root} />;
});
