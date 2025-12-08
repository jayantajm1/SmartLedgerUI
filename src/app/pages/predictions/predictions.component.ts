import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { CashflowPredictionService } from '../../api/api/cashflowPrediction.service';
import { AuthStateService } from '../../services/auth-state.service';
import { CashflowPrediction } from '../../api/model/cashflowPrediction';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.css'],
})
export class PredictionsComponent implements OnInit, AfterViewInit, OnDestroy {
  predictions: CashflowPrediction[] = [];
  currentPrediction: CashflowPrediction | null = null;
  forecastAmount: number = 0;
  forecastConfidence: number = 0;
  projectedInflow: number = 0;
  projectedOutflow: number = 0;
  netCashflow: number = 0;
  riskLevel: string = 'Low';

  isLoading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  orgId: string | null = null;
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;

  private predictionChart: any;
  private subscription?: Subscription;
  private isBrowser: boolean;

  constructor(
    private cashflowService: CashflowPredictionService,
    private authStateService: AuthStateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.subscription = this.authStateService.currentUser.subscribe((user) => {
      if (user && user.orgId) {
        this.orgId = user.orgId;
        this.loadPredictions();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      if (this.predictions.length > 0) {
        this.initializeChart();
      }
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

    const predictionCtx = document.getElementById(
      'predictionChart'
    ) as HTMLCanvasElement;
    if (predictionCtx) {
      const labels = this.predictions.map((p) => p.month || '');
      const inflowData = this.predictions.map((p) => p.projectedInflow || 0);
      const outflowData = this.predictions.map((p) => p.projectedOutflow || 0);

      this.predictionChart = new Chart(predictionCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Projected Inflow',
              data: inflowData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Projected Outflow',
              data: outflowData,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '$' + value.toLocaleString();
                },
              },
            },
          },
        },
      });
    }
  }

  loadPredictions(): void {
    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.cashflowService.apiCashflowPredictionOrgIdGet(this.orgId).subscribe({
      next: (data: any) => {
        this.predictions = data || [];
        if (this.predictions.length > 0) {
          this.currentPrediction = this.predictions[0];
          this.updateMetrics();
          if (this.isBrowser) {
            setTimeout(() => this.initializeChart(), 100);
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading predictions:', err);
        this.error = 'Failed to load cashflow predictions.';
        this.isLoading = false;
      },
    });
  }

  loadPredictionByMonth(): void {
    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.cashflowService
      .apiCashflowPredictionOrgIdYearMonthGet(
        this.orgId,
        this.selectedYear,
        this.selectedMonth
      )
      .subscribe({
        next: (data: any) => {
          this.currentPrediction = data;
          this.updateMetrics();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading prediction for month:', err);
          this.error = 'Failed to load prediction for selected month.';
          this.isLoading = false;
        },
      });
  }

  generatePredictions(): void {
    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.cashflowService
      .apiCashflowPredictionGenerateOrgIdPost(this.orgId)
      .subscribe({
        next: () => {
          this.successMessage = 'Cashflow predictions generated successfully!';
          this.loadPredictions();
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Error generating predictions:', err);
          this.error = 'Failed to generate predictions. Please try again.';
          this.isLoading = false;
        },
      });
  }

  private updateMetrics(): void {
    if (this.currentPrediction) {
      this.projectedInflow = this.currentPrediction.projectedInflow || 0;
      this.projectedOutflow = this.currentPrediction.projectedOutflow || 0;
      this.netCashflow = this.projectedInflow - this.projectedOutflow;
      this.forecastConfidence = this.currentPrediction.confidence || 0;
      this.forecastAmount = Math.abs(this.netCashflow);

      // Calculate risk level based on net cashflow
      if (this.netCashflow < 0) {
        this.riskLevel = 'High';
      } else if (this.netCashflow < this.projectedInflow * 0.2) {
        this.riskLevel = 'Medium';
      } else {
        this.riskLevel = 'Low';
      }
    }
  }

  onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(target.value);
    this.loadPredictionByMonth();
  }

  onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedMonth = parseInt(target.value);
    this.loadPredictionByMonth();
  }
}
