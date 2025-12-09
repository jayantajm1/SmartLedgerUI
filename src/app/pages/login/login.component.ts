import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../api/api/auth.service';
import { UsersService } from '../../api/api/users.service';
import { LoginRequest } from '../../api/model/loginRequest';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private authStateService: AuthStateService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.apiV1AuthLoginPost(loginRequest).subscribe({
        next: (response) => {
          console.log('Login successful', response);

          // Store token
          if (response?.token) {
            this.authStateService.setToken(response.token);

            // Decode token to get userId
            const decodedToken = this.decodeToken(response.token);
            const userId = decodedToken?.sub;

            if (userId) {
              // Call user API to get full user details
              this.usersService.apiV1UsersIdGet(userId).subscribe({
                next: (userDetails) => {
                  this.authStateService.setUser(userDetails);
                  this.isLoading = false;
                  this.router.navigate(['/dashboard']);
                },
                error: (userError) => {
                  console.error('Error fetching user details:', userError);
                  this.isLoading = false;
                  this.errorMessage = 'Failed to load user details. Please try again.';
                }
              });
            } else {
              this.isLoading = false;
              this.errorMessage = 'Invalid token. Please try again.';
            }
          } else {
            this.isLoading = false;
            this.errorMessage = 'No token received. Please try again.';
          }
        },
        error: (error) => {
          console.error('Login error', error);
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Invalid email or password. Please try again.';
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
