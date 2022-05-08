import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { Avatar, Box, Button, Card, Flex, Text } from 'native-base'
import { useLogoutMutation } from '@/Services/auth'
import { useAppDispatch, useAppSelector } from '@/Store/hooks'
import { Screen } from '@/Components/Screen/screen'
import { logout } from '@/Store/auth'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/Navigators/utils'
import { StackNavigationProp } from '@react-navigation/stack'
import { AutoImage } from '@/Components/AutoImage'
import { t } from 'i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CalendarStrip from 'react-native-calendar-strip'

const logo = require('../Assets/Images/scp-logo.png')

const getRoleDisplayText = (role: string = '') => {
  switch (role) {
    case 'MASTER':
      return t`master`
    case 'SUBMASTER':
      return t`subMaster`
    case 'CA_MANAGER':
      return t`caTeamLead`
    case 'CA_SENIOR':
      return t`CA_SENIOR`
    case 'CREDIT_OFFICER':
      return t`creditOfficer`
    case 'CRM_SENIOR':
      return t`seniorCRM`
    case 'CRM':
      return t`crmStaff`
    case 'ACC_CONTROLLER':
      return t`accountingController`
    case 'ACCOUNTANT':
      return t`accountant`
    case 'SUPPORTER':
      return t`support`
    case 'ENTERPRISE':
      return t`enterprise`
    case 'EMPLOYEE':
      return t`employee`
    default:
      return role
  }
}

const ExampleContainer = () => {
  const { t, i18n } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Colors } = useTheme()
  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.auth)

  const [userId, setUserId] = useState('9')
  const [
    fetchOne,
    { data, isSuccess, isLoading, isFetching, error },
  ] = useLazyFetchOneQuery()

  useEffect(() => {
    fetchOne(userId)
  }, [fetchOne, userId])

  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }))
  }

  const [logoutServer] = useLogoutMutation()

  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList, 'Home'>
  >()

  return (
    <Screen preset="scroll" statusBackgroundColor={Colors.navBackground}>
      <ScrollView
        style={Layout.fill}
        contentContainerStyle={[Layout.fill, Layout.colCenter]}
      >
        <View
          style={[
            [
              // Layout.colCenter,
              // Gutters.smallHPadding,
              {
                backgroundColor: Colors.navBackground,
                height: 144,
                position: 'relative',
                paddingVertical: 12,
                paddingHorizontal: 16,
                justifyContent: 'center',
                width: '100%',
                flexDirection: 'row',
                flex: 1,
              },
            ],
          ]}
        >
          <AutoImage source={logo} style={{ height: 54, width: 100 }} />

          <Box
            shadow={1}
            style={{
              position: 'absolute',
              backgroundColor: Colors.white,
              left: 12,
              right: 12,
              paddingVertical: 16,
              paddingHorizontal: 16,
              top: 84,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="person-circle-outline"
              size={56}
              color={Colors.primary}
            />

            <Flex marginLeft="16px">
              <Text fontSize={18} fontWeight="600">
                {auth.user?.fullname}
              </Text>
              <Text>{getRoleDisplayText(auth.user?.role.name)}</Text>
            </Flex>
          </Box>
        </View>

        <Box width="100%" marginTop="48px">
          <Text
            paddingX={'12px'}
            marginBottom="8px"
            fontWeight="500"
            fontSize={16}
          >{t`home.paymentSchedule`}</Text>
          <CalendarStrip
            calendarAnimation={{ type: 'sequence', duration: 10 }}
            daySelectionAnimation={{
              type: 'border',
              duration: 200,
              borderWidth: 1,
              borderHighlightColor: Colors.primary,
            }}
            style={{
              marginHorizontal: 12,
              padding: 12,
              paddingBottom: 0,
              height: 90,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
            calendarHeaderStyle={{
              color: Colors.text,
              fontWeight: '500',
              fontSize: 14,
            }}
            calendarColor={Colors.white}
            dateNumberStyle={{
              color: Colors.text,
              fontWeight: '500',
              fontSize: 14,
            }}
            dateNameStyle={{ color: Colors.subText }}
            highlightDateNumberStyle={{ color: Colors.primary }}
            highlightDateNameStyle={{ color: Colors.primary }}
            onDateSelected={date => {
              // setSelectedDate(date.toISOString())
            }}
            onWeekChanged={monday => {
              const d = new Date(monday.toISOString())
              d.setDate(d.getDate() + 3)
              // getClientInWeekData(d.toISOString())
            }}
            markedDates={
              undefined
              // clientActive?.data?.map(
              // (item: any) => ({
              //   date: dayjs(item.meeting_date).format('YYYY-MM-DD'),
              //   lines: [
              //     {
              //       color: Colors.primary,
              //     },
              //   ],
              // }),
              // {},
              // )
            }
          />
        </Box>

        <View
          style={[
            { marginTop: 90 },
            Layout.row,
            Layout.rowHCenter,
            Gutters.smallHPadding,
            Gutters.largeVMargin,
            Common.backgroundPrimary,
          ]}
        >
          <Text style={[Layout.fill, Fonts.textCenter, Fonts.textSmall]}>
            {t('example.labels.userId')}
          </Text>
          <TextInput
            onChangeText={setUserId}
            editable={!isLoading}
            keyboardType={'number-pad'}
            maxLength={1}
            value={userId}
            selectTextOnFocus
            style={[Layout.fill, Common.textInput]}
          />
        </View>
        <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
          DarkMode :
        </Text>

        <TouchableOpacity
          style={[Common.button.rounded, Gutters.regularBMargin]}
          onPress={() => onChangeTheme({ darkMode: null })}
        >
          <Text style={Fonts.textRegular}>Auto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Common.button.outlineRounded, Gutters.regularBMargin]}
          onPress={() => onChangeTheme({ darkMode: true })}
        >
          <Text style={Fonts.textRegular}>Dark</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Common.button.outline, Gutters.regularBMargin]}
          onPress={() => onChangeTheme({ darkMode: false })}
        >
          <Text style={Fonts.textRegular}>Light</Text>
        </TouchableOpacity>

        <Button
          onPress={() => {
            i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')
          }}
        >
          Change Languages
        </Button>
        <Button
          onPress={async () => {
            try {
              await logoutServer()
            } catch (e) {
              console.log('Call logout api failed', e)
            }
            dispatch(logout())
          }}
        >
          Logout
        </Button>

        <Button onPress={() => navigation.navigate('Clients')}>navigate</Button>
      </ScrollView>
    </Screen>
  )
}

export default ExampleContainer
