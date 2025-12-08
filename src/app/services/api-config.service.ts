import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private detectedApiUrl: string | null = null;

  constructor(
    private http: HttpClient,
    private storage: BrowserStorageService
  ) {}

  /**
   * Detects which backend API URL is available by trying each URL in order
   * @returns Promise<string> The first available API URL
   */
  async detectApiUrl(): Promise<string> {
    // If already detected, return cached value
    if (this.detectedApiUrl) {
      return this.detectedApiUrl;
    }

    console.log('🔍 Detecting available backend API...');

    for (const apiUrl of environment.apiUrls) {
      try {
        console.log(`⏳ Trying: ${apiUrl}`);

        // Try to reach the API health endpoint or swagger
        const healthCheck$ = this.http
          .get(`${apiUrl}/swagger/index.html`, {
            responseType: 'text',
            observe: 'response',
          })
          .pipe(
            timeout(environment.apiTimeout),
            catchError(() => of(null))
          );

        const response = await firstValueFrom(healthCheck$);

        if (response && response.status === 200) {
          this.detectedApiUrl = apiUrl;
          console.log(`✅ Backend found at: ${apiUrl}`);
          this.storage.setItem('detectedApiUrl', apiUrl);
          return apiUrl;
        }
      } catch (error) {
        console.log(`❌ Not available: ${apiUrl}`);
      }
    }

    // If no URL responds, use default
    console.warn('⚠️ No backend detected, using default:', environment.apiUrl);
    this.detectedApiUrl = environment.apiUrl;
    return environment.apiUrl;
  }

  /**
   * Gets the detected or default API URL
   * @returns string The API URL to use
   */
  getApiUrl(): string {
    return (
      this.detectedApiUrl ||
      this.storage.getItem('detectedApiUrl') ||
      environment.apiUrl
    );
  }

  /**
   * Clears the cached API URL detection
   */
  resetDetection(): void {
    this.detectedApiUrl = null;
    this.storage.removeItem('detectedApiUrl');
  }
}
