// Example: Using Authentication in Your Components

// ============================================
// 1. CHECK IF USER IS AUTHENTICATED
// ============================================

import { Component, OnInit } from '@angular/core';
import { AuthStateService } from './services/auth-state.service';

export class YourComponent implements OnInit {
  isAuthenticated$ = this.authStateService.isAuthenticated;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    // Subscribe to auth state
    this.isAuthenticated$.subscribe((isAuth) => {
      console.log('Is authenticated:', isAuth);
    });

    // Or get current value directly
    if (this.authStateService.isAuthenticatedValue) {
      console.log('User is logged in');
    }
  }
}

// ============================================
// 2. GET CURRENT USER DATA
// ============================================

export class YourComponent {
  currentUser$ = this.authStateService.currentUser;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    // Subscribe to user data
    this.currentUser$.subscribe((user) => {
      console.log('Current user:', user);
      console.log('User email:', user?.email);
    });

    // Or get current value directly
    const user = this.authStateService.currentUserValue;
    console.log('User name:', user?.firstName);
  }
}

// ============================================
// 3. USE IN TEMPLATE
// ============================================

// In your component.html:
/*
<div *ngIf="currentUser$ | async as user">
  <p>Welcome, {{ user.firstName }}!</p>
  <p>Email: {{ user.email }}</p>
</div>

<div *ngIf="isAuthenticated$ | async">
  <p>You are logged in!</p>
</div>
*/

// ============================================
// 4. MANUAL LOGOUT
// ============================================

export class YourComponent {
  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  logout() {
    this.authStateService.logout();
    this.router.navigate(['/login']);
  }
}

// ============================================
// 5. GET TOKEN FOR CUSTOM API CALLS
// ============================================

export class YourComponent {
  constructor(private authStateService: AuthStateService) {}

  makeCustomApiCall() {
    const token = this.authStateService.getToken();

    if (token) {
      // Use token in custom API call
      // Note: Most API calls will automatically include token via interceptor
      console.log('Token:', token);
    }
  }
}

// ============================================
// 6. PROTECT COMPONENT ACTIONS
// ============================================

export class YourComponent {
  canEdit = false;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    // Enable features only for authenticated users
    this.authStateService.isAuthenticated.subscribe((isAuth) => {
      this.canEdit = isAuth;
    });
  }

  onEdit() {
    if (!this.canEdit) {
      alert('Please login to edit');
      return;
    }
    // Proceed with edit
  }
}

// ============================================
// 7. CHECK USER ROLE (IF YOUR API RETURNS ROLE)
// ============================================

export class YourComponent {
  isAdmin = false;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    this.authStateService.currentUser.subscribe((user) => {
      this.isAdmin = user?.role === 'admin';
    });
  }
}

// ============================================
// 8. REDIRECT IF NOT AUTHENTICATED
// ============================================

export class YourComponent implements OnInit {
  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authStateService.isAuthenticatedValue) {
      this.router.navigate(['/login']);
    }
  }
}

// ============================================
// 9. CONDITIONAL MENU ITEMS
// ============================================

export class YourComponent {
  menuItems: any[] = [];

  constructor(private authStateService: AuthStateService) {}

  ngOnInit() {
    this.authStateService.isAuthenticated.subscribe((isAuth) => {
      if (isAuth) {
        this.menuItems = [
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Invoices', route: '/invoices' },
          { label: 'Settings', route: '/settings' },
        ];
      } else {
        this.menuItems = [
          { label: 'Login', route: '/login' },
          { label: 'Register', route: '/register' },
        ];
      }
    });
  }
}

// ============================================
// 10. HANDLE API ERRORS WITH AUTH
// ============================================

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class YourComponent {
  constructor(
    private yourApiService: YourApiService,
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  fetchData() {
    this.yourApiService
      .getData()
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            // Token expired or invalid
            this.authStateService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        console.log('Data:', data);
      });
  }
}

// ============================================
// COMPLETE EXAMPLE COMPONENT
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div *ngIf="currentUser$ | async as user" class="user-info">
        <h2>Profile</h2>
        <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button (click)="logout()" class="btn-logout">Logout</button>
      </div>

      <div *ngIf="!(isAuthenticated$ | async)" class="not-logged-in">
        <p>Please login to view your profile</p>
        <button (click)="goToLogin()" class="btn-login">Go to Login</button>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }

      .user-info {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      h2 {
        margin-top: 0;
        color: #333;
      }

      p {
        margin: 10px 0;
      }

      .btn-logout,
      .btn-login {
        margin-top: 20px;
        padding: 10px 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }

      .btn-logout:hover,
      .btn-login:hover {
        background: #764ba2;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  currentUser$ = this.authStateService.currentUser;
  isAuthenticated$ = this.authStateService.isAuthenticated;

  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is authenticated
    if (!this.authStateService.isAuthenticatedValue) {
      console.log('User not authenticated');
    }
  }

  logout() {
    this.authStateService.logout();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
