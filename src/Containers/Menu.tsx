import React, { useState } from 'react'
import { Alert, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useTranslation } from 'react-i18next'
import { Colors } from '@/Theme/Variables'
import { Header, Icon, Screen } from '@/Components'

import { Actionsheet, Text, useDisclose, VStack } from 'native-base'
import { logout } from '@/Store/auth'
import { useAppDispatch, useAppSelector } from '@/Store/hooks'
import { useLogoutMutation } from '@/Services/auth'
import { useNavigation } from '@react-navigation/native'
import RNFS from 'react-native-fs'
import { Config } from '@/Config'
import FileViewer from 'react-native-file-viewer'
import ChangePassword from '@/Components/ChangePassword'

const HEADER: ViewStyle = {
  backgroundColor: Colors.navBackground,
}

const ROW: ViewStyle = {
  backgroundColor: Colors.white,
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
  paddingLeft: 20,
  paddingRight: 12,
  paddingVertical: 12,
  alignItems: 'center',
}

const ROW_TEXT: TextStyle = {
  fontSize: 16,
  marginLeft: 20,
  flex: 1,
}

export const MenuScreen = () => {
  const { t, i18n } = useTranslation()

  const navigation: any = useNavigation()
  const { user } = useAppSelector(state => state.auth)

  const dispatch = useAppDispatch()
  const [logoutServer] = useLogoutMutation()
  const { isOpen, onClose, onOpen } = useDisclose()
  const [isShowChangepass, showChangePass] = useState(false)

  return (
    <Screen
      preset="scroll"
      statusBackgroundColor={Colors.navBackground}
      backgroundColor={Colors.background}
      statusBar="light-content"
    >
      {isShowChangepass && (
        <ChangePassword onCancel={() => showChangePass(false)} />
      )}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              i18n.changeLanguage('vi')
              onClose()
            }}
          >
            🇻🇳 Tiếng Việt
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              onClose()
              i18n.changeLanguage('en')
            }}
          >
            🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿 English
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <Header
        title={
          user?.role?.name === 'EMPLOYEE'
            ? t`Account Management`
            : t`menuScreen.headerTitle`
        }
        style={HEADER}
        titleStyle={{ color: Colors.white }}
      />
      {user?.role.name === 'EMPLOYEE' && (
        <>
          <TouchableOpacity
            style={[ROW, { marginBottom: 16 }]}
            onPress={() => navigation.navigate('UserInfo')}
          >
            <Ionicons
              name="person-circle-outline"
              size={48}
              color={Colors.primary}
            />

            <VStack flex={1} marginLeft="20px">
              <Text fontSize="18px" fontWeight="600">
                {user.fullname}
              </Text>
              <Text
                fontSize="14px"
                color={Colors.subText}
              >{t`User Information`}</Text>
            </VStack>

            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={ROW}
            onPress={() => {
              // navigation.navigate('UserInfo')
            }}
          >
            <Icon
              icon="kyc"
              style={{ width: 24, height: 24, marginRight: 2 }}
            />
            <Text style={ROW_TEXT}>{t`eKYC verification`}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[ROW, { marginBottom: 16 }]}
            onPress={() => {
              // navigation.navigate('UserInfo')
            }}
          >
            <Ionicons name="card-outline" size={24} color={Colors.primary} />

            <Text style={ROW_TEXT}>{t`Bank Account`}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>
        </>
      )}
      {user?.role.name !== 'EMPLOYEE' && (
        <>
          <TouchableOpacity
            style={ROW}
            // onPress={() => navigation.navigate('PayingTransaction')}
          >
            <Icon
              icon="enterprise"
              style={{ width: 24, height: 24, marginRight: 2 }}
            />
            <Text style={ROW_TEXT}>{t`menuScreen.companyInfo`}</Text>

            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={ROW}
            // onPress={() => navigation.navigate('PaidTransaction')}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={Colors.primary}
            />
            <Text
              style={[ROW_TEXT, { marginLeft: 20 }]}
            >{t`menuScreen.accountInfo`}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>
        </>
      )}

      {user?.role.name === 'EMPLOYEE' && (
        <>
          <TouchableOpacity
            style={ROW}
            onPress={() => {
              const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile`

              RNFS.downloadFile({
                fromUrl: `${
                  Config.APP === 'epayz'
                    ? 'https://docs.google.com/document/d/11MBRbYqRQXUbPiPydb9__Nlm-w9hIFfl'
                    : 'https://docs.google.com/document/d/1ScNMRB76ksKZAP1ulxeGeW5kIx4RcCMi'
                }`,
                toFile: localFile,
              })
                .promise.then(() => FileViewer.open(localFile))
                .catch(error => {
                  Alert.alert(t`common.error`, 'Can not view file')
                })
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={Colors.primary}
            />
            <Text
              style={[ROW_TEXT, { marginLeft: 24 }]}
            >{t`Terms of Use`}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={ROW}
            // onPress={() => onOpen()}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={Colors.primary}
            />
            <Text
              style={[ROW_TEXT, { marginLeft: 24 }]}
            >{t`menuScreen.faqs`}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[ROW, { marginBottom: 16 }]}
            onPress={() => {
              // onOpen()
            }}
          >
            <Ionicons name="call-outline" size={24} color={Colors.primary} />
            <Text style={[ROW_TEXT, { marginLeft: 24 }]}>{t`Contact Us`}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.subText}
            />
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={ROW} onPress={() => onOpen()}>
        <Ionicons name="language" size={24} color={Colors.primary} />
        <Text
          style={[ROW_TEXT, { marginLeft: 24 }]}
        >{t`menuScreen.changeLanguage`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity style={ROW} onPress={() => showChangePass(true)}>
        <Ionicons name="sync-outline" size={24} color={Colors.primary} />
        <Text style={[ROW_TEXT, { marginLeft: 24 }]}>{t`Change password`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={ROW}
        onPress={() => {
          Alert.alert(t`common.confirmation`, t`common.areYouSure`, [
            {
              text: t`common.cancel`,
              style: 'destructive',
            },
            {
              text: t`menuScreen.logout`,
              onPress: async () => {
                try {
                  logoutServer()
                } catch (e) {
                  console.log('Call logout api failed', e)
                }
                dispatch(logout())
              },
            },
          ])
        }}
      >
        <Ionicons name="power" size={24} color={Colors.primary} />
        <Text
          style={[ROW_TEXT, { marginLeft: 24 }]}
        >{t`menuScreen.logout`}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={Colors.subText}
        />
      </TouchableOpacity>
    </Screen>
  )
}
