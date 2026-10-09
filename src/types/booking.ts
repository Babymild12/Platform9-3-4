export type FareOption = {
  code: string;
  label: string;
  price: number;
};

export type TripSchedule = {
  id: string;
  number: string;
  kind: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  price: number;
  seats: number;
  fares: FareOption[];
};

export type DemoTicket = {
  id: string;
  bookingReference: string;
  scheduleId: string;
  trainNumber: string;
  trainKind: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  travelDate: string;
  fareCode: string;
  fareLabel: string;
  unitPrice: number;
  totalPrice: number;
  passengers: { name: string; seat: string }[];
  paymentMethod: "promptpay-demo" | "card-demo";
  qrPayload: string;
  status: "simulation-paid" | "cancelled";
  createdAt: string;
};