import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { navigateAndSimpleReset } from '@/Navigators/utils'

const StartupContainer = () => {
  const { Layout, Gutters, Fonts, Colors } = useTheme()

  const { t } = useTranslation()

  // const init = async () => {
  //   await new Promise(resolve =>
  //     setTimeout(() => {
  //       resolve(true)
  //     }, 10000),
  //   )
  //   // navigateAndSimpleReset('login')
  // }

  // useEffect(() => {
  //   init()
  // })

  return (
    <View
      style={[
        Layout.fill,
        Layout.colCenter,
        { backgroundColor: Colors.navBackground },
      ]}
    >
      <Brand />
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
    </View>
  )
}

export default StartupContainer
