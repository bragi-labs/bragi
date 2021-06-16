import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSettingsContext = () => {
	const [stageWidthCm, setStageWidthCm] = useState(19.0);
	const [rowGapCm, setRowGapCm] = useState(1.0);

	return {
		stageWidthCm,
		setStageWidthCm,
		rowGapCm,
		setRowGapCm,
	};
};

export const SettingsContextContainer = createContainer(useSettingsContext);
