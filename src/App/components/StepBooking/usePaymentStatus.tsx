import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

export const usePaymentStatus = () => {
    const stripe = useStripe();
    const [ status, setStatus ] = useState({ message: '', type: 'success' as 'success' | 'pending' | 'error' | 'warn' });

    useEffect(() => {
        if (!stripe) {
            return;
        }

        // Retrieve the "payment_intent_client_secret" query parameter appended to
        // your return_url by Stripe.js
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (!clientSecret)
            return;
            
        // Retrieve the PaymentIntent
        stripe
            .retrievePaymentIntent(clientSecret)
            .then(({ paymentIntent, error }) => {

                if (error) {
                    console.error(error);
                    return setStatus({ type: 'error', message: `Payment error: "${error.type}".` });
                }
                // Inspect the PaymentIntent `status` to indicate the status of the payment
                // to your customer.
                //
                // Some payment methods will [immediately succeed or fail][0] upon
                // confirmation, while others will first enter a `processing` state.
                //
                // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification


                /*
                   | 'canceled'
                    | 'processing'
                    | 'requires_action'
                    | 'requires_capture'
                    | 'requires_confirmation'
                    | 'requires_payment_method'
                    | 'succeeded';
                
                */
                switch (paymentIntent.status) {
                    case 'succeeded':
                        return setStatus({ type: 'success', message: 'Success! Payment received.' });

                    case 'processing':
                        return setStatus({ type: 'pending', message: `Payment processing. We'll update you when payment is received.` });

                    case 'requires_payment_method':
                        // Redirect your user back to your payment page to attempt collecting
                        // payment again
                        return setStatus({ type: 'error', message: 'Payment failed. Please try another payment method.' });

                    default:
                        return setStatus({ type: 'warn', message: `Current status: "${paymentIntent.status}".`/* 'Something went wrong.' */ });
                }
            }).catch(error => {
                console.error(error);
                return setStatus({ type: 'error', message: `Something went wrong.` });
            });
    }, [ stripe ]);


    return status;
};
