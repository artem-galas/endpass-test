export class Bet {
  public bet: number;
  public chanceHi: number;
  public chanceLo: number;
  public payoutHi: string;
  public payoutLo: string;

  constructor(bet: number) {
    this.bet = bet;
    this.chanceHi = this.calculateChanceHi();
    this.chanceLo = this.calculateChanceLo();
    this.payoutHi = this.calculatePayout(this.chanceHi);
    this.payoutLo = this.calculatePayout(this.chanceLo);
  }

  private calculateChanceHi(): number {
    return 100 - this.bet;
  }

  private calculateChanceLo(): number {
    return 100 - this.chanceHi;
  }

  private calculatePayout(chance): string {
    return (100 / chance).toFixed(2);
  }
}
