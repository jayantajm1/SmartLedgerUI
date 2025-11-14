import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { DataService } from "../../services/data.service";
import { Invoice } from "../../models/invoice.model";
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

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataService.invoices$.subscribe(() => this.updateDashboard())
    );
    this.subscriptions.push(
      this.dataService.vendors$.subscribe(() => this.updateDashboard())
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
    const invoices = this.dataService.getInvoices();
    const vendors = this.dataService.getVendors();

    // Calculate monthly spend
    const currentMonth = new Date().getMonth();
    this.monthlySpend = invoices
      .filter(inv => new Date(inv.due_date).getMonth() === currentMonth)
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Update overdue invoices
    const today = new Date();
    this.overdueInvoices = invoices.filter(inv =>
      inv.status === "Unpaid" && new Date(inv.due_date) < today
    );

    // Update quick stats
    this.totalInvoices = invoices.length;
    this.totalVendors = vendors.length;
  }
}
