import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  exchangeRates: any[] = [];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.fetchExhangeRates();
  }

  fetchExhangeRates() {
    this.currencyService
      .getApiData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.exchangeRates = data;
      });
  }
}
