import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { useTheme } from '@/Hooks'
import MainNavigator from './Main'
import { navigationRef } from './utils'
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import { useAppSelector } from '@/Store/hooks'
import { LoginScreen } from '@/Containers/Login'
import EmployeeNavigator from './Employee'

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
  const { accessToken, user } = useAppSelector(state => state.auth)

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        {!accessToken || !user ? (
          <AuthStack />
        ) : user?.role.name === 'EMPLOYEE' ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="EmployeeApp"
              component={EmployeeNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="App"
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
