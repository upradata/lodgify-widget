import { addBookingReservationStateManagement } from './BookingStateManagement.hoc';
import { BookingView } from './BookingView';


export const Booking = addBookingReservationStateManagement(BookingView);

Booking.displayName = 'Booking';
