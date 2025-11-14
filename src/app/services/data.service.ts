import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';
import { Vendor } from '../models/vendor.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  private vendorsSubject = new BehaviorSubject<Vendor[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);

  public invoices$ = this.invoicesSubject.asObservable();
  public vendors$ = this.vendorsSubject.asObservable();
  public users$ = this.usersSubject.asObservable();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadFromLocalStorage();
    }
  }

  // Invoices
  getInvoices(): Invoice[] {
    return this.invoicesSubject.value;
  }

  addInvoice(invoice: Invoice): void {
    const invoices = [...this.invoicesSubject.value, invoice];
    this.invoicesSubject.next(invoices);
    this.saveToLocalStorage();
  }

  updateInvoice(invoice: Invoice): void {
    const invoices = this.invoicesSubject.value.map(inv => 
      inv.id === invoice.id ? invoice : inv
    );
    this.invoicesSubject.next(invoices);
    this.saveToLocalStorage();
  }

  deleteInvoice(id: string): void {
    const invoices = this.invoicesSubject.value.filter(inv => inv.id !== id);
    this.invoicesSubject.next(invoices);
    this.saveToLocalStorage();
  }

  // Vendors
  getVendors(): Vendor[] {
    return this.vendorsSubject.value;
  }

  addVendor(vendor: Vendor): void {
    const vendors = [...this.vendorsSubject.value, vendor];
    this.vendorsSubject.next(vendors);
    this.saveToLocalStorage();
  }

  updateVendor(vendor: Vendor): void {
    const vendors = this.vendorsSubject.value.map(v => 
      v.id === vendor.id ? vendor : v
    );
    this.vendorsSubject.next(vendors);
    this.saveToLocalStorage();
  }

  deleteVendor(id: string): void {
    const vendors = this.vendorsSubject.value.filter(v => v.id !== id);
    this.vendorsSubject.next(vendors);
    this.saveToLocalStorage();
  }

  // Users
  getUsers(): User[] {
    return this.usersSubject.value;
  }

  addUser(user: User): void {
    const users = [...this.usersSubject.value, user];
    this.usersSubject.next(users);
    this.saveToLocalStorage();
  }

  updateUser(user: User): void {
    const users = this.usersSubject.value.map(u => 
      u.id === user.id ? user : u
    );
    this.usersSubject.next(users);
    this.saveToLocalStorage();
  }

  deleteUser(id: string): void {
    const users = this.usersSubject.value.filter(u => u.id !== id);
    this.usersSubject.next(users);
    this.saveToLocalStorage();
  }

  // Utility
  generateId(): string {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private saveToLocalStorage(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('invoices', JSON.stringify(this.invoicesSubject.value));
    localStorage.setItem('vendors', JSON.stringify(this.vendorsSubject.value));
    localStorage.setItem('users', JSON.stringify(this.usersSubject.value));
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;
    
    const invoices = localStorage.getItem('invoices');
    const vendors = localStorage.getItem('vendors');
    const users = localStorage.getItem('users');

    if (invoices) {
      this.invoicesSubject.next(JSON.parse(invoices));
    }
    if (vendors) {
      this.vendorsSubject.next(JSON.parse(vendors));
    }
    if (users) {
      this.usersSubject.next(JSON.parse(users));
    }
  }
}
