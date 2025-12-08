import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { InvoiceService } from '../../api/api/invoice.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Invoice } from '../../api/model/invoice';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  showModal: boolean = false;
  showDetailsModal: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  selectedInvoice: Invoice | null = null;

  currentInvoice: Invoice = this.getEmptyInvoice();
  currentInvoiceId: string | null = null;
  private subscription?: Subscription;
  private orgId: string | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authStateService.currentUser.subscribe(
      (user: any) => {
        if (user?.orgId) {
          this.orgId = user.orgId;
          this.loadInvoices();
        } else {
          this.error = 'Organization ID not found. Please log in again.';
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadInvoices(): void {
    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.invoiceService.apiV1InvoicesOrgIdGet(this.orgId).subscribe({
      next: (data) => {
        this.invoices = data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading invoices:', err);
        this.error = 'Failed to load invoices. Please try again.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredInvoices = this.invoices.filter((invoice) => {
      const searchLower = this.searchTerm.toLowerCase();
      const matchesSearch =
        !this.searchTerm ||
        invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
        invoice.vendor?.name?.toLowerCase().includes(searchLower) ||
        false;

      const matchesStatus =
        !this.statusFilter || invoice.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  sortByDate(): void {
    this.filteredInvoices.sort(
      (a, b) =>
        new Date(b.dueDate || '').getTime() -
        new Date(a.dueDate || '').getTime()
    );
  }

  viewInvoiceDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.invoiceService.apiV1InvoicesDetailsIdGet(id).subscribe({
      next: (data) => {
        this.selectedInvoice = data;
        this.showDetailsModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading invoice details:', err);
        this.error = 'Failed to load invoice details.';
        this.isLoading = false;
      },
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentInvoice = this.getEmptyInvoice();
    this.currentInvoiceId = null;
    this.error = null;
    this.showModal = true;
  }

  openEditModal(invoice: Invoice): void {
    this.isEditing = true;
    this.currentInvoiceId = invoice.id || null;
    this.currentInvoice = { ...invoice };
    this.error = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentInvoice = this.getEmptyInvoice();
    this.currentInvoiceId = null;
    this.error = null;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedInvoice = null;
  }

  saveInvoice(): void {
    if (
      !this.currentInvoice.invoiceNumber ||
      !this.currentInvoice.totalAmount
    ) {
      this.error = 'Invoice Number and Total Amount are required fields';
      return;
    }

    this.isLoading = true;
    this.error = null;

    if (this.isEditing && this.currentInvoiceId) {
      // Update existing invoice
      this.invoiceService
        .apiV1InvoicesIdPut(this.currentInvoiceId, this.currentInvoice)
        .subscribe({
          next: () => {
            this.successMessage = 'Invoice updated successfully!';
            this.closeModal();
            this.loadInvoices();
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: (err) => {
            console.error('Error updating invoice:', err);
            this.error = 'Failed to update invoice. Please try again.';
            this.isLoading = false;
          },
        });
    } else {
      // Create new invoice
      if (!this.orgId) {
        this.error = 'Organization ID not found.';
        return;
      }
      this.currentInvoice.orgId = this.orgId;

      this.invoiceService.apiV1InvoicesPost(this.currentInvoice).subscribe({
        next: () => {
          this.successMessage = 'Invoice created successfully!';
          this.closeModal();
          this.loadInvoices();
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Error creating invoice:', err);
          this.error = 'Failed to create invoice. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  deleteInvoice(id: string): void {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.invoiceService.apiV1InvoicesIdDelete(id).subscribe({
      next: () => {
        this.successMessage = 'Invoice deleted successfully!';
        this.loadInvoices();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        console.error('Error deleting invoice:', err);
        this.error = 'Failed to delete invoice. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private getEmptyInvoice(): Invoice {
    return {
      invoiceNumber: '',
      totalAmount: 0,
      currency: 'USD',
      status: 'Pending',
      category: '',
    };
  }
}
