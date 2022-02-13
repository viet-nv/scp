import * as React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScreenProps } from './screen.props'
import { isNonScrolling, offsets, presets } from './screen.presets'

import { useIsFocused } from '@react-navigation/native'

function FocusAwareStatusBar(props: any) {
  const isFocused = useIsFocused()

  return isFocused ? <StatusBar {...props} /> : null
}

const isIos = Platform.OS === 'ios'

function ScreenWithoutScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets()
  const preset = presets.fixed
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor
    ? { backgroundColor: props.backgroundColor }
    : {}
  const statusBackgroundStyle = props.statusBackgroundColor
    ? { backgroundColor: props.statusBackgroundColor }
    : {}
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle, statusBackgroundStyle]}
      behavior={isIos ? 'padding' : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || 'none']}
    >
      <FocusAwareStatusBar
        barStyle={props.statusBar || 'light-content'}
        backgroundColor={props.statusBackgroundColor || props.backgroundColor}
      />
      <View
        style={[
          preset.outer,
          backgroundStyle,
          statusBackgroundStyle,
          insetStyle,
        ]}
      >
        <View style={[preset.inner, style, backgroundStyle]}>
          {props.children}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

function ScreenWithScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets()
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor
    ? { backgroundColor: props.backgroundColor }
    : {}
  const statusBackgroundStyle = props.statusBackgroundColor
    ? { backgroundColor: props.statusBackgroundColor }
    : {}

  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle, statusBackgroundStyle]}
      behavior={isIos ? 'padding' : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || 'none']}
    >
      <FocusAwareStatusBar
        barStyle={props.statusBar || 'light-content'}
        backgroundColor={props.statusBackgroundColor || props.backgroundColor}
      />
      <View
        style={[
          preset.outer,
          backgroundStyle,
          statusBackgroundStyle,
          insetStyle,
        ]}
      >
        <ScrollView
          style={[preset.outer, backgroundStyle]}
          contentContainerStyle={[preset.inner, style]}
          keyboardShouldPersistTaps={
            props.keyboardShouldPersistTaps || 'handled'
          }
        >
          {props.children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  } else {
    return <ScreenWithScrolling {...props} />
  }
}
