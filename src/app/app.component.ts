import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { environment } from '../environments/environment';
import { UserLocalStorage } from './lib/user-local-storage';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';

import {debounceTime} from 'rxjs/operators';
import { Bet } from './models/bet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public user: User;
  public diceForm: FormGroup;
  public bet: Bet;

  constructor(private fb: FormBuilder) {
    const currentUser = UserLocalStorage.getUser();
    if (currentUser) {
      this.user = currentUser;
    } else {
      this.user = new User();
      UserLocalStorage.setUser(this.user);
    }
  }

  ngOnInit() {
    this.buildDiceForm();

    this.numberControl.valueChanges
    .pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.bet = new Bet(value);
      console.log(this.bet);
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

  public submitDiceForm() {
    console.log(this.diceForm);
  }

  get betAmountControl(): AbstractControl {
    return this.diceForm.get('betAmount');
  }

  get numberControl(): AbstractControl {
    return this.diceForm.get('number');
  }
}
