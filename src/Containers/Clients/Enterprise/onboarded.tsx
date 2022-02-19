import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useLazyGetEnterpriseQuery } from '@/Services/enterprise'
import { useAppDispatch, useOnboardedEnterprises } from '@/Store/hooks'
import { appendData, reset } from '@/Store/enterprises/onBoarded'
import EnterpriseList from './components/EnterpriseList'

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

export const OnboardedEnterprise = () => {
  const dispatch = useAppDispatch()

  const onboardedEnterprises = useOnboardedEnterprises()
  const [getEnterprises] = useLazyGetEnterpriseQuery()

  useEffect(() => {
    getEnterprises({ page: 1, size: 10, status: 'ONBOARDED' }).then(res => {
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
        onScroll={async ({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            if (
              !loadingMore &&
              onboardedEnterprises.data.length <
                onboardedEnterprises.total_record
            ) {
              setLoadingMore(true)
              await getEnterprises({
                page: onboardedEnterprises.page + 1,
                size: 10,
                name: filters.name || undefined,
                status: 'ONBOARDED',
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

export default OnboardedEnterprise
