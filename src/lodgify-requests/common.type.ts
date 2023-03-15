import type { CamelObject } from '../util.types';

export interface LodgifyCurrency {
    id: number;
    code: string;
    name: string;
    euro_forex: number;
    symbol: string;
}


export type Currency = CamelObject<LodgifyCurrency>;


type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type Year = `20${Digit}${Digit}`;
type Month = `${'0' | '1'}${Digit}`;
type Day = `${'0' | '1' | '2' | '3'}${Digit}`;

export type LodgifyDate = `${Year}-${Month}-${Day}`;

/* 

fee_type
string
Cleaning Miscellaneous DamageProtectionInsurance ManagementFee ServiceFee Wood DrinkingWater WaterCraftMooring WaterCraft Water Vehicle FoodUtensils UtensilsCleaning Transportation Tour Toiletries Spa Resort Rent Parking Phone OnSitePaymentMethod Oil LinensBed LinensBath Linens Laundry Labor Internet TravelInsurance HotTub HighChair Heating Gas Gardening Food Equipment Electricity Concierge PoolHeating Pool Class BabyBed PropertyAssociation AirConditioning AdditionalBed PetFee

room_rate_type
string
Stay ShortStayPremium

*/
