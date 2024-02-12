import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import { map } from 'rxjs';

import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ MatSelectModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, DecimalPipe ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  outputAmount: number = 0;
  inputAmount: number = 0;
  currencyForm = this.fb.group({
    giveCurrency: [''],
    receiveCurrency: [''],
    giveAmount: [0],
    receiveAmount: [0]
  });
  exchangeRates: any[] = [];

  constructor(private currencyService: CurrencyService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const source$ = this.currencyService.getData();
    const uahValue = {
      base_ccy: "UAH",
      buy: "1",
      ccy: "UAH",
      sale: "1"
    };

    const allCurrencies = source$.pipe(
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

    this.currencyForm.valueChanges.subscribe(() => {
      let ic = this.currencyForm.get('giveCurrency')?.value;
      let oc = this.currencyForm.get('receiveCurrency')?.value;
      let ga = this.currencyForm.get('giveAmount')?.value;
      this.outputAmount = this.calculateExchange(ga!, ic!, oc!);
    });
    
    this.currencyForm.get('receiveAmount')?.valueChanges.subscribe((receiveValue)=> {
      let ic = this.currencyForm.get('giveCurrency')?.value;
      let oc = this.currencyForm.get('receiveCurrency')?.value;
      this.inputAmount = this.calculateExchange(receiveValue!, oc!, ic!);
    })

 }

  calculateExchange(inputAmount?: number, inputCurrency?: string, outputCurrency?: string) {
    let inputObject, outputObject = this.exchangeRates[0];
    this.exchangeRates.forEach((item) => {
      if(item.ccy === inputCurrency) {
        inputObject = item;
      } else if (item.ccy === outputCurrency) {
        outputObject = item;
      }
    });
    return (inputAmount!*inputObject!.buy) / outputObject.sale;
  }
}
