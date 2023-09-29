import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ResultNote } from '../entities/resultNote.model';
import { ResultService } from './result.service';

@Injectable({
  providedIn: 'root',
})
export class ResultNoteService {
  private apiUrl = 'https://localhost:7143/api/ResultNote'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getAllResultNotes(): Observable<ResultNote[]> {
    return this.http.get<ResultNote[]>(`${this.apiUrl}/GetAllResultNotes`);
  }

  filterNotesByIdResult(idCovenantResult: number): Observable<ResultNote[]> {
    return this.getAllResultNotes().pipe(
      map((notes) =>
        notes.filter((note) => note.idCovenantResult === idCovenantResult)
      )
    );
  }

  getResultNoteById(id: number): Observable<ResultNote> {
    return this.http.get<ResultNote>(`${this.apiUrl}/GetResultNoteById/${id}`);
  }

  createResultNote(
    covenantResultId: number,
    resultNote: ResultNote
  ): Observable<ResultNote> {
    const url = `${this.apiUrl}/AddResultNote/${covenantResultId}`;
    return this.http.post<ResultNote>(url, resultNote);
  }

  updateResultNote(resultNote: ResultNote): Observable<ResultNote> {
    const url = `${this.apiUrl}/UpdateResultNote/${resultNote.idNote}`;
    return this.http.put<ResultNote>(url, resultNote);
  }

  deleteResultNote(id: number): Observable<void> {
    const url = `${this.apiUrl}/ArchiveResultNote/${id}`;
    return this.http.delete<void>(url);
  }
}
