import { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface HeaderProps {
  title: string
  /**
   * Icon that should appear on the left
   */
  leftIcon?: string

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  /**
   * Icon that should appear on the right
   */
  rightIcon?: string

  /**
   * What happens when you press the right icon
   */
  onRightPress?(): void

  /**
   * Container style overrides.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Title style overrides.
   */
  titleStyle?: StyleProp<TextStyle>

  iconColor?: string
}
