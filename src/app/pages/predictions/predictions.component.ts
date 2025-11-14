import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { DataService } from "../../services/data.service";
import { Chart, registerables } from "chart.js";
import { Subscription } from "rxjs";

Chart.register(...registerables);

@Component({
  selector: "app-predictions",
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: "./predictions.component.html",
  styleUrls: ["./predictions.component.css"]
})
export class PredictionsComponent implements OnInit, AfterViewInit, OnDestroy {
  forecastAmount: number = 0;
  upcomingUnpaid: number = 0;
  forecastConfidence: number = 85;
  riskLevel: string = "Medium";

  private predictionChart: any;
  private subscription?: Subscription;
  private isBrowser: boolean;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.subscription = this.dataService.invoices$.subscribe(() => {
      this.updatePredictions();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      this.initializeChart();
      this.updatePredictions();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.predictionChart) {
      this.predictionChart.destroy();
    }
  }

  private initializeChart(): void {
    if (!this.isBrowser) return;

    const predictionCtx = document.getElementById("predictionChart") as HTMLCanvasElement;
    if (predictionCtx) {
      this.predictionChart = new Chart(predictionCtx, {
        type: "line",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [{
            label: "Predicted Cash Flow",
            data: [15000, 18000, 22000, 25000],
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            tension: 0.4,
            fill: true,
            borderDash: [5, 5]
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
  }

  private updatePredictions(): void {
    const invoices = this.dataService.getInvoices();

    // Calculate forecast based on historical data
    const avgMonthlySpend = invoices.reduce((sum, inv) => sum + inv.amount, 0) /
                            Math.max(1, invoices.length) * 30;
    this.forecastAmount = Math.round(avgMonthlySpend);

    // Calculate upcoming unpaid invoices
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    this.upcomingUnpaid = invoices.filter(inv =>
      inv.status === "Unpaid" && new Date(inv.due_date) <= nextWeek
    ).length;

    // Adjust risk level based on unpaid invoices
    if (this.upcomingUnpaid > 5) {
      this.riskLevel = "High";
    } else if (this.upcomingUnpaid > 2) {
      this.riskLevel = "Medium";
    } else {
      this.riskLevel = "Low";
    }
  }
}
