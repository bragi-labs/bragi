import { atom } from 'recoil';

export const uiSizes = atom({
	key: 'uiSizes',
	default: {
		partsWidth: 718, //718 and less
		quarterSize: 36, //20 to 44
		lyricsSize: 11, //11 to 15
		rowGap: 36, //20 to 80
	},
});
