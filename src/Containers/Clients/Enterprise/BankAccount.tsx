import { Header, Screen } from '@/Components'
import {
  useDeleteBankAccountMutation,
  useLazyBankAccountQuery,
} from '@/Services/enterprise'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  AlertDialog,
  Divider,
  Fab,
  FlatList,
  Flex,
  Icon,
  Text,
  Button,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

function ClientReport() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const [banks, setBanks] = useState({
    data: [],
    page: 1,
    size: 10,
    total_record: 0,
  })

  const [
    deleteBankAccount,
    { isLoading: isDeletingBankAcc },
  ] = useDeleteBankAccountMutation()

  const [idToDelete, setDeleteBank] = useState()
  const cancelRef = React.useRef(null)

  const [getBankAccounts, { isLoading, isFetching }] = useLazyBankAccountQuery()
  const init = () => {
    getBankAccounts({
      id: route.params.id,
      params: { page: 1, size: 10 },
    }).then(res => {
      setBanks({
        ...res.data.paginate,
        data: res.data.data,
      })
    })
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      init()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  return (
    <Screen
      preset="fixed"
      statusBackgroundColor={Colors.navBackground}
      backgroundColor={Colors.white}
    >
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={!!idToDelete}
        onClose={() => setDeleteBank(undefined)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{t`enterpriseScreen.deleteBankAccount`}</AlertDialog.Header>
          <AlertDialog.Body>
            {t`enterpriseScreen.areYouSureToDelete`}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                size="sm"
                colorScheme="coolGray"
                onPress={() => setDeleteBank(undefined)}
                ref={cancelRef}
              >
                {t`common.cancel`}
              </Button>
              <Button
                colorScheme="danger"
                size="sm"
                isLoading={isDeletingBankAcc}
                _loading={{
                  backgroundColor: Colors.error,
                }}
                onPress={async () => {
                  const res: any = await deleteBankAccount(idToDelete)
                  if (!res.error) {
                    Alert.alert(
                      t`common.success`,
                      t`enterpriseScreen.deleteBankAccountSuccess`,
                    )
                    init()
                    setDeleteBank(undefined)
                  } else Alert.alert(t`common.error`, t`common.errorMsg`)
                }}
              >
                {t`common.delete`}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Header
        title={t`enterpriseScreen.bankAccount`}
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

      <Fab
        renderInPortal={false}
        shadow={2}
        size="sm"
        icon={<Icon as={Ionicons} size="sm" name="add" color="white" />}
        onPress={() => {
          navigation.navigate('AddUpdateBank', {
            enterprise_id: route.params.id,
          })
        }}
      />

      <FlatList
        style={{
          marginTop: 56,
          marginBottom: insets.bottom,
        }}
        data={banks.data}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <Text
              color={Colors.subText}
              textAlign="center"
              padding="16px"
              fontSize="16px"
            >{t`common.noDataFound`}</Text>
          ) : undefined
        }
        renderItem={({ item, index }: { item: any; index: number }) => {
          return (
            <Flex
              key={item.id}
              paddingX="16px"
              paddingY="8px"
              marginBottom={index === banks.total_record - 1 ? '72px' : '0px'}
            >
              <Text fontSize={14} numberOfLines={2}>
                {item.bank_name} - {item.branch_name}
              </Text>

              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                marginTop="8px"
              >
                <Flex flexDirection="row">
                  <Text
                    color={Colors.subText}
                  >{t`enterpriseScreen.accNo`}</Text>
                  <Text marginLeft="4px" fontWeight="500">
                    {item.account_number}
                  </Text>
                </Flex>

                <Flex flexDirection="row">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddUpdateBank', {
                        bank: item,
                        enterprise_id: route.params.id,
                      })
                    }
                  >
                    <Text
                      color={Colors.link}
                      fontSize="12px"
                      paddingX="4px"
                      paddingY="2px"
                    >
                      {t`common.update`}
                    </Text>
                  </TouchableOpacity>
                  <Divider orientation="vertical" bg="red.600" mx="0.5" />
                  <TouchableOpacity onPress={() => setDeleteBank(item.id)}>
                    <Text
                      color={Colors.error}
                      fontSize="12px"
                      paddingX="4px"
                      paddingY="2px"
                    >
                      {t`common.delete`}
                    </Text>
                  </TouchableOpacity>
                </Flex>
              </Flex>
            </Flex>
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
            banks.data.length < banks.total_record
          )
            getBankAccounts({
              id: route.params.id,
              params: { page: banks.page + 1, size: 10 },
            }).then(res => {
              setBanks({
                ...res.data.paginate,
                data: [...banks.data, ...res.data.data],
              })
            })
        }}
        onEndReachedThreshold={50}
      />
    </Screen>
  )
}

export default ClientReport
