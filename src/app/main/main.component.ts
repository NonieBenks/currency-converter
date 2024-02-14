import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Component } from '@angular/core';

import { map, tap } from 'rxjs';

import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ MatSelectModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  giveCalculatedValue: string = '';
  receiveCalculatedValue: string = '';

  currencyForm = this.fb.group({
    giveCurrency: [''],
    receiveCurrency: [''],
    giveAmount: [0],
    receiveAmount: [0]
  });

  exchangeRates: any[] = [];

  constructor(private currencyService: CurrencyService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const sourceApi$ = this.currencyService.getData();
    const uahValue = {
      base_ccy: "UAH",
      buy: "1",
      ccy: "UAH",
      sale: "1"
    };

    const allCurrencies = sourceApi$.pipe(
      map(array => [...array, uahValue])
    );

    allCurrencies.subscribe((c) => {
      this.exchangeRates = c;
    });

    this.currencyForm = this.fb.group({
      giveCurrency: [this.exchangeRates[0].ccy],
      receiveCurrency: [this.exchangeRates[1].ccy],
      giveAmount: [0],
      receiveAmount: [0]
    });


    this.currencyForm.valueChanges.pipe(tap((form) => {
      this.receiveCalculatedValue = this.calculateExchange(form.giveAmount, form.giveCurrency, form.receiveCurrency).toFixed(2);
    })).subscribe();
 }

 onInput() {
    this.giveCalculatedValue = 
    this.calculateExchange(this.currencyForm.get('receiveAmount')?.value, this.currencyForm.get('receiveCurrency')?.value, this.currencyForm.get('giveCurrency')?.value).toFixed(2);
 }

  calculateExchange(inputAmount?: number | null, inputCurrency?: string | null, outputCurrency?: string | null) {
    let inputObject, outputObject = this.exchangeRates[0];

    this.exchangeRates.forEach((item) => {
      if(item.ccy === inputCurrency) {
        inputObject = item;
      }
      if (item.ccy === outputCurrency) {
        outputObject = item;
      }
    });
    return (inputAmount!*inputObject!.buy) / outputObject.sale;
  }
}
