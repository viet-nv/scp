import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { useLazyGetEnterpriseQuery } from '@/Services/enterprise'
import { useAllEnterPrises, useAppDispatch } from '@/Store/hooks'
import { appendData, reset } from '@/Store/enterprises/all'
import EnterpriseList from './components/EnterpriseList'
import Calendar from './components/Calendar'
import ReportSummary from './components/ReportSummary'

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
  const dispatch = useAppDispatch()

  const allEnterprises = useAllEnterPrises()
  const [
    getEnterprises,
    { isLoading, isFetching },
  ] = useLazyGetEnterpriseQuery()

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
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isFetching}
            onRefresh={() => {
              dispatch(reset())
              getEnterprises({ page: 1, size: 10 }).then(res => {
                dispatch(
                  appendData({
                    ...res.data.paginate,
                    data: res.data.data,
                  }),
                )
              })
            }}
          />
        }
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
          <ReportSummary />
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
