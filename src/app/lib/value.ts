import * as CryptoJS from 'crypto-js';

export class ValueClass {
  value: number;
  valueHash: string;

  constructor() {
    this.value = this.nextValue();
    this.valueHash = this.nextValueHash();
  }

  private nextValue(): number {
    return this.getRandomInt(1, 100);
  }

  private nextValueHash(): string {
    return CryptoJS.SHA256(this.value.toString()).toString();
  }

  private getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
