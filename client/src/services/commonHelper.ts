export class CommonHelper {
	static getRandomId(): string {
		const numberOfDigits = 9;
		const min = 16 ** (numberOfDigits - 1);
		const max = 16 ** numberOfDigits;
		return (Math.floor(Math.random() * (max - min + 1)) + min).toString(16);
	}
}
