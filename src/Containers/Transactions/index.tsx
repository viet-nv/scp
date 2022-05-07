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

export const TransactionScreen: React.FC<
  StackScreenProps<RootStackParamList, 'Transactions'>
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
        title={t`transactionScreen.headerTitle`}
        style={HEADER}
        titleStyle={{ color: Colors.white }}
      />
      <TouchableOpacity
        style={ROW}
        onPress={() => navigation.navigate('PayingTransaction')}
      >
        <Icon icon="payment-waiting" style={{ width: 36, height: 36 }} />
        <Text style={ROW_TEXT}>{t`transactionScreen.payingTransaction`}</Text>

        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={ROW}
        onPress={() => navigation.navigate('PaidTransaction')}
      >
        <Icon icon="payment-done" style={{ width: 32, height: 32 }} />
        <Text
          style={[ROW_TEXT, { marginLeft: 24 }]}
        >{t`transactionScreen.paidTransaction`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={ROW}
        onPress={() => navigation.navigate('WaitForSettlementTransaction')}
      >
        <Icon icon="settlement" style={{ width: 32, height: 32 }} />
        <Text
          style={[ROW_TEXT, { marginLeft: 24 }]}
        >{t`transactionScreen.waitingForSettlement`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={ROW}
        onPress={() => navigation.navigate('SettledTransaction')}
      >
        <Icon icon="settled" style={{ width: 32, height: 32 }} />
        <Text
          style={[ROW_TEXT, { marginLeft: 24 }]}
        >{t`transactionScreen.settledTransaction`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>
    </Screen>
  )
}
