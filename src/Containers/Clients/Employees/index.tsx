import React from 'react'
import { View, ViewStyle } from 'react-native'

import { Header, Screen } from '@/Components'
import { useTranslation } from 'react-i18next'

import { useWindowDimensions } from 'react-native'
import {
  TabView,
  SceneMap,
  TabBar,
  TabBarIndicator,
  TabBarIndicatorProps,
  Route,
} from 'react-native-tab-view'
import { Text } from 'native-base'
import { Colors } from '@/Theme/Variables'
import { useNavigation } from '@react-navigation/native'
import { useAllEmployees, useOnboardedEmployees } from '@/Store/hooks'
import AllEmployees from './all'

const renderScene = SceneMap({
  first: AllEmployees,
  second: () => <Text>bbb</Text>,
})

const HEADER: ViewStyle = {
  backgroundColor: Colors.navBackground,
}

const TAB_INDICATOR = {
  backgroundColor: Colors.primary,
  height: 3,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  left: 35,
}

export const EmployeeScreen = () => {
  const { t } = useTranslation()
  const layout = useWindowDimensions()
  const navigation: any = useNavigation()

  const { total_record: totalEmployees } = useAllEmployees()
  const { total_record: totalOnboardedEmployees } = useOnboardedEmployees()

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: t`enterpriseScreen.all` },
    { key: 'second', title: t`enterpriseScreen.onboarded` },
  ])

  const renderIndicator = (indicatorProps: TabBarIndicatorProps<Route>) => {
    const width = indicatorProps.getTabWidth(index) - 70
    return <TabBarIndicator {...indicatorProps} width={width} />
  }

  const renderLabel = (labelProps: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          color: labelProps.focused ? Colors.primary : Colors.white,
          fontSize: 16,
        }}
      >
        {labelProps.route.title}
      </Text>

      <View
        style={{
          backgroundColor: labelProps.focused ? Colors.primary : Colors.white,
          borderRadius: 999,
          width: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 6,
        }}
      >
        <Text
          style={{ color: Colors.navBackground, fontSize: 10, lineHeight: 16 }}
        >
          {labelProps.route.key === 'first'
            ? totalEmployees
            : totalOnboardedEmployees}
        </Text>
      </View>
    </View>
  )

  return (
    <Screen
      preset="fixed"
      statusBackgroundColor={Colors.navBackground}
      backgroundColor={Colors.white}
      statusBar="light-content"
    >
      <Header
        title={t`employeeScreen.title`}
        style={HEADER}
        titleStyle={{ color: Colors.white }}
        leftIcon="arrow-back-outline"
        onLeftPress={() => navigation.goBack()}
      />

      <TabView
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{ backgroundColor: Colors.navBackground }}
            indicatorStyle={TAB_INDICATOR}
            renderLabel={renderLabel}
            renderIndicator={renderIndicator}
          />
        )}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </Screen>
  )
}
