import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native'

const API_URL = 'http://localhost:3003'

const StripeApp = () => {
    const [email, setEmail] = useState('')
    const [cardDetails, setCardDetails] = useState('')
    const { confirmPayment, loading} = useConfirmPayment();

    const fetchPaymentIntentClientSecret = async () => {
      let options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }
      }
      const response = await fetch(`${API_URL}/create-payment-intent`, options)

      const { clientSecret, error } = await response.json();
      return { clientSecret, error}
    }

      const handlePayButton = async () => {
      if (!cardDetails?.complete || !email ){
        Alert.alert('Please complete card details and email');
        return
      }

      const billingDetails = {
        email: email,
        name: 'Jenny Rosen',
        phone: '+4915142321555',
        address: {
          line1: 'Alexanderplatz 1',
          line2: 'testing afjsn',
          city: 'Berlin',
          postal_code: '10551',
          country: 'DE',
        },
      }

      // fetch intent client secret from nodejs backend
      try {
        const { clientSecret, error } = await fetchPaymentIntentClientSecret();

        if (error) {
          console.log("Unable to process payment")
        } else {
          //do confirmPaymentIntent in here as we want to push to next screen, if make at nodejs need to declare return_url ?
          const { paymentIntent, error }= await confirmPayment(clientSecret, {
            paymentMethodType: "Card",
            billingDetails: billingDetails
          })

          console.log(error)

          if (error) {
            alert(`Payment Confirmation Error - ${error.localizedMessage}`)
            console.log({
              localizedMessage: error.localizedMessage,
              message: error.message
            })
          } else if (paymentIntent) {
            alert('Payment Succesful')
            console.log(paymentIntent)
          }
        }

          } catch (err) { 
            console.log(err)
      }
    }

    return (
      <View className="flex-1 justify-center items-center mx-2">
        <TextInput
          autoCapitalize='none'
          placeholder='Email'
          keyboardType='email-address'
          onChange={(e) => setEmail(e.nativeEvent.text)}
          className=" text-lg h-50 p-2 rounded-md  bg-neutral-200 w-full"
        />

        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.card}
          style={styles.cardContainer}
          onCardChange={cardDetails => {
            setCardDetails(cardDetails);
          }}
          // onFocus={focusedField => {
          //   console.log('focusField', focusedField);
          // }}
        />
        <Button onPress={handlePayButton} title='Pay Now' disabled={loading}></Button>
      </View>
      
    )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000'
  },
  cardContainer: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  }
})

export default StripeApp