import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSettingsContext = () => {
	const [pageWidth, setPageWidth] = useState(793);
	const [stageWidth, setStageWidth] = useState(714);
	const [partsWidth, setPartsWidth] = useState(714);
	const [quarterSize, setQuarterSize] = useState(36);
	const [rowGap, setRowGap] = useState(36);

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
