import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Actionsheet, Box, Flex, Text } from 'native-base'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import CalendarStrip from 'react-native-calendar-strip'
import { Colors } from '@/Theme/Variables'
import { useLazyGetEmployeesQuery } from '@/Services/employee'

function Calendar() {
  const { t } = useTranslation()
  const [clientsInWeek, setClientInWeek] = useState<
    { start: Date; end: Date; data: any }[]
  >([])
  const [date, setDate] = useState(new Date())
  const [getEmployees] = useLazyGetEmployeesQuery()

  const getClientInWeekData = useCallback(
    (dateInput = new Date()) => {
      const d = new Date(dateInput)
      setDate(d)
      d.setHours(0, 0, 0, 0)
      const monday = new Date(d)
      monday.setDate(monday.getDate() - (monday.getDay() || 7) + 1)

      const sunday = new Date(d)
      sunday.setDate(sunday.getDate() - (sunday.getDay() || 7) + 7)
      sunday.setHours(23, 59, 59, 59)

      const found = clientsInWeek.find(item => item.start <= d && d <= item.end)

      if (!found)
        getEmployees({
          // meeting_date_from: monday.toISOString(),
          // meeting_date_to: sunday.toISOString(),
          size: 100,
        }).then(res =>
          setClientInWeek([
            ...clientsInWeek,
            {
              start: monday,
              end: sunday,
              data: res.data.data,
            },
          ]),
        )
    },
    [getEmployees, clientsInWeek],
  )

  useEffect(() => {
    getClientInWeekData()
  }, [])

  const clientActive = clientsInWeek.find(
    item => item.start <= date && date <= item.end,
  )
  const currentInWeek = clientActive?.data?.length || 0

  const [selectedDate, setSelectedDate] = useState('')

  const selectedWeek = clientsInWeek.find(
    item =>
      selectedDate &&
      item.start <= new Date(selectedDate) &&
      item.end >= new Date(selectedDate),
  )?.data

  return (
    <>
      <Actionsheet isOpen={!!selectedDate} onClose={() => setSelectedDate('')}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text fontSize="16" fontWeight="500">
              {t`enterpriseScreen.meetingSchedule`}
            </Text>
          </Box>
          {!!selectedWeek?.length ? (
            <ScrollView style={{ width: '100%' }}>
              {selectedWeek.map((item: any) => {
                return (
                  <Actionsheet.Item
                    key={item.id}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.border,
                    }}
                  >
                    <Flex flexDirection="row">
                      <Text color={Colors.subText}>
                        {t`enterpriseScreen.time`}:
                      </Text>{' '}
                      <Text fontWeight="500">
                        {dayjs(item.meeting_date).format('DD-MM-YYYY hh:mm')}
                      </Text>
                    </Flex>
                    <Flex flexDirection="row">
                      <Text color={Colors.subText}>
                        {t`enterpriseScreen.client`}:
                      </Text>{' '}
                      <Text fontWeight="500" noOfLines={2}>
                        {item.name}
                      </Text>
                    </Flex>
                  </Actionsheet.Item>
                )
              })}
            </ScrollView>
          ) : (
            <Text
              fontSize="16"
              color={Colors.subText}
              textAlign="center"
              padding="20"
            >{t`enterpriseScreen.noSchedule`}</Text>
          )}
        </Actionsheet.Content>
      </Actionsheet>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500' }}>
          {t`enterpriseScreen.meetingSchedule`}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14 }}>
            {t`enterpriseScreen.clientInWeek`}
          </Text>
          <Text
            style={{
              fontWeight: '500',
              color: Colors.primary,
              fontSize: 16,
            }}
          >
            {' '}
            {currentInWeek}
          </Text>
        </View>
      </View>
      <CalendarStrip
        calendarAnimation={{ type: 'sequence', duration: 10 }}
        daySelectionAnimation={{
          type: 'border',
          duration: 200,
          borderWidth: 1,
          borderHighlightColor: Colors.primary,
        }}
        style={{
          marginHorizontal: 16,
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
          setSelectedDate(date.toISOString())
        }}
        onWeekChanged={monday => {
          const d = new Date(monday.toISOString())
          d.setDate(d.getDate() + 3)
          getClientInWeekData(d.toISOString())
        }}
        markedDates={clientActive?.data?.map(
          (item: any) => ({
            date: dayjs(item.meeting_date).format('YYYY-MM-DD'),
            lines: [
              {
                color: Colors.primary,
              },
            ],
          }),
          {},
        )}
      />
    </>
  )
}

export default Calendar
