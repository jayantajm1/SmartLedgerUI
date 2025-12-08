import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { PaymentService } from '../../api/api/payment.service';
import { InvoiceService } from '../../api/api/invoice.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Payment } from '../../api/model/payment';
import { PaymentRequest } from '../../api/model/paymentRequest';
import { Invoice } from '../../api/model/invoice';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  invoices: Invoice[] = [];

  searchTerm: string = '';
  methodFilter: string = '';

  showModal: boolean = false;
  showDetailsModal: boolean = false;
  isEditing: boolean = false;

  currentPayment: PaymentRequest = this.getEmptyPayment();
  selectedPayment: Payment | null = null;
  currentPaymentId: string | null = null;

  isLoading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  orgId: string | null = null;
  private subscription?: Subscription;

  constructor(
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authStateService.currentUser.subscribe((user) => {
      if (user && user.orgId) {
        this.orgId = user.orgId;
        this.loadPayments();
        this.loadInvoices();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadPayments(): void {
    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.paymentService.apiV1PaymentsOrgOrgIdGet(this.orgId).subscribe({
      next: (data: any) => {
        this.payments = data || [];
        this.filteredPayments = [...this.payments];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.error = 'Failed to load payments.';
        this.isLoading = false;
      },
    });
  }

  loadInvoices(): void {
    if (!this.orgId) return;

    this.invoiceService.apiV1InvoicesOrgIdGet(this.orgId).subscribe({
      next: (data: any) => {
        this.invoices = data || [];
      },
      error: (err) => {
        console.error('Error loading invoices:', err);
      },
    });
  }

  loadPaymentsByInvoice(invoiceId: string): void {
    this.isLoading = true;
    this.error = null;

    this.paymentService.apiV1PaymentsInvoiceInvoiceIdGet(invoiceId).subscribe({
      next: (data: any) => {
        this.payments = data || [];
        this.filteredPayments = [...this.payments];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments by invoice:', err);
        this.error = 'Failed to load payments for invoice.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredPayments = this.payments.filter((payment) => {
      const searchLower = this.searchTerm.toLowerCase();
      const matchesSearch =
        !this.searchTerm ||
        payment.reference?.toLowerCase().includes(searchLower) ||
        payment.invoice?.invoiceNumber?.toLowerCase().includes(searchLower) ||
        false;

      const matchesMethod =
        !this.methodFilter || payment.method === this.methodFilter;

      return matchesSearch && matchesMethod;
    });
  }

  sortByDate(): void {
    this.filteredPayments.sort(
      (a, b) =>
        new Date(b.paymentDate || '').getTime() -
        new Date(a.paymentDate || '').getTime()
    );
  }

  viewPaymentDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.paymentService.apiV1PaymentsIdGet(id).subscribe({
      next: (data) => {
        this.selectedPayment = data;
        this.showDetailsModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payment details:', err);
        this.error = 'Failed to load payment details.';
        this.isLoading = false;
      },
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentPayment = this.getEmptyPayment();
    this.currentPaymentId = null;
    this.error = null;
    this.showModal = true;
  }

  openEditModal(payment: Payment): void {
    this.isEditing = true;
    this.currentPaymentId = payment.id || null;
    this.currentPayment = {
      invoiceId: payment.invoiceId || undefined,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      method: payment.method || undefined,
      reference: payment.reference || undefined,
    };
    this.error = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentPayment = this.getEmptyPayment();
    this.currentPaymentId = null;
    this.error = null;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedPayment = null;
  }

  savePayment(): void {
    if (!this.currentPayment.invoiceId || !this.currentPayment.amount) {
      this.error = 'Invoice and Amount are required fields';
      return;
    }

    this.isLoading = true;
    this.error = null;

    if (this.isEditing && this.currentPaymentId) {
      // Update existing payment
      this.paymentService
        .apiV1PaymentsIdPut(this.currentPaymentId, this.currentPayment)
        .subscribe({
          next: () => {
            this.successMessage = 'Payment updated successfully!';
            this.closeModal();
            this.loadPayments();
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: (err) => {
            console.error('Error updating payment:', err);
            this.error = 'Failed to update payment. Please try again.';
            this.isLoading = false;
          },
        });
    } else {
      // Create new payment
      this.paymentService.apiV1PaymentsPost(this.currentPayment).subscribe({
        next: () => {
          this.successMessage = 'Payment created successfully!';
          this.closeModal();
          this.loadPayments();
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Error creating payment:', err);
          this.error = 'Failed to create payment. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  deletePayment(id: string): void {
    if (!confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.paymentService.apiV1PaymentsIdDelete(id).subscribe({
      next: () => {
        this.successMessage = 'Payment deleted successfully!';
        this.loadPayments();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        console.error('Error deleting payment:', err);
        this.error = 'Failed to delete payment. Please try again.';
        this.isLoading = false;
      },
    });
  }

  getInvoiceNumber(invoiceId: string | null | undefined): string {
    if (!invoiceId) return 'N/A';
    const invoice = this.invoices.find((inv) => inv.id === invoiceId);
    return invoice?.invoiceNumber || 'N/A';
  }

  private getEmptyPayment(): PaymentRequest {
    return {
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'Bank Transfer',
    };
  }
}
