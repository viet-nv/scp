import { Colors } from '@/Theme/Variables'
import { Box, Text } from 'native-base'
import React, { ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'

export const TagOutline = ({
  active,
  children,
  onPress,
}: {
  active: boolean
  children: ReactNode
  onPress?: () => void
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        borderWidth={1}
        borderColor={active ? Colors.primary : Colors.border}
        color={active ? Colors.primary : Colors.text}
        paddingX="6px"
        paddingY="4px"
        position="relative"
        borderRadius="4"
        overflow="hidden"
      >
        <Text fontSize="12" color={(active && Colors.primary) || undefined}>
          {children}
        </Text>

        {active && (
          <>
            <Box
              position="absolute"
              top="-1px"
              right="-1px"
              width={0}
              height={0}
              borderTopRightRadius="4px"
              borderTopWidth="0"
              borderLeftWidth="0"
              borderRightWidth="16px"
              borderBottomWidth="16px"
              borderColor={'transparent'}
              borderRightColor={Colors.primary}
            />
            <Box position="absolute" top="-2px" right="0">
              <Text fontSize={8} color={Colors.white}>
                ✓
              </Text>
            </Box>
          </>
        )}
      </Box>
    </TouchableOpacity>
  )
}

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
        paddingVertical: 2,
        paddingHorizontal: 6,
        alignItems: 'center',
      }}
    >
      <Text color={textColor} fontWeight="500" fontSize="10">
        {text}
      </Text>
    </View>
  )
}

export default Tag
