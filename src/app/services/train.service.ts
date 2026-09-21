import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Train } from '../models/train.model';

const INITIAL_TRAINS: Train[] = [
  {
    id: 'TR-101',
    trainNumber: 'TGV 6612',
    type: 'TGV INOUI',
    departureStation: 'Paris Gare de Lyon',
    arrivalStation: 'Lyon Part-Dieu',
    departureTime: '08:14',
    arrivalTime: '10:10',
    status: 'ON_TIME',
    availableSeats: 42,
    price: 68
  },
  {
    id: 'TR-102',
    trainNumber: 'OUIGO 7820',
    type: 'OUIGO',
    departureStation: 'Paris Gare de Lyon',
    arrivalStation: 'Marseille Saint-Charles',
    departureTime: '09:02',
    arrivalTime: '12:28',
    status: 'DELAYED',
    delayMinutes: 15,
    availableSeats: 12,
    price: 29
  },
  {
    id: 'TR-103',
    trainNumber: 'TER 88104',
    type: 'TER',
    departureStation: 'Lyon Part-Dieu',
    arrivalStation: 'Grenoble',
    departureTime: '10:45',
    arrivalTime: '12:05',
    status: 'ON_TIME',
    availableSeats: 85,
    price: 19
  },
  {
    id: 'TR-104',
    trainNumber: 'TGV 8541',
    type: 'TGV INOUI',
    departureStation: 'Paris Montparnasse',
    arrivalStation: 'Bordeaux Saint-Jean',
    departureTime: '11:10',
    arrivalTime: '13:14',
    status: 'ON_TIME',
    availableSeats: 3,
    price: 89
  },
  {
    id: 'TR-105',
    trainNumber: 'INTERCITES 4402',
    type: 'INTERCITES',
    departureStation: 'Paris Austerlitz',
    arrivalStation: 'Toulouse Matabiau',
    departureTime: '14:28',
    arrivalTime: '21:12',
    status: 'CANCELLED',
    availableSeats: 0,
    price: 45
  }
];

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  // RxJS Legacy State Management
  private trainsSubject = new BehaviorSubject<Train[]>(INITIAL_TRAINS);
  private searchQuerySubject = new BehaviorSubject<string>('');
  private selectedTypeSubject = new BehaviorSubject<string>('ALL');
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  public readonly trains$: Observable<Train[]> = this.trainsSubject.asObservable();
  public readonly searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();
  public readonly selectedType$: Observable<string> = this.selectedTypeSubject.asObservable();
  public readonly isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Observable dérivé via combineLatest
  public readonly filteredTrains$: Observable<Train[]> = combineLatest([
    this.trains$,
    this.searchQuery$,
    this.selectedType$
  ]).pipe(
    map(([trains, query, selectedType]) => {
      const q = query.toLowerCase().trim();
      return trains.filter(train => {
        const matchesQuery =
          !q ||
          train.departureStation.toLowerCase().includes(q) ||
          train.arrivalStation.toLowerCase().includes(q) ||
          train.trainNumber.toLowerCase().includes(q);

        const matchesType =
          selectedType === 'ALL' || train.type === selectedType;

        return matchesQuery && matchesType;
      });
    })
  );

  // Observable dérivé comptant le total de places disponibles
  public readonly totalSeatsAvailable$: Observable<number> = this.filteredTrains$.pipe(
    map(trains => trains.reduce((acc, curr) => acc + curr.availableSeats, 0))
  );

  constructor() {}

  public setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  public setFilterType(type: string): void {
    this.selectedTypeSubject.next(type);
  }

  public bookSeat(trainId: string): void {
    const currentTrains = this.trainsSubject.getValue();
    const updatedTrains = currentTrains.map(train => {
      if (train.id === trainId && train.availableSeats > 0) {
        return { ...train, availableSeats: train.availableSeats - 1 };
      }
      return train;
    });
    this.trainsSubject.next(updatedTrains);
  }

  public refreshTrains(): void {
    this.loadingSubject.next(true);
    // Simuler un appel HTTP asynchrone
    of(INITIAL_TRAINS)
      .pipe(delay(600))
      .subscribe(trains => {
        this.trainsSubject.next(trains);
        this.loadingSubject.next(false);
      });
  }
}
