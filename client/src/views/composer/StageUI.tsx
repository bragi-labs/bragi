import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { ScoreModel } from '../../model/scoreModel';
import { SettingsContextContainer } from '../../hooks/useSettingsContext';
import { StageHeaderUI } from './StageHeaderUI';
import { PartUI } from './PartUI';

export interface StageUIProps {
	score: ScoreModel | null;
}

export const StageUI = ({ score }: StageUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
			width: '21cm',
			//height: '29.7cm',
			height: '100%',
			textAlign: 'center',
			//backgroundColor: '#eee',
			backgroundColor: '#fff',
			//backgroundImage: 'linear-gradient(135deg, #fff 47.06%, #ccc 47.06%, #ccc 50%, #fff 50%, #fff 97.06%, #ccc 97.06%, #ccc 100%)',
			//backgroundSize: '24px 24px',
			padding: '2.54cm 1.32cm 3.67cm 1.9cm',
			opacity: 0.85,
			overflow: 'auto',
			'@media print': {
				padding: '0 !important',
				opacity: 1,
				overflow: 'visible',
			},
		},
		content: {
			maxHeight: '27.7cm',
			overflow: 'hidden',
			backgroundColor: '#fff',
			color: '#000',
		},
		stageHeader: {
			padding: '0 0 16px 0',
		},
	}));
	const classes = useStyles();

	const { stageWidthCm } = SettingsContextContainer.useContainer();

	return (
		<>
			{score && (
				<Box id="StageUI" className={`${classes.root} no-scrollbar`} style={{ padding: `${(21 - stageWidthCm) / 2}cm` }}>
					<Box className={classes.content} style={{ width: `${stageWidthCm}cm` }}>
						<StageHeaderUI scoreInfo={score.scoreInfo} />
						{score.parts.map((part, i) => (
							<PartUI key={i} part={part} />
						))}
					</Box>
				</Box>
			)}
		</>
	);
};
