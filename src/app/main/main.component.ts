import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  giveCalculatedValue = 0;
  receiveCalculatedValue = 0;
  giveCurrency = 'UAH';
  receiveCurrency = 'USD';

  exchangeRates: any[] = [];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.fetchExhangeRate();
  }

  fetchExhangeRate() {
    this.currencyService.getFullData().subscribe((data) => {
      this.exchangeRates = data;
    });
  }
  calculateGiveAmount() {
    let inputObject,
      outputObject = this.exchangeRates[0];

    this.exchangeRates.forEach((item) => {
      if (item.ccy === this.receiveCurrency) {
        inputObject = item;
      }
      if (item.ccy === this.giveCurrency) {
        outputObject = item;
      }
    });
    const result =
      (this.receiveCalculatedValue! * inputObject!.sale) / outputObject.buy;
    this.giveCalculatedValue = Math.round(result * 10 ** 2) / 10 ** 2;
  }

  calculateReceiveAmount() {
    let inputObject,
      outputObject = this.exchangeRates[0];

    this.exchangeRates.forEach((item) => {
      if (item.ccy === this.giveCurrency) {
        inputObject = item;
      }
      if (item.ccy === this.receiveCurrency) {
        outputObject = item;
      }
    });
    const result =
      (this.giveCalculatedValue! * inputObject!.sale) / outputObject.buy;
    this.receiveCalculatedValue = Math.round(result * 10 ** 2) / 10 ** 2;
  }
}
