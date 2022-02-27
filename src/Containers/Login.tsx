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
import { Text, Button, useTheme } from 'native-base'

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
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 20,
}

const BODY: ViewStyle = {
  flex: 3,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  paddingHorizontal: 20,
  paddingVertical: 30,
  backgroundColor: 'white',
}

const LOGO: ImageStyle = {
  alignSelf: 'center',
  width: 200,
  height: 108,
}

const INPUT_ROW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
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
    await login({ username, password: hash }).unwrap()
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
          style={{
            marginBottom: 24,
            fontWeight: '500',
            textAlign: 'center',
            fontSize: 18,
          }}
        >
          Login to continue
        </Text>
        <Text>Username</Text>
        <View style={INPUT_ROW}>
          <Ionicons name="md-person-outline" size={20} color={colors.text} />
          <TextInput
            style={TEXT_INPUT}
            placeholder="Enter your username..."
            autoCapitalize="none"
            placeholderTextColor={colors.subText}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <Text style={{ marginTop: 24 }}>Password</Text>
        <View style={INPUT_ROW}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.text} />
          <TextInput
            style={TEXT_INPUT}
            placeholder="Enter your password..."
            autoCapitalize="none"
            placeholderTextColor={'gray'}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(prev => !prev)}>
            {!showPass ? (
              <Ionicons name="eye-off" color={colors.subText} size={20} />
            ) : (
              <Ionicons name="eye" color={colors.subText} size={20} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={{ color: colors.primary['500'], marginTop: 16 }}>
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
