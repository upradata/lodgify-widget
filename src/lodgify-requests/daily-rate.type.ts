
export interface DailyRates {
    calendar_items: CalendarItem[];
    rate_settings: RateSettings;
}

export interface RateSettings {
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

export interface CalendarItem {
    date?: string;
    is_default: boolean;
    prices: DailyPrice[];
}


export interface DailyPrice {
    min_stay: number;
    max_stay: number;
    price_per_day: number;
}


/* 

{
  "calendar_items": [
    {
      "date": null,
      "is_default": true,
      "prices": [
        {
          "min_stay": 1,
          "max_stay": 1,
          "price_per_day": 100
        },
        {
          "min_stay": 2,
          "max_stay": 6,
          "price_per_day": 100
        },
        {
          "min_stay": 7,
          "max_stay": 13,
          "price_per_day": 71.43
        },
        {
          "min_stay": 14,
          "max_stay": 29,
          "price_per_day": 50
        },
        {
          "min_stay": 30,
          "max_stay": 0,
          "price_per_day": 66.67
        }
      ]
    },
    {
      "date": "2023-01-01",
      "is_default": false,
      "prices": [
        {
          "min_stay": 1,
          "max_stay": 1,
          "price_per_day": 100
        },
        {
          "min_stay": 2,
          "max_stay": 6,
          "price_per_day": 100
        },
        {
          "min_stay": 7,
          "max_stay": 13,
          "price_per_day": 71.43
        },
        {
          "min_stay": 14,
          "max_stay": 29,
          "price_per_day": 50
        },
        {
          "min_stay": 30,
          "max_stay": 0,
          "price_per_day": 66.67
        }
      ]
    },
    {
      "date": "2023-01-02",
      "is_default": false,
      "prices": [
        {
          "min_stay": 1,
          "max_stay": 1,
          "price_per_day": 100
        },
        {
          "min_stay": 2,
          "max_stay": 6,
          "price_per_day": 100
        },
        {
          "min_stay": 7,
          "max_stay": 13,
          "price_per_day": 71.43
        },
        {
          "min_stay": 14,
          "max_stay": 29,
          "price_per_day": 50
        },
        {
          "min_stay": 30,
          "max_stay": 0,
          "price_per_day": 66.67
        }
      ]
    }
  ],
  "rate_settings": {
    "bookability": 0,
    "check_in_hour": 14,
    "check_out_hour": 10,
    "booking_window_days": 365,
    "advance_notice_days": 1,
    "advance_notice_hours": 24,
    "preparation_time_days": 0,
    "currency_code": "EUR",
    "vat": 1,
    "is_vat_exclusive": false
  }
}

*/
