import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { MusicalHelper } from '../../services/musicalHelper';
import { SoundHelper } from '../../services/soundHelper';
import { FigurenotesHelper } from '../../services/figurenotesHelper';
import { PartInfoModel, PartModel, ScoreSettingsModel } from '../../model/scoreModel';
import { Part } from '../../model/part';
import { selectionAtom } from '../../atoms/selectionAtom';

export interface MelodyPartUIProps {
	partInfo: PartInfoModel | null;
	part: PartModel;
	isFirstPart: boolean;
	scoreSettings: ScoreSettingsModel;
}

export const MelodyPartUI = ({ partInfo, part, isFirstPart, scoreSettings }: MelodyPartUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
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

	const [selection, setSelection] = useRecoilState(selectionAtom);

	const handleClickNote = useCallback(
		function handleClickNote(e) {
			const note = Part.findNote(part, e.currentTarget.dataset.noteId);
			if (note) {
				setSelection([{ partInfoId: part.partInfoId, measureId: note.measureId, partId: note.partId, noteId: note.id }]);
				if (!note.isRest) {
					SoundHelper.playShortNote(note.fullName);
				}
			}
		},
		[part, setSelection],
	);

	return (
		<Box id="MelodyPartUI" className={`${classes.root} ${isFirstPart ? '' : classes.partSpaceAbove}`}>
			{part.notes.map((n) => (
				<Box
					key={n.id}
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
										left: MusicalHelper.parseNote(n.fullName).octave <= 3 ? `${scoreSettings.quarterSize - 2}px` : `${scoreSettings.quarterSize / 2 - 1}px`,
										width:
											MusicalHelper.parseNote(n.fullName).octave <= 3
												? `${((n.durationDivs - 24) * scoreSettings.quarterSize) / 24 - 1}px`
												: `${scoreSettings.quarterSize / 2 - 1 + ((n.durationDivs - 24) * scoreSettings.quarterSize) / 24 - 1}px`,
									}}
								/>
							)}
							{n.fullName.length >= 2 && n.fullName[1] === '#' && (
								<ArrowRightAltIcon className={`${classes.alter} sharp`} style={{ left: `${scoreSettings.quarterSize / 2 - 8}px` }} />
							)}
							{n.fullName.length >= 2 && n.fullName[1] === 'b' && (
								<ArrowRightAltIcon className={`${classes.alter} flat`} style={{ left: `${scoreSettings.quarterSize / 2 - 18}px` }} />
							)}
							{partInfo && partInfo.fontSize > 0 && (
								<Box
									className={classes.noteName}
									style={{
										top: `${scoreSettings.quarterSize / 2 - 9}px`,
										left: `${MusicalHelper.parseNote(n.fullName).alter ? scoreSettings.quarterSize / 2 - 9 : scoreSettings.quarterSize / 2 - 5.5}px`,
										fontSize: `${partInfo && partInfo.fontSize > 0 ? partInfo.fontSize : '12'}px`,
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
		</Box>
	);
};
