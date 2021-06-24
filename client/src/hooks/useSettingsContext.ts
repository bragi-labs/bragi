import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSettingsContext = () => {
	const [stageWidthCm, setStageWidthCm] = useState(18.9);
	const [quarterSizeCm, setQuarterSizeCm] = useState(1.0);
	const [rowGapCm, setRowGapCm] = useState(1.0);

	return {
		stageWidthCm,
		setStageWidthCm,
		quarterSizeCm,
		setQuarterSizeCm,
		rowGapCm,
		setRowGapCm,
	};
};

export const SettingsContextContainer = createContainer(useSettingsContext);
