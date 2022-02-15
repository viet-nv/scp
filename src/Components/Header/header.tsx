import React from 'react'
import { View, ViewStyle, TextStyle } from 'react-native'
import { HeaderProps } from './header.props'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Button, useTheme, Text } from 'native-base'

// static styles
const ROOT: ViewStyle = {
  flexDirection: 'row',
  height: 56,
  alignItems: 'center',
  justifyContent: 'flex-start',
}
const TITLE: TextStyle = {
  textAlign: 'center',
  fontSize: 16,
  fontWeight: '500',
}
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: 'center' }
const LEFT: ViewStyle = { width: 20, height: 56, paddingHorizontal: 16 }
const RIGHT: ViewStyle = { width: 20, height: 56, paddingHorizontal: 16 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export const Header = (props: HeaderProps) => {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    style,
    titleStyle,
    iconColor,
    title,
  } = props
  const { colors } = useTheme()

  return (
    <View style={[ROOT, style]}>
      {leftIcon ? (
        <Button
          variant="link"
          onPress={onLeftPress}
          style={{ paddingHorizontal: 16, height: 56 }}
        >
          <Ionicons
            name={leftIcon}
            size={20}
            color={iconColor || colors.white}
          />
        </Button>
      ) : (
        <View style={LEFT} />
      )}
      <View style={TITLE_MIDDLE}>
        <Text style={[TITLE, titleStyle]}>{title}</Text>
      </View>
      {rightIcon ? (
        <Button
          variant="link"
          onPress={onRightPress}
          style={{ paddingHorizontal: 16, height: 56 }}
        >
          <Ionicons name={rightIcon} size={20} />
        </Button>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}
