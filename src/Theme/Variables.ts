/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

import { Config } from '@/Config'
import {
  ThemeColors,
  ThemeFontSize,
  ThemeMetricsSizes,
  ThemeNavigationColors,
} from '@/Theme/theme.type'

/**
 * Colors
 */
export const Colors: ThemeColors = {
  // Example colors:
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  primary: Config.APP === 'epayz' ? '#B11116' : '#25bec3',
  border: '#E7E7E9',
  subText: '#6E6D7A',
  text: '#333333',
  navBackground: Config.APP === 'epayz' ? '#B11116' : '#1c2b4d',
  background: '#E6E6E6',
  lightGray: '#F7F8FA',
  link: '#1890FF',

  success: '#28a745',
  error: '#dc3545',
  warning: '#FBA928',
  disabledBackground: '#525252',
}

export const NavigationColors: Partial<ThemeNavigationColors> = {
  primary: Colors.primary,
}

/**
 * FontSize
 */
export const FontSize: ThemeFontSize = {
  small: 16,
  regular: 20,
  large: 40,
}

/**
 * Metrics Sizes
 */
const tiny = 5 // 10
const small = tiny * 2 // 10
const regular = tiny * 3 // 15
const large = regular * 2 // 30
export const MetricsSizes: ThemeMetricsSizes = {
  tiny,
  small,
  regular,
  large,
}

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
}
