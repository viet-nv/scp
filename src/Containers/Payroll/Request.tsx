import { Header, Screen } from '@/Components'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Box,
  Button,
  ChevronDownIcon,
  Flex,
  Text,
  View,
  Actionsheet,
  Input,
  FormControl,
  Divider,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useCalculateTransactionMutation,
  useGetWorkingEnterpriseQuery,
  useLazyGetPromotionsQuery,
  useLazyGetTransactionLimitQuery,
  usePostTransactionMutation,
} from '@/Services/transaction'

import { useAppSelector } from '@/Store/hooks'
import { formatNum } from '@/Utils'
import dayjs from 'dayjs'
import { useDebounce } from '@/Hooks'

function RequestPayroll() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()
  const { user } = useAppSelector(state => state.auth)

  const { data, isLoading } = useGetWorkingEnterpriseQuery(user?.id || 0)
  const [
    getTransactionLimit,
    // { isLoading: isLoadingTxLimit },
  ] = useLazyGetTransactionLimitQuery()

  const [
    getPromotions,
    { isLoading: loadingPromotions },
  ] = useLazyGetPromotionsQuery()

  const [
    calculateTransaction,
    { isLoading: calculating },
  ] = useCalculateTransactionMutation()

  const [selectedEnterprise, setSelectedEnterprise] = useState(null)
  const [showSelect, setShowSelect] = useState(false)

  useEffect(() => {
    if (!isLoading) setShowSelect(true)
  }, [isLoading])

  const [info, setInfo] = useState({
    available_advance_amount: 0,
    max_advance_amount: 0,
    max_advance_labor: 0,
  })

  const [requestAmount, setRequestAmount] = useState('')
  const [rqAmountErr, setRqAmountErr] = useState('')

  const amount = useDebounce(requestAmount, 300)

  useEffect(() => {
    if (selectedEnterprise) {
      getTransactionLimit({ enterprise_id: selectedEnterprise }).then(res => {
        setInfo(res.data as any)
      })
      getPromotions(selectedEnterprise).then(res => {
        console.log(res)
      })
    }
  }, [selectedEnterprise])

  const [postData, setPostData] = useState<any>(null)
  useEffect(() => {
    if (!rqAmountErr && amount && selectedEnterprise) {
      calculateTransaction({
        amount: Number(amount.replace(/\./g, '')),
        enterprise_id: selectedEnterprise,
      }).then((res: any) => {
        setPostData(res.data)
      })
    }
  }, [rqAmountErr, amount, selectedEnterprise])

  const [
    postTransaction,
    { isLoading: creating },
  ] = usePostTransactionMutation()
  const handleRequest = async () => {
    const res: any = await postTransaction({
      ...postData,
      amount: postData.request_amount,
    })

    if (res.error) {
      Alert.alert('', t`common.errorMsg`)
    } else {
      navigation.navigate('TransactionNotice', { id: res.data.id })
    }
  }

  return (
    <>
      <Actionsheet
        isOpen={showSelect}
        onClose={() => {
          if (selectedEnterprise) setShowSelect(false)
          else
            Alert.alert(t``, t`pleaseSelectEnterprise`, [
              {
                text: t`common.cancel`,
                onPress: () => navigation.goBack(),
              },
              {
                text: t`common.ok`,
              },
            ])
        }}
      >
        <Actionsheet.Content>
          {data?.data.map((item: any) => {
            return (
              <Actionsheet.Item
                key={item.enterprise.id}
                onPress={() => {
                  setSelectedEnterprise(item.enterprise.id)
                  setShowSelect(false)
                }}
              >
                {item.enterprise.name}
              </Actionsheet.Item>
            )
          })}
        </Actionsheet.Content>
      </Actionsheet>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`employeeApp.payroll`}
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
            <View backgroundColor={Colors.navBackground}>
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingX="12px"
              >
                <Text color={Colors.white} fontSize="14px">
                  {t`enterprise`}
                </Text>
                <TouchableOpacity
                  style={{ alignItems: 'center', flexDirection: 'row' }}
                  onPress={() => setShowSelect(true)}
                >
                  <Text color={Colors.white} marginRight="4px">
                    {
                      data.data.find(
                        (item: any) =>
                          item.enterprise.id === selectedEnterprise,
                      )?.enterprise.name
                    }
                  </Text>

                  <ChevronDownIcon size="20px" color={Colors.white} />
                </TouchableOpacity>
              </Flex>

              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingX="12px"
                marginTop="6px"
              >
                <Text color={Colors.white} fontSize="14px">
                  {t`employeeApp.maxPaymentOfAdvance`}
                </Text>
                <Text color={Colors.white} fontWeight="500" fontSize={16}>
                  {formatNum(info.max_advance_amount)}
                </Text>
              </Flex>

              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingX="12px"
                marginBottom="12px"
              >
                <Text
                  color={Colors.white}
                  fontSize="14px"
                >{t`employeeApp.maxLabourOfAdvance`}</Text>

                <Text color={Colors.white} fontWeight="500" fontSize={16}>
                  {info.max_advance_labor} {t`days`}
                </Text>
              </Flex>
            </View>

            <View padding="16px">
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingX="12px"
                marginTop="6px"
                marginBottom="12px"
              >
                <Text fontSize="14px">{t`transactionDate`}</Text>
                <Text fontWeight="500" fontSize={16}>
                  {dayjs().format('DD-MM-YYYY')}
                </Text>
              </Flex>

              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingX="12px"
                marginBottom="12px"
              >
                <Text fontSize="14px">{t`salaryPaymentDate`}</Text>
                <Text fontWeight="500" fontSize={16}>
                  {dayjs(data.salary_payment_date).format('DD-MM-YYYY')}
                </Text>
              </Flex>

              <View paddingX="12px">
                <Text marginBottom="8px">{t`requestAmount`}</Text>
                <FormControl isInvalid={!!rqAmountErr} marginBottom="24px">
                  <Input
                    style={{ borderColor: Colors.error }}
                    value={requestAmount}
                    onChangeText={text => {
                      const temp = text.replace(/[^0-9]/g, '')
                      if (!text) {
                        setRqAmountErr(t`Please input your request amount`)
                      } else if (Number(temp) > info.max_advance_amount)
                        setRqAmountErr(t`requestAmountExceedAvailable`)
                      else setRqAmountErr('')

                      setRequestAmount(
                        temp ? formatNum(Number(temp), false) : '',
                      )
                    }}
                  />
                  <FormControl.ErrorMessage>
                    {rqAmountErr}
                  </FormControl.ErrorMessage>
                </FormControl>

                <Divider />

                {calculating ? (
                  <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                  <View
                    padding="8px"
                    borderWidth={1}
                    borderColor={Colors.border}
                    marginTop="16px"
                    borderRadius="8px"
                  >
                    <Flex flexDirection="row" justifyContent="space-between">
                      <Text
                        color={Colors.subText}
                      >{t`Corresponding Labours`}</Text>
                      <Text>{postData?.corresponding_labor}</Text>
                    </Flex>

                    <Flex flexDirection="row" justifyContent="space-between">
                      <Text
                        color={Colors.subText}
                      >{t`No. of earned labour`}</Text>
                      <Text>{postData?.earned_labor}</Text>
                    </Flex>

                    <Flex flexDirection="row" justifyContent="space-between">
                      <Text
                        color={Colors.subText}
                      >{t`No. of future labour`}</Text>
                      <Text>{postData?.future_labor}</Text>
                    </Flex>
                  </View>
                )}
              </View>
            </View>
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
          isDisabled={!postData}
          isLoading={creating}
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={handleRequest}
        >
          {t`Request`}
        </Button>
      </Box>
    </>
  )
}

export default RequestPayroll
