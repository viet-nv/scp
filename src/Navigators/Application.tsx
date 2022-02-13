import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { StartupContainer } from '@/Containers'
import { useTheme } from '@/Hooks'
import MainNavigator from './Main'
import { navigationRef } from './utils'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import { useAppSelector } from '@/Store/hooks'
import { LoginScreen } from '@/Containers/Login'

const AuthStackNavigator = createStackNavigator<{ login: undefined }>()

const AuthStack = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="login"
    >
      <AuthStackNavigator.Screen name="login" component={LoginScreen} />
    </AuthStackNavigator.Navigator>
  )
}

const Stack = createStackNavigator()

// @refresh reset
const ApplicationNavigator = () => {
  const { NavigationTheme } = useTheme()
  const { accessToken } = useAppSelector(state => state.auth)

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        {!accessToken ? (
          <AuthStack />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Startup" component={StartupContainer} />
            <Stack.Screen
              name="Main"
              component={MainNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default ApplicationNavigator
