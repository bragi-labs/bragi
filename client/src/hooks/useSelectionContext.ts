import { useState } from 'react';
import { createContainer } from 'unstated-next';

export interface SelectedItem {
	partId: number;
	measureId: number;
	noteId: number;
}

export interface Selection {
	items: SelectedItem[];
}

const useSelectionContext = () => {
	const [selection, setSelection] = useState<Selection | null>(null);

	return {
		selection,
		setSelection,
	};
};

export const SelectionContextContainer = createContainer(useSelectionContext);
