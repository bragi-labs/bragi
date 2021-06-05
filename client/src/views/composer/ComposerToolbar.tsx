import React, { memo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

export const ComposerToolbar = memo(() => {
	const useStyles = makeStyles(() => ({
		root: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			position: 'relative',
			height: '100%',
		},
		panel: {
			display: 'flex',
			alignItems: 'center',
			marginRight: 24,
			height: 32,
			opacity: 0.5,
			borderRadius: 16,
			backgroundColor: '#222',
			padding: '0 4px',
		},
		actionButton: {
			margin: '0 4px',
			width: 24,
			height: 24,
			textAlign: 'center',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			color: '#ccc',
			'&:hover': {
				color: '#fff',
			},
		},
		actionButtonDisabled: {
			pointerEvents: 'none',
			color: '#666',
		},
	}));
	const classes = useStyles();

	return (
		<Box id="ComposerToolbar" className={classes.root}>
			<Box className={`${classes.panel}`}>
				<AddCircleOutlineOutlinedIcon className={classes.actionButton} titleAccess="New" />
				<FolderOpenOutlinedIcon className={`${classes.actionButton} ${classes.actionButtonDisabled}`} titleAccess="Open" />
				<SaveOutlinedIcon className={`${classes.actionButton} ${classes.actionButtonDisabled}`} titleAccess="Save" />
			</Box>
		</Box>
	);
});
