const express = require('express')
const app = express();
const PORT = 3003

// 4000 0025 0000 3155 - OK NEED 3D PIN
// 4242 4242 4242 4242 - OK 
//

const PUBLISHABLE_KEY = ''
const SECRET_KEY =''

const Stripe = require('stripe')
const stripe = Stripe(SECRET_KEY, {apiVersion: "2020-08-27"})

app.post('/create-payment-intent', async (req, res) => {
    try {
        const paymentIntents = await stripe.paymentIntents.create({
            amount: 200,
            currency: "myr",
            payment_method_types: ['card'], // by default
            // return_url: '' this is handle at UI
        })

        const clientSecret = paymentIntents.client_secret;

        console.log(clientSecret)

        return res.json({
            clientSecret
        })
    } catch (err) {
        console.log('==============')
        console.log(err.message)
        return res.status(500).send({error: err.message})
    }
})

app.post('/payment-sheet', async (req, res) => {
    // const { email, name, phone, address } = req.body;
    let price = '9999'
    let email = 'syukran3@gmail.com'
    let name = "syukran DEV"
    let phone = "+60127353525"
    let address = {
        "city": "Banting",
        "country": "MY",
        "line1": "43, Jalan Abu 12",
        "line2": "",
        "postal_code": "42700",
        "state": "SEL"
      }

    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });
  
    console.log(customers)
    let customer;
    if (customers.data.length > 0) {
      customer = await stripe.customers.update(customers.data[0].id, {
        name,
        phone,
        address
      });
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        phone,
        address
      });
    }

    console.log(customer)

    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2023-10-16'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'myr',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    //   publishableKey: 'pk_test_51OhvjmCNZTiVUYuOLYEruIcWPFhwTXMwW6jIg0xAKpcjlKPUWDAEz3jBsgRW5GlNCChe1755VPkVQZo5UUMCP2zi00XWfdk94s'
    });
  });



app.listen(PORT, () => {
    console.log('Connected to server port ', PORT)
})