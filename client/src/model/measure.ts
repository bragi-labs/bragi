import { CommonHelper } from '../services/commonHelper';
import { MeasureModel } from './scoreModel';
import { Voice } from './voice';
import { NewScoreData } from '../services/newScoreData';
import { MusicalHelper } from '../services/musicalHelper';

export class Measure implements MeasureModel {
	id: number = CommonHelper.getRandomId();
	scoreId: number = 0;
	partId: number = 0;
	number: number = -1;
	isPickup: boolean = false;
	musicalScale: string = 'C';
	timeSignature: string = '4/4';
	tempoBpm: number = 120;
	durationDivs: number = 96;
	voices: Voice[] = [];

	initFromModel(measureModel: MeasureModel) {
		this.id = measureModel.id;
		this.scoreId = measureModel.scoreId;
		this.partId = measureModel.partId;
		this.number = measureModel.number;
		this.isPickup = measureModel.isPickup;
		this.timeSignature = measureModel.timeSignature;
		this.durationDivs = measureModel.durationDivs;
		this.tempoBpm = measureModel.tempoBpm;
		this.musicalScale = measureModel.musicalScale;
		this.voices = [];
		measureModel.voices.forEach((v) => {
			const voice = new Voice();
			voice.initFromModel(v);
			this.voices.push(voice);
		});
	}

	initFromNewDialog(newScoreData: NewScoreData, isPickupMeasure: boolean, measureNumber: number) {
		this.number = measureNumber;
		this.isPickup = isPickupMeasure;
		this.timeSignature = newScoreData.timeSignature;
		this.durationDivs = MusicalHelper.parseTimeSignature(newScoreData.timeSignature).measureDurationDivs;
		this.voices = [];
		const voice = new Voice();
		voice.scoreId = this.scoreId;
		voice.partId = this.partId;
		voice.measureId = this.id;
		voice.initFromNewDialog(newScoreData);
		this.voices.push(voice);
	}
}
