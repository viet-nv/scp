import React from 'react'
import { Alert, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { RootStackParamList } from '@/Navigators/utils'
import { Colors } from '@/Theme/Variables'
import { Header, Icon, Screen } from '@/Components'

import { Actionsheet, Text, useDisclose } from 'native-base'
import { logout } from '@/Store/auth'
import { useAppDispatch } from '@/Store/hooks'
import { useLogoutMutation } from '@/Services/auth'

const HEADER: ViewStyle = {
  backgroundColor: Colors.navBackground,
}

const ROW: ViewStyle = {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
  paddingLeft: 20,
  paddingRight: 12,
  paddingVertical: 12,
  alignItems: 'center',
}

const ROW_TEXT: TextStyle = {
  fontSize: 16,
  marginLeft: 20,
  flex: 1,
}

export const MenuScreen: React.FC<
  StackScreenProps<RootStackParamList, 'Transactions'>
> = ({ navigation }) => {
  const { t, i18n } = useTranslation()

  const dispatch = useAppDispatch()
  const [logoutServer] = useLogoutMutation()
  const { isOpen, onClose, onOpen } = useDisclose()
  return (
    <Screen
      preset="scroll"
      statusBackgroundColor={Colors.navBackground}
      backgroundColor={Colors.white}
      statusBar="light-content"
    >
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              i18n.changeLanguage('vi')
              onClose()
            }}
          >
            🇻🇳 Tiếng Việt
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              onClose()
              i18n.changeLanguage('en')
            }}
          >
            🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿 English
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <Header
        title={t`menuScreen.headerTitle`}
        style={HEADER}
        titleStyle={{ color: Colors.white }}
      />
      <TouchableOpacity
        style={ROW}
        // onPress={() => navigation.navigate('PayingTransaction')}
      >
        <Icon
          icon="enterprise"
          style={{ width: 30, height: 30, marginRight: 2 }}
        />
        <Text style={ROW_TEXT}>{t`menuScreen.companyInfo`}</Text>

        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={ROW}
        // onPress={() => navigation.navigate('PaidTransaction')}
      >
        <Ionicons
          name="person-circle-outline"
          size={32}
          color={Colors.primary}
        />
        <Text
          style={[ROW_TEXT, { marginLeft: 20 }]}
        >{t`menuScreen.accountInfo`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity style={ROW} onPress={() => onOpen()}>
        <Ionicons name="language" size={30} color={Colors.primary} />
        <Text
          style={[ROW_TEXT, { marginLeft: 24 }]}
        >{t`menuScreen.changeLanguage`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={ROW}
        onPress={() => {
          Alert.alert(t`common.confirmation`, t`common.areYouSure`, [
            {
              text: t`common.cancel`,
              style: 'destructive',
            },
            {
              text: t`menuScreen.logout`,
              onPress: async () => {
                try {
                  logoutServer()
                } catch (e) {
                  console.log('Call logout api failed', e)
                }
                dispatch(logout())
              },
            },
          ])
        }}
      >
        <Ionicons name="power" size={30} color={Colors.primary} />
        <Text
          style={[ROW_TEXT, { marginLeft: 24 }]}
        >{t`menuScreen.logout`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>
    </Screen>
  )
}
