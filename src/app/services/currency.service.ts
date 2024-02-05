import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) {   
  }
  private apiUrl = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5';

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
