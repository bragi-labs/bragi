import { atom } from 'recoil';

export interface SelectionItem {
	measureId: string;
	voiceId: string;
	noteId: string;
}

export const uiSelection = atom<SelectionItem[]>({
	key: 'uiSelection',
	default: [],
});
