import React from 'react'
import { TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { RootStackParamList } from '@/Navigators/utils'
import { Colors } from '@/Theme/Variables'
import { Header, Icon, Screen } from '@/Components'

import { Text } from 'native-base'

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

export const ClientScreen: React.FC<
  StackScreenProps<RootStackParamList, 'Clients'>
> = ({ navigation }) => {
  const { t } = useTranslation()
  return (
    <Screen
      preset="scroll"
      statusBackgroundColor={Colors.navBackground}
      backgroundColor={Colors.white}
      statusBar="light-content"
    >
      <Header
        title={t`clientScreen.title`}
        style={HEADER}
        titleStyle={{ color: Colors.white }}
      />
      <TouchableOpacity
        style={ROW}
        onPress={() => navigation.navigate('Enterprise')}
      >
        <Icon icon="enterprise" style={{ width: 36, height: 36 }} />
        <Text style={ROW_TEXT}>{t`clientScreen.enterprise`}</Text>

        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity style={ROW}>
        <Icon icon="user-group" style={{ width: 36, height: 36 }} />
        <Text style={ROW_TEXT}>{t`clientScreen.employee`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity style={ROW}>
        <Icon icon="handshake" style={{ width: 36, height: 36 }} />
        <Text style={ROW_TEXT}>{t`clientScreen.referralPartner`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>
    </Screen>
  )
}
