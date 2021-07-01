import { atom } from 'recoil';

export enum DraggedItem {
	PIANO_PANEL = 'PIANO_PANEL',
	NOTE_TOOLBAR_PANEL = 'NOTE_TOOLBAR_PANEL',
	NA = 'NA',
}

export const uiDraggedItem = atom<DraggedItem>({
	key: 'uiDraggedItem',
	default: DraggedItem.NA,
});
