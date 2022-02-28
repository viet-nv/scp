import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ExampleContainer } from '@/Containers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Platform } from 'react-native'
import { ClientScreen } from '@/Containers/Clients'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { EnterpriseScreen } from '@/Containers/Clients/Enterprise'
import CreateNewEnterprise from '@/Containers/Clients/Enterprise/create'
import EnterpriseDetail from '@/Containers/Clients/Enterprise/detail'
import UpdateEnterprise from '@/Containers/Clients/Enterprise/update'
import ClientReport from '@/Containers/Clients/Enterprise/clientReport'
import AddNewClientReport from '@/Containers/Clients/Enterprise/AddNewClientReport'
import BankAccount from '@/Containers/Clients/Enterprise/BankAccount'
import AddUpdateBank from '@/Containers/Clients/Enterprise/AddUpdateBank'
import FrequencyUpdateNotice from '@/Containers/Clients/Enterprise/FrequencyUpdateNotice'
import AssignedAccount from '@/Containers/Clients/Enterprise/AssignedAccount'
import LegalDocuments from '@/Containers/Clients/Enterprise/LegalDocuments'
import { EmployeeScreen } from '@/Containers/Clients/Employees'

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
          let iconName = ''
          if (route.name === 'Home') {
            iconName = !focused ? 'home-outline' : 'home'
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'time' : 'time-outline'
          } else if (route.name === 'Clients') {
            iconName = focused ? 'people' : 'people-outline'
          } else {
            iconName = focused ? 'grid' : 'grid-outline'
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
        component={ExampleContainer}
        options={{ title: t`home.title` }}
      />
      <Tab.Screen
        name="Transactions"
        component={ExampleContainer}
        options={{ title: t`transactionScreen.title` }}
      />
      <Tab.Screen
        name="Clients"
        component={ClientScreen}
        options={{ title: t`clientScreen.title` }}
      />
      <Tab.Screen
        name="Menu"
        component={ExampleContainer}
        options={{ title: 'Menu' }}
      />
    </Tab.Navigator>
  )
}

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      initialRouteName="Main"
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Enterprise" component={EnterpriseScreen} />
      <Stack.Screen name="AddNewEnterprise" component={CreateNewEnterprise} />
      <Stack.Screen name="EnterpriseDetail" component={EnterpriseDetail} />
      <Stack.Screen name="UpdateEnterprise" component={UpdateEnterprise} />

      <Stack.Screen name="ClientReport" component={ClientReport} />
      <Stack.Screen name="AddNewClientReport" component={AddNewClientReport} />

      <Stack.Screen name="BankAccount" component={BankAccount} />
      <Stack.Screen name="AddUpdateBank" component={AddUpdateBank} />

      <Stack.Screen
        name="FrequencyUpdateNotice"
        component={FrequencyUpdateNotice}
      />
      <Stack.Screen name="AssignedAccount" component={AssignedAccount} />
      <Stack.Screen name="LegalDocuments" component={LegalDocuments} />

      <Stack.Screen name="Employees" component={EmployeeScreen} />
    </Stack.Navigator>
  )
}

export default MainNavigator
