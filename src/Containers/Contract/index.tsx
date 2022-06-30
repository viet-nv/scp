import { Header, Screen } from '@/Components'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
  Actionsheet,
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
    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.pdf`

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

  const masterContracts = otherData?.data?.filter(
    (item: any) => item.type === 'MASTER_CONTRACT',
  )

  const commitmentContracts = otherData?.data?.filter(
    (item: any) => item.type === 'COMMITMENT_AGREEMENT',
  )

  const [showType, setShowType] = useState('')

  const data = showType === 'master' ? masterContracts : commitmentContracts

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
            thirdPartyCookiesEnabled
            originWhitelist={['*']}
            source={{ uri }}
            style={{ marginTop: 56, width: '100%', height: '100%' }}
            onShouldStartLoadWithRequest={request => {
              if (request.url.includes('/smart-ca')) {
                setTimeout(() => {
                  setWebviewUri('')
                  handleSign()
                }, 3000)
                return true
              }

              return true
            }}
          />
        ) : (
          <ScrollView
            style={{
              marginTop: 56,
            }}
          >
            <VStack paddingX="12px" space="16px" marginTop="16px">
              <Text
                fontWeight="500"
                fontSize="16px"
              >{t`Waiting for signing documents`}</Text>
              {!waitingSignData?.data?.length && (
                <Text
                  textAlign="center"
                  color={Colors.subText}
                >{t`No contract needs to be signed`}</Text>
              )}
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

              <Divider />

              <Text fontSize="16px" fontWeight="500">{t`Contract List`}</Text>

              <HStack space="16px">
                <Box
                  borderRadius="4px"
                  borderWidth="1px"
                  borderColor={Colors.border}
                  flex={1}
                >
                  <TouchableOpacity
                    onPress={() => setShowType('commitment')}
                    style={{
                      padding: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="document-text" size={24} />
                    <Text marginTop="6px">{t`COMMITMENT_AGREEMENT`}</Text>
                  </TouchableOpacity>
                </Box>

                <Box
                  borderRadius="4px"
                  borderWidth="1px"
                  borderColor={Colors.border}
                  flex={1}
                >
                  <TouchableOpacity
                    onPress={() => setShowType('master')}
                    style={{
                      padding: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="contract" size={24} />
                    <Text marginTop="6px">{t`MASTER_CONTRACT`}</Text>
                  </TouchableOpacity>
                </Box>
              </HStack>

              <Actionsheet isOpen={!!showType} onClose={() => setShowType('')}>
                <Actionsheet.Content>
                  <Text fontWeight="500" fontSize={16}>
                    {showType === 'master'
                      ? t`MASTER_CONTRACT`
                      : t`COMMITMENT_AGREEMENT`}
                  </Text>
                  {data?.map((item: any) => (
                    <>
                      <Actionsheet.Item
                        onPress={() => hanldeViewFile(item.object)}
                      >
                        <HStack justifyContent="space-between">
                          <Text color={Colors.subText}>{t`Contract No.`}:</Text>
                          <Text fontWeight="500" marginLeft="16px">
                            {item.contract_no}
                          </Text>
                        </HStack>

                        <HStack justifyContent="space-between" marginTop="8px">
                          <Text color={Colors.subText}>{t`Status`}:</Text>
                          <Text fontWeight="500" marginLeft="16px">
                            {t(item.state)}
                          </Text>
                        </HStack>
                      </Actionsheet.Item>
                      <Divider />
                    </>
                  ))}
                </Actionsheet.Content>
              </Actionsheet>
            </VStack>

            <Flex height={insets.bottom}></Flex>
          </ScrollView>
        )}
      </Screen>
    </>
  )
}

export default Contract
