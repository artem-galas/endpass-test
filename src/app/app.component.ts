import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { environment } from '../environments/environment';
import { UserLocalStorage } from './lib/user-local-storage';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';

import {debounceTime} from 'rxjs/operators';
import { Bet } from './models/bet';
import { ValueClass } from './lib/value';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public user: User;
  public diceForm: FormGroup;
  public bet: Bet;
  public nextValueHash: string;
  public nextValue: number;
  public result: {
    win: boolean
    numbrer: number,
  };
  public diceFormSubmit = false;
  public valueClass: ValueClass;

  constructor(private fb: FormBuilder) {
    if (localStorage.getItem(environment.localStorageUserKey)) {
      this.user = UserLocalStorage.getUser();
    } else {
      this.user = new User();
      UserLocalStorage.setUser(this.user);
    }
    this.setNewValue();
  }

  ngOnInit() {
    this.buildDiceForm();

    this.numberControl.valueChanges
    .pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.bet = new Bet(value);
    });
  }

  private buildDiceForm() {
    this.diceForm = this.fb.group({
      betAmount: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.user.balance),
        Validators.pattern(new RegExp('^\\d+$'))
      ]],
      number: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.pattern(new RegExp('^\\d+$'))
      ]]
    });
  }

  public getFreeCredits() {
    this.user.getFreeCredits();
    UserLocalStorage.setUser(this.user);
  }

  public setBet({hi}: {hi: boolean}) {
    this.diceFormSubmit = true;
    if (hi) {
      if (this.nextValue >= this.diceForm.value.number) {
        this.userWin(this.bet.payoutHi);
      } else {
        this.userFail(this.bet.payoutHi);
      }
    } else {
      if (this.nextValue <= this.diceForm.value.number) {
        this.userWin(this.bet.payoutLo);
      } else {
        this.userFail(this.bet.payoutLo);
      }
    }
  }

  get betAmountControl(): AbstractControl {
    return this.diceForm.get('betAmount');
  }

  get numberControl(): AbstractControl {
    return this.diceForm.get('number');
  }

  private setNewValue() {
    this.valueClass = new ValueClass();
    this.nextValue = this.valueClass.value;
    this.nextValueHash = this.valueClass.valueHash;
  }

  private userWin(payout: number) {
    this.user.increaceBalance(payout);
    UserLocalStorage.setUser(this.user);
    this.result = {
      numbrer: this.nextValue,
      win: true,
    };
  }

  private userFail(payout: number) {
    this.user.decriceBalance(payout);
    UserLocalStorage.setUser(this.user);
    this.result = {
      numbrer: this.nextValue,
      win: false,
    };
  }

  public tryAgain() {
    this.diceForm.reset();
    this.diceFormSubmit = false;
    this.setNewValue();
  }
}
