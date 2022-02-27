import { Colors } from '@/Theme/Variables'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View, ViewStyle } from 'react-native'
import { Text } from 'native-base'
import {
  useGetReportSummaryQuery,
  useLazyGetEnterpriseQuery,
} from '@/Services/enterprise'
import { useAllEnterPrises, useAppDispatch } from '@/Store/hooks'
import { appendData, reset } from '@/Store/enterprises/all'
import EnterpriseList from './components/EnterpriseList'
import Calendar from './components/Calendar'

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
        <Calendar />

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
