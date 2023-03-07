export interface RatesSettings {
    bookability: number;
    check_in_hour: number;
    check_out_hour: number;
    booking_window_days: number;
    advance_notice_days: number;
    advance_notice_hours: number;
    preparation_time_days: number;
    currency_code: string;
    vat: number;
    is_vat_exclusive: boolean;
}



/* 

{
  "bookability": 0,
  "check_in_hour": 0,
  "check_out_hour": 0,
  "booking_window_days": 0,
  "advance_notice_days": 0,
  "advance_notice_hours": 0,
  "preparation_time_days": 0,
  "currency_code": "EUR",
  "vat": 20,
  "is_vat_exclusive": false
}

*/
