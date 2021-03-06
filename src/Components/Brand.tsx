import React from 'react'
import { View, Image } from 'react-native'
import { useTheme } from '@/Hooks'
import { Config } from '@/Config'

interface Props {
  height?: number | string
  width?: number | string
  mode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center'
}

const logo = require('../Assets/Images/scp-logo.png')
const epayzGray = require('../Assets/Images/epayz-gray.png')

const Brand = ({ height, width, mode }: Props) => {
  const { Layout } = useTheme()

  return (
    <View style={{ height, width }}>
      <Image
        style={Layout.fullSize}
        source={Config.APP === 'epayz' ? epayzGray : logo}
        resizeMode={mode}
      />
    </View>
  )
}

Brand.defaultProps = {
  height: 200,
  mode: 'contain',
  width: 300,
}

export default Brand
