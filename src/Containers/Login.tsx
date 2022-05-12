import React, { useState } from 'react'
import {
  Alert,
  ImageStyle,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { sha256 } from 'react-native-sha256'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { Input, Text, Button, useTheme, Icon } from 'native-base'

import { AutoImage } from '../Components/AutoImage'
import { Screen } from '@/Components/Screen/screen'
import { Colors } from '@/Theme/Variables'
import { useLoginMutation } from '@/Services/auth'
import { useLazyGetMeQuery } from '@/Services/users'

const logo = require('../Assets/Images/scp-logo.png')

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
  width: 250,
  height: 120,
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

  return (
    <Screen style={ROOT} preset="fixed" backgroundColor={colors.navBackground}>
      <View style={HEADER}>
        <AutoImage source={logo} style={LOGO} />
      </View>

      <View style={BODY}>
        <Text
          color={Colors.white}
          style={{
            marginBottom: 24,
            fontWeight: '500',
            textAlign: 'center',
            fontSize: 18,
          }}
        >
          Login to continue
        </Text>
        <Text marginBottom="10px" color={Colors.white}>
          Username
        </Text>
        <Input
          placeholder="Enter your username..."
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

        <Text style={{ marginTop: 24, marginBottom: 10 }} color={Colors.white}>
          Password
        </Text>
        <Input
          style={TEXT_INPUT}
          placeholder="Enter your password..."
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
            style={{ color: Colors.white, marginTop: 16 }}
            textAlign="right"
          >
            Forgot password?
          </Text>
        </TouchableOpacity>

        <Button
          testID="next-screen-button"
          onPress={handleLogin}
          style={LOGIN_BTN}
          isLoading={isLoading}
        >
          Login
        </Button>
      </View>
    </Screen>
  )
}
