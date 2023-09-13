import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CounterParty } from '../entities/counterparty.model';

@Injectable({
  providedIn: 'root',
})
export class CounterpartyService {
  private apiUrl = 'https://localhost:7143/api/Counterparty'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getAllCounterparties(): Observable<CounterParty[]> {
    return this.http.get<CounterParty[]>(`${this.apiUrl}/GetAllCounterparties`);
  }

  getCounterpartyById(id: number): Observable<CounterParty> {
    return this.http.get<CounterParty>(
      `${this.apiUrl}/GetCounterpartyById/${id}`
    );
  }
}
