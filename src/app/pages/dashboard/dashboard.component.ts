import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { InvoiceService } from "../../api/api/invoice.service";
import { VendorService } from "../../api/api/vendor.service";
import { AuthStateService } from "../../services/auth-state.service";
import { Invoice } from "../../api/model/invoice";
import { Vendor } from "../../api/model/vendor";
import { Chart, registerables } from "chart.js";
import { Subscription } from "rxjs";

Chart.register(...registerables);

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  monthlySpend: number = 0;
  totalInvoices: number = 0;
  totalVendors: number = 0;
  overdueInvoices: Invoice[] = [];

  private monthlyChart: any;
  private inflowChart: any;
  private subscriptions: Subscription[] = [];
  private isBrowser: boolean;
  private orgId: string | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private vendorService: VendorService,
    private authStateService: AuthStateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authStateService.currentUser.subscribe((user: any) => {
        if (user?.orgId) {
          this.orgId = user.orgId;
          this.loadDashboardData();
        } else {
          // Handle case where orgId is not available
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      this.initializeCharts();
      this.updateDashboard();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.monthlyChart) this.monthlyChart.destroy();
    if (this.inflowChart) this.inflowChart.destroy();
  }

  private loadDashboardData(): void {
    if (!this.orgId) return;

    // Load invoices for the organization
    this.invoiceService.apiV1InvoicesOrgIdGet(this.orgId).subscribe({
      next: (invoices) => {
        this.overdueInvoices = invoices.filter((inv: Invoice) =>
          inv.status === "Pending" && new Date(inv.dueDate || '') < new Date()
        );
        this.totalInvoices = invoices.length;
        this.monthlySpend = invoices
          .filter((inv: Invoice) => new Date(inv.dueDate || '').getMonth() === new Date().getMonth())
          .reduce((sum: number, inv: Invoice) => sum + (inv.totalAmount || 0), 0);
        this.updateDashboard();
      },
      error: (err) => console.error('Error loading invoices:', err)
    });

    // Load vendors for the organization
    this.vendorService.apiVendorsOrgIdGet(this.orgId).subscribe({
      next: (vendors) => {
        this.totalVendors = vendors.length;
        this.updateDashboard();
      },
      error: (err) => console.error('Error loading vendors:', err)
    });
  }

  private initializeCharts(): void {
    if (!this.isBrowser) return;

    // Monthly spend chart
    const monthlyCtx = document.getElementById("monthlyChart") as HTMLCanvasElement;
    if (monthlyCtx) {
      this.monthlyChart = new Chart(monthlyCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{
            label: "Monthly Spend",
            data: [12000, 15000, 13000, 18000, 16000, 14000],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return "$" + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    // Inflow vs Outflow chart
    const inflowCtx = document.getElementById("inflowChart") as HTMLCanvasElement;
    if (inflowCtx) {
      this.inflowChart = new Chart(inflowCtx, {
        type: "bar",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [{
            label: "Inflow",
            data: [25000, 30000, 28000, 32000],
            backgroundColor: "#10b981"
          }, {
            label: "Outflow",
            data: [18000, 22000, 20000, 24000],
            backgroundColor: "#ef4444"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom"
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return "$" + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
  }

  private updateDashboard(): void {
    // Data is already loaded in loadDashboardData
    // Update charts if needed
    if (this.monthlyChart) {
      // Update chart data here if dynamic
    }
  }
}
