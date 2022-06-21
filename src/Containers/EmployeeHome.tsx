import React, { useState, useEffect } from 'react'
import { View, ScrollView, NativeModules, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Box, Button, Flex, HStack, Text } from 'native-base'
import { useLogoutMutation } from '@/Services/auth'
import { useAppDispatch, useAppSelector } from '@/Store/hooks'
import { Screen } from '@/Components/Screen/screen'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/Navigators/utils'
import { StackNavigationProp } from '@react-navigation/stack'
import { AutoImage } from '@/Components/AutoImage'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CalendarStrip from 'react-native-calendar-strip'
import { formatNum } from '@/Utils'
import { Config } from '@/Config'
import CircularProgress from 'react-native-circular-progress-indicator'

const { RNEkycVnptSdk } = NativeModules
const logo =
  Config.APP === 'epayz'
    ? require('../Assets/Images/epayz-gray-old.png')
    : require('../Assets/Images/scp-logo.png')

const EmployeeHome = () => {
  const { t } = useTranslation()
  const { Layout, Colors } = useTheme()
  const auth = useAppSelector(state => state.auth)

  const navigation: any = useNavigation()

  return (
    <Screen
      preset="scroll"
      statusBackgroundColor={Colors.white}
      statusBar="dark-content"
    >
      <ScrollView
        style={Layout.fill}
        contentContainerStyle={[Layout.fill, Layout.colCenter]}
      >
        <HStack
          padding="16px"
          justifyContent="flex-start"
          width="100%"
          marginBottom="8px"
        >
          <Text fontSize={18} fontWeight="600">{t`Hello, `}</Text>
          <Text fontSize={18} fontWeight="600" color={Colors.primary}>
            {auth.user?.fullname}
          </Text>
        </HStack>

        <CircularProgress
          value={60}
          radius={113}
          duration={0}
          activeStrokeColor={Colors.primary}
          inActiveStrokeColor={Colors.primary + '33'}
          activeStrokeWidth={13}
          inActiveStrokeWidth={13}
          valueSuffix={'%'}
          maxValue={100}
          progressValueStyle={{ fontSize: 28 }}
          title={'Có thể ứng'}
          titleStyle={{
            fontSize: 18,
            fontWeight: '500',
            color: Colors.text,
          }}
          subtitle="90.000.000đ"
          subtitleStyle={{ fontSize: 24, fontWeight: '700' }}
        />

        <Button
          marginTop="20px"
          onPress={() => navigation.navigate('Payroll')}
        >{t`Request now!`}</Button>

        <Box width="100%" marginTop="28px">
          <Text
            paddingX={'12px'}
            marginBottom="16px"
            fontWeight="500"
            fontSize={18}
          >{t`Attendance Detail`}</Text>
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

        {/* <Button */}
        {/*   onPress={() => { */}
        {/*     if (Platform.OS == 'ios') { */}
        {/*       RNEkycVnptSdk.initVnptEkyc('0') */}
        {/*         .then((result: any) => { */}
        {/*           console.log('result ekyc:' + result) */}
        {/*         }) */}
        {/*         .catch((err: any) => { */}
        {/*           console.log('err ekyc:' + err) */}
        {/*         }) */}
        {/*     } */}
        {/*   }} */}
        {/* > */}
        {/*   test */}
        {/* </Button> */}
      </ScrollView>
    </Screen>
  )
}

export default EmployeeHome
