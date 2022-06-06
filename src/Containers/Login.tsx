import React, { useState } from 'react'
import {
  Alert,
  ImageStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { sha256 } from 'react-native-sha256'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { Input, Text, Button, useTheme, Icon, Flex } from 'native-base'

import { AutoImage } from '../Components/AutoImage'
import { Screen } from '@/Components/Screen/screen'
import { Colors } from '@/Theme/Variables'
import { useLoginMutation } from '@/Services/auth'
import { useLazyGetMeQuery } from '@/Services/users'
import { Config } from '@/Config'
import { useTranslation } from 'react-i18next'

const logo = require('../Assets/Images/scp-logo.png')
const epayzGray = require('../Assets/Images/epayz-gray.png')

const ROOT: ViewStyle = {
  flex: 1,
  position: 'relative',
}

const HEADER: ViewStyle = {
  flex: 2,
  justifyContent: 'center',
  alignItems: 'center',
}

const BODY: ViewStyle = {
  flex: 5,
  paddingHorizontal: 20,
  // backgroundColor: 'white',
}

const LOGO: ImageStyle = {
  alignSelf: 'center',
  width: Config.APP === 'epayz' ? 100 : 250,
  height: Config.APP === 'epayz' ? 140 : 120,
}

const INPUT_ROW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  borderBottomWidth: 1,
  paddingBottom: 8,
}

const TEXT_INPUT = {
  flex: 1,
  paddingLeft: 10,
  color: '#333',
}

const LOGIN_BTN = {
  marginTop: 36,
  backgroundColor: Config.APP === 'epayz' ? Colors.white : undefined,
  width: Config.APP === 'epayz' ? '50%' : undefined,
  borderRadius: 999,
}

export const LoginScreen = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const [login, { isLoading }] = useLoginMutation()
  const [getMe] = useLazyGetMeQuery()

  const handleLogin = async () => {
    if (!username) {
      Alert.alert('Wrong Input!', 'Username cannot be empty.', [
        { text: 'Okay' },
      ])
      return
    }
    if (!password) {
      Alert.alert('Wrong Input!', 'Password cannot be empty.', [
        { text: 'Okay' },
      ])
      return
    }

    const hash = await sha256(password)
    await login({ username, password: hash })
    await getMe()
  }

  const { colors } = useTheme()
  const { t } = useTranslation()

  return (
    <Screen
      style={ROOT}
      preset="fixed"
      backgroundColor={
        Config.APP === 'epayz' ? Colors.primary : colors.navBackground
      }
    >
      <View style={HEADER}>
        <AutoImage
          source={Config.APP === 'epayz' ? epayzGray : logo}
          style={LOGO}
        />
      </View>

      <View style={BODY}>
        <Text
          color={colors.white}
          style={{
            marginBottom: 24,
            fontWeight: '600',
            textAlign: 'center',
            fontSize: 18,
          }}
        >
          {t`Login to continue`}
        </Text>
        <Text marginBottom="10px" color={colors.white} fontWeight="500">
          {t`Username`}
        </Text>
        <Input
          placeholder={t`Enter your username...`}
          autoCapitalize="none"
          backgroundColor={Colors.white}
          placeholderTextColor={colors.subText}
          value={username}
          onChangeText={setUsername}
          InputLeftElement={
            <Icon
              as={<Ionicons name="person-outline" />}
              size={5}
              ml="2"
              color={Colors.subText}
            />
          }
        />

        <Text
          fontWeight="500"
          style={{ marginTop: 24, marginBottom: 10 }}
          color={colors.white}
        >
          {t`Password`}
        </Text>
        <Input
          style={TEXT_INPUT}
          placeholder={t`Enter your password...`}
          autoCapitalize="none"
          placeholderTextColor={colors.subText}
          secureTextEntry={!showPass}
          value={password}
          backgroundColor={Colors.white}
          onChangeText={setPassword}
          InputLeftElement={
            <Icon
              as={<Ionicons name="lock-closed-outline" color={colors.text} />}
              size={5}
              ml="2"
              color={Colors.subText}
            />
          }
          InputRightElement={
            <Icon
              as={<Ionicons name={showPass ? 'eye' : 'eye-off'} />}
              size={6}
              mr="2"
              color="muted.400"
              onPress={() => setShowPass(prev => !prev)}
            />
          }
        />

        <TouchableOpacity>
          <Text
            fontWeight="600"
            style={{
              color: Colors.white,
              marginTop: 16,
            }}
            textAlign="right"
          >
            {t`Forgot password?`}
          </Text>
        </TouchableOpacity>

        <Flex justifyContent={'center'} alignItems="center">
          <Button
            testID="next-screen-button"
            onPress={handleLogin}
            style={LOGIN_BTN}
            isLoading={isLoading}
          >
            <Text
              color={Config.APP === 'epayz' ? '#000000' : ''}
              fontWeight="600"
            >{t`Login`}</Text>
          </Button>
        </Flex>
      </View>
    </Screen>
  )
}
