import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CovenantResult } from '../entities/covenantResult.model';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private apiUrl = 'https://localhost:7143/api/CovenantResult'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getAllCovenantResults(): Observable<CovenantResult[]> {
    return this.http.get<CovenantResult[]>(
      `${this.apiUrl}/GetAllCovenantResults`
    );
  }

  getCovenantResultById(id: number): Observable<CovenantResult> {
    return this.http.get<CovenantResult>(
      `${this.apiUrl}/GetCovenantResultById/${id}`
    );
  }

  createCovenantResult(
    covenantConditionId: number,
    covenantResult: CovenantResult
  ): Observable<CovenantResult> {
    const url = `${this.apiUrl}/AddCovenantResult/${covenantConditionId}`;
    return this.http.post<CovenantResult>(url, covenantResult);
  }

  updateCovenantResult(
    covenantResult: CovenantResult
  ): Observable<CovenantResult> {
    const url = `${this.apiUrl}/UpdateCovenantResult/${covenantResult.idResult}`;
    return this.http.put<CovenantResult>(url, covenantResult);
  }

  deleteCovenantResult(id: number): Observable<void> {
    const url = `${this.apiUrl}/DeleteCovenantResult/${id}`;
    return this.http.delete<void>(url);
  }
}
