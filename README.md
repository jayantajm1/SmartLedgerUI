# SmartLedger - Angular Expense Management Dashboard

A full-stack responsive financial dashboard built with Angular 17, featuring comprehensive CRUD operations for invoices, vendors, and users, along with analytics and predictions.

## Features

###  Dashboard
- **Monthly Spend Analytics** - Interactive line chart showing spending trends
- **Inflow vs Outflow Comparison** - Bar chart comparing income and expenses
- **Unpaid Invoice Alerts** - Real-time alerts for overdue invoices with red badges
- **Quick Stats** - Summary cards showing total invoices and vendors

###  CRUD Modules

#### 1. Invoices Management
- Create, Read, Update, Delete invoices
- Fields: Invoice ID, Vendor, Amount, Due Date, Status (Paid/Unpaid)
- Search functionality
- Filter by status (Paid/Unpaid)
- Sort by due date
- Modal-based form for add/edit

#### 2. Vendors Management
- Full CRUD operations for vendors
- Fields: Vendor Name, Contact, Email, GSTIN, Address
- Search by name or email
- Modal-based forms

#### 3. Users Management
- User administration with roles
- Fields: Name, Email, Role (Admin/Accountant/Viewer)
- Complete CRUD functionality

#### 4. Predictions Page
- **Spend Forecast Widget** - Predicts spending for next 30 days
- **Upcoming Unpaid Invoices** - Shows invoices due in next 7 days
- **Prediction Confidence Score** - Visual confidence indicators
- **Cash Flow Prediction Chart** - Line chart with forecasted trends
- **Risk Level Assessment** - Dynamic risk calculation

## Technology Stack

- **Framework**: Angular 17 (Standalone Components)
- **Charts**: Chart.js
- **State Management**: RxJS BehaviorSubject
- **Storage**: LocalStorage
- **Styling**: Custom CSS (Professional Finance Theme)
- **SSR**: Server-Side Rendering enabled

## Project Structure

```
src/app/
 components/
    sidebar/        # Navigation sidebar
    header/         # Page header component
 pages/
    dashboard/      # Dashboard with charts
    invoices/       # Invoice CRUD module
    vendors/        # Vendor CRUD module
    users/          # User CRUD module
    predictions/    # Financial predictions
 models/
    invoice.model.ts
    vendor.model.ts
    user.model.ts
 services/
     data.service.ts # Data management service
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open browser at `http://localhost:4200`

## Build

```bash
npm run build
```

## Features Highlights

 **Responsive Design** - Works on desktop, tablet, and mobile
 **Professional Theme** - Clean finance/expense management UI
 **Real-time Updates** - Reactive data flow using RxJS
 **Local Data Persistence** - Data saved in browser localStorage
 **SSR Compatible** - Server-side rendering ready
 **Search & Filter** - Advanced filtering and search capabilities
 **Modal Forms** - Clean modal-based data entry
 **Visual Analytics** - Interactive charts and graphs
 **Prediction Engine** - Smart forecasting based on historical data

## Design Requirements Met

-  Professional finance theme with clean aesthetics
-  Sidebar navigation with active state indicators
-  Card-based layout with icons and grid system
-  Minimal and visually clean charts
-  Placeholder support for dynamic data
-  Consistent color scheme and typography
-  Responsive breakpoints for mobile devices

## Data Management

- All data stored in browser localStorage
- Automatic persistence on CRUD operations
- Real-time synchronization across components
- SSR-safe implementation with platform detection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

SmartLedger Team
