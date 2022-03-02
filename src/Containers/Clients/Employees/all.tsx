import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { useAllEmployees, useAppDispatch } from '@/Store/hooks'
import { appendData, reset } from '@/Store/employees/all'
import EmployeeList from './components/EmployeeList'
import Calendar from './components/Calendar'
import ReportSummary from './components/ReportSummary'
import { useLazyGetEmployeesQuery } from '@/Services/employee'

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

export const AllEmployees = () => {
  const dispatch = useAppDispatch()

  const allEnterprises = useAllEmployees()
  const [getEmployees, { isLoading, isFetching }] = useLazyGetEmployeesQuery()

  useEffect(() => {
    getEmployees({ page: 1, size: 10 }).then(res => {
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
              getEmployees({ page: 1, size: 10 }).then(res => {
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
              await getEmployees({
                page: allEnterprises.page + 1,
                size: 10,
                name: filters.name || undefined,
                status: filters.status.join(',') || undefined,
                senior_fullname: filters.senior_fullname || undefined,
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
          <EmployeeList
            loadingMore={loadingMore}
            filters={filters}
            setFilters={setFilters}
          />
        </View>
      </ScrollView>
    </>
  )
}

export default AllEmployees
