import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { Box, Flex, Text } from 'native-base'
import { useLogoutMutation } from '@/Services/auth'
import { useAppDispatch, useAppSelector } from '@/Store/hooks'
import { Screen } from '@/Components/Screen/screen'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/Navigators/utils'
import { StackNavigationProp } from '@react-navigation/stack'
import { AutoImage } from '@/Components/AutoImage'
import { t } from 'i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CalendarStrip from 'react-native-calendar-strip'
import { formatNum } from '@/Utils'

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

        <Flex flexDirection="row" alignItems="center" padding="12px">
          <View
            style={{
              borderColor: Colors.primary,
              marginRight: 12,
              borderRadius: 4,
              borderWidth: 1,
              flex: 1,
              padding: 12,
            }}
          >
            <Text
              fontSize={12}
              fontWeight="500"
              textAlign="center"
            >{t`home.transactionAmountInMonth`}</Text>
            <Text
              textAlign="center"
              marginTop="8px"
              color={Colors.error}
              fontWeight="500"
            >
              {formatNum(100000000)}
            </Text>
          </View>
          <View
            style={{
              borderColor: Colors.primary,
              borderRadius: 4,
              borderWidth: 1,
              flex: 1,
              padding: 12,
            }}
          >
            <Text
              fontSize={12}
              fontWeight="500"
              textAlign="center"
            >{t`home.averageBalanceInMonth`}</Text>
            <Text
              textAlign="center"
              marginTop="8px"
              color={Colors.error}
              fontWeight="500"
            >
              {formatNum(100000000)}
            </Text>
          </View>
        </Flex>

        <View style={{ padding: 12, width: '100%' }}>
          <View
            style={{
              padding: 12,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text>{t`home.onboardedClient`}</Text>
          </View>
        </View>
        {/* <Text style={[Fonts.textRegular, Gutters.smallBMargin]}> */}

        {/*   DarkMode : */}
        {/* </Text> */}

        {/* <TouchableOpacity */}
        {/*   style={[Common.button.rounded, Gutters.regularBMargin]} */}
        {/*   onPress={() => onChangeTheme({ darkMode: null })} */}
        {/* > */}
        {/*   <Text style={Fonts.textRegular}>Auto</Text> */}
        {/* </TouchableOpacity> */}

        {/* <TouchableOpacity */}
        {/*   style={[Common.button.outlineRounded, Gutters.regularBMargin]} */}
        {/*   onPress={() => onChangeTheme({ darkMode: true })} */}
        {/* > */}
        {/*   <Text style={Fonts.textRegular}>Dark</Text> */}
        {/* </TouchableOpacity> */}

        {/* <TouchableOpacity */}
        {/*   style={[Common.button.outline, Gutters.regularBMargin]} */}
        {/*   onPress={() => onChangeTheme({ darkMode: false })} */}
        {/* > */}
        {/*   <Text style={Fonts.textRegular}>Light</Text> */}
        {/* </TouchableOpacity> */}
      </ScrollView>
    </Screen>
  )
}

export default ExampleContainer
