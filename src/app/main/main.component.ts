import { Component, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../services/currency.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  data: any[] = [];
  currencies: string[] = ["EUR", "USD", "UAH"];
  firstCurrency = 1;
  secondCurrency = signal(0);

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getData().subscribe((currencies) => {
       this.data = currencies;
   });
 }
}
