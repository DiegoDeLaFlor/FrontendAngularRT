import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Division, DivisionPayload, DivisionsResponse } from '../models/division.model';

@Injectable({
providedIn: 'root',
})
export class DivisionService {
private apiUrl = 'https://backendnestjs-production.up.railway.app/divisions';

constructor(private http: HttpClient) {}

    getDivisions(page:number,limit:number): Observable<DivisionsResponse> {
        return this.http.get<DivisionsResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
    }

    createDivision(data: DivisionPayload): Observable<Division> {
        return this.http.post<Division>(this.apiUrl, data);
    }

    updateDivision(id: number, data: Partial<Division>): Observable<Division> {
        return this.http.patch<Division>(`${this.apiUrl}/${id}`, data);
    }

    deleteDivision(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getSubdivisions(divisionId: number): Observable<DivisionsResponse> {
        return this.http.get<DivisionsResponse>(`${this.apiUrl}/${divisionId}/subdivisions`);
    }
}
