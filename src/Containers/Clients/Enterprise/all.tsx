import { Colors } from '@/Theme/Variables'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Actionsheet, Box, Flex, Text, useDisclose } from 'native-base'
import Tag from '@/Components/Tag'
import {
  useGetReportSummaryQuery,
  useLazyGetEnterpriseQuery,
} from '@/Services/enterprise'
import { useAllEnterPrises, useAppDispatch } from '@/Store/hooks'
import { appendData, reset } from '@/Store/enterprises/all'

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

const getStatusText = (key: string): string => {
  switch (key) {
    case 'PERSUADING':
      return 'enterpriseScreen.persuading'
    case 'AGREED_TO_MEET':
      return 'enterpriseScreen.agreedToMeet'
    case 'AGREED_TO_JOIN':
      return 'enterpriseScreen.agreedToJoin'
    case 'ASSESSMENT':
      return 'enterpriseScreen.inAssessment'
    case 'DOCUMENT_REVIEWING':
      return 'enterpriseScreen.inProcessing'
    case 'REJECTED':
      return 'enterpriseScreen.rejected'

    default:
      return ''
  }
}

const getStatusColor = (key: string): string => {
  switch (key) {
    case 'PERSUADING':
      return Colors.warning
    case 'AGREED_TO_MEET':
      return Colors.primary
    case 'AGREED_TO_JOIN':
      return Colors.success
    case 'IN_ASSESSMENT':
      return Colors.warning
    case 'IN_PROCESSING':
      return Colors.warning
    case 'REJECTED':
      return Colors.error

    default:
      return ''
  }
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
          setClientInWeek(prev => [
            ...prev,
            {
              start: monday,
              end: sunday,
              data: res.data.data,
            },
          ]),
        )
    },
    [getEnterprises],
  )

  useEffect(() => {
    getClientInWeekData()
  }, [getClientInWeekData])

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

  const { isOpen, onOpen, onClose } = useDisclose()

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text fontSize="16" fontWeight="500">
              {t`enterpriseScreen.meetingSchedule`}
            </Text>
          </Box>
          <ScrollView style={{ width: '100%' }}>
            {!!selectedWeek?.length ? (
              selectedWeek.map((item: any) => (
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
              ))
            ) : (
              <Text
                fontSize="16"
                color={Colors.subText}
                textAlign="center"
                padding="20"
              >{t`enterpriseScreen.noSchedule`}</Text>
            )}
          </ScrollView>
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
        scrollEventThrottle={400}
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
        <CalendarProvider
          date={date.toISOString()}
          onDateChanged={date => {
            getClientInWeekData(date)
          }}
        >
          <ExpandableCalendar
            firstDay={1}
            calendarHeight={1}
            current={date.toISOString()}
            theme={{
              textMonthFontWeight: '500',
              textSectionTitleColor: Colors.text,
              textDayHeaderFontWeight: '500',
              dayTextColor: Colors.text,
              textDisabledColor: Colors.text,
            }}
            onDayPress={({ timestamp }) => {
              setSelectedDate(dayjs(timestamp).format())
              onOpen()
            }}
            markedDates={clientActive?.data?.reduce(
              (acc: any, cur: any) => ({
                ...acc,
                [dayjs(cur.meeting_date).format('YYYY-MM-DD')]: {
                  marked: true,
                  selected: true,
                },
              }),
              {},
            )}
          />
        </CalendarProvider>

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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              {t`enterpriseScreen.enterpriseList`}
            </Text>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'flex-end' }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  marginRight: 6,
                }}
              >
                {' '}
                {t`enterpriseScreen.filter`}
              </Text>
              <Ionicons name="filter" size={16} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 12,
              paddingBottom: 72,
            }}
          >
            {allEnterprises.data.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '500' }}>
                    {item.name}
                  </Text>
                  <Tag
                    text={t(getStatusText(item.status))}
                    backgroundColor={getStatusColor(item.status)}
                    textColor={Colors.white}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 4,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: Colors.subText }}>
                      {' '}
                      {t`enterpriseScreen.tax` + ':'}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 4,
                        fontSize: 12,
                        fontWeight: '500',
                      }}
                    >
                      {item.tax_code}
                    </Text>
                  </View>
                </View>

                {item.senior_user && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: Colors.subText }}>
                      {' '}
                      {t`enterpriseScreen.seniorName` + ':'}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 4,
                        fontSize: 12,
                        fontWeight: '500',
                      }}
                    >
                      {/* @ts-ignore */}
                      {item.senior_user?.fullname}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {loadingMore && (
              <ActivityIndicator size="small" style={{ marginTop: 24 }} />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default AllEnterprise
