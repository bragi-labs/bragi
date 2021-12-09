import React, { useCallback, useMemo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { TextField, Typography } from '@material-ui/core';
import { MusicalHelper } from '../../services/musicalHelper';
import { MusicModel, PartType } from '../../model/scoreModel';
import { ScoreSettings } from '../../model/scoreSettings';
import { Music } from '../../model/music';
import { MelodyPartUI } from './MelodyPartUI';
import { useSetRecoilState } from 'recoil';
import { selectionAtom } from '../../atoms/selectionAtom';

export interface MusicUIProps {
	music: MusicModel;
	scoreSettings: ScoreSettings;
}

export const MusicUI = ({ music, scoreSettings }: MusicUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			position: 'relative',
		},
		row: {
			position: 'relative',
			display: 'flex',
			pageBreakInside: 'avoid',
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
		textPartRoot: {
			display: 'flex',
			width: '100%',
			'& .MuiTextField-root': {
				width: '100%',
				'& .MuiInput-formControl': {
					width: '100%',
					'& .MuiInput-input': {
						width: '100%',
						padding: 2,
						fontFamily: 'Arial, sans-serif',
						color: '#000',
					},
				},
				'&.font-weight-bold .MuiInput-input': {
					fontWeight: 900,
				},
				'&.textSize-8 .MuiInput-input': {
					fontSize: '8px',
				},
				'&.textSize-9 .MuiInput-input': {
					fontSize: '9px',
				},
				'&.textSize-10 .MuiInput-input': {
					fontSize: '10px',
				},
				'&.textSize-11 .MuiInput-input': {
					fontSize: '11px',
				},
				'&.textSize-12 .MuiInput-input': {
					fontSize: '12px',
				},
				'&.textSize-13 .MuiInput-input': {
					fontSize: '13px',
				},
				'&.textSize-14 .MuiInput-input': {
					fontSize: '14px',
				},
				'&.textSize-15 .MuiInput-input': {
					fontSize: '15px',
				},
				'&.textSize-16 .MuiInput-input': {
					fontSize: '16px',
				},
				'&.textSize-17 .MuiInput-input': {
					fontSize: '17px',
				},
				'&.textSize-18 .MuiInput-input': {
					fontSize: '18px',
				},
				'&.textSize-19 .MuiInput-input': {
					fontSize: '19px',
				},
				'&.textSize-20 .MuiInput-input': {
					fontSize: '20px',
				},
				'&.textSize-21 .MuiInput-input': {
					fontSize: '21px',
				},
				'&.textSize-22 .MuiInput-input': {
					fontSize: '22px',
				},
				'&.textSize-23 .MuiInput-input': {
					fontSize: '23px',
				},
				'&.textSize-24 .MuiInput-input': {
					fontSize: '24px',
				},
			},
		},
	}));
	const classes = useStyles();

	const setSelection = useSetRecoilState(selectionAtom);

	const sizeVars = useMemo(() => {
		const exampleMeasure = Music.getExampleMeasure(music);
		const timeData = MusicalHelper.parseTimeSignature(exampleMeasure.timeSignature);
		const partWidth = (4 * scoreSettings.quarterSize * timeData.beats) / timeData.beatType;
		const measureWidth = partWidth + 2;
		const spaceForMeasurementNumbers = 20;
		const numberOfMeasuresPerRow = Math.trunc((scoreSettings.musicWidth - spaceForMeasurementNumbers) / measureWidth);
		const leftGutter = (scoreSettings.musicWidth - measureWidth * numberOfMeasuresPerRow) / 2;
		return {
			numberOfMeasuresPerRow,
			partWidth,
			leftGutter,
		};
	}, [music, scoreSettings.musicWidth, scoreSettings.quarterSize]);

	const getPartInfo = useCallback(
		function getPartInfo(partInfoId: string) {
			return music.partsInfo.find((pi) => pi.id === partInfoId) || null;
		},
		[music],
	);

	const getRows = useCallback(
		function getRows() {
			if (music.measures.length === 0) {
				return [];
			}
			const rows: number[][] = [];
			let row: number[] = [];
			music.measures.forEach((m, i) => {
				row.push(i);
				if (m.isPickup || m.number % sizeVars.numberOfMeasuresPerRow === 0) {
					rows.push(row);
					row = [];
				}
			});
			if (row.length) {
				rows.push(row);
			}
			return rows;
		},
		[music, sizeVars.numberOfMeasuresPerRow],
	);

	const handleTextFocus = useCallback(
		function handleTextFocus(e) {
			setSelection([
				{
					partInfoId: e.target.parentElement.parentElement.dataset.partInfoId,
					measureId: e.target.parentElement.parentElement.dataset.msrId,
					partId: e.target.parentElement.parentElement.dataset.partId,
					noteId: '',
				},
			]);
		},
		[setSelection],
	);

	const handleTextChange = useCallback(
		function handleTextChange(e) {
			const part = Music.findPart(music, e.target.parentElement.parentElement.dataset.partId);
			if (part) {
				part.text = e.target.value;
			}
		},
		[music],
	);

	const handleTextBlur = useCallback(
		function handleTextBlur(e) {
			setSelection([
				{
					partInfoId: e.target.parentElement.parentElement.dataset.partInfoId,
					measureId: e.target.parentElement.parentElement.dataset.msrId,
					partId: e.target.parentElement.parentElement.dataset.partId,
					noteId: '',
				},
			]);
		},
		[setSelection],
	);

	return (
		<Box id="MusicUI" className={classes.root} style={{ width: `${scoreSettings.musicWidth}px` }}>
			{getRows().map((row, rIndex) => (
				<Box key={rIndex} className={classes.row} style={{ marginLeft: `${sizeVars.leftGutter}px` }}>
					{row.map((mIndex) => (
						<Box key={`${rIndex}-${mIndex}`} className={classes.measure} style={{ marginTop: `${rIndex === 0 ? 0 : scoreSettings.rowGap}px` }}>
							{scoreSettings.measureNumbers && music.measures[mIndex].number % sizeVars.numberOfMeasuresPerRow === 1 && (
								<Box className={classes.measureNumberAnchor}>
									<Box className={classes.measureNumber}>
										<Typography variant="body2" className={classes.measureNumberText}>
											{music.measures[mIndex].number}
										</Typography>
									</Box>
								</Box>
							)}
							{music.measures[mIndex].parts.map((p, pIndex) => (
								<Box key={`${rIndex}-${mIndex}-${p.id}`} style={{ width: `${sizeVars.partWidth}px` }}>
									{Music.isPartVisible(music, p.partInfoId) && p.partType === PartType.FN_LVL_1 && (
										<MelodyPartUI partInfo={getPartInfo(p.partInfoId)} part={p} isFirstPart={pIndex === 0} scoreSettings={scoreSettings} />
									)}
									{Music.isPartVisible(music, p.partInfoId) && p.partType === PartType.TEXT && (
										<Box id="TextPartUI" className={classes.textPartRoot} style={{ backgroundColor: `${getPartInfo(p.partInfoId)?.bgColor || '#fff'}` }}>
											<TextField
												data-part-info-id={p.partInfoId}
												data-part-id={p.id}
												data-msr-id={p.measureId}
												defaultValue={p.text}
												onFocus={handleTextFocus}
												onChange={handleTextChange}
												onBlur={handleTextBlur}
												label=""
												className={`textSize-${getPartInfo(p.partInfoId)?.fontSize || '12'} ${getPartInfo(p.partInfoId)?.isBold ? 'font-weight-bold' : ''}`}
												style={{ borderBottom: `${pIndex === music.measures[mIndex].parts.length - 1 ? 0 : 1}px solid #eee` }}
											/>
										</Box>
									)}
								</Box>
							))}
						</Box>
					))}
				</Box>
			))}
		</Box>
	);
};
