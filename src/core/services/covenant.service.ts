import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Covenant } from '../entities/covenant.model';

@Injectable({
  providedIn: 'root',
})
export class CovenantService {
  private apiUrl = 'https://localhost:7143/api/Covenant'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getAllCovenants(): Observable<Covenant[]> {
    return this.http.get<Covenant[]>(`${this.apiUrl}/GetAllCovenants`);
  }

  getCovenantById(id: number): Observable<Covenant> {
    return this.http.get<Covenant>(`${this.apiUrl}/GetCovenantById/${id}`);
  }

  createCovenant(covenant: Covenant): Observable<Covenant> {
    const url = `${this.apiUrl}/CreateCovenant`;
    return this.http.post<Covenant>(url, covenant);
  }

  updateCovenant(covenant: Covenant): Observable<Covenant> {
    const url = `${this.apiUrl}/UpdateCovenant/${covenant.idCovenant}`;
    return this.http.put<Covenant>(url, covenant);
  }

  deleteCovenant(id: number): Observable<void> {
    const url = `${this.apiUrl}/DeleteCovenant/${id}`;
    return this.http.delete<void>(url);
  }

  filterCovenantsByName(name: string): Observable<Covenant[]> {
    return this.getAllCovenants().pipe(
      map((covenants) =>
        covenants.filter((covenant) =>
          covenant.nameCovenant.toLowerCase().includes(name.toLowerCase())
        )
      )
    );
  }
}
