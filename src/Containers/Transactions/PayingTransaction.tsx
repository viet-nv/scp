import { Header, Screen } from '@/Components'
import { useLazyGetTransactionsQuery } from '@/Services/transaction'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Box, Button, Checkbox, FlatList, Flex, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

function PayingTransaction() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const [selectedPayments, setSelectedPayments] = useState<number[]>([])

  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
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

  const init = () => {
    getTransactions({
      page: 1,
      size: 10,
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

  const filterCount = 0

  return (
    <>
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
          data={transactions.data}
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
              <TouchableOpacity>
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
                        {item.request_amount.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })}
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
