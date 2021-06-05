import React, { memo, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Button, Typography } from '@material-ui/core';

interface NewScoreDialogProps {
	onClose: () => void;
}

export const NewScoreDialog = memo(({ onClose }: NewScoreDialogProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'fixed',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
			borderRadius: 8,
			backgroundColor: '#fff',
			width: 300,
			height: 200,
			display: 'grid',
			placeItems: 'center',
			color: '#000',
			opacity: 0.9,
		},
	}));
	const classes = useStyles();

	const handleClickClose = useCallback(() => {
		onClose();
	}, []);

	return (
		<Box id="NewScoreDialog" className={classes.root}>
			<Typography variant="h5">New Score</Typography>
			<Button onClick={handleClickClose} variant="contained" size="small">
				Close
			</Button>
		</Box>
	);
});
