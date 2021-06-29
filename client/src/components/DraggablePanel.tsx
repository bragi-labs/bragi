import React, { useState, useRef, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

export interface DraggablePanelProps {
	onDragStart?: () => void;
	onDragMove?: (deltaX: number, deltaY: number) => void;
	onDragEnd?: () => void;
}

export const DraggablePanel = React.memo(({ onDragStart, onDragMove, onDragEnd }: DraggablePanelProps) => {
	const useStyles = makeStyles(() => ({
		root: {
			height: '16px',
			backgroundImage: 'linear-gradient(135deg, #fa3 25%, #333 25%, #333 50%, #fa3 50%, #fa3 75%, #333 75%, #333 100%)',
			backgroundSize: '56px 56px',
			userSelect: 'none',
			cursor: 'move',
		},
	}));
	const classes = useStyles();

	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const panelRef = useRef<HTMLDivElement | null>(null);

	const handleMouseDown = useCallback(
		(e) => {
			if (e.button !== 0) {
				return;
			}
			setPosition({ x: e.clientX, y: e.clientY });
			setIsDragging(true);
			if (onDragStart) {
				onDragStart();
			}
			e.stopPropagation();
			e.preventDefault();
		},
		[onDragStart],
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging) {
				return;
			}
			const roundedX = Math.trunc(e.clientX / 4) * 4;
			const roundedY = Math.trunc(e.clientY / 4) * 4;
			const deltaX = roundedX - position.x;
			const deltaY = roundedY - position.y;
			if (deltaX === 0 && deltaY === 0) {
				return;
			}
			setPosition({ x: roundedX, y: roundedY });
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
			if (onDragEnd) {
				onDragEnd();
			}
			e.stopPropagation();
			e.preventDefault();
		},
		[isDragging, onDragEnd],
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

	return <div id="DraggablePanel" ref={panelRef} className={classes.root} />;
});
