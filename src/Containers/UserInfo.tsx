import React from 'react'
import { ViewStyle } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useTranslation } from 'react-i18next'
import { Colors } from '@/Theme/Variables'
import { Header, Screen } from '@/Components'

import { Divider, Flex, HStack, Text, VStack } from 'native-base'
import { useAppSelector } from '@/Store/hooks'
import { useNavigation } from '@react-navigation/native'

const HEADER: ViewStyle = {
  backgroundColor: Colors.navBackground,
}

export const UserInfo = () => {
  const { t } = useTranslation()

  const navigation = useNavigation()
  const { user } = useAppSelector(state => state.auth)

  return (
    <Screen
      preset="scroll"
      statusBackgroundColor={Colors.navBackground}
      backgroundColor={Colors.white}
      statusBar="light-content"
    >
      <Header
        title={t`User Information`}
        style={HEADER}
        leftIcon="arrow-back-outline"
        titleStyle={{ color: Colors.white }}
        onLeftPress={() => navigation.goBack()}
      />
      <Flex alignItems="center" justifyContent={'center'} marginTop="16px">
        <Ionicons
          name="person-circle-outline"
          size={100}
          color={Colors.primary}
        />
      </Flex>

      <VStack padding="12px">
        <HStack justifyContent="space-between" paddingY="12px">
          <Text color={Colors.subText}>{t`Name`}</Text>
          <Text>{user?.fullname}</Text>
        </HStack>
        <Divider />

        <HStack justifyContent="space-between" paddingY="12px">
          <Text color={Colors.subText}>{t`Phone`}</Text>
          <Text>{user?.phone}</Text>
        </HStack>
        <Divider />

        <HStack justifyContent="space-between" paddingY="12px">
          <Text color={Colors.subText}>{t`Email`}</Text>
          <Text>{user?.email}</Text>
        </HStack>

        <Divider />

        <HStack justifyContent="space-between" paddingY="12px">
          <Text color={Colors.subText}>{t`ID Card No.`}</Text>
          <Text>{user?.id_card}</Text>
        </HStack>

        <Divider />
      </VStack>
    </Screen>
  )
}
