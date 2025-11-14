import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { DataService } from '../../services/data.service';
import { Invoice } from '../../models/invoice.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;

  currentInvoice: Invoice = this.getEmptyInvoice();
  private subscription?: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.dataService.invoices$.subscribe(invoices => {
      this.invoices = invoices;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  applyFilters(): void {
    this.filteredInvoices = this.invoices.filter(invoice => {
      const matchesSearch = !this.searchTerm ||
        invoice.invoice_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        invoice.vendor.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || invoice.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  sortByDate(): void {
    this.filteredInvoices.sort((a, b) =>
      new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
    );
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentInvoice = this.getEmptyInvoice();
    this.showModal = true;
  }

  openEditModal(invoice: Invoice): void {
    this.isEditing = true;
    this.currentInvoice = { ...invoice };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentInvoice = this.getEmptyInvoice();
  }

  saveInvoice(): void {
    if (!this.currentInvoice.invoice_id || !this.currentInvoice.vendor ||
        !this.currentInvoice.amount || !this.currentInvoice.due_date) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEditing) {
      this.dataService.updateInvoice(this.currentInvoice);
    } else {
      this.currentInvoice.id = this.dataService.generateId();
      this.currentInvoice.created_at = new Date().toISOString();
      this.dataService.addInvoice(this.currentInvoice);
    }

    this.closeModal();
  }

  deleteInvoice(id: string): void {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.dataService.deleteInvoice(id);
    }
  }

  private getEmptyInvoice(): Invoice {
    return {
      id: '',
      invoice_id: '',
      vendor: '',
      amount: 0,
      due_date: '',
      status: 'Unpaid',
      created_at: ''
    };
  }
}
