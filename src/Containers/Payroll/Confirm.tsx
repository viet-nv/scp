import { Header, Screen } from '@/Components'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  View,
  VStack,
} from 'native-base'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useGetTransactionDetailQuery,
  useTransactionOtpMutation,
} from '@/Services/transaction'
import OTPInputView from '@Components/OTPTextView'
import { useAppSelector } from '@/Store/hooks'
import { formatNum } from '@/Utils'

function ConfirmRequest() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()
  const { user } = useAppSelector(state => state.auth)

  const { data, isLoading, refetch } = useGetTransactionDetailQuery(
    route.params.id,
  )

  const [sendOtp, { isLoading: sending }] = useTransactionOtpMutation()
  const [code, setCode] = useState('')

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`CONFIRM INFORMATION`}
          style={{
            backgroundColor: Colors.navBackground,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
          }}
          titleStyle={{ color: Colors.white }}
          leftIcon="arrow-back-outline"
          onLeftPress={() => navigation.goBack()}
        />

        {sending && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: '#000000',
              opacity: 0.2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 80 }} />
        ) : (
          <ScrollView
            style={{
              marginTop: 56,
              marginBottom: insets.bottom + 80,
            }}
          >
            <View padding="16px">
              <VStack space="8px">
                <Flex flexDirection="row" justifyContent="space-between">
                  <Text color={Colors.subText}>{t`Company`}</Text>
                  <Text>{data?.enterprise.name}</Text>
                </Flex>
                <Divider />

                <Flex flexDirection="row" justifyContent="space-between">
                  <Text color={Colors.subText}>{t`Account number`}</Text>
                  <Text>{data?.bank_account_number}</Text>
                </Flex>
                <Divider />

                <Flex flexDirection="row" justifyContent="space-between">
                  <Text color={Colors.subText}>{t`Account Holder`}</Text>
                  <Text>{data?.bank_name}</Text>
                </Flex>
                <Divider />

                <Flex flexDirection="row" justifyContent="space-between">
                  <Text color={Colors.subText}>{t`No. of future labour`}</Text>
                  <Text>{data?.employee.name}</Text>
                </Flex>
                <Divider />

                <Flex flexDirection="row" justifyContent="space-between">
                  <Text color={Colors.subText}>{t`Payment Amount`}</Text>
                  <Text>{formatNum(data?.payment_amount || 0)}</Text>
                </Flex>
                <Divider />
                <Text>{t(`sendOtpMsg`, { phone: user?.phone })}</Text>
              </VStack>

              <VStack>
                <OTPInputView
                  pinCount={6}
                  onCodeFilled={code => {
                    sendOtp({ id: route.params.id, otp: code }).then(
                      (res: any) => {
                        if (res.error)
                          Alert.alert(t`common.error`, t`common.errorMsg`)
                      },
                    )
                  }}
                />
              </VStack>
            </View>
          </ScrollView>
        )}
      </Screen>
    </>
  )
}

export default ConfirmRequest
