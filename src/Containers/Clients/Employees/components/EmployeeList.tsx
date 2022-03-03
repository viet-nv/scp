import React from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import {
  Actionsheet,
  Box,
  Button,
  Flex,
  Input,
  Text,
  useDisclose,
} from 'native-base'
import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  useAllEmployees,
  useAppDispatch,
  useOnboardedEmployees,
} from '@/Store/hooks'
import { Colors } from '@/Theme/Variables'
import Tag, { TagOutline } from '@/Components/Tag'
import {
  appendData as appendDataAll,
  reset as resetAll,
} from '@/Store/employees/all'
import {
  appendData as appendDataOnboarded,
  reset as resetOnboarded,
} from '@/Store/employees/onBoarded'
import { useNavigation } from '@react-navigation/native'
import { useLazyGetEmployeesQuery } from '@/Services/employee'

export const getStatusText = (key: string): string => {
  switch (key) {
    case 'NEW':
      return 'enterpriseScreen.new'
    case 'PERSUADING':
      return 'enterpriseScreen.persuading'
    case 'AGREED_TO_MEET':
      return 'enterpriseScreen.agreedToMeet'
    case 'AGREED_TO_JOIN':
      return 'enterpriseScreen.agreedToJoin'
    case 'PROCESSING':
      return 'enterpriseScreen.inProcessing'
    case 'CONSIDERING':
      return 'enterpriseScreen.considering'
    case 'REJECTED':
      return 'enterpriseScreen.rejected'
    case 'REGISTERED':
      return 'enterpriseScreen.registered'
    case 'ASSESSMENT':
      return 'enterpriseScreen.inAssessment'
    case 'DOCUMENT_REVIEWING':
      return 'enterpriseScreen.documentReviewing'
    case 'ONBOARDED':
      return 'enterpriseScreen.onboarded'
    case 'STOP_CORPORATION':
      return 'enterpriseScreen.stopCorperation'
    case 'ACTIVATE':
      return 'enterpriseScreen.activate'
    default:
      return key
  }
}

export const getStatusColor = (key: string): string => {
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
    case 'ONBOARDED':
      return Colors.success
    case 'NEW':
      return Colors.error
    case 'STOP_CORPORATION':
      return Colors.warning

    default:
      return Colors.primary
  }
}

type Filter = {
  name: string
  erc_number: string
  senior_fullname: string
  status: string[]
}

