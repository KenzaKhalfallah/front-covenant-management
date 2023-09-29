import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../entities/acount.model';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'https://localhost:7143/api/Account'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/GetAllAccounts`);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/GetAccountById/${id}`);
  }

  createAccount(account: Account): Observable<Account> {
    const url = `${this.apiUrl}/CreateAccount`;
    return this.http.post<Account>(url, account);
  }

  updateAccount(account: Account): Observable<Account> {
    const url = `${this.apiUrl}/UpdateAccount/${account.idAccount}`;
    return this.http.put<Account>(url, account);
  }

  deleteAccount(id: number): Observable<void> {
    const url = `${this.apiUrl}/DeleteAccount/${id}`;
    return this.http.delete<void>(url);
  }
}
