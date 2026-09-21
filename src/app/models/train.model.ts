export interface Train {
  id: string;
  trainNumber: string;
  type: 'TGV INOUI' | 'OUIGO' | 'TER' | 'INTERCITES';
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
  delayMinutes?: number;
  availableSeats: number;
  price: number;
}
