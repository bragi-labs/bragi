import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { draggedItemAtom } from '../atoms/draggedItemAtom';

export const useDraggablePanel = () => {
	const draggedItem = useRecoilValue(draggedItemAtom);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	return {
		draggedItem,
		position,
		setPosition,
	};
};
