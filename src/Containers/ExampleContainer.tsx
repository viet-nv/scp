import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { Button, Text } from 'native-base'
import { useLogoutMutation } from '@/Services/auth'
import { useAppDispatch } from '@/Store/hooks'
import { Screen } from '@/Components/Screen/screen'
import { logout } from '@/Store/auth'

const ExampleContainer = () => {
  const { t, i18n } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Colors } = useTheme()
  const dispatch = useAppDispatch()

  const [userId, setUserId] = useState('9')
  const [
    fetchOne,
    { data, isSuccess, isLoading, isFetching, error },
  ] = useLazyFetchOneQuery()

  useEffect(() => {
    fetchOne(userId)
  }, [fetchOne, userId])

  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }))
  }

  const [logoutServer] = useLogoutMutation()

  return (
    <Screen preset="scroll" statusBackgroundColor={Colors.navBackground}>
      <ScrollView
        style={Layout.fill}
        contentContainerStyle={[
          Layout.fill,
          Layout.colCenter,
          Gutters.smallHPadding,
        ]}
      >
        <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
          <Brand />
          {(isLoading || isFetching) && <ActivityIndicator />}
          {!isSuccess ? (
            <Text style={Fonts.textRegular}>{error}</Text>
          ) : (
            <Text style={Fonts.textRegular}>
              {t('example.helloUser', { name: data?.name })}
            </Text>
          )}
        </View>
        <View
          style={[
            Layout.row,
            Layout.rowHCenter,
            Gutters.smallHPadding,
            Gutters.largeVMargin,
            Common.backgroundPrimary,
          ]}
        >
          <Text style={[Layout.fill, Fonts.textCenter, Fonts.textSmall]}>
            {t('example.labels.userId')}
          </Text>
          <TextInput
            onChangeText={setUserId}
            editable={!isLoading}
            keyboardType={'number-pad'}
            maxLength={1}
            value={userId}
            selectTextOnFocus
            style={[Layout.fill, Common.textInput]}
          />
        </View>
        <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
          DarkMode :
        </Text>

        <TouchableOpacity
          style={[Common.button.rounded, Gutters.regularBMargin]}
          onPress={() => onChangeTheme({ darkMode: null })}
        >
          <Text style={Fonts.textRegular}>Auto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Common.button.outlineRounded, Gutters.regularBMargin]}
          onPress={() => onChangeTheme({ darkMode: true })}
        >
          <Text style={Fonts.textRegular}>Dark</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Common.button.outline, Gutters.regularBMargin]}
          onPress={() => onChangeTheme({ darkMode: false })}
        >
          <Text style={Fonts.textRegular}>Light</Text>
        </TouchableOpacity>

        <Button
          onPress={() => {
            i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')
          }}
        >
          Change Languages
        </Button>
        <Button
          onPress={async () => {
            try {
              await logoutServer()
            } catch (e) {
              console.log('Call logout api failed', e)
            }
            dispatch(logout())
          }}
        >
          Logout
        </Button>
      </ScrollView>
    </Screen>
  )
}

export default ExampleContainer
