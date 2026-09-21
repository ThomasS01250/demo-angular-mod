import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-train-filter',
  template: `
    <wcs-card mode="raised" class="filter-card">
      <wcs-card-body>
        <div class="filter-header">
          <h3>Recherche & Filtres</h3>
          <wcs-badge shape="rounded" class="seat-badge">
            Places disponibles : <strong>{{ totalSeats }}</strong>
          </wcs-badge>
        </div>

        <div class="filter-row">
          <div class="input-container">
            <wcs-form-field>
              <wcs-label>Rechercher une destination ou un numéro de train :</wcs-label>
              <wcs-input
                icon="search"
                placeholder="Ex: Lyon, Bordeaux, TGV 6612..."
                [value]="searchTerm"
                (wcsInput)="onSearchInput($event)">
              </wcs-input>
            </wcs-form-field>
          </div>

          <div class="radio-filter-group">
            <label class="filter-label">Type de train :</label>
            <wcs-radio-group
              name="train-type-filter"
              mode="option"
              [value]="selectedType"
              (wcsChange)="onTypeChange($event)">
              <wcs-radio label="Tous" value="ALL"></wcs-radio>
              <wcs-radio label="TGV INOUI" value="TGV INOUI"></wcs-radio>
              <wcs-radio label="OUIGO" value="OUIGO"></wcs-radio>
              <wcs-radio label="TER" value="TER"></wcs-radio>
            </wcs-radio-group>
          </div>

          <div class="actions-group">
            <wcs-button mode="stroked" shape="round" size="s" (click)="resetFilters()">
              Réinitialiser
            </wcs-button>
          </div>
        </div>
      </wcs-card-body>
    </wcs-card>
  `,
  styles: [`
    .filter-card {
      margin-bottom: 24px;
      display: block;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .filter-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #1e293b;
    }

    .seat-badge {
      font-size: 0.85rem;
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: flex-end;
    }

    .input-container {
      flex: 1;
      min-width: 280px;
    }

    .filter-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #475569;
      margin-bottom: 4px;
      display: inline-block;
    }

    .radio-filter-group {
      display: flex;
      flex-direction: column;
    }

    .actions-group {
      display: flex;
      align-items: center;
      padding-bottom: 2px;
    }
  `]
})
export class TrainFilterComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedType: string = 'ALL';
  totalSeats: number = 0;

  private destroy$ = new Subject<void>();

  constructor(public trainService: TrainService) {}

  ngOnInit(): void {
    this.trainService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => {
        this.searchTerm = term;
      });

    this.trainService.totalSeatsAvailable$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seats => {
        this.totalSeats = seats;
      });
  }

  onSearchInput(event: any): void {
    const value = event?.target?.value ?? event?.detail?.value ?? '';
    this.searchTerm = value;
    this.trainService.setSearchQuery(value);
  }

  onTypeChange(event: any): void {
    const value = typeof event === 'string' ? event : (event?.detail?.value ?? 'ALL');
    this.selectedType = value;
    this.trainService.setFilterType(value);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'ALL';
    this.trainService.setSearchQuery('');
    this.trainService.setFilterType('ALL');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
