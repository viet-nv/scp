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
  VStack,
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
import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer'

import { useAppSelector } from '@/Store/hooks'
import { formatNum } from '@/Utils'
import dayjs from 'dayjs'
import { useDebounce } from '@/Hooks'
import { useGetEmployeeContractsQuery } from '@/Services/employee'
import { Config } from '@/Config'
import { useSmartCAMutation } from '@/Services/users'
import WebView from 'react-native-webview'

function getUrlExtension(url: string) {
  // @ts-ignore
  return url.split(/[#?]/)[0].split('.').pop().trim()
}

function Contract() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()
  const { user } = useAppSelector(state => state.auth)

  const {
    data: waitingSignData,
    refetch: refetch1,
  } = useGetEmployeeContractsQuery({
    enterprise_id: user?.enterprise.id || 0,
    states: 'WAITING_PARTNER',
  })

  const [sign, { isLoading: signing }] = useSmartCAMutation()

  const { data: otherData, refetch } = useGetEmployeeContractsQuery({
    enterprise_id: user?.enterprise.id || 0,
    states: 'CCOMPLETED,OUTDATED',
  })

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch1()
      refetch()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])
  const auth = useAppSelector(state => state.auth)

  const hanldeViewFile = (object: any) => {
    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile`

    RNFS.downloadFile({
      fromUrl: `${Config.PC_API_URL}/v1/objects/${object.key}/download`,
      toFile: localFile,
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .promise.then(() => FileViewer.open(localFile))
      .catch(error => {
        Alert.alert(t`common.error`, 'Can not view file')
      })
  }

  const [uri, setWebviewUri] = useState('')
  const [signData, setSignData] = useState<any>(undefined)
  const handleSign = async (data?: any) => {
    if (data) setSignData(data)
    const res: any = await sign(data || signData)

    if (res.data?.redirect_url) {
      setWebviewUri(res.data.redirect_url)
    } else
      Alert.alert(
        t``,
        t`Your document was sent to VNPT SmartCA successfully, please sign your document on SmartCA first`,
      )
  }

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`employeeApp.contract`}
          style={{
            backgroundColor: Colors.navBackground,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            zIndex: 100,
          }}
          titleStyle={{ color: Colors.white }}
          onLeftPress={() => {
            console.log('sss')
            setWebviewUri('')
          }}
          leftIcon={uri ? 'arrow-back-outline' : undefined}
        />
        {!!uri ? (
          <WebView
            source={{ uri }}
            style={{ marginTop: 56, width: '100%', height: '100%' }}
            onShouldStartLoadWithRequest={request => {
              if (request.url.includes('/smart-ca')) {
                setWebviewUri('')
                handleSign()
                return false
              }

              return true
            }}
          />
        ) : (
          <ScrollView
            style={{
              marginTop: 56,
              marginBottom: insets.bottom,
            }}
          >
            <VStack paddingX="12px" space="24px" marginTop="16px">
              {waitingSignData?.data?.map((item: any) => (
                <Box
                  key={item.id}
                  borderRadius="4px"
                  borderWidth="1px"
                  padding="12px"
                  borderColor={Colors.border}
                >
                  <Text textAlign="center" fontWeight={500}>
                    {t(item.type)}
                  </Text>

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    marginTop="12px"
                  >
                    <Text color={Colors.subText}>{t`Status`}</Text>
                    <Text>{t`Waiting to sign`}</Text>
                  </Flex>

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    marginTop="12px"
                  >
                    <Text color={Colors.subText}>{t`Contract No.`}</Text>
                    <Text>{item.contract_no}</Text>
                  </Flex>

                  <Flex flexDirection="row" marginTop="12px">
                    <Button
                      flex={1}
                      size="sm"
                      variant="outline"
                      marginRight="12px"
                      onPress={() => hanldeViewFile(item.object)}
                    >{t`View contract`}</Button>
                    <Button
                      isLoading={signing}
                      flex={1}
                      size="sm"
                      variant="solid"
                      onPress={() =>
                        handleSign({
                          contract_id: item.id,
                          object_id: item.object.id,
                        })
                      }
                    >{t`Sign`}</Button>
                  </Flex>
                </Box>
              ))}

              {otherData?.data?.map((item: any) => (
                <Box
                  key={item.id}
                  borderRadius="4px"
                  borderWidth="1px"
                  padding="12px"
                  borderColor={Colors.border}
                >
                  <Text textAlign="center" fontWeight={500}>
                    {t(item.type)}
                  </Text>

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    marginTop="12px"
                  >
                    <Text color={Colors.subText}>{t`Status`}</Text>
                    <Text>{t(item.state)}</Text>
                  </Flex>

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    marginTop="12px"
                  >
                    <Text color={Colors.subText}>{t`Contract No.`}</Text>
                    <Text>{item.contract_no}</Text>
                  </Flex>

                  <Button
                    flex={1}
                    size="sm"
                    variant="outline"
                    marginRight="12px"
                    marginTop="12px"
                    onPress={() => hanldeViewFile(item.objects)}
                  >{t`View contract`}</Button>
                </Box>
              ))}
            </VStack>
          </ScrollView>
        )}
      </Screen>
    </>
  )
}

export default Contract
