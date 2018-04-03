import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { By } from 'selenium-webdriver';
import { DebugElement } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Bet } from './models/bet';

import {MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule,
  MatCardModule} from '@angular/material';
  import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appComponentEl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule,
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appComponentEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    expect(component).toBeDefined();
  });

  it('should has user in localStorage', () => {
    expect(localStorage.getItem('user')).toBeTruthy();
  });

  describe('Balance Element', () => {
    let cardUser;
    let balanceSpan;
    let button;
    let currentUser;

    beforeEach(() => {
      cardUser = appComponentEl.querySelector('mat-card.user');
      balanceSpan = cardUser.querySelector('span.balance');
      button = cardUser.querySelector('button');
      currentUser = JSON.parse(localStorage.getItem('user'));
    });

    it('user should get 100 free tokens and button should disabled', async(() => {
      cardUser.querySelector('button').click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.user.balance).toBe(100);
        expect(balanceSpan.textContent).toBe('Balance: 100 credits');
        expect(button.disabled).toBe(true);
      });
    }));
  });

  describe('Dice Element', () => {
    let diseEl;
    let diseForm;
    let betAmountInput: HTMLInputElement;
    let numberInput: HTMLInputElement;
    let betHiButton: HTMLButtonElement;
    let betAmount: string;
    let number: string;

    beforeEach(() => {
      diseEl = appComponentEl.querySelector('.dice');
      diseForm = diseEl.querySelector('#diceForm');
      betAmountInput = diseForm.querySelector('.form-group:first-child').querySelector('input') as HTMLInputElement;
      numberInput = diseForm.querySelector('.form-group:nth-child(2)').querySelector('input') as HTMLInputElement;
      betHiButton = diseEl.querySelector('.button-container').querySelector('button');
      betAmount = '20';
      number = '42';
    });

    it('user input 20 into Base Amount and Number 42 should win', async(() => {
      component.user.balance = 100;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.diceForm.valid).toBeFalsy();
      component.nextValue = 45;
      component.nextValueHash = CryptoJS.SHA256('45').toString();

      component.diceForm.setValue({
        betAmount: betAmount,
        number: number
      });
      fixture.detectChanges();

      component.bet = new Bet(parseInt(number, 10));
      component.setBet({hi: true});

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        expect(component.diceForm.valid).toBeTruthy();
        expect(betAmountInput.value).toBe('20');
        expect(numberInput.value).toBe('42');
        expect(component.user.balance).toBe(134);
      });
    }));
  });
});
