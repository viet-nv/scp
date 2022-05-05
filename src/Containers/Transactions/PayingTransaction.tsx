import { Header, Screen } from '@/Components'
import { useLazyGetTransactionsQuery } from '@/Services/transaction'
import { Colors } from '@/Theme/Variables'
import { formatNum } from '@/Utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import {
  Actionsheet,
  Box,
  Button,
  Checkbox,
  FlatList,
  Flex,
  Input,
  Text,
  useDisclose,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

function PayingTransaction() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const [selectedPayments, setSelectedPayments] = useState<number[]>([])

  const [filter, setFilter] = useState({
    employee_name: '',
    bank_name: '',
  })

  const [
    getTransactions,
    { isLoading, isFetching },
  ] = useLazyGetTransactionsQuery()

  const [transactions, setTransactions] = useState({
    data: [],
    page: 1,
    size: 10,
    total_record: 0,
  })

  const statuses = 'paying'
  const init = () => {
    getTransactions({
      page: 1,
      size: 10,
      statuses,
    }).then(res => {
      setTransactions({
        ...res.data.paginate,
        data: res.data.data,
      })
    })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      init()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const filterCount = +!!filter.employee_name + +!!filter.bank_name

  const handleMakePayment = () => {
    //
  }

  const { isOpen, onOpen, onClose } = useDisclose()
  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Text
            fontWeight="500"
            fontSize={16}
          >{t`enterpriseScreen.filter`}</Text>
          <Box
            width="100%"
            marginTop="24px"
            paddingX="16px"
            position="relative"
          >
            <Text>{t`transactionScreen.employee_name`}</Text>
            <Input
              marginTop="8px"
              placeholder={t`transactionScreen.employee_name`}
              width="100%"
              value={filter.employee_name}
              onChangeText={employee_name =>
                setFilter({ ...filter, employee_name })
              }
            />

            <Text marginTop="24px">{t`transactionScreen.bank_name`}</Text>
            <Input
              marginTop="8px"
              placeholder={t`transactionScreen.bank_name`}
              width="100%"
              value={filter.bank_name}
              onChangeText={bank_name => setFilter({ ...filter, bank_name })}
            />

            <Box flexDirection="row" marginTop="16px" paddingY="12px">
              <Button
                flex={1}
                variant="outline"
                onPress={() => {
                  setFilter({
                    employee_name: '',
                    bank_name: '',
                  })

                  getTransactions({
                    page: 1,
                    size: 10,
                    employee_name: '',
                    bank_name: '',
                  }).then(res => {
                    setTransactions({
                      ...res.data.paginate,
                      data: res.data.data,
                    })
                  })
                  onClose()
                }}
              >{t`enterpriseScreen.clearFilter`}</Button>
              <Button
                flex={1}
                marginLeft="16px"
                onPress={() => {
                  getTransactions({
                    page: 1,
                    size: 10,
                    employee_name: filter.employee_name,
                    bank_name: filter.bank_name,
                  }).then(res => {
                    setTransactions({
                      ...res.data.paginate,
                      data: res.data.data,
                    })
                  })

                  onClose()
                }}
              >{t`enterpriseScreen.apply`}</Button>
            </Box>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>

      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`transactionScreen.payingTransaction`}
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

        <FlatList
          style={{
            marginTop: 56,
            marginBottom: insets.bottom,
          }}
          onRefresh={() => {
            getTransactions({
              page: 1,
              size: 10,
              ...filter,
            }).then(res => {
              setTransactions({
                ...res.data.paginate,
                data: res.data.data,
              })
            })
          }}
          refreshing={isFetching}
          data={transactions.data}
          ListEmptyComponent={
            !isLoading && !isFetching ? (
              <Text
                textAlign="center"
                color={Colors.subText}
                padding="16px"
              >{t`transactionScreen.noTransactionsFound`}</Text>
            ) : undefined
          }
          ListHeaderComponent={
            <>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
                style={{
                  padding: 12,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                <Flex flexDirection="row">
                  <Checkbox
                    value="all"
                    accessibilityLabel="all"
                    isChecked={
                      !!transactions.data.length &&
                      selectedPayments.length === transactions.data.length
                    }
                    onChange={selected =>
                      setSelectedPayments(
                        selected ? transactions.data.map((i: any) => i.id) : [],
                      )
                    }
                  />

                  <Text
                    style={{ fontSize: 16, fontWeight: '500' }}
                    marginLeft={2}
                  >
                    {t`common.selectAll`}
                  </Text>
                </Flex>
                <TouchableOpacity
                  style={{ display: 'flex', flexDirection: 'row' }}
                  onPress={onOpen}
                >
                  {!!filterCount && (
                    <View
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        backgroundColor: Colors.primary,
                        borderRadius: 50,
                        width: 16,
                        height: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text fontSize="10px" color="white">
                        {filterCount}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      marginRight: 6,
                    }}
                    color={filterCount ? Colors.primary : Colors.text}
                  >
                    {t`enterpriseScreen.filter`}
                  </Text>
                  <Ionicons
                    name="filter"
                    size={16}
                    color={filterCount ? Colors.primary : Colors.text}
                  />
                </TouchableOpacity>
              </Flex>
            </>
          }
          renderItem={({ item, index }: { item: any; index: number }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TransactionDetail', { id: item.id })
                }
              >
                <Flex
                  key={item.id}
                  alignItems="center"
                  padding="12px"
                  flexDirection="row"
                  marginBottom={
                    index === transactions.total_record - 1 ? '72px' : '0px'
                  }
                  backgroundColor={
                    index % 2 === 0 ? Colors.lightGray : Colors.white
                  }
                >
                  <Checkbox
                    value={item.id}
                    accessibilityLabel={`${item.id}`}
                    isChecked={selectedPayments.includes(item.id)}
                    onChange={selected =>
                      selected
                        ? setSelectedPayments(prev => [...prev, item.id])
                        : setSelectedPayments(prev =>
                            prev.filter(id => id !== item.id),
                          )
                    }
                  />

                  <Flex
                    flex={1}
                    marginLeft={2}
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Flex>
                      <Text fontWeight={500}>{item.employee.name}</Text>
                      <Flex flexDirection="row">
                        <Text color={Colors.subText}>
                          {t`enterpriseScreen.accNo`}{' '}
                          <Text fontWeight={500} color={Colors.text}>
                            {item.bank_account_number}
                          </Text>
                        </Text>
                      </Flex>
                      <Text color={Colors.subText}>
                        {t`transactionScreen.transactionCode`}:{' '}
                        <Text>{item.code}</Text>
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="flex-end">
                      <Text fontWeight={500} color={Colors.error} fontSize={16}>
                        {formatNum(item.request_amount)}
                      </Text>

                      <Text color={Colors.subText}>
                        {dayjs(item.transaction_date).format('DD-MM-YYYY')}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </TouchableOpacity>
            )
          }}
          ListFooterComponent={
            isLoading || isFetching ? <ActivityIndicator /> : undefined
          }
          ListFooterComponentStyle={{ padding: 16 }}
          onEndReached={() => {
            if (
              !isLoading &&
              !isFetching &&
              transactions.data.length < transactions.total_record
            )
              getTransactions({
                page: transactions.page + 1,
                size: 10,
              }).then(res => {
                setTransactions({
                  ...res.data.paginate,
                  data: [...transactions.data, ...res.data.data],
                })
              })
          }}
        ></FlatList>
      </Screen>

      <Box
        position="absolute"
        padding="16px"
        style={{
          paddingBottom: insets.bottom + 16,
        }}
        borderTopWidth={1}
        borderTopColor={Colors.border}
        backgroundColor={Colors.white}
        left="0"
        right="0"
        bottom={0}
      >
        <Button
          onPress={handleMakePayment}
          isLoading={false}
          isDisabled={!selectedPayments.length}
          _loading={{
            backgroundColor: Colors.primary,
          }}
        >{t`transactionScreen.makePayment`}</Button>
      </Box>
    </>
  )
}

export default PayingTransaction
