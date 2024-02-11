import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../services/currency.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ MatSelectModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, DecimalPipe ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  data: any[] = [];
  currencies: string[] = ["EUR", "USD", "UAH"];
  outputNumber: number = 0;
  inputNumber: number = 0;

  currencyForm = this.fb.group({
    giveCurrency: [this.currencies[2]],
    receiveCurrency: [this.currencies[1]],
    giveAmount: [0],
    receiveAmount: [0]
  });

  constructor(private currencyService: CurrencyService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const source = this.currencyService.getData();
    const uahValue = {
      base_ccy: "UAH",
      buy: "1",
      ccy: "UAH",
      sale: "1"
    };

    const allCurrencies = source.pipe(
      map(array => [...array, uahValue]) // Spread the existing array and add the new object
    );

    allCurrencies.subscribe((c) => {
      this.data = c;
    });

    this.currencyForm.valueChanges.subscribe(() => {
      let ic = this.currencyForm.get('giveCurrency')?.value;
      let oc = this.currencyForm.get('receiveCurrency')?.value;
      let ga = this.currencyForm.get('giveAmount')?.value;
      this.outputNumber = this.calculateExchange(ga!, ic!, oc!);
    });
 }

  calculateExchange(inputAmount?: number, inputCurrency?: string, outputCurrency?: string) {
    let inputObject = this.data[0];
    let outputObject = this.data[1];
    this.data.forEach((item) => {
      if(item.ccy === inputCurrency) {
        inputObject = item;
      } else if (item.ccy === outputCurrency) {
        outputObject = item;
      }
    });
    return (inputAmount!*inputObject.sale) / outputObject.sale;
  }
}