function EmployeeList({
  loadingMore,
  filters,
  setFilters,
  isOnboarded = false,
}: {
  loadingMore: boolean
  filters: Filter
  setFilters: (filters: Filter) => void
  isOnboarded?: boolean
}) {
  const { t } = useTranslation()

  const allEmployees = useAllEmployees()
  const onboardedEmployees = useOnboardedEmployees()

  const appendData = isOnboarded ? appendDataOnboarded : appendDataAll
  const reset = isOnboarded ? resetOnboarded : resetAll
  const employees = !isOnboarded ? allEmployees : onboardedEmployees

  const dispatch = useAppDispatch()
  const navigation: any = useNavigation()

  const [getEmployees, { isLoading, isFetching }] = useLazyGetEmployeesQuery()

  const { isOpen, onOpen, onClose } = useDisclose()
  const handleTagClick = (status: string) => {
    const idx = filters.status.indexOf(status)
    const tmp = { ...filters }
    if (idx > -1) {
      tmp.status.splice(idx, 1)
    } else {
      tmp.status.push(status)
    }
    setFilters(tmp)
  }

  const filterCount =
    +!!filters.status.length +
    +!!filters.name +
    +!!filters.erc_number +
    +!!filters.senior_fullname

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Text
            fontWeight="500"
            fontSize={16}
          >{t`enterpriseScreen.filter`}</Text>
          <Box
            width="100%"
            marginTop="24px"
            paddingX="16px"
            position="relative"
          >
            <Text>{t`employeeScreen.employeeName`}</Text>
            <Input
              marginTop="8px"
              placeholder={t`employeeScreen.employeeName`}
              width="100%"
              value={filters.name}
              onChangeText={name => setFilters({ ...filters, name })}
            />

            <Text marginTop="24px">{t`employeeScreen.idCardNo`}</Text>
            <Input
              marginTop="8px"
              placeholder={t`employeeScreen.idCardNo`}
              width="100%"
              value={filters.erc_number}
              onChangeText={erc_number =>
                setFilters({ ...filters, erc_number })
              }
            />

            {!isOnboarded && (
              <>
                <Text marginTop="24px">{t`enterpriseScreen.enterpriseStatus`}</Text>
                <Flex flexDirection="row" flexWrap="wrap">
                  <Box margin="4px">
                    <TagOutline
                      active={filters.status.includes('AGREED_TO_MEET')}
                      onPress={() => handleTagClick('AGREED_TO_MEET')}
                    >{t`enterpriseScreen.agreedToMeet`}</TagOutline>
                  </Box>
                  <Box margin="4px">
                    <TagOutline
                      onPress={() => handleTagClick('AGREED_TO_JOIN')}
                      active={filters.status.includes('AGREED_TO_JOIN')}
                    >{t`enterpriseScreen.agreedToJoin`}</TagOutline>
                  </Box>
                  <Box margin="4px">
                    <TagOutline
                      active={filters.status.includes('PERSUADING')}
                      onPress={() => handleTagClick('PERSUADING')}
                    >{t`enterpriseScreen.persuading`}</TagOutline>
                  </Box>
                  <Box margin="4px">
                    <TagOutline
                      active={filters.status.includes('DOCUMENT_REVIEWING')}
                      onPress={() => handleTagClick('DOCUMENT_REVIEWING')}
                    >{t`enterpriseScreen.inProcessing`}</TagOutline>
                  </Box>
                  <Box margin="4px">
                    <TagOutline
                      active={filters.status.includes('ASSESSMENT')}
                      onPress={() => handleTagClick('ASSESSMENT')}
                    >{t`enterpriseScreen.inAssessment`}</TagOutline>
                  </Box>
                  <Box margin="4px">
                    <TagOutline
                      active={filters.status.includes('REJECTED')}
                      onPress={() => handleTagClick('REJECTED')}
                    >{t`enterpriseScreen.rejected`}</TagOutline>
                  </Box>
                </Flex>
              </>
            )}

            <Text marginTop="24px">{t`enterpriseScreen.assignedAccount`}</Text>
            <Input
              marginTop="8px"
              placeholder={t`enterpriseScreen.assignedAccount`}
              width="100%"
              value={filters.senior_fullname}
              onChangeText={senior_fullname =>
                setFilters({ ...filters, senior_fullname })
              }
            />
            <Box flexDirection="row" marginTop="16px" paddingY="12px">
              <Button
                flex={1}
                variant="outline"
                onPress={() => {
                  setFilters({
                    name: '',
                    erc_number: '',
                    senior_fullname: '',
                    status: [],
                  })
                  dispatch(reset())

                  getEmployees({
                    page: 1,
                    size: 10,
                    status: isOnboarded ? 'ONBOARDED' : undefined,
                  }).then(res => {
                    dispatch(
                      appendData({
                        ...res.data.paginate,
                        data: res.data.data,
                      }),
                    )
                  })
                  onClose()
                }}
              >{t`enterpriseScreen.clearFilter`}</Button>
              <Button
                flex={1}
                marginLeft="16px"
                onPress={() => {
                  dispatch(reset())

                  getEmployees({
                    page: 1,
                    size: 10,
                    name: filters.name || undefined,
                    status: isOnboarded
                      ? 'ONBOARDED'
                      : filters.status.join(',') || undefined,
                    senior_fullname: filters.senior_fullname || undefined,
                  }).then(res => {
                    dispatch(
                      appendData({
                        ...res.data.paginate,
                        data: res.data.data,
                      }),
                    )
                  })

                  onClose()
                }}
              >{t`enterpriseScreen.apply`}</Button>
            </Box>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 16,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500' }}>
          {t`employeeScreen.employeeList`}
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            position: 'relative',
          }}
          onPress={onOpen}
        >
          {!!filterCount && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -8,
                backgroundColor: Colors.primary,
                borderRadius: 50,
                width: 16,
                height: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text fontSize="10px" color="white">
                {filterCount}
              </Text>
            </View>
          )}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              marginRight: 6,
            }}
            color={filterCount ? Colors.primary : Colors.text}
          >
            {' '}
            {t`enterpriseScreen.filter`}
          </Text>
          <Ionicons
            name="filter"
            size={16}
            color={filterCount ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 12,
          paddingBottom: 72,
        }}
      >
        {employees.data.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.border,
              paddingVertical: 12,
            }}
            onPress={() =>
              navigation.navigate('EmployeeDetail', { id: item.id })
            }
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
                  {t`employeeScreen.idCardNo` + ':'}
                </Text>
                <Text
                  style={{
                    marginLeft: 4,
                    fontSize: 12,
                    fontWeight: '500',
                  }}
                >
                  {item.erc_number}
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
                  {item.senior_user?.fullname}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        {(isFetching || isLoading || loadingMore) && (
          <ActivityIndicator size="small" style={{ marginTop: 24 }} />
        )}
        {!isFetching && !loadingMore && !employees.data.length && (
          <Text textAlign="center" marginTop="24px" color={Colors.subText}>
            {t`enterpriseScreen.noEnterpriseFound`}
          </Text>
        )}
      </View>
    </>
  )
}

export default EmployeeList
