import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { VendorService } from '../../api/api/vendor.service';
import { OrganizationService } from '../../api/api/organization.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Vendor } from '../../api/model/vendor';
import { Organization } from '../../api/model/organization';
import { VendorRequest } from '../../api/model/vendorRequest';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
})
export class VendorsComponent implements OnInit, OnDestroy {
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  organizations: Organization[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  showDetailsModal: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = false;
  isLoadingOrganizations: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  selectedVendor: Vendor | null = null;
  selectedOrgId: string = '';

  currentVendor: VendorRequest = this.getEmptyVendor();
  currentVendorId: string | null = null;
  private subscription?: Subscription;
  private orgId: string | null = null;

  constructor(
    private vendorService: VendorService,
    private organizationService: OrganizationService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authStateService.currentUser.subscribe(
      (user: any) => {
        if (user?.orgId) {
          this.orgId = user.orgId;
          this.loadVendors();
        } else {
          this.error = 'Organization ID not found. Please log in again.';
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadVendors(): void {
    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.vendorService.apiVendorsOrgIdGet(this.orgId).subscribe({
      next: (data) => {
        this.vendors = data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vendors:', err);
        this.error = 'Failed to load vendors. Please try again.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredVendors = this.vendors.filter((vendor) => {
      if (!this.searchTerm) return true;
      const searchLower = this.searchTerm.toLowerCase();
      return (
        vendor.name?.toLowerCase().includes(searchLower) ||
        false ||
        vendor.email?.toLowerCase().includes(searchLower) ||
        false ||
        vendor.phone?.toLowerCase().includes(searchLower) ||
        false
      );
    });
  }

  loadOrganizations(): void {
    this.isLoadingOrganizations = true;
    this.error = null;

    this.organizationService.apiV1OrganizationsGet().subscribe({
      next: (data) => {
        this.organizations = data || [];
        this.isLoadingOrganizations = false;
      },
      error: (err) => {
        console.error('Error loading organizations:', err);
        this.error = 'Failed to load organizations. Please try again.';
        this.isLoadingOrganizations = false;
      },
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentVendor = this.getEmptyVendor();
    this.currentVendorId = null;
    this.selectedOrgId = this.orgId || '';
    this.error = null;
    this.loadOrganizations();
    this.showModal = true;
  }

  openEditModal(vendor: Vendor): void {
    this.isEditing = true;
    this.currentVendorId = vendor.id || null;
    this.currentVendor = {
      name: vendor.name || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      category: vendor.category || '',
    };
    this.error = null;
    this.showModal = true;
  }

  viewVendorDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.vendorService.apiVendorsDetailIdGet(id).subscribe({
      next: (data) => {
        this.selectedVendor = data;
        this.showDetailsModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vendor details:', err);
        this.error = 'Failed to load vendor details.';
        this.isLoading = false;
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.currentVendor = this.getEmptyVendor();
    this.currentVendorId = null;
    this.error = null;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedVendor = null;
  }

  saveVendor(): void {
    if (!this.currentVendor.name || !this.currentVendor.email) {
      this.error = 'Name and Email are required fields';
      return;
    }

    if (!this.isEditing && !this.selectedOrgId) {
      this.error = 'Please select an organization.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    if (this.isEditing && this.currentVendorId) {
      // Update existing vendor
      this.vendorService
        .apiVendorsIdPut(this.currentVendorId, this.currentVendor)
        .subscribe({
          next: () => {
            this.successMessage = 'Vendor updated successfully!';
            this.closeModal();
            this.loadVendors();
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: (err) => {
            console.error('Error updating vendor:', err);
            this.error = 'Failed to update vendor. Please try again.';
            this.isLoading = false;
          },
        });
    } else {
      // Create new vendor with selected organization
      this.vendorService
        .apiVendorsOrgIdPost(this.selectedOrgId, this.currentVendor)
        .subscribe({
          next: () => {
            this.successMessage = 'Vendor created successfully!';
            this.closeModal();
            this.loadVendors();
            setTimeout(() => (this.successMessage = null), 3000);
          },
          error: (err) => {
            console.error('Error creating vendor:', err);
            this.error = 'Failed to create vendor. Please try again.';
            this.isLoading = false;
          },
        });
    }
  }

  deleteVendor(id: string): void {
    if (!confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.vendorService.apiVendorsIdDelete(id).subscribe({
      next: () => {
        this.successMessage = 'Vendor deleted successfully!';
        this.loadVendors();
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        console.error('Error deleting vendor:', err);
        this.error = 'Failed to delete vendor. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private getEmptyVendor(): VendorRequest {
    return {
      name: '',
      email: '',
      phone: '',
      category: '',
    };
  }
}
