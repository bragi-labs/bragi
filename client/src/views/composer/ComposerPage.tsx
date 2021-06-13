import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
// import { useScoreContext } from '../../hooks/useScoreContext';
import { ComposerToolbar } from './ComposerToolbar';
import { Piano } from './Piano';

export const ComposerPage = () => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			height: '100%',
			userSelect: 'none',
		},
		toolbarContainer: {
			position: 'relative',
			'@media print': {
				display: 'none',
			},
		},
	}));
	const classes = useStyles();

	// const { score, updateScore } = useScoreContext();

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar />
				<Piano />
			</Box>
		</Box>
	);
};
