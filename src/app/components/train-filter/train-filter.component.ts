import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-train-filter',
  template: `
    <div class="filter-card">
      <div class="filter-header">
        <h3>Recherche & Filtres</h3>
        <span class="seat-counter">
          Places disponibles : <strong>{{ totalSeats }}</strong>
        </span>
      </div>

      <div class="filter-row">
        <div class="input-group">
          <label for="search-input">Rechercher une destination ou un numéro de train :</label>
          <input
            id="search-input"
            type="text"
            class="native-search-input"
            placeholder="Ex: Lyon, Bordeaux, TGV 6612..."
            [value]="searchTerm"
            (input)="onSearchInput($event)"
          />
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
    </div>
  `,
  styles: [`
    .filter-card {
      background: #ffffff;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
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

    .seat-counter {
      font-size: 0.9rem;
      background-color: #e8f5e9;
      color: #1b5e20;
      padding: 4px 10px;
      border-radius: 12px;
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: flex-end;
    }

    .input-group {
      flex: 1;
      min-width: 250px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-group label, .filter-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #475569;
    }

    .native-search-input {
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.95rem;
      outline: none;
    }

    .native-search-input:focus {
      border-color: #0088ce;
      box-shadow: 0 0 0 2px rgba(0, 136, 206, 0.15);
    }

    .radio-filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .actions-group {
      display: flex;
      align-items: center;
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
    const value = event.target?.value || event.detail?.value || '';
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
