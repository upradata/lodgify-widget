import { CamelObject } from '../util.types';

export interface LodgifyQuote {
  total_including_vat: number;
  total_excluding_vat?: number;
  total_vat?: number;
  property_id: number;
  date_arrival: string;
  date_departure: string;
  currency_code: string;
  room_types: RoomType[];
  add_ons: any[];
  other_items: any[];
  add_ons_subtotal: number;
  rate_policy_user_id?: any;
  scheduled_payments: ScheduledPayment[];
  scheduled_damage_protection: any[];
  security_deposit: number;
  total_scheduled_payments: number;
  total_to_collect_manually: number;
  amount_gross: number;
  rental_agreement: string;
  cancellation_policy_text: string;
  security_deposit_text: string;
  is_verification: boolean;
}

export interface ScheduledPayment {
  type: string;
  date_due: string;
  amount: number;
  is_current: boolean;
}

export interface RoomType {
  room_type_id: number;
  name: string;
  people: number;
  price_types: PriceType[];
  subtotal: number;
}

export enum QuotePriceType {
  RoomRate = 0,
  Promotion = 1,
  Fee = 2,
  AddOn = 3,
  Tax = 4,
  Other = 5
}

export enum RoomRateType {
  Stay = 0,
  ShortStayPremium = 1
}


export enum FeeType {
  Cleaning = 0,
  Miscellaneous,
  DamageProtectionInsurance,
  ManagementFee,
  ServiceFee,
  Wood,
  DrinkingWater,
  WaterCraftMooring,
  WaterCraft,
  Water,
  Vehicle,
  FoodUtensils,
  UtensilsCleaning,
  Transportation,
  Tour,
  Toiletries,
  Spa,
  Resort,
  Rent,
  Parking,
  Phone,
  OnSitePaymentMethod,
  Oil,
  LinensBed,
  LinensBath,
  Linens,
  Laundry,
  Labor,
  Internet,
  TravelInsurance,
  HotTub,
  HighChair,
  Heating,
  Gas,
  Gardening,
  Food,
  Equipment,
  Electricity,
  Concierge,
  PoolHeating,
  Pool,
  Class,
  BabyBed,
  PropertyAssociation,
  AirConditioning,
  AdditionalBed,
  PetFee
}


export interface PriceType {
  type: QuotePriceType;
  is_negative: boolean;
  description: string;
  prices: QuotePrice[];
  subtotal: number;
}


export interface QuotePrice {
  uid: string;
  description: string;
  amount: number;
  fee_type?: null | FeeType;
  room_rate_type: null | RoomRateType;
}

export type Quote = CamelObject<LodgifyQuote>;


/* 

{
    "total_including_vat": 1576.40,
    "total_excluding_vat": null,
    "total_vat": null,

    OR (depending on Lodgify Settings page Sales tax / VAT)

    "total_including_vat": null,
    "total_excluding_vat": 1332.71,
    "total_vat": 243.69,

    "property_id": 436901,
    "date_arrival": "2023-03-01T00:00:00",
    "date_departure": "2023-03-08T00:00:00",
    "currency_code": "EUR",
    "room_types": [
      {
        "room_type_id": 503044,
        "name": "Mini-Hotel",
        "people": 5,
        "price_types": [
          {
            "type": 0,
            "is_negative": false,
            "description": "Room Rate",
            "prices": [
              {
                "uid": "RoomRate-RoomType-503044-Stay",
                "description": "RoomType",
                "amount": 1400.0,
                "fee_type": null,
                "room_rate_type": 0
              }
            ],
            "subtotal": 1400.0
          },
          {
            "type": 1,
            "is_negative": true,
            "description": "Promotion",
            "prices": [
              {
                "uid": "Promotion-RoomType-503044",
                "description": "Doggy Promo",
                "amount": -210.0,
                "fee_type": null,
                "room_rate_type": null
              }
            ],
            "subtotal": -210.0
          },
          {
            "type": 2,
            "is_negative": false,
            "description": "Fees",
            "prices": [
              {
                "uid": "Fee-RoomType-503044-AdditionalBed-73974",
                "description": "Extra bed",
                "amount": 105.0,
                "fee_type": 45,
                "room_rate_type": null
              },
              {
                "uid": "Fee-RoomType-503044-Cleaning-79548",
                "description": "Cleaning",
                "amount": 35.0,
                "fee_type": 0,
                "room_rate_type": null
              }
            ],
            "subtotal": 140.0
          },
          {
            "type": 4,
            "is_negative": false,
            "description": "Taxes",
            "prices": [
              {
                "uid": "Tax-RoomRate-RoomType-503044-Stay-26918",
                "description": "Local Tax",
                "amount": 59.5,
                "fee_type": null,
                "room_rate_type": null
              },
              {
                "uid": "Tax-RoomRate-RoomType-503044-Stay-28712",
                "description": "Online Service Tax",
                "amount": 7.0,
                "fee_type": null,
                "room_rate_type": null
              }
            ],
            "subtotal": 66.5
          }
        ],
        "subtotal": 1396.5
      }
    ],
    "add_ons": [
      {
        "add_on_id": 39011,
        "name": "ShowDance",
        "units": 4,
        "amount": 179.90
      }
    ],
    "other_items": [],
    "add_ons_subtotal": 179.90,
    "rate_policy_user_id": null,
    "scheduled_payments": [
      {
        "type": "Payment",
        "date_due": "On agreement",
        "amount": 1576.40,
        "is_current": true
      }
    ],
    "scheduled_damage_protection": [],
    "security_deposit": 0.0,
    "total_scheduled_payments": 1576.40,
    "total_to_collect_manually": 0.00,
    "amount_gross": 1576.40,
    "rental_agreement": "d5958e3f-77b7-4b7e-9242-8b16136860ab",
    "cancellation_policy_text": "50% of paid prepayments refundable when canceled 7 days before arrival or earlier.\r\n0% refundable if canceled after.",
    "security_deposit_text": "No damage deposit is due.",
    "is_verification": false
  }

*/
