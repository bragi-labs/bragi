import React, { useCallback } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import { TextField } from '@material-ui/core';
import { PartInfoModel, PartModel } from '../../model/scoreModel';
import { selectionAtom } from '../../atoms/selectionAtom';

export interface TextPartUIProps {
	partInfo: PartInfoModel | null;
	part: PartModel;
	isLastPart: boolean;
}

export const TextPartUI = ({ partInfo, part, isLastPart }: TextPartUIProps) => {
	const useStyles = makeStyles(() => ({
		root: {
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
	const resetSelection = useResetRecoilState(selectionAtom);

	const handleTextFocus = useCallback(() => {
		if (partInfo) {
			setSelection([{ partInfoId: partInfo.id, measureId: part.measureId, partId: part.id, noteId: '' }]);
		}
	}, [setSelection, partInfo, part.measureId, part.id]);

	const handleTextChange = useCallback(
		(e) => {
			part.text = e.target.value;
		},
		[part],
	);

	const handleTextBlur = useCallback(() => {
		resetSelection();
	}, [resetSelection]);

	return (
		<Box id="TextPartUI" className={classes.root} style={{ backgroundColor: `${partInfo ? partInfo.bgColor : '#fff'}` }}>
			<TextField
				defaultValue={part.text}
				onFocus={handleTextFocus}
				onChange={handleTextChange}
				onBlur={handleTextBlur}
				label=""
				className={`textSize-${partInfo ? partInfo.fontSize : '12'} ${partInfo && partInfo.isBold ? 'font-weight-bold' : ''}`}
				style={{ borderBottom: `${isLastPart ? 0 : 1}px solid #eee` }}
			/>
		</Box>
	);
};
