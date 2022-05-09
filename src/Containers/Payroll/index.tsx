import { Screen } from '@/Components'
import { useTheme } from '@/Hooks'
import {
  useGetTransactionLimitQuery,
  useGetTransactionsQuery,
} from '@/Services/transaction'
import { Colors } from '@/Theme/Variables'
import { formatNum } from '@/Utils'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Flex, View, Text, Button, Divider } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TouchableOpacity } from 'react-native'

const Row = ({ item }: { item: any }) => {
  const navigation: any = useNavigation()
  const { t } = useTranslation()

  return (
    <React.Fragment key={item.id}>
      <View paddingY="12px">
        <Flex flexDirection="row" justifyContent="space-between">
          <Text
            color={Colors.subText}
          >{t`transactionScreen.transactionCode`}</Text>
          <Text fontWeight="500">{item.code}</Text>
        </Flex>

        <Flex
          flexDirection="row"
          justifyContent="space-between"
          marginTop="4px"
        >
          <Text color={Colors.subText}>{t`enterpriseScreen.time`}</Text>
          <Text fontWeight="500">
            {dayjs(item.salary_payment_date).format('DD-MM-YYYY HH:mm')}
          </Text>
        </Flex>

        <Flex
          flexDirection="row"
          justifyContent="space-between"
          marginTop="4px"
        >
          <Text color={Colors.subText}>{t`employeeApp.amount`}</Text>
          <Text color={Colors.error} fontWeight="500">
            {formatNum(item.payment_amount)}
          </Text>
        </Flex>
        {item.status !== 'PAYING' && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TransactionNotice', { id: item.id })
            }
          >
            <Text color={Colors.primary} textAlign="right" paddingY="4px">
              {t`employeeApp.notice`}
              {' >'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Divider />
    </React.Fragment>
  )
}
function Payroll() {
  const navigation: any = useNavigation()
  const { Layout, Colors } = useTheme()

  const { t } = useTranslation()

  const { data } = useGetTransactionLimitQuery()

  const { data: pendingData } = useGetTransactionsQuery({
    statuses: 'PAYING',
    size: 100,
  })

  const { data: paidData } = useGetTransactionsQuery({
    statuses: 'PAID,WAIT_SETTLEMENT',
    size: 100,
  })

  return (
    <Screen preset="scroll" statusBackgroundColor={Colors.navBackground}>
      <ScrollView
        style={Layout.fill}
        contentContainerStyle={[Layout.fill, Layout.colCenter]}
      >
        <View
          padding="16px"
          width="100%"
          backgroundColor={Colors.navBackground}
        >
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              fontSize={16}
              color={Colors.white}
            >{t`employeeApp.maxPaymentOfAdvance`}</Text>
            <Text color={Colors.primary} fontWeight="600" fontSize={18}>
              {formatNum(data?.max_advance_amount || 0)}
            </Text>
          </Flex>
          <Flex
            marginTop="4px"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              fontSize={16}
              color={Colors.white}
            >{t`employeeApp.maxLabourOfAdvance`}</Text>
            <Text color={Colors.white} fontWeight="500" fontSize={16}>
              {data?.max_advance_labor} {t`days`}
            </Text>
          </Flex>
        </View>

        <View padding="16px" paddingX="12px" width="100%">
          <View
            style={{
              borderRadius: 8,
              padding: 16,
              backgroundColor: Colors.primary + '33',
            }}
          >
            <Text textAlign="center">
              {t('employeeApp.youStillHave')}{' '}
              <Text fontWeight="500" fontSize={16} color={Colors.error}>
                {formatNum(data?.available_advance_amount || 0)}
              </Text>{' '}
              {t`employeeApp.inYourPayrollAccount`}
            </Text>

            <Button
              marginTop="12px"
              onPress={() => navigation.navigate('RequestPayroll')}
            >{t`employeeApp.continueToAdvance`}</Button>
          </View>

          <Text marginTop="16px" fontWeight="500" fontSize={16}>
            {t`employeeApp.pendingTransaction`}{' '}
            <Text>({pendingData?.data.length})</Text>
          </Text>
          {!pendingData?.data.length ? (
            <Text
              textAlign="center"
              color={Colors.subText}
              padding="16px"
            >{t`common.noDataFound`}</Text>
          ) : (
            pendingData.data.map((item: any) => (
              <Row item={item} key={item.id} />
            ))
          )}

          <Text fontWeight="500" fontSize={16}>
            {t`transactionScreen.paidTransaction`}{' '}
            <Text>({paidData?.data.length})</Text>
          </Text>
          {!paidData?.data.length ? (
            <Text
              textAlign="center"
              color={Colors.subText}
              padding="16px"
            >{t`common.noDataFound`}</Text>
          ) : (
            paidData.data.map((item: any) => <Row item={item} key={item.id} />)
          )}
        </View>
      </ScrollView>
    </Screen>
  )
}

export default Payroll
