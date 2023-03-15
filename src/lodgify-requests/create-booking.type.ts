import type { LodgifyDate } from './common.type';
import type { CamelObject } from '../util.types';


export type Bookability = 'InstantBooking' | 'BookingRequest' | 'EnquiryOnly';

export type BookingSource =
    | 'Manual' | 'OH' | 'Domegos' | 'NineFlats' | 'Airbnb' | 'HomeAway'
    | 'BookingCom' | 'Expedia' | 'ICal' | 'Email' | 'FacebookMessenger' | 'AirbnbIntegration';


export type BookingStatus = 'Open' | 'Booked' | 'Tentative' | 'Declined';

export type BookingMessageType = 'Comment' | 'Owner' | 'Renter';


export interface LodgifyCreateBookingOptions {
    rooms: BookingRoom[];
    guest: BookingGuest;
    messages?: BookingMessage[];
    source: BookingSource;
    source_text?: string;
    arrival: LodgifyDate;
    departure: LodgifyDate;
    property_id: number;
    status: BookingStatus;
    payment_type?: string;
    payment_address?: string;
    currency_code?: string;
    bookability: Bookability;
    ip_created?: string;
    total?: number;
    origin?: string;
    payment_website_id: number;
}

export interface BookingMessage {
    subject: string;
    message: string;
    type: BookingMessageType;
}

export interface BookingGuest {
    name: string;
    email: string;
    street_address1?: string;
    street_address2?: string;
    city?: string;
    postal_code?: string;
    phone?: string;
    country_code?: string;
    state?: string;
    locale?: string;
}


export interface BookingRoom {
    room_type_id: number;
    people: number;
}

export type BookingId = number;


export type CreateBookingOptions = CamelObject<LodgifyCreateBookingOptions>;


/* 

{
  rooms: [
    {
      room_type_id: 503044,
      people: 4
    }
  ],
  guest: {
    name: "Thomas Milotti",
    email: "thomas.milotti@gmail.com",
    street_address1: "75, rue de Lourmel",
    city: "Paris",
    postal_code: "75015",
    phone: "0749110152",
    country_code: "France",
    state: "Ile-de-France",
    locale: "fr"
  },
  messages: [
    {
      subject: "Sujet du message",
      message: "le message en question",
      type: "Comment"
    }
  ],
  source: "Manual",
  source_text: "website",
  arrival: "2023-05-14",
  departure: "2023-05-20",
  property_id: 436901,
  status: "Open",
  payment_address: "39, Avenue Aimé Martin",
  currency_code: "eur",
  bookability: "BookingRequest",
  total: 1800,
  origin: "France",
  payment_website_id: 391077
}


*/
