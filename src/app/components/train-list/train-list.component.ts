import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Train } from '../../models/train.model';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-train-list',
  templateUrl: './train-list.component.html',
  styleUrls: ['./train-list.component.css']
})
export class TrainListComponent implements OnInit {
  trains$: Observable<Train[]>;
  isLoading$: Observable<boolean>;

  constructor(private trainService: TrainService) {
    this.trains$ = this.trainService.filteredTrains$;
    this.isLoading$ = this.trainService.isLoading$;
  }

  ngOnInit(): void {}

  onBook(train: Train): void {
    if (train.availableSeats > 0) {
      this.trainService.bookSeat(train.id);
    }
  }

  onRefresh(): void {
    this.trainService.refreshTrains();
  }

  getBadgeColor(type: string): string {
    switch (type) {
      case 'TGV INOUI':
        return 'primary';
      case 'OUIGO':
        return 'warning';
      case 'TER':
        return 'success';
      default:
        return 'info';
    }
  }
}
