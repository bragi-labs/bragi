import { CommonHelper } from '../services/commonHelper';
import { MeasureModel, VoiceModel } from '../model/scoreModel';
import { Voice } from './voice';
import { NewScoreDialogResult } from '../views/composer/NewScoreDialog';

export class Measure implements MeasureModel {
	id: number = CommonHelper.getRandomId();
	number: number = -1;
	isPickup: boolean = false;
	musicalScale: string = 'C';
	timeSignature: string = '4/4';
	tempoBpm: number = 120;
	durationDivs: number = 96;
	voices: VoiceModel[] = [];

	initFromModel(measureModel: MeasureModel) {
		this.id = measureModel.id;
		this.number = measureModel.number;
		this.isPickup = measureModel.isPickup;
		this.musicalScale = measureModel.musicalScale;
		this.timeSignature = measureModel.timeSignature;
		this.tempoBpm = measureModel.tempoBpm;
		this.durationDivs = measureModel.durationDivs;
		this.voices = [];
		measureModel.voices.forEach((v) => {
			const voice = new Voice();
			voice.initFromModel(v);
			this.voices.push(voice);
		});
	}

	initFromNewDialog(newScoreDialogResult: NewScoreDialogResult, isPickupMeasure: boolean) {
		this.number = isPickupMeasure ? 0 : 1;
		this.isPickup = isPickupMeasure;
		this.timeSignature = isPickupMeasure ? newScoreDialogResult.pickupMeasure : newScoreDialogResult.timeSignature;
		this.durationDivs = Measure.getMeasureDurationDivs(isPickupMeasure ? newScoreDialogResult.pickupMeasure : newScoreDialogResult.timeSignature);
		this.voices = [];
		const voice = new Voice();
		voice.initFromNewDialog(/*newScoreDialogResult*/);
		this.addVoice(voice);
	}

	static getMeasureDurationDivs(timeSignature: string) {
		const t1 = parseInt(timeSignature[0]);
		const t2 = parseInt(timeSignature[2]);
		return t1 * (96 / t2);
	}

	addVoice(voice: Voice) {
		this.voices.push(voice);
	}
}
