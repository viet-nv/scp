import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useAppDispatch, useOnboardedEmployees } from '@/Store/hooks'
import { appendData, reset } from '@/Store/employees/onBoarded'
import EnterpriseList from './components/EmployeeList'
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

export const OnboardedEmployee = () => {
  const dispatch = useAppDispatch()

  const onboardedEmployees = useOnboardedEmployees()
  const [getEmployees] = useLazyGetEmployeesQuery()

  useEffect(() => {
    getEmployees({ page: 1, size: 10, status: 'ONBOARDED' }).then(res => {
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
    erc_number: string
    senior_fullname: string
    status: string[]
  }>({
    name: '',
    erc_number: '',
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
              onboardedEmployees.data.length < onboardedEmployees.total_record
            ) {
              setLoadingMore(true)
              await getEmployees({
                page: onboardedEmployees.page + 1,
                size: 10,
                name: filters.name || undefined,
                status: 'ONBOARDED',
                senior_fullname: filters.senior_fullname || undefined,
                erc_number: filters.erc_number || undefined,
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
        <View style={{ padding: 16 }}>
          <EnterpriseList
            loadingMore={loadingMore}
            filters={filters}
            setFilters={setFilters}
            isOnboarded
          />
        </View>
      </ScrollView>
    </>
  )
}

export default OnboardedEmployee
