import { Header, Screen } from '@/Components'
import Tag from '@/Components/Tag'
import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer'
import {
  useGetLegalStatusQuery,
  useGetLegalTypeQuery,
  useLazyGetLegalDocsQuery,
} from '@/Services/employee'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Text, Box, Flex, Modal, useDisclose, Actionsheet } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native'
import { Config } from '@/Config'
import { useAppSelector } from '@/Store/hooks'

// *IMPORTANT*: The correct file extension is always required.
// You might encounter issues if the file's extension isn't included
// or if it doesn't match the mime type of the file.
// https://stackoverflow.com/a/47767860
function getUrlExtension(url: string) {
  // @ts-ignore
  return url.split(/[#?]/)[0].split('.').pop().trim()
}

function EmployeeLegalDocuments() {
  const { t, i18n } = useTranslation()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const { data } = useGetLegalTypeQuery(route.params.id)
  const { data: legalStatus, refetch } = useGetLegalStatusQuery(route.params.id)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const original = [...(data?.data || [])]

  const legalTypes = original.sort((a: any, b: any) => a.id - b.id)

  const { isOpen, onOpen, onClose } = useDisclose()
  const [selectedType, setSelectedType] = useState<any>()

  const [getLegalDocs, { isLoading, isFetching }] = useLazyGetLegalDocsQuery()
  const [documents, setDocuments] = useState({
    page: 1,
    size: 10,
    total_record: 0,
    data: [],
  })

  useEffect(() => {
    if (selectedType)
      getLegalDocs({
        page: 1,
        id: route.params.id,
        size: 10,
        legal_type_id: selectedType.id,
      }).then(res => {
        setDocuments({
          ...res.data.paginate,
          data: res.data.data,
        })
      })
  }, [selectedType?.id])

  const auth = useAppSelector(state => state.auth)

  return (
    <>
      <Actionsheet
        isOpen={!!selectedType}
        onClose={() => {
          setDocuments({
            page: 1,
            size: 10,
            data: [],
            total_record: 0,
          })
          setSelectedType(undefined)
        }}
      >
        <Actionsheet.Content>
          <Text fontWeight="500" fontSize={16}>
            {i18n.language === 'vi'
              ? selectedType?.vi_content
              : selectedType?.en_content}
          </Text>

          <FlatList
            style={{ width: '100%' }}
            data={documents.data}
            renderItem={({ item }: { item: any }) => {
              return (
                <Actionsheet.Item
                  onPress={() => {
                    const localFile = `${
                      RNFS.DocumentDirectoryPath
                    }/temporaryfile.${getUrlExtension(
                      item.object.original_name,
                    )}`

                    RNFS.downloadFile({
                      fromUrl: `${Config.PC_API_URL}/v1/objects/${item.object.key}/download`,
                      toFile: localFile,
                      headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                      },
                    })
                      .promise.then(() => FileViewer.open(localFile))
                      .catch(error => {
                        Alert.alert(t`common.error`, 'Can not view file')
                      })
                  }}
                >
                  <Text>{item?.object?.original_name}</Text>
                </Actionsheet.Item>
              )
            }}
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
            ListFooterComponent={
              isLoading || isFetching ? <ActivityIndicator /> : undefined
            }
            onEndReached={() => {
              if (
                !isLoading &&
                !isFetching &&
                documents.data.length < documents.total_record
              )
                getLegalDocs({
                  id: route.params.id,
                  legal_type_id: selectedType.id,
                  page: documents.page + 1,
                  size: 10,
                }).then(res =>
                  setDocuments({
                    ...res.data.paginate,
                    data: [...documents.data, ...res.data.data],
                  }),
                )
            }}
          ></FlatList>
        </Actionsheet.Content>
      </Actionsheet>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`enterpriseScreen.legalDocuments`}
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

        <Flex
          px="4"
          marginTop="72px"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="16px"
        >
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              marginRight="4px"
              fontWeight="500"
            >{t`enterpriseScreen.documentStatus`}</Text>
            <Tag
              backgroundColor={
                legalStatus?.status === 1 ? Colors.error : Colors.success
              }
              textColor={Colors.white}
              text={
                legalStatus?.status === 1
                  ? t`enterpriseScreen.missing`
                  : t`enterpriseScreen.full`
              }
            ></Tag>
          </Flex>

          <TouchableOpacity onPress={onOpen}>
            <Text fontWeight="500" color={Colors.link}>{t`common.detail`}</Text>
          </TouchableOpacity>
          <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>{t`enterpriseScreen.documentStatus`}</Modal.Header>
              <Modal.Body>
                <Flex flexDirection="row" justifyContent="space-between">
                  <Text color={Colors.subText}>{t`common.detail`}</Text>
                  <Text fontWeight="500">{legalStatus?.note}</Text>
                </Flex>

                <Flex
                  flexDirection="row"
                  justifyContent="space-between"
                  marginTop="12px"
                >
                  <Text color={Colors.subText}>{t`common.deadline`}</Text>
                  <Text fontWeight="500">
                    {legalStatus?.deadline
                      ? dayjs(legalStatus.deadline).format('DD-MM-YYYY')
                      : ''}
                  </Text>
                </Flex>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </Flex>

        <View
          style={{
            marginHorizontal: 16,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: Colors.white,
            borderColor: Colors.border,
            overflow: 'hidden',
          }}
        >
          {legalTypes.map((item, index) => (
            <Box
              key={item.id}
              backgroundColor={Colors.white}
              borderBottomWidth={index < legalTypes.length - 1 ? 1 : 0}
              borderBottomColor={Colors.border}
            >
              <TouchableOpacity
                style={{
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setSelectedType(item)}
              >
                <Box
                  flexDirection="row"
                  flex={1}
                  alignItems="center"
                  marginRight="12px"
                >
                  <Text fontSize="14px" fontWeight="500" flex={1}>
                    {i18n.language === 'vi' ? item.vi_content : item.en_content}
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors.primary,
                      borderRadius: 999,
                      width: 18,
                      height: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 10,
                        lineHeight: 16,
                      }}
                    >
                      {item.total}
                    </Text>
                  </View>
                </Box>

                <Text color={Colors.link} fontWeight="500">
                  {t`common.view`}
                </Text>
              </TouchableOpacity>
            </Box>
          ))}
        </View>
      </Screen>
    </>
  )
}

export default EmployeeLegalDocuments
