import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Division } from '../models/division.model';

@Injectable({
providedIn: 'root',
})
export class DivisionService {
private apiUrl = 'http://localhost:3000/divisions';

constructor(private http: HttpClient) {}

getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(this.apiUrl);
}

createDivision(data: Division): Observable<Division> {
    return this.http.post<Division>(this.apiUrl, data);
}

updateDivision(id: number, data: Partial<Division>): Observable<Division> {
    return this.http.patch<Division>(`${this.apiUrl}/${id}`, data);
}

deleteDivision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}
