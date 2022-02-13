import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ExampleContainer } from '@/Containers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Platform } from 'react-native'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
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
        component={ExampleContainer}
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

export default MainNavigator
