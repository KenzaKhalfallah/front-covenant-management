import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CovenantCondition } from '../entities/covenantCondition.model';

@Injectable({
  providedIn: 'root',
})
export class ConditionService {
  private apiUrl = 'https://localhost:7143/api/CovenantCondition'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getAllCovenantConditions(): Observable<CovenantCondition[]> {
    return this.http.get<CovenantCondition[]>(
      `${this.apiUrl}/GetAllCovenantConditions`
    );
  }

  filterConditionsByIdCovenant(
    idCovenant: number
  ): Observable<CovenantCondition[]> {
    return this.getAllCovenantConditions().pipe(
      map((conditions) =>
        conditions.filter((condition) => condition.idCovenant === idCovenant)
      )
    );
  }

  getCovenantConditionById(id: number): Observable<CovenantCondition> {
    return this.http.get<CovenantCondition>(
      `${this.apiUrl}/GetCovenantConditionById/${id}`
    );
  }

  createCovenantCondition(
    covenantId: number,
    covenantCondition: CovenantCondition
  ): Observable<CovenantCondition> {
    const url = `${this.apiUrl}/AddCovenantCondition/${covenantId}`;
    return this.http.post<CovenantCondition>(url, covenantCondition);
  }

  updateCovenantCondition(
    covenantCondition: CovenantCondition
  ): Observable<CovenantCondition> {
    const url = `${this.apiUrl}/UpdateCovenantCondition/${covenantCondition.idCondition}`;
    return this.http.put<CovenantCondition>(url, covenantCondition);
  }

  deleteCovenantCondition(id: number): Observable<void> {
    const url = `${this.apiUrl}/DeleteCovenantCondition/${id}`;
    return this.http.delete<void>(url);
  }
}
