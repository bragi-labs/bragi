import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useSettingsContext = () => {
	const [stageWidthCm, setStageWidthCm] = useState(19.0);
	const [rowGapCm, setRowGapCm] = useState(1.0);
	const [totalDurationDivsPerRow] = useState(24 * 4 * 4);

	return {
		stageWidthCm,
		setStageWidthCm,
		rowGapCm,
		setRowGapCm,
		totalDurationDivsPerRow,
	};
};

export const SettingsContextContainer = createContainer(useSettingsContext);
