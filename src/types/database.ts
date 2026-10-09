export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      stations: { Row: { id: string; code: string; name_th: string; name_en: string | null; region: string | null; active: boolean } };
      trains: { Row: { id: string; train_number: string; name: string; train_type: string; active: boolean } };
      routes: { Row: { id: string; train_id: string; origin_station_id: string; destination_station_id: string; departure_time: string; arrival_time: string; active: boolean } };
      bookings: { Row: { id: string; user_id: string; booking_reference: string; status: "pending_payment" | "confirmed" | "cancelled" | "expired"; total_amount: number; created_at: string } };
      booking_seats: { Row: { id: string; booking_id: string; run_seat_id: string; passenger_name: string; fare_amount: number } };
      seat_holds: { Row: { id: string; user_id: string; run_seat_id: string; expires_at: string; created_at: string } };
      payments: { Row: { id: string; booking_id: string; provider: string; status: "pending" | "succeeded" | "failed" | "refunded"; amount: number; created_at: string } };
      tickets: { Row: { id: string; booking_seat_id: string; ticket_number: string; qr_payload: string; verified_at: string | null } };
      user_roles: { Row: { user_id: string; role: "passenger" | "station_staff" | "admin" } };
    };
    Views: Record<string, never>;
    Functions: {
      hold_run_seats: { Args: { p_run_id: string; p_seat_ids: string[] }; Returns: string[] };
      release_expired_holds: { Args: Record<PropertyKey, never>; Returns: number };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};