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
            <wcs-card mode="raised">
              <wcs-card-body>
                <wcs-card-header>
                  <div slot="badges">
                    <wcs-badge shape="rounded" [class]="'badge-type-' + getBadgeSlug(train.type)">
                      {{ train.type }}
                    </wcs-badge>
                  </div>
                  {{ train.trainNumber }}
                  <div slot="actions">
                    <wcs-badge *ngIf="train.status === 'ON_TIME'" shape="rounded" class="status-badge on-time">À l'heure</wcs-badge>
                    <wcs-badge *ngIf="train.status === 'DELAYED'" shape="rounded" class="status-badge delayed">+{{ train.delayMinutes }} min</wcs-badge>
                    <wcs-badge *ngIf="train.status === 'CANCELLED'" shape="rounded" class="status-badge cancelled">Supprimé</wcs-badge>
                  </div>
                </wcs-card-header>

                <div class="journey-route">
                  <div class="station departure">
                    <span class="time">{{ train.departureTime }}</span>
                    <span class="name">{{ train.departureStation }}</span>
                  </div>
                  <div class="journey-divider">
                    <wcs-divider></wcs-divider>
                  </div>
                  <div class="station arrival">
                    <span class="time">{{ train.arrivalTime }}</span>
                    <span class="name">{{ train.arrivalStation }}</span>
                  </div>
                </div>

                <wcs-card-footer>
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
                </wcs-card-footer>
              </wcs-card-body>
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

    .status-badge.on-time {
      --wcs-badge-background-color: #dcfce7;
      --wcs-badge-color: #15803d;
    }

    .status-badge.delayed {
      --wcs-badge-background-color: #fef3c7;
      --wcs-badge-color: #b45309;
    }

    .status-badge.cancelled {
      --wcs-badge-background-color: #fee2e2;
      --wcs-badge-color: #b91c1c;
    }

    .badge-type-tgv-inoui {
      --wcs-badge-background-color: #7b1fa2;
      --wcs-badge-color: #ffffff;
    }

    .badge-type-ouigo {
      --wcs-badge-background-color: #00a4e4;
      --wcs-badge-color: #ffffff;
    }

    .badge-type-ter {
      --wcs-badge-background-color: #0088ce;
      --wcs-badge-color: #ffffff;
    }

    .journey-route {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f8fafc;
      padding: 16px 20px;
      border-radius: 8px;
      margin: 12px 0;
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
      margin: 0 24px;
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

  getBadgeSlug(type: string): string {
    return type.toLowerCase().replace(/\s+/g, '-');
  }
}
