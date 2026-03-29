import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ai`;

  chat(message: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.apiUrl}/chat`, { message });
  }

  search(query: string, limit: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { query, limit: limit.toString() }
    });
  }
}
