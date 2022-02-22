import { Header, Screen } from '@/Components'
import { useLazyClientReportQuery } from '@/Services/enterprise'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Fab, FlatList, Flex, Icon, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getStatusText } from './components/EnterpriseList'

function ClientReport() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const [reports, setReports] = useState({
    data: [],
    page: 1,
    size: 10,
    total_record: 0,
  })

  const [
    getClientReports,
    { isLoading, isFetching },
  ] = useLazyClientReportQuery()

  const init = () => {
    getClientReports({
      id: route.params.id,
      params: { page: 1, size: 10 },
    }).then(res => {
      setReports({
        ...res.data.paginate,
        data: res.data.data,
      })
    })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      init()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    init()
  }, [])

  return (
    <Screen
      preset="fixed"
      statusBackgroundColor={Colors.navBackground}
      backgroundColor={Colors.white}
    >
      <Header
        title={t`enterpriseScreen.clientReport`}
        style={{
          backgroundColor: Colors.navBackground,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
        }}
        titleStyle={{ color: Colors.white }}
        leftIcon="arrow-back-outline"
        onLeftPress={() => navigation.goBack()}
      />

      <Fab
        renderInPortal={false}
        shadow={2}
        size="sm"
        icon={<Icon as={Ionicons} size="sm" name="add" color="white" />}
        onPress={() =>
          navigation.navigate('AddNewClientReport', {
            id: route.params.id,
            STATUSES: route.params.STATUSES,
          })
        }
      />

      <FlatList
        style={{
          marginTop: 56,
          marginBottom: insets.bottom,
        }}
        ListHeaderComponent={
          <>
            <Text
              fontSize="16px"
              fontWeight="500"
              marginTop="16px"
              marginX="16px"
            >{t`enterpriseScreen.reportHistory`}</Text>
            <Flex
              alignItems="center"
              paddingX="16px"
              paddingY="8px"
              backgroundColor={`${Colors.primary}33`}
              flexDirection="row"
              marginTop="12px"
            >
              <Text flex={3} fontSize="12px">{t`enterpriseScreen.date`}</Text>
              <Text
                flex={4}
                marginLeft="8px"
                fontSize="12px"
              >{t`enterpriseScreen.status`}</Text>
              <Text
                flex={4}
                fontSize="12px"
                marginLeft="8px"
              >{t`enterpriseScreen.note`}</Text>
            </Flex>
          </>
        }
        data={reports.data}
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <Text
              color={Colors.subText}
              textAlign="center"
              padding="16px"
            >{t`common.noDataFound`}</Text>
          ) : undefined
        }
        renderItem={({ item, index }: { item: any; index: number }) => {
          return (
            <Flex
              key={item.id}
              flexDirection="row"
              alignItems="center"
              paddingX="16px"
              paddingY="8px"
              marginBottom={index === reports.total_record - 1 ? '72px' : '0px'}
              backgroundColor={
                index % 2 === 1 ? Colors.lightGray : Colors.white
              }
            >
              <Flex flex={3}>
                <Text fontSize="12px">
                  {dayjs(item.created_at).format('hh:mm')}
                </Text>
                <Text fontSize="12px">
                  {dayjs(item.created_at).format('DD-MM-YYYY')}
                </Text>
              </Flex>

              <Flex flex={4} marginLeft="8px">
                <Text fontSize="12px">{t(getStatusText(item.status))}</Text>
                <Text fontSize="12px">
                  {item.meeting_date
                    ? dayjs(item.meeting_date).format('DD-MM-YYYY hh:mm')
                    : undefined}
                </Text>
              </Flex>
              <Text flex={4} fontSize="12px" marginLeft="8px">
                {item.note}
              </Text>
            </Flex>
          )
        }}
        ListFooterComponent={
          isLoading || isFetching ? <ActivityIndicator /> : undefined
        }
        ListFooterComponentStyle={{ padding: 16 }}
        onEndReached={() => {
          if (
            !isLoading &&
            !isFetching &&
            reports.data.length < reports.total_record
          )
            getClientReports({
              id: route.params.id,
              params: { page: reports.page + 1, size: 10 },
            }).then(res => {
              setReports({
                ...res.data.paginate,
                data: [...reports.data, ...res.data.data],
              })
            })
        }}
        onEndReachedThreshold={50}
      />
    </Screen>
  )
}

export default ClientReport
