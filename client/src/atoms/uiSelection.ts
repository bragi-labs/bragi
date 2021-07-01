import { atom } from 'recoil';

export interface SelectionItem {
	partId: string;
	measureId: string;
	voiceId: string;
	noteId: string;
}

export const uiSelection = atom<SelectionItem[]>({
	key: 'uiSelection',
	default: [],
});
