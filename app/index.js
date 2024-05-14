import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { StripeProvider } from '@stripe/stripe-react-native'
import { useRouter } from 'expo-router'

const HomePageScreen = () => {
  const router = useRouter()
  return (
    <StripeProvider 
      publishableKey=''
    >
       
        <View className="flex-1 justify-center items-center">
          <TouchableOpacity className="bg-neutral-800 p-3 border rounded-lg mb-10" onPress={() => router.push('checkout/v1')}>
            <Text className="text-white text-lg font-semibold">Checkout V1</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-neutral-800 p-3 border rounded-lg" onPress={() => router.push('checkout/v2')}>
            <Text className="text-white text-lg font-semibold">Checkout V2</Text>
          </TouchableOpacity>
        </View>
    </StripeProvider>
  )
}

export default HomePageScreen