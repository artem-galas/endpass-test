import { Guid } from '../lib/guid';
import { environment } from '../../environments/environment';

export class User {
  id: string;
  balance: number;

  constructor(id = Guid.newGuid(), balace = 0) {
    this.id = id;
    this.balance = balace;
  }

  public getFreeCredits(): void {
    this.balance = 100;
  }
}
