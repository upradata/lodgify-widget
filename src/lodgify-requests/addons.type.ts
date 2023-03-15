import type { Currency } from './common.type';
import type { CamelObject } from '../util.types';


export interface LodgifyAddon {
    id: number;
    name: string;
    description: string;
    charge_type: string;
    rate_type: string;
    max_quantity: number;
    frequency: string;
    percentage?: any;
    amount: number;
    original_amount: number;
    image_url?: any;
    currency: Currency;
}


export type Addon = CamelObject<LodgifyAddon>;


/* 

{
    "id": 39011,
    "name": "Show Dance",
    "description": "<p>Compétition de danse sportive</p>",
    "charge_type": "PerQuantity",
    "rate_type": "Fixed",
    "max_quantity": 5,
    "frequency": "PerStay",
    "percentage": null,
    "amount": 37.48,
    "original_amount": 37.48,
    "image_url": null,
    "currency": {
      "id": 92,
      "code": "EUR",
      "name": "Euro",
      "euro_forex": 1,
      "symbol": "€  "
    }
  }

*/
