import { Button } from '@lodgify/ui';
import { PaymentElement, PaymentElementProps, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { joinToString } from '@root/util';
import { BookingContext } from '../Booking/BookingContext';
import { usePaymentStatus } from './usePaymentStatus';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
export const stripe$ = loadStripe('pk_test_51MrGx3GfYy8fKb1qCtq7sZoV36eHUT9mFIrPrRBOC3HxRkhp9mjG1wDMOzdZopFnL6ZUgdtkTvUr7bucV4DzyWYx00W23FSrEV');

const join = joinToString({ filter: v => !!v });

const corsProxy = `http://localhost:8080`;

export const StripeCheckoutForm: React.FunctionComponent<{}> = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [ errorMessage, setErrorMessage ] = useState('');
    const [ isLoading, setLoading ] = useState(false);

    const handleError = (message: string) => {
        setLoading(false);
        setErrorMessage(message);
    };

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();

        if (submitError) {
            handleError(submitError.message);
            return;
        }


        const requestUrl = join('/',
            'http://localhost:3001',
            'create-intent'
        );

        // Create the PaymentIntent and obtain clientSecret
        const { response: res, error: fetchError } = await fetch(requestUrl, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 1099, currency: 'eur' })
        })
            .then(response => {
                if (`${response.status}`.startsWith('2'))
                    return { response, error: undefined as Error };

                return { response: undefined as Response, error: new Error(`${response.statusText} (status: ${response.status})`) };
            })
            .catch(error => ({ response: undefined as Response, error: error as Error }));

        if (res?.type === 'error' || fetchError) {
            console.error(fetchError || res.statusText);
            handleError(fetchError ? fetchError.message : res.statusText);
            return;
        }

        const { clientSecret } = await res.json();

        // Confirm the PaymentIntent using the details collected by the Payment Element
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.href}?payment-status=success`, // 'https://example.com/order/123/complete',
            },
        });

        if (error) {
            // Show error to your customer (for example, payment details incomplete)
            console.error(error);
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            handleError(error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    const { billingInfo } = useContext(BookingContext);
    const { countriesMetadata } = useContext(AppContext);

    const paymentProps: PaymentElementProps = {
        options: {
            layout: 'auto',
            defaultValues: {
                billingDetails: {
                    name: `${billingInfo.firstName} ${billingInfo.lastName}`,
                    phone: billingInfo.phoneNumber,
                    email: billingInfo.email,
                    address: {
                        // line1: '',
                        // postal_code: '',
                        // city: '',
                        country: countriesMetadata.find(c => c.code === billingInfo.country)?.name,
                        // state: ''
                    }
                }
            },
            // business: { name: 'Upra-data' }
        }
    };

    const status = usePaymentStatus();

    return (
        <form onSubmit={handleSubmit} className="StripeCheckoutForm">
            <PaymentElement {...paymentProps} />

            {status.message && <p>{status.message} (type={status.type})</p>}
            {errorMessage && <p>{errorMessage}</p>}


            <Button className="StripeCheckoutForm__submit-btn" isFormSubmit isRounded isDisabled={isLoading || !stripe || !elements}>
                Pay now
                {/* <span id="button-text">
                    {isLoading ? <div className="spinner" >Spinner</div> : "Pay now"}
                </span> */}
            </Button>
        </form>
    );
};

StripeCheckoutForm.displayName = 'StripeCheckoutForm';
