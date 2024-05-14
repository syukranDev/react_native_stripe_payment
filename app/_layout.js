import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen
            name='index'
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name='checkout/v1/index'
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name='checkout/v2/index'
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name='checkout/success/index'
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen
            name='checkout/failed/index'
            options={{
                headerShown: false
            }}
        />
    </Stack>
  )
}

export default Layout