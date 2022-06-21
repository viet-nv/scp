import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Platform } from 'react-native'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { MenuScreen } from '@/Containers/Menu'
import { Icon } from '@/Components'
import Payroll from '@/Containers/Payroll'
import TransactionNotice from '@/Containers/Payroll/TransactionNotice'
import RequestPayroll from '@/Containers/Payroll/Request'
import ConfirmRequest from '@/Containers/Payroll/Confirm'
import Contract from '@/Containers/Contract'
import { UserInfo } from '@/Containers/UserInfo'
import EmployeeHome from '@/Containers/EmployeeHome'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const TabNavigator = () => {
  const { Colors } = useTheme()
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.subText,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
          paddingTop: 2,
          ...(Platform.OS === 'android' && {
            paddingBottom: 2,
          }),
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarHideOnKeyboard: true,

        tabBarIcon: ({ focused, size }) => {
          if (route.name === 'Payroll')
            return focused ? (
              <Icon
                icon="dollar-circle"
                style={{ width: size - 2, height: size - 2 }}
              />
            ) : (
              <Icon
                icon="dollar-circle-outline"
                style={{ width: size - 2, height: size - 2 }}
              />
            )
          let iconName = ''
          if (route.name === 'Home') {
            iconName = !focused ? 'home-outline' : 'home'
          } else if (route.name === 'Contract') {
            iconName = focused ? 'md-document-text' : 'md-document-text-outline'
          } else {
            iconName = focused ? 'person' : 'person-outline'
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? Colors.primary : Colors.subText}
            />
          )
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={EmployeeHome}
        options={{ title: t`home.title` }}
      />
      <Tab.Screen
        name="Payroll"
        component={Payroll}
        options={{ title: t`employeeApp.payroll` }}
      />
      <Tab.Screen
        name="Contract"
        component={Contract}
        options={{ title: t`employeeApp.contract` }}
      />
      <Tab.Screen
        name="AccountManagement"
        component={MenuScreen}
        options={{ title: t`employeeApp.account` }}
      />
    </Tab.Navigator>
  )
}

// @refresh reset
const EmployeeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      initialRouteName="EmployeeMain"
    >
      <Stack.Screen name="EmployeeMain" component={TabNavigator} />
      <Stack.Screen name="TransactionNotice" component={TransactionNotice} />
      <Stack.Screen name="RequestPayroll" component={RequestPayroll} />
      <Stack.Screen name="ConfirmRequest" component={ConfirmRequest} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
    </Stack.Navigator>
  )
}

export default EmployeeNavigator
