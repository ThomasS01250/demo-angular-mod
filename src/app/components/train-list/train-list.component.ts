import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Train } from '../../models/train.model';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-train-list',
  template: `
    <div class="train-list-container">
      <div class="list-actions">
        <h2>Trajets disponibles</h2>
        <wcs-button mode="clear" size="m" (click)="onRefresh()">
          Rafraîchir les horaires
        </wcs-button>
      </div>

      <!-- État de chargement avec *ngIf classique -->
      <div *ngIf="isLoading$ | async; else contentBlock" class="loading-state">
        <wcs-spinner></wcs-spinner>
        <p>Recherche des trains en cours...</p>
      </div>

      <ng-template #contentBlock>
        <div class="train-cards-grid">
          <!-- Boucle *ngFor avec pipe async -->
          <div *ngFor="let train of trains$ | async" class="train-item">
            <wcs-card>
              <div class="train-card-inner">
                <div class="card-header">
                  <div class="train-identity">
                    <wcs-badge [color]="getBadgeColor(train.type)">{{ train.type }}</wcs-badge>
                    <span class="train-number">{{ train.trainNumber }}</span>
                  </div>
                  <div class="train-status">
                    <span *ngIf="train.status === 'ON_TIME'" class="status-badge on-time">À l'heure</span>
                    <span *ngIf="train.status === 'DELAYED'" class="status-badge delayed">+{{ train.delayMinutes }} min</span>
                    <span *ngIf="train.status === 'CANCELLED'" class="status-badge cancelled">Supprimé</span>
                  </div>
                </div>

                <div class="card-body">
                  <div class="journey-route">
                    <div class="station departure">
                      <span class="time">{{ train.departureTime }}</span>
                      <span class="name">{{ train.departureStation }}</span>
                    </div>
                    <div class="journey-divider">
                      <span class="line"></span>
                      <span class="dot"></span>
                    </div>
                    <div class="station arrival">
                      <span class="time">{{ train.arrivalTime }}</span>
                      <span class="name">{{ train.arrivalStation }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="seats-info">
                    <span [class.text-danger]="train.availableSeats <= 5">
                      {{ train.availableSeats }} place(s) restante(s)
                    </span>
                  </div>
                  <div class="price-action">
                    <span class="price">{{ train.price }} €</span>
                    <wcs-button
                      [disabled]="train.availableSeats === 0 || train.status === 'CANCELLED'"
                      size="m"
                      (click)="onBook(train)">
                      {{ train.availableSeats === 0 ? 'Complet' : 'Réserver' }}
                    </wcs-button>
                  </div>
                </div>
              </div>
            </wcs-card>
          </div>

          <!-- Message si aucun train trouvé -->
          <div *ngIf="(trains$ | async)?.length === 0" class="empty-state">
            <p>Aucun train ne correspond à vos critères de recherche.</p>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .train-list-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .list-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .list-actions h2 {
      font-size: 1.3rem;
      margin: 0;
      color: #1e293b;
    }

    .train-cards-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .train-card-inner {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .train-identity {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .train-number {
      font-weight: 600;
      color: #334155;
    }

    .status-badge {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .status-badge.on-time {
      background-color: #dcfce7;
      color: #15803d;
    }

    .status-badge.delayed {
      background-color: #fef3c7;
      color: #b45309;
    }

    .status-badge.cancelled {
      background-color: #fee2e2;
      color: #b91c1c;
    }

    .journey-route {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 8px;
    }

    .station {
      display: flex;
      flex-direction: column;
    }

    .station .time {
      font-size: 1.4rem;
      font-weight: 700;
      color: #0f172a;
    }

    .station .name {
      font-size: 0.9rem;
      color: #64748b;
    }

    .journey-divider {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 24px;
    }

    .journey-divider .line {
      width: 100%;
      height: 2px;
      background-color: #cbd5e1;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }

    .seats-info {
      font-size: 0.85rem;
      color: #64748b;
    }

    .seats-info .text-danger {
      color: #dc2626;
      font-weight: 600;
    }

    .price-action {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .price {
      font-size: 1.3rem;
      font-weight: 700;
      color: #0f172a;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
    }
  `]
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
