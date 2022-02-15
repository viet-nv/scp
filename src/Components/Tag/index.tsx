import React from 'react'
import { Text, View } from 'react-native'

function Tag({
  text,
  backgroundColor,
  textColor,
}: {
  text: string
  backgroundColor: string
  textColor: string
}) {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontSize: 10,
          fontWeight: '500',
        }}
      >
        {text}
      </Text>
    </View>
  )
}

export default Tag
