import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { DataService } from '../../services/data.service';
import { Vendor } from '../../models/vendor.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit, OnDestroy {
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;

  currentVendor: Vendor = this.getEmptyVendor();
  private subscription?: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.dataService.vendors$.subscribe(vendors => {
      this.vendors = vendors;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  applyFilters(): void {
    this.filteredVendors = this.vendors.filter(vendor => {
      if (!this.searchTerm) return true;
      return vendor.vendor_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             vendor.email.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentVendor = this.getEmptyVendor();
    this.showModal = true;
  }

  openEditModal(vendor: Vendor): void {
    this.isEditing = true;
    this.currentVendor = { ...vendor };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentVendor = this.getEmptyVendor();
  }

  saveVendor(): void {
    if (!this.currentVendor.vendor_name || !this.currentVendor.contact ||
        !this.currentVendor.email) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEditing) {
      this.dataService.updateVendor(this.currentVendor);
    } else {
      this.currentVendor.id = this.dataService.generateId();
      this.currentVendor.created_at = new Date().toISOString();
      this.dataService.addVendor(this.currentVendor);
    }

    this.closeModal();
  }

  deleteVendor(id: string): void {
    if (confirm('Are you sure you want to delete this vendor?')) {
      this.dataService.deleteVendor(id);
    }
  }

  private getEmptyVendor(): Vendor {
    return {
      id: '',
      vendor_name: '',
      contact: '',
      email: '',
      gstin: '',
      address: '',
      created_at: ''
    };
  }
}
