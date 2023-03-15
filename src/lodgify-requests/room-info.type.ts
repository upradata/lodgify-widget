import { CamelObject } from '../util.types';
import { Currency } from './common.type';

export interface LodgifyRoomInfo {
  images: Image[];
  amenities: Amenities;
  description?: any;
  breakfast_included: boolean;
  has_parking: boolean;
  adults_only: boolean;
  pets_allowed?: any;
  show_additional_key_facts: boolean;
  id: number;
  name: string;
  image_url: string;
  max_people: number;
  units: number;
  has_wifi: boolean;
  has_meal_plan: boolean;
  bedrooms: number;
  bathrooms: number;
  area_unit: string;
  area: number;
  min_price: number;
  original_min_price: number;
  max_price: number;
  original_max_price: number;
  price_unit_in_days: number;
  currency: Currency;
}


export interface Amenities {
  room: any[];
  'further-info': any[];
  cooking: any[];
  entertainment: any[];
  heating: any[];
  laundry: any[];
  livingroom: any[];
  miscellaneous: any[];
  outside: any[];
  parking: any[];
  sanitary: any[];
  sleeping: Sleeping[];
}


export interface Sleeping {
  name: string;
  prefix: string;
  bracket?: any;
  text: string;
}

interface Image {
  text: string;
  url: string;
}


export type RoomInfo = CamelObject<LodgifyRoomInfo>;

/* 

{
  "images": [
    {
      "text": "",
      "url": "//li5.cdbcdn.com/oh/0cca9a7a-3060-4249-9a91-87d646153b77.jpg?f=32"
    },
    {
      "text": "",
      "url": "//li4.cdbcdn.com/oh/b6fb57f8-5042-44ac-81cc-88562850ec6d.jpg?f=32"
    },
    {
      "text": "",
      "url": "//li3.cdbcdn.com/oh/15d43c6d-3200-4fd8-9760-4bcb5b1ca7e4.jpg?f=32"
    },
    {
      "text": "",
      "url": "//li2.cdbcdn.com/oh/6a50263d-aa68-41a2-af0b-97551e554763.jpg?f=32"
    },
    {
      "text": "",
      "url": "//li1.cdbcdn.com/oh/0ec10a51-ae44-462f-954d-bf4dcafad4fd.jpg?f=32"
    }
  ],
  "amenities": {
    "room": [],
    "further-info": [],
    "cooking": [],
    "entertainment": [],
    "heating": [],
    "laundry": [],
    "livingroom": [],
    "miscellaneous": [],
    "outside": [],
    "parking": [],
    "sanitary": [],
    "sleeping": [
      {
        "name": "SleepingDoubleBed",
        "prefix": "2",
        "bracket": null,
        "text": "2 Lit double"
      },
      {
        "name": "SleepingStudioCouch",
        "prefix": "1",
        "bracket": null,
        "text": "1 Canapé-lit"
      },
      {
        "name": "SleepingTwinSingleBed",
        "prefix": "1",
        "bracket": null,
        "text": "1 Lit simple"
      }
    ]
  },
  "description": null,
  "breakfast_included": false,
  "has_parking": false,
  "adults_only": true,
  "pets_allowed": null,
  "show_additional_key_facts": false,
  "id": 503044,
  "name": "Mini-Hotel",
  "image_url": "//li5.cdbcdn.com/oh/0cca9a7a-3060-4249-9a91-87d646153b77.jpg?f=32",
  "max_people": 5,
  "units": 1,
  "has_wifi": false,
  "has_meal_plan": false,
  "bedrooms": 0,
  "bathrooms": 0,
  "area_unit": "sqm",
  "area": 300,
  "min_price": 100,
  "original_min_price": 100,
  "max_price": 100,
  "original_max_price": 100,
  "price_unit_in_days": 0,
  "currency": {
    "id": 92,
    "code": "EUR",
    "name": "Euro",
    "euro_forex": 1,
    "symbol": "€  "
  }
}


*/
