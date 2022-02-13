import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ExampleContainer } from '@/Containers'
import { useTheme } from 'native-base'
import { Platform } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  const { colors } = useTheme()
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary['500'],
        tabBarInactiveTintColor: colors.gray['500'],
        tabBarStyle: {
          backgroundColor: 'white',
          // borderTopColor: colors.gray['500'],
          // borderTopWidth: 0.5,
          // paddingTop: 4,
          // ...(Platform.OS === 'android' && {
          //   paddingBottom: 4,
          // }),
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
              color={focused ? colors.primary['500'] : colors.gray['500']}
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
