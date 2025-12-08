import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/invoices', icon: 'invoice', label: 'Invoices' },
    { path: '/payments', icon: 'payments', label: 'Payments' },
    { path: '/vendors', icon: 'vendors', label: 'Vendors' },
    { path: '/users', icon: 'users', label: 'Users' },
    { path: '/organizations', icon: 'organizations', label: 'Organizations' },
    { path: '/predictions', icon: 'predictions', label: 'Predictions' },
  ];

  constructor(public router: Router) {}
}
