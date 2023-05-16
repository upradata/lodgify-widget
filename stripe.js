const stripe = require('stripe')('sk_test_51MrGx3GfYy8fKb1qRQect69zPMC40kE0oW1beTDMu75MgCB2vgV8bYeTNWfeuFeYNIHZqIMEhYac4L1tqo5vwjhx00mUIO2W2a');
const express = require('express');
const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*' /* 'YOUR-DOMAIN.TLD' */); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());
app.use(express.static('.'));

app.post('/create-intent', async (req, res) => {
    const { amount, currency } = req.body || {};

    if (!amount || !currency)
        return res.status(500).send(`Internal Server Error: amount and currency has to be specified. Values are { amount: "${amount}", currency: ${currency} }`);

    const intent = await stripe.paymentIntents.create({
        /* amount: 1099,
        currency: 'eur', */
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: intent.client_secret });
});

app.listen(3001, () => {
    console.log('Running on port 3001');
});
