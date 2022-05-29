import { Header, Screen } from '@/Components'
import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Box, Button, Flex, useDisclose } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useConfirmTransactionMutation,
  useGetEmployeeIncomeNoticeFileQuery,
  useRejectTransactionMutation,
} from '@/Services/transaction'

function TransactionNotice() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()

  const { data, isLoading } = useGetEmployeeIncomeNoticeFileQuery(
    route.params.id,
  )

  const [confirm, { isLoading: confirming }] = useConfirmTransactionMutation()
  const [reject, { isLoading: rejecting }] = useRejectTransactionMutation()

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.background}
      >
        <Header
          title={t`employeeApp.transactionNotice`}
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
          <Flex
            marginY="56px"
            flex={1}
            alignItems="center"
            justifyContent="center"
            padding="24px"
          >
            <Button
              onPress={() => {
                const localFile = `${RNFS.DocumentDirectoryPath}/${data.name}`
                RNFS.writeFile(localFile, `${data.data}`, 'base64').then(() => {
                  FileViewer.open(localFile, {
                    showOpenWithDialog: true,
                  })
                })
              }}
            >
              {t`employeeApp.viewFile`}
            </Button>
          </Flex>
        )}
      </Screen>

      {data?.data && route.params.paid !== true && (
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
            marginRight="12px"
            flex={1}
            variant="outline"
            _loading={{
              backgroundColor: Colors.primary,
            }}
            isLoading={rejecting}
            onPress={() => {
              Alert.alert(t`common.confirmation`, t`common.areYouSure`, [
                {
                  text: t`common.cancel`,
                  style: 'destructive',
                },
                {
                  text: t`common.confirm`,
                  onPress: () => {
                    reject(route.params.id)
                  },
                },
              ])
            }}
          >{t`transactionScreen.reject`}</Button>
          <Button
            flex={1}
            isLoading={confirming}
            _loading={{
              backgroundColor: Colors.primary,
            }}
            onPress={() => {
              Alert.alert(t`common.confirmation`, t`common.areYouSure`, [
                {
                  text: t`common.cancel`,
                  style: 'destructive',
                },
                {
                  text: t`common.confirm`,
                  onPress: () => {
                    confirm(route.params.id).then(res => {
                      navigation.navigate('ConfirmRequest', {
                        id: route.params.id,
                      })
                    })
                  },
                },
              ])
            }}
          >
            {t`common.confirm`}
          </Button>
        </Box>
      )}
    </>
  )
}

export default TransactionNotice
