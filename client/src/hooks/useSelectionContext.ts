import { useState } from 'react';
import { createContainer } from 'unstated-next';

export interface SelectedItem {
	partId: string;
	measureId: string;
	voiceId: string;
	noteId: string;
}

export interface Selection {
	items: SelectedItem[];
}

const useSelectionContext = () => {
	const [selection, setSelection] = useState<Selection | null>(null);

	const isSelected = (id: string) => {
		if (!selection) return false;
		let found = false;
		selection.items.forEach((i) => {
			if ([i.partId, i.measureId, i.voiceId, i.noteId].includes(id)) {
				found = true;
			}
		});
		return found;
	};

	return {
		selection,
		setSelection,
		isSelected,
	};
};

export const SelectionContextContainer = createContainer(useSelectionContext);
