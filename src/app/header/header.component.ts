import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  data: any[] = [];
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
     this.currencyService.getData().subscribe((currencies) => {
        this.data = currencies;
    });
  }
}
