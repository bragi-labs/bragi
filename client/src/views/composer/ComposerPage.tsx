import React, { memo, useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Score } from '../../score/score';
import { ComposerToolbar } from './ComposerToolbar';
import { Piano } from './Piano';

export const ComposerPage = memo(() => {
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

	const [score, setScore] = useState<Score>(new Score());

	const handleChangeScore = useCallback((s: Score) => {
		setScore(s);
	}, []);

	return (
		<Box id="ComposerPage" className={classes.root}>
			<Box className={classes.toolbarContainer}>
				<ComposerToolbar score={score} onChangeScore={handleChangeScore} />
				<Piano />
			</Box>
		</Box>
	);
});
