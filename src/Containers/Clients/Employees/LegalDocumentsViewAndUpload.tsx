import { Header, Screen } from '@/Components'
import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer'
import {
  useLazyGetEmployeeLegalDocsQuery,
  useUploadEmployeeFileMutation,
  useUploadEmployeeLegalDocMutation,
} from '@/Services/employee'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Text, Actionsheet, Box, Button, Flex } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, FlatList, ScrollView } from 'react-native'
import { Config } from '@/Config'
import { useAppSelector } from '@/Store/hooks'
import DocumentPicker from 'react-native-document-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

// *IMPORTANT*: The correct file extension is always required.
// You might encounter issues if the file's extension isn't included
// or if it doesn't match the mime type of the file.
// https://stackoverflow.com/a/47767860
function getUrlExtension(url: string) {
  // @ts-ignore
  return url.split(/[#?]/)[0].split('.').pop().trim()
}

function EmployeeLegalDocumentsViewAndUpload() {
  const { t, i18n } = useTranslation()
  const navigation: any = useNavigation()
  const insets = useSafeAreaInsets()
  const route: any = useRoute()

  const selectedType = route.params.selectedType

  const [
    getLegalDocs,
    { isLoading, isFetching },
  ] = useLazyGetEmployeeLegalDocsQuery()
  const [documents, setDocuments] = useState({
    page: 1,
    size: 10,
    total_record: 0,
    data: [],
  })

  const init = () => {
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
  }

  useEffect(() => {
    if (selectedType) init()
  }, [selectedType?.id])

  const auth = useAppSelector(state => state.auth)
  const [uploadFiles, setUploadFiles] = useState([])
  const [upload, { isLoading: isUploading }] = useUploadEmployeeFileMutation()

  const [linkDocs] = useUploadEmployeeLegalDocMutation()

  function getUrlExtension(url: string) {
    // @ts-ignore
    return url.split(/[#?]/)[0].split('.').pop().trim()
  }

  return (
    <>
      <Actionsheet
        isOpen={!!uploadFiles.length}
        onClose={() => setUploadFiles([])}
      >
        <Actionsheet.Content>
          <Text fontWeight="500" fontSize={18}>{t`selectedFiles`}</Text>
          <ScrollView style={{ width: '100%' }}>
            {uploadFiles.map((item: any) => (
              <Flex
                paddingX="16px"
                paddingY="8px"
                key={item.uri}
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                flexDirection="row"
              >
                <Text flex={1} numberOfLines={1}>
                  {item.name}
                </Text>
                <Ionicons
                  onPress={() => {
                    setUploadFiles(prev =>
                      prev.filter((el: any) => el.uri !== item.uri),
                    )
                  }}
                  color={Colors.subText}
                  name="close"
                  size={24}
                  style={{ padding: 4 }}
                />
              </Flex>
            ))}
          </ScrollView>
          <Button.Group padding="16px" width="100%" gap="16px">
            <Button
              variant="outline"
              flex={1}
              onPress={async () => {
                const res: any = await DocumentPicker.pickMultiple()
                setUploadFiles(res)
              }}
            >{t`employeeScreen.reselect`}</Button>
            <Button
              flex={1}
              isLoading={isUploading}
              _loading={{
                backgroundColor: Colors.primary,
              }}
              onPress={async () => {
                const res = await Promise.all(
                  uploadFiles.map(async (file: any) => {
                    const formData = new FormData()
                    formData.append('files', {
                      name: file.name,
                      uri: file.uri,
                      type: file.type,
                    })
                    return upload(formData).catch(err => err)
                  }),
                )

                const linkDocRes: any = await linkDocs({
                  employee_id: route.params.id,
                  legal_type_id: selectedType.id,
                  object_ids: res
                    .filter(r => !(r instanceof Error))
                    .map(r => r.data.objects[0].id),
                })

                if (linkDocRes.error) {
                  Alert.alert(t`common.error`, t`common.errorMsg`)
                } else {
                  Alert.alert(
                    t`common.success`,
                    t`employeeScreen.uploadSuccess`,
                  )

                  setUploadFiles([])
                  init()
                }
              }}
            >{t`employeeScreen.upload`}</Button>
          </Button.Group>
        </Actionsheet.Content>
      </Actionsheet>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={
            i18n.language === 'vi'
              ? selectedType?.vi_content
              : selectedType?.en_content
          }
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
          style={{ width: '100%', marginTop: 72 }}
          data={documents.data}
          renderItem={({ item }: { item: any }) => {
            return (
              <Actionsheet.Item
                onPress={() => {
                  const localFile = `${
                    RNFS.DocumentDirectoryPath
                  }/temporaryfile.${getUrlExtension(item.object.original_name)}`

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
                <Text fontSize="16px">{item?.object?.original_name}</Text>
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
          isLoading={isLoading}
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={async () => {
            // hanlde upload
            const res: any = await DocumentPicker.pickMultiple()
            setUploadFiles(res)
          }}
        >{t`employeeScreen.upload`}</Button>
      </Box>
    </>
  )
}

export default EmployeeLegalDocumentsViewAndUpload
