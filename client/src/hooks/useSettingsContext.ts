import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSettingsContext = () => {
	const [partsWidth, setPartsWidth] = useState(718); //718 and less
	const [quarterSize, setQuarterSize] = useState(36); //20 to 44
	const [lyricsSize, setLyricsSize] = useState(11); //11 to 15
	const [rowGap, setRowGap] = useState(36); //20 to 80

	return {
		partsWidth,
		setPartsWidth,
		quarterSize,
		setQuarterSize,
		lyricsSize,
		setLyricsSize,
		rowGap,
		setRowGap,
	};
};

export const SettingsContextContainer = createContainer(useSettingsContext);
