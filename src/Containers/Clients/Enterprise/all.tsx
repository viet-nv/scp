import { Colors } from '@/Theme/Variables'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View, ViewStyle } from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import { Actionsheet, Box, Flex, Text, useDisclose } from 'native-base'
import {
  useGetReportSummaryQuery,
  useLazyGetEnterpriseQuery,
} from '@/Services/enterprise'
import { useAllEnterPrises, useAppDispatch } from '@/Store/hooks'
import { appendData, reset } from '@/Store/enterprises/all'
import EnterpriseList from './components/EnterpriseList'

const SUMMARY: ViewStyle = {
  backgroundColor: Colors.primary,
  padding: 8,
  borderRadius: 8,
}

const SummaryItem = ({
  text,
  count,
  isWarning,
  margin = true,
}: {
  text: string
  count: number
  isWarning?: boolean
  margin?: boolean
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingVertical: 12,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: margin ? 8 : 0,
      }}
    >
      <Text
        style={{
          color: isWarning ? Colors.warning : Colors.primary,
          fontSize: 16,
          fontWeight: '500',
        }}
      >
        {count}
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: '500',
        }}
      >
        {text}
      </Text>
    </View>
  )
}

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: any) => {
  const paddingToBottom = 20
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  )
}

export const AllEnterprise = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const allEnterprises = useAllEnterPrises()
  const [getEnterprises] = useLazyGetEnterpriseQuery()

  useEffect(() => {
    getEnterprises({ page: 1, size: 10 }).then(res => {
      dispatch(
        appendData({
          ...res.data.paginate,
          data: res.data.data,
        }),
      )
    })

    return () => {
      dispatch(reset())
    }
  }, [])

  const { data: reportSummary } = useGetReportSummaryQuery()

  const [loadingMore, setLoadingMore] = useState(false)

  const [clientsInWeek, setClientInWeek] = useState<
    { start: Date; end: Date; data: any }[]
  >([])
  const [date, setDate] = useState(new Date())

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
        getEnterprises({
          meeting_date_from: monday.toISOString(),
          meeting_date_to: sunday.toISOString(),
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
    [getEnterprises, clientsInWeek],
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

  const [filters, setFilters] = useState<{
    name: string
    tax_code: string
    senior_fullname: string
    status: string[]
  }>({
    name: '',
    tax_code: '',
    senior_fullname: '',
    status: [],
  })

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

      <ScrollView
        onScroll={async ({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            if (
              !loadingMore &&
              allEnterprises.data.length < allEnterprises.total_record
            ) {
              setLoadingMore(true)
              await getEnterprises({
                page: allEnterprises.page + 1,
                size: 10,
                name: filters.name || undefined,
                status: filters.status.join(',') || undefined,
                senior_fullname: filters.senior_fullname || undefined,
                tax_code: filters.tax_code || undefined,
              }).then(res => {
                dispatch(
                  appendData({
                    ...res.data.paginate,
                    data: res.data.data,
                  }),
                )
              })
              setLoadingMore(false)
            }
          }
        }}
        scrollEventThrottle={100}
      >
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
          calendarAnimation={{ type: 'parallel', duration: 30 }}
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

        <View style={{ padding: 16 }}>
          <View style={SUMMARY}>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                color: Colors.white,
                fontWeight: '500',
              }}
            >
              {' '}
              {t`enterpriseScreen.reportSummary`}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <SummaryItem
                text={t`enterpriseScreen.agreedToMeet`}
                count={
                  reportSummary?.find(item => item.status === 'AGREED_TO_MEET')
                    ?.total || 0
                }
                margin={false}
              />
              <SummaryItem
                text={t`enterpriseScreen.agreedToJoin`}
                count={
                  reportSummary?.find(item => item.status === 'AGREED_TO_JOIN')
                    ?.total || 0
                }
              />
              <SummaryItem
                text={t`enterpriseScreen.persuading`}
                count={
                  reportSummary?.find(item => item.status === 'PERSUADING')
                    ?.total || 0
                }
              />
            </View>

            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <SummaryItem
                text={t`enterpriseScreen.inProcessing`}
                count={
                  reportSummary?.find(
                    item => item.status === 'DOCUMENT_REVIEWING',
                  )?.total || 0
                }
                margin={false}
                isWarning
              />
              <SummaryItem
                text={t`enterpriseScreen.inAssessment`}
                count={
                  reportSummary?.find(item => item.status === 'ASSESSMENT')
                    ?.total || 0
                }
                isWarning
              />
              <SummaryItem
                text={t`enterpriseScreen.rejected`}
                count={
                  reportSummary?.find(item => item.status === 'REJECTED')
                    ?.total || 0
                }
                isWarning
              />
            </View>
          </View>

          <EnterpriseList
            loadingMore={loadingMore}
            filters={filters}
            setFilters={setFilters}
          />
        </View>
      </ScrollView>
    </>
  )
}

export default AllEnterprise
