import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-train-filter',
  templateUrl: './train-filter.component.html',
  styleUrls: ['./train-filter.component.css']
})
export class TrainFilterComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedType: string = 'ALL';
  totalSeats: number = 0;

  private destroy$ = new Subject<void>();

  constructor(public trainService: TrainService) {}

  ngOnInit(): void {
    // Souscription classique RxJS avec gestion mémoire manuelle
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

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.trainService.setFilterType(type);
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
