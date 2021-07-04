import { useRecoilValue } from 'recoil';
import { uiDraggedItem } from '../atoms/uiDraggedItem';
import { useState } from 'react';

export const useDraggablePanel = () => {
	const draggedItem = useRecoilValue(uiDraggedItem);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	return {
		draggedItem,
		position,
		setPosition,
	};
};
