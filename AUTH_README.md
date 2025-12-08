# SmartLedger Authentication Frontend

## Overview
Complete authentication system for SmartLedger application with login, registration, and protected routes.

## Features Implemented

### 1. **Login Component** (`src/app/pages/login/`)
- Email and password validation
- Password visibility toggle
- Loading states
- Error handling
- Responsive design
- Auto-redirect to dashboard on success

### 2. **Register Component** (`src/app/pages/register/`)
- First name, last name, email, and password fields
- Password strength validation (uppercase, lowercase, number)
- Password confirmation matching
- Real-time form validation
- Success/error messages
- Auto-redirect to login after successful registration

### 3. **Auth Guard** (`src/app/guards/auth.guard.ts`)
- Protects routes from unauthorized access
- Redirects to login with return URL
- Token-based authentication check

### 4. **Auth State Service** (`src/app/services/auth-state.service.ts`)
- Centralized authentication state management
- Observable streams for user and auth status
- Token and user data persistence
- Logout functionality

### 5. **HTTP Interceptor** (`src/app/interceptors/auth.interceptor.ts`)
- Automatically adds Bearer token to all HTTP requests
- Handles 401 Unauthorized responses
- Auto-logout on token expiration

### 6. **Updated Components**
- **Header Component**: Added user display and logout button
- **Routes**: Protected all main routes with auth guard
- **App Config**: Integrated HTTP client with interceptor

## File Structure

```
src/app/
├── pages/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   └── register/
│       ├── register.component.ts
│       ├── register.component.html
│       └── register.component.css
├── guards/
│   └── auth.guard.ts
├── services/
│   └── auth-state.service.ts
├── interceptors/
│   └── auth.interceptor.ts
├── app.routes.ts (updated)
└── app.config.ts (updated)
```

## Routes Configuration

```typescript
- / → redirects to /login
- /login → Login page (public)
- /register → Register page (public)
- /dashboard → Dashboard (protected)
- /invoices → Invoices (protected)
- /vendors → Vendors (protected)
- /users → Users (protected)
- /predictions → Predictions (protected)
```

## Usage

### Login Flow
1. User navigates to `/login`
2. Enters email and password
3. On success: Token and user data stored, redirect to `/dashboard`
4. On error: Error message displayed

### Register Flow
1. User navigates to `/register`
2. Fills in first name, last name, email, password, and confirm password
3. Password must meet strength requirements
4. On success: Redirect to `/login` after 2 seconds
5. On error: Error message displayed

### Protected Routes
- All main routes are protected by `authGuard`
- Unauthenticated users are redirected to `/login`
- Return URL is preserved for redirect after login

### Token Management
- JWT token stored in localStorage as `authToken`
- User data stored in localStorage as `currentUser`
- Token automatically included in all API requests via interceptor
- Auto-logout on 401 responses

### Logout
- Click "Logout" button in header
- Clears token and user data
- Redirects to login page

## API Integration

### Login Endpoint
```typescript
POST /api/v1/auth/login
Body: { email: string, password: string }
Expected Response: { token: string, user: object }
```

### Register Endpoint
```typescript
POST /api/v1/auth/register
Body: { 
  firstName: string, 
  lastName: string, 
  email: string, 
  password: string 
}
```

## Styling
- Modern gradient background (purple theme)
- Responsive design for mobile and desktop
- Loading spinners for async operations
- Form validation with error messages
- Smooth transitions and hover effects

## Security Features
- Password minimum length: 6 characters
- Email validation
- Password strength validation
- HTTP-only token transmission
- Automatic token injection via interceptor
- Protected routes with auth guard

## Next Steps (Optional Enhancements)
1. Add "Remember Me" functionality
2. Implement password reset flow
3. Add social authentication (Google, GitHub)
4. Implement refresh token mechanism
5. Add role-based access control
6. Email verification after registration
7. Two-factor authentication (2FA)

## Development

### Run the application
```bash
npm start
```

### Build for production
```bash
npm run build
```

## Notes
- Ensure your backend API returns the expected response format
- Update the API base URL in `src/app/api/configuration.ts` if needed
- Tokens are stored in localStorage (consider httpOnly cookies for production)
