import { atom } from 'recoil';

export enum DraggedItemType {
	PIANO_PANEL = 'PIANO_PANEL',
	NOTE_PANEL = 'NOTE_PANEL',
	MEASURE_PANEL = 'MEASURE_PANEL',
	PARTS_PANEL = 'PARTS_PANEL',
	NA = 'NA',
}

export const uiDraggedItem = atom<DraggedItemType>({
	key: 'uiDraggedItem',
	default: DraggedItemType.NA,
});
