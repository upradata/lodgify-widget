
export type PropertyInfo = PropertyInfoPrice & {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    zip: string;
    city: string;
    country: string;
    image_url: string;
    has_addons: boolean;
    has_agreement: boolean;
    agreement_text?: any;
    agreement_url?: any;
    contact: Contact;
    rating: number;
    rooms: Room[];
    in_out_max_date: string;
    in_out?: any;
    currency_code: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
};




export interface Room {
    id: number;
    name: string;
}


export interface Contact {
    spoken_languages: string[];
}


export interface PropertyInfoPrice {
    price_unit_in_days: number;
    min_price: number;
    original_min_price: number;
    max_price: number;
    original_max_price: number;
}


/* 

{
  "id": 432806,
  "name": "Za Rohom Room 1",
  "description": "<p>A quick summary.</p>",
  "latitude": 49.060445,
  "longitude": 19.581905,
  "address": " - ",
  "zip": "031 01",
  "city": "Liptovský Mikuláš",
  "country": "Slovaquie",
  "image_url": "//l.icdbcdn.com/oh/b47d66b2-8d36-4e13-91a5-6c1624c9d27d.jpg?f=32",
  "has_addons": false,
  "has_agreement": false,
  "agreement_text": null,
  "agreement_url": null,
  "contact": {
    "spoken_languages": [
      "FR",
      "EN",
      "IT"
    ]
  },
  "rating": 0,
  "price_unit_in_days": 1,
  "min_price": 130,
  "original_min_price": 130,
  "max_price": 160,
  "original_max_price": 160,
  "rooms": [
    {
      "id": 498935,
      "name": "Za Rohom Room 1"
    }
  ],
  "in_out_max_date": "0001-01-01",
  "in_out": null,
  "currency_code": "EUR",
  "created_at": "2022-12-29T19:55:08",
  "updated_at": "2023-01-11T21:49:35",
  "is_active": true
}

*/
