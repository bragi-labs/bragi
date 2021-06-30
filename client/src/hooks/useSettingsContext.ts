import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSettingsContext = () => {
	const [pageWidth, setPageWidth] = useState(776);
	const [stageWidth, setStageWidth] = useState(718);
	const [partsWidth, setPartsWidth] = useState(718); //718 and less
	const [quarterSize, setQuarterSize] = useState(36); //20 to 44
	const [rowGap, setRowGap] = useState(36); //20 to 80

	return {
		pageWidth,
		setPageWidth,
		stageWidth,
		setStageWidth,
		partsWidth,
		setPartsWidth,
		quarterSize,
		setQuarterSize,
		rowGap,
		setRowGap,
	};
};

export const SettingsContextContainer = createContainer(useSettingsContext);
