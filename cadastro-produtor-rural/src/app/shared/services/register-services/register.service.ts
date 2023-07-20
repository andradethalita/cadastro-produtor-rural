import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Register } from 'src/app/interfaces/register';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private readonly API = 'http://localhost:3000/registers'

  constructor(private http: HttpClient) { }


  create(register: Register): Observable<Register> {
    return this.http.post<Register>(this.API, register)
  }

  getRegisteredItems(): Observable<Register[]> {
    return this.http.get<Register[]>(this.API);
  }

  deleteItem(id: number): Observable<void> {
    const url = `${this.API}/${id}`;
    return this.http.delete<void>(url);
  }
}
