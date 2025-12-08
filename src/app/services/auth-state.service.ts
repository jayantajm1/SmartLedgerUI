import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated: Observable<boolean>;

  constructor(private storage: BrowserStorageService) {
    const storedUser = this.storage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(
      !!this.storage.getItem('authToken')
    );
    this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get isAuthenticatedValue(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  public setUser(user: any): void {
    this.storage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public setToken(token: string): void {
    this.storage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  public logout(): void {
    this.storage.removeItem('authToken');
    this.storage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  public getToken(): string | null {
    return this.storage.getItem('authToken');
  }
}
