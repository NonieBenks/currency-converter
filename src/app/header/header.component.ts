import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  exchangeRates: any[] = [];
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
     this.currencyService.getData().subscribe((currencies) => {
        this.exchangeRates = currencies;
    });
  }
}
