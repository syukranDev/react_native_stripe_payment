import { View, Text, Button, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';

const API_URL = 'http://localhost:3003'


const CheckoutV2Screen = () => {
    const router = useRouter();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
  
    const fetchPaymentSheetParams = async () => {
      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { paymentIntent, ephemeralKey, customer} = await response.json();
  
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    };
  
    const initializePaymentSheet = async () => {
      const {
        paymentIntent,
        ephemeralKey,
        customer,
        // publishableKey,
      } = await fetchPaymentSheetParams();
  
      const { error } = await initPaymentSheet({
        merchantDisplayName: "SyukranDev Sdn Bhd",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        // defaultBillingDetails: { //auto fill bila pops name keluar
        //   name: 'Jane Doe',

        // },
        returnURL: 'https://localhost:3333/'
      });
      if (!error) {
        setLoading(true);
      }
    };
  
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
    
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
          router.push('checkout/failed')
        } else {
          Alert.alert('Success', 'Your order is confirmed!');
          router.push('checkout/success')
        }
      };
  
    useEffect(() => {
      initializePaymentSheet();
    }, []);
  
    return (
      <View className="flex-1 justify-center text-center">
        <Button
          variant="primary"
          disabled={!loading}
          title="Click me to Checkout V2"
          onPress={openPaymentSheet}
        />
      </View>
    );
}

export default CheckoutV2Screen