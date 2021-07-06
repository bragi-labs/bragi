import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { TextField, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';
import { FigurenotesHelper } from '../../services/figurenotesHelper';
import { MusicModel, PartType } from '../../model/scoreModel';
import { ScoreSettings } from '../../model/scoreSettings';
import { Music } from '../../model/music';
import { selectionAtom } from '../../atoms/selectionAtom';

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
		textLine: {
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

	const [selection, setSelection] = useRecoilState(selectionAtom);
	const resetSelection = useResetRecoilState(selectionAtom);

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

	const handleClickNote = useCallback(
		(e) => {
			const note = Music.findNote(music, e.currentTarget.dataset.noteId);
			if (note) {
				const partInfoId = e.currentTarget.dataset.partInfoId;
				setSelection([{ partInfoId, measureId: note.measureId, partId: note.partId, noteId: note.id }]);
				if (!note.isRest) {
					SoundHelper.playShortNote(note.fullName);
				}
			}
		},
		[music, setSelection],
	);

	const handleTextFocus = useCallback(
		(e) => {
			const p = Music.findPart(music, e.target.parentElement.parentElement.dataset.partId);
			if (p) {
				const partInfoId = e.target.parentElement.parentElement.dataset.partInfoId;
				setSelection([{ partInfoId, measureId: p.measureId, partId: p.id, noteId: '' }]);
			}
		},
		[music, setSelection],
	);

	const handleTextChange = useCallback(
		(e) => {
			const p = Music.findPart(music, e.target.parentElement.parentElement.dataset.partId);
			if (p) {
				p.text = e.target.value;
			}
		},
		[music],
	);

	const handleTextBlur = useCallback(() => {
		resetSelection();
	}, [resetSelection]);

	const getPartInfo = useCallback(
		(partInfoId: string) => {
			return music.partsInfo.find((pi) => pi.id === partInfoId);
		},
		[music],
	);

	const getPartInfoFontSize = useCallback(
		(partInfoId: string) => {
			const pi = getPartInfo(partInfoId);
			return pi ? pi.fontSize : 0;
		},
		[getPartInfo],
	);

	const isPartInfoBold = useCallback(
		(partInfoId: string) => {
			const pi = getPartInfo(partInfoId);
			return pi ? pi.isBold : false;
		},
		[getPartInfo],
	);

	const getPartInfoBgColor = useCallback(
		(partInfoId: string) => {
			const pi = getPartInfo(partInfoId);
			return pi ? pi.bgColor : '#f6f6f6';
		},
		[getPartInfo],
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
									{Music.isPartVisible(music, p.partInfoId) && (
										<Box
											className={`${classes.part} ${
												pIndex > 0 && p.partType === PartType.FN_LVL_1 /*&& Music.doesPartHasSharpsOrFlats(music, part.partInfoId)*/
													? classes.partSpaceAbove
													: ''
											}`}
										>
											{p.partType === PartType.FN_LVL_1 &&
												p.notes.map((n) => (
													<Box
														key={n.id}
														data-part-info-id={p.partInfoId}
														data-measure-id={m.id}
														data-part-id={p.id}
														data-note-id={n.id}
														onClick={handleClickNote}
														className={`${classes.note} ${selection.find((si) => si.noteId === n.id) ? 'selected' : ''}`}
														style={{ flex: `${n.durationDivs} 0 0`, height: `${scoreSettings.quarterSize}px` }}
													>
														{n.fullName && (
															<Box
																className={classes.fnSymbolContainer}
																style={{
																	transform: `scaleX(${n.durationDivs >= 24 ? 1 : n.durationDivs / 24})`,
																}}
															>
																<Box
																	className={classes.fnSymbol}
																	style={{
																		...FigurenotesHelper.getSymbolStyle(
																			`${MusicalHelper.parseNote(n.fullName).step}${MusicalHelper.parseNote(n.fullName).octave}`,
																			scoreSettings.quarterSize - 2,
																			'px',
																		),
																	}}
																/>
																{n.durationDivs > 24 && (
																	<Box
																		className={classes.longNoteTail}
																		style={{
																			backgroundColor: `${FigurenotesHelper.getNoteColor(MusicalHelper.parseNote(n.fullName).step)}`,
																			top: `${scoreSettings.quarterSize - 12}px`,
																			height: `10px`,
																			left:
																				MusicalHelper.parseNote(n.fullName).octave <= 3
																					? `${scoreSettings.quarterSize - 2}px`
																					: `${scoreSettings.quarterSize / 2 - 1}px`,
																			width:
																				MusicalHelper.parseNote(n.fullName).octave <= 3
																					? `${((n.durationDivs - 24) * scoreSettings.quarterSize) / 24 - 1}px`
																					: `${
																							scoreSettings.quarterSize / 2 -
																							1 +
																							((n.durationDivs - 24) * scoreSettings.quarterSize) / 24 -
																							1
																					  }px`,
																		}}
																	/>
																)}
																{n.fullName.length >= 2 && n.fullName[1] === '#' && (
																	<ArrowRightAltIcon
																		className={`${classes.alter} sharp`}
																		style={{ left: `${scoreSettings.quarterSize / 2 - 8}px` }}
																	/>
																)}
																{n.fullName.length >= 2 && n.fullName[1] === 'b' && (
																	<ArrowRightAltIcon
																		className={`${classes.alter} flat`}
																		style={{ left: `${scoreSettings.quarterSize / 2 - 18}px` }}
																	/>
																)}
																{getPartInfoFontSize(p.partInfoId) > 0 && (
																	<Box
																		className={classes.noteName}
																		style={{
																			top: `${scoreSettings.quarterSize / 2 - 9}px`,
																			left: `${
																				MusicalHelper.parseNote(n.fullName).alter
																					? scoreSettings.quarterSize / 2 - 9
																					: scoreSettings.quarterSize / 2 - 5.5
																			}px`,
																			fontSize: `${getPartInfoFontSize(p.partInfoId)}px`,
																		}}
																	>
																		{MusicalHelper.parseNote(n.fullName).step}
																		{MusicalHelper.parseNote(n.fullName).alter}
																	</Box>
																)}
															</Box>
														)}
														{!n.fullName && <Box>{``}</Box>}
													</Box>
												))}
											{p.partType === PartType.TEXT && (
												<Box className={classes.textLine} style={{ backgroundColor: `${getPartInfoBgColor(p.partInfoId)}` }}>
													<TextField
														data-part-info-id={p.partInfoId}
														data-measure-id={m.id}
														data-part-id={p.id}
														defaultValue={p.text}
														onFocus={handleTextFocus}
														onChange={handleTextChange}
														onBlur={handleTextBlur}
														label=""
														className={`textSize-${getPartInfoFontSize(p.partInfoId)} ${isPartInfoBold(p.partInfoId) ? 'font-weight-bold' : ''}`}
														style={{ borderBottom: `${pIndex === m.parts.length - 1 ? 0 : 1}px solid #eee` }}
													/>
												</Box>
											)}
										</Box>
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
