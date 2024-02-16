import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}
  private apiUrl =
    'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';

  private uahValue = {
    base_ccy: 'UAH',
    buy: '1',
    ccy: 'UAH',
    sale: '1',
  };

  composeFullData(uahValue: any) {
    const sourceApi$ = this.http.get<any>(this.apiUrl);
    return sourceApi$.pipe(map((array) => [...array, uahValue]));
  }

  getApiData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getFullData(): Observable<any> {
    return this.composeFullData(this.uahValue);
  }
}
