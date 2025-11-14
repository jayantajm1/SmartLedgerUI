import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  private apiUrl = 'https://your-backend-url/api/openai'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  getOpenAIResponse(prompt: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { prompt });
  }
}
