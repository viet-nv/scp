import { Header, Screen } from '@/Components'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Actionsheet,
  Box,
  Divider,
  Flex,
  Text,
  Button,
  useDisclose,
  VStack,
} from 'native-base'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGetTransactionDetailQuery } from '@/Services/transaction'
import { formatNum } from '@/Utils'
import dayjs from 'dayjs'

const Row = ({ left, right }: { left: string; right: string | undefined }) => {
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text flex={3} color={Colors.subText}>
        {left}
      </Text>
      <Text flex={2} fontWeight="500" textAlign="right">
        {right}
      </Text>
    </Flex>
  )
}

function TransactionDetail() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()

  const { data, isLoading, refetch } = useGetTransactionDetailQuery(
    route.params.id,
  )

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const { isOpen, onOpen, onClose } = useDisclose()

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.background}
      >
        <Header
          title={`${t`transactionScreen.transactionDetail`} ${
            data?.code ? `${data?.code}` : ''
          }`}
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

        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 80 }} />
        ) : (
          <ScrollView
            style={{
              marginTop: 56,
              marginBottom: insets.bottom + 80,
            }}
          >
            <Box
              marginTop="14px"
              marginX="2"
              shadow={1}
              borderRadius="8px"
              backgroundColor={Colors.white}
            >
              <VStack space={2} padding="12px">
                <Row
                  left={t`transactionScreen.employee_name`}
                  right={data?.employee.name}
                />
                <Divider />

                <Row
                  left={t`enterpriseScreen.enterpriseName`}
                  right={data?.enterprise.name}
                />

                <Divider />

                <Row
                  left={t`transactionScreen.type`}
                  right={
                    data?.employee_type === 'SEASON'
                      ? t`transactionScreen.season`
                      : t`transactionScreen.fulltime`
                  }
                />
                <Divider />

                <Row
                  left={t`transactionScreen.appliedEnterpriseFee`}
                  right={data?.enterprise_fee_type}
                />

                <Divider />

                <Row
                  left={t`transactionScreen.advanceLimit`}
                  right={formatNum(data?.advance_limit || 0)}
                />
                <Divider />

                <Row
                  left={t`transactionScreen.advancedLabours`}
                  right={data?.advanced_labor}
                />
              </VStack>
            </Box>
            <Box
              marginTop="14px"
              marginX="2"
              shadow={1}
              borderRadius="8px"
              backgroundColor={Colors.white}
            >
              <VStack space={2} padding="12px">
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`transactionScreen.transactionInfo`}</Text>
                <Divider />
                <Row
                  left={t`transactionScreen.transactionDate`}
                  right={dayjs(data?.transaction_date).format('DD-MM-YYYY')}
                />
                <Divider />
                <Row
                  left={t`transactionScreen.salaryPaymentDate`}
                  right={dayjs(data?.salary_payment_date).format('DD-MM-YYYY')}
                />
                <Divider />
                <Row
                  left={t`transactionScreen.totalEarnedLabours`}
                  right={data?.earned_labor}
                />
                <Divider />
                <Row
                  left={t`transactionScreen.appliedPromotion`}
                  right={data?.promotion_name}
                />
                <Divider />
                <Row
                  left={t`transactionScreen.requestAmount`}
                  right={formatNum(data?.request_amount)}
                />
                <Divider />
                <Row
                  left={t`transactionScreen.appliedTerm`}
                  right={data?.applied_term}
                />

                <Divider />
                <Row
                  left={t`transactionScreen.numOfEarnedLabour`}
                  right={data?.earned_labor}
                />

                <Divider />
                <Row
                  left={t`transactionScreen.appliedDiscountRate`}
                  right={data.applied_discount_rate + '%'}
                />

                <Divider />
                <Row
                  left={t`transactionScreen.futureDiscountAmount`}
                  right={data.future_discount_amount}
                />

                <Divider />
                <Row
                  left={t`transactionScreen.totalTransactionCost`}
                  right={formatNum(data.cost_amount)}
                />

                <Divider />
                <Row
                  left={t`transactionScreen.debtPurchasingPrice`}
                  right={formatNum(data.debt_purchasing_price_amount)}
                />

                <Divider />
                <Row
                  left={t`transactionScreen.bankFeeAfterTax`}
                  right={data.bank_fee_after_tax_amount}
                />

                <Divider />
                <Row
                  left={t`transactionScreen.paymentAmountToEmployee`}
                  right={data.receive_amount}
                />
              </VStack>
            </Box>
          </ScrollView>
        )}
      </Screen>

      <Box
        position="absolute"
        padding="16px"
        style={{
          paddingBottom: insets.bottom + 16,
        }}
        borderTopWidth={1}
        display="flex"
        flexDirection="row"
        borderTopColor={Colors.border}
        backgroundColor={Colors.white}
        left="0"
        right="0"
        bottom={0}
      >
        <Button
          flex={1}
          variant="outline"
          isLoading={isLoading}
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={() => {}}
        >{t`transactionScreen.reject`}</Button>
        <Button
          marginLeft="12px"
          flex={1}
          isLoading={isLoading}
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={() => {}}
        >{t`transactionScreen.makePayment`}</Button>
      </Box>
    </>
  )
}

export default TransactionDetail
