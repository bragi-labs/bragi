import React, { useCallback, useMemo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { MusicalHelper } from '../../services/musicalHelper';
import { MusicModel, PartType } from '../../model/scoreModel';
import { ScoreSettings } from '../../model/scoreSettings';
import { Music } from '../../model/music';
import { MelodyPartUI } from './MelodyPartUI';
import { TextPartUI } from './TextPartUI';

export interface MusicUIProps {
	music: MusicModel;
	scoreSettings: ScoreSettings;
}

export const MusicUI = ({ music, scoreSettings }: MusicUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {},
		measures: {
			position: 'relative',
			display: 'flex',
			flexWrap: 'wrap',
		},
		measure: {
			position: 'relative',
			border: '1px solid #999',
		},
		measureNumberAnchor: {
			position: 'absolute',
			top: 0,
			left: 0,
		},
		measureNumber: {
			position: 'absolute',
			top: -18,
			right: 2,
		},
		measureNumberText: {
			fontSize: '14px',
			fontWeight: 700,
		},
		part: {
			display: 'flex',
		},
		partSpaceAbove: {
			marginTop: 11,
		},
		note: {
			position: 'relative',
			fontSize: 10,
			border: '1px solid #eee',
			'&.selected': {
				backgroundColor: '#ddf',
				border: '1px solid #3f51b5',
			},
			'@media print': {
				backgroundColor: 'transparent !important',
				border: '1px solid #ddd !important',
			},
		},
		fnSymbolContainer: {
			position: 'absolute',
			left: 0,
			top: 0,
		},
		fnSymbol: {
			position: 'absolute',
		},
		longNoteTail: {
			position: 'absolute',
		},
		noteName: {
			position: 'absolute',
			fontFamily: 'Arial, sans-serif',
			color: '#fff',
		},
		alter: {
			position: 'absolute',
			top: -16,
			transformOrigin: 'center',
			'&.sharp': {
				transform: 'rotate(-45deg)',
			},
			'&.flat': {
				transform: 'rotate(-135deg)',
			},
			zIndex: -1,
		},
	}));
	const classes = useStyles();

	const sizeVars = useMemo(() => {
		const exampleMeasure = music.measures[0].isPickup ? music.measures[1] : music.measures[0];
		const timeData = MusicalHelper.parseTimeSignature(exampleMeasure.timeSignature);
		const measureWidth = (4 * scoreSettings.quarterSize * timeData.beats) / timeData.beatType + 2;
		const spaceForMeasurementNumbers = 20;
		const numberOfMeasuresPerRow = Math.trunc((scoreSettings.musicWidth - spaceForMeasurementNumbers) / measureWidth);
		const pickupMeasureLeftOver = measureWidth * (numberOfMeasuresPerRow - 1);
		const leftOver = (scoreSettings.musicWidth - -spaceForMeasurementNumbers - measureWidth * numberOfMeasuresPerRow) / 2;
		return {
			numberOfMeasuresPerRow,
			measureWidth,
			pickupMeasureLeftOver,
			leftOver,
		};
	}, [music.measures, scoreSettings.musicWidth, scoreSettings.quarterSize]);

	const getPartInfo = useCallback(
		function getPartInfo(partInfoId: string) {
			return music.partsInfo.find((pi) => pi.id === partInfoId) || null;
		},
		[music],
	);

	return (
		<Box id="MusicUI" className={classes.root} style={{ width: `${scoreSettings.musicWidth}px` }}>
			<Box className={classes.measures} style={{ marginLeft: `${sizeVars.leftOver}px` }}>
				{music.measures.map((m) => (
					<Box key={m.id} style={{ marginRight: `${m.isPickup ? sizeVars.pickupMeasureLeftOver : 0}px` }}>
						<Box className={classes.measure} style={{ width: `${sizeVars.measureWidth}px`, marginBottom: `${scoreSettings.rowGap}px` }}>
							{scoreSettings.measureNumbers && m.number % sizeVars.numberOfMeasuresPerRow === 1 && (
								<Box className={classes.measureNumberAnchor}>
									<Box className={classes.measureNumber}>
										<Typography variant="body2" className={classes.measureNumberText}>
											{m.number}
										</Typography>
									</Box>
								</Box>
							)}
							{m.parts.map((p, pIndex) => (
								<Box key={p.id}>
									{Music.isPartVisible(music, p.partInfoId) && p.partType === PartType.FN_LVL_1 && (
										<MelodyPartUI partInfo={getPartInfo(p.partInfoId)} part={p} isFirstPart={pIndex === 0} scoreSettings={scoreSettings} />
									)}
									{Music.isPartVisible(music, p.partInfoId) && p.partType === PartType.TEXT && (
										<TextPartUI partInfo={getPartInfo(p.partInfoId)} part={p} isLastPart={pIndex === m.parts.length - 1} />
									)}
								</Box>
							))}
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};
