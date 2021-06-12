import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { Score } from '../score/score';

export const useScoreContext = () => {
	const [score, setScore] = useState<Score | null>(null);

	return {
		score,
		setScore,
	};
};

export const ScoreContextContainer = createContainer(useScoreContext);
