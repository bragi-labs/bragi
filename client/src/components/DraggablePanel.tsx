import React, { useState, useRef, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import { DraggedItemType, uiDraggedItem } from '../atoms/uiDraggedItem';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

export interface DraggablePanelProps {
	title: string;
	draggedItemType: DraggedItemType;
	onDragMove?: (deltaX: number, deltaY: number) => void;
}

export const DraggablePanel = React.memo(({ title, draggedItemType, onDragMove }: DraggablePanelProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			backgroundColor: '#222',
			//backgroundImage: 'linear-gradient(135deg, #fa3 25%, #333 25%, #333 50%, #fa3 50%, #fa3 75%, #333 75%, #333 100%)',
			//backgroundSize: '56px 56px',
			padding: '2px 8px 6px 8px',
			userSelect: 'none',
			cursor: 'move',
		},
		title: {
			color: '#eee',
			fontSize: 14,
		},
	}));
	const classes = useStyles();

	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const panelRef = useRef<HTMLDivElement | null>(null);
	const setDraggedItem = useSetRecoilState(uiDraggedItem);
	const resetDraggedItem = useResetRecoilState(uiDraggedItem);

	const handleMouseDown = useCallback(
		(e) => {
			if (e.button !== 0) {
				return;
			}
			setPosition({ x: e.clientX, y: e.clientY });
			setIsDragging(true);
			setDraggedItem(draggedItemType);
			e.stopPropagation();
			e.preventDefault();
		},
		[setDraggedItem],
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging) {
				return;
			}
			//const roundedX = Math.trunc(e.clientX / 4) * 4;
			//const roundedY = Math.trunc(e.clientY / 4) * 4;
			const deltaX = e.clientX - position.x;
			const deltaY = e.clientY - position.y;
			if (deltaX === 0 && deltaY === 0) {
				return;
			}
			setPosition({ x: e.clientX, y: e.clientY });
			if (onDragMove) {
				onDragMove(deltaX, deltaY);
			}
		},
		[isDragging, position, onDragMove],
	);

	const handleMouseUp = useCallback(
		(e) => {
			if (!isDragging) {
				return;
			}
			setIsDragging(false);
			resetDraggedItem();
			e.stopPropagation();
			e.preventDefault();
		},
		[isDragging, resetDraggedItem],
	);

	useEffect(() => {
		const panel = panelRef.current;
		if (!panel) {
			return;
		}
		panel.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			panel.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseDown, handleMouseMove, handleMouseUp]);

	return (
		<div id="DraggablePanel" ref={panelRef} className={classes.root}>
			<Typography className={classes.title}>{title}</Typography>
		</div>
	);
});
