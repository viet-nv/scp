import { Header, Screen } from '@/Components'
// import { useGetFrequencyQuery } from '@/Services/enterprise'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Actionsheet,
  Box,
  Divider,
  Flex,
  Text,
  useDisclose,
  VStack,
} from 'native-base'
import React from 'react'
import Tag from '@/Components/Tag'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getStatusColor, getStatusText } from './components/EmployeeList'
import dayjs from 'dayjs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useGetEmployeeDetailQuery,
  useGetWorkingQuery,
} from '@/Services/employee'

function EmployeeDetail() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()

  const { data, isLoading, refetch } = useGetEmployeeDetailQuery(
    route.params.id,
  )

  const { data: workingData } = useGetWorkingQuery(route.params.id)
  // const {
  //   data: frequencyData,
  //   refetch: refetchFrequency,
  // } = useGetFrequencyQuery(route.params.id)

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
      // refetchFrequency()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const [isOpenInfo, setOnpenInfo] = React.useState(true)
  const [isOpenDesignatedAcc, setOnpenDesignatedAcc] = React.useState(false)
  const [isOpenPayrollTerm, setOnpenPayrollTerm] = React.useState(false)

  const { isOpen, onOpen, onClose } = useDisclose()

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Text fontWeight="500" fontSize={16}>
            Menu
          </Text>
          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('UpdateEmployee', {
                data,
              })
            }}
          >
            <Flex
              flexDirection="row"
              paddingX="16px"
              paddingY="12px"
              alignItems="center"
            >
              <Ionicons name="create-outline" size={20} color={Colors.text} />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`enterpriseScreen.update`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('EmployeeClientReport', {
                id: route.params.id,
                STATUSES: data.to_statuses || [],
              })
            }}
          >
            <Flex
              flexDirection="row"
              paddingX="16px"
              paddingY="12px"
              alignItems="center"
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={Colors.text}
              />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`enterpriseScreen.clientReport`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('EmployeeLegalDocuments', {
                id: route.params.id,
              })
            }}
          >
            <Flex
              flexDirection="row"
              paddingX="16px"
              paddingY="12px"
              alignItems="center"
            >
              <Ionicons color={Colors.text} name="document-outline" size={20} />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`enterpriseScreen.legalDocuments`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item padding="0">
            <Flex
              flexDirection="row"
              paddingX="16px"
              paddingY="12px"
              alignItems="center"
            >
              <Ionicons color={Colors.text} name="contract-outline" size={20} />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`enterpriseScreen.contractManagement`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('EmployeeBankAccount', {
                id: route.params.id,
              })
            }}
          >
            <Flex
              flexDirection="row"
              paddingX="16px"
              paddingY="12px"
              alignItems="center"
            >
              <Ionicons color={Colors.text} name="receipt-outline" size={20} />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`employeeScreen.bankAccountOfPaymentReceive`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item padding="0">
            <Flex
              flexDirection="row"
              paddingX="16px"
              paddingY="12px"
              alignItems="center"
            >
              <Ionicons
                color={Colors.text}
                name="information-circle-outline"
                size={20}
              />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`employeeScreen.ekycInfo`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('EmployeeAssignedAccount', {
                id: route.params.id,
              })
            }}
          >
            <Flex
              flexDirection="row"
              paddingX="16px"
              paddingY="12px"
              alignItems="center"
            >
              <Ionicons color={Colors.text} name="person-outline" size={20} />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`enterpriseScreen.assignedAccount`}
              </Text>
            </Flex>
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.background}
      >
        <Header
          title={t`employeeScreen.employeeDetail`}
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
          rightIcon="ellipsis-horizontal"
          onRightPress={() => {
            onOpen()
          }}
        />

        {isLoading ? (
          <ActivityIndicator size="small" style={{ marginTop: 80 }} />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => refetch()}
              />
            }
            style={{
              marginTop: 56,
              marginBottom: insets.bottom,
            }}
          >
            <Box marginTop="14px" backgroundColor={Colors.white}>
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setOnpenInfo(prev => !prev)}
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`enterpriseScreen.commonInfo`}</Text>
                <Ionicons
                  name={
                    isOpenInfo
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                  size={24}
                  color={Colors.subText}
                />
              </TouchableOpacity>
              {isOpenInfo && (
                <VStack space={2} paddingX="16px" paddingBottom="16px">
                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.employeeName`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.name}
                    </Text>
                  </Flex>
                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.status`}
                    </Text>
                    <Tag
                      text={t(getStatusText(data.status))}
                      backgroundColor={getStatusColor(data.status)}
                      textColor={Colors.white}
                    />
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.idCardNo`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.erc_number || '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.issuanceDate`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.first_granted_date
                        ? dayjs(data.first_granted_date).format('DD-MM-YYYY')
                        : '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.issuanceAgency`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.issuance_agency || '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.permanentAddress`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.address || '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.contactAddress`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.contact_address || '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.phone`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.phone || '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      Email
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.email || '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.birthday`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.birthday
                        ? dayjs(data.birthday).format('DD-MM-YYYY')
                        : '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.gender`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.gender
                        ? data.gender === 'MALE'
                          ? t`Mr`
                          : t`Ms`
                        : '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.registrationBookNo`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.registration_no || '--'}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`employeeScreen.socialInsuranceBookNo`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.social_insurance_no || '--'}
                    </Text>
                  </Flex>
                </VStack>
              )}
            </Box>

            <Box marginTop="12px" backgroundColor={Colors.white}>
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setOnpenDesignatedAcc(prev => !prev)}
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`employeeScreen.designatedAccount`}</Text>
                <Ionicons
                  name={
                    isOpenDesignatedAcc
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                  size={24}
                  color={Colors.subText}
                />
              </TouchableOpacity>

              {isOpenDesignatedAcc && (
                <VStack space="2" paddingX="12px" paddingBottom="12px">
                  {workingData?.data?.map((item: any, index: number) => (
                    <React.Fragment key={item.id}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('EmployeeAccount', {
                            employee_id: route.params.id,
                            enterprise: item.enterprise,
                          })
                        }
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text fontWeight="500">{item.enterprise.name}</Text>
                        <Ionicons
                          name="chevron-forward"
                          color={Colors.subText}
                        />
                      </TouchableOpacity>
                      {index !== workingData?.data?.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </VStack>
              )}
            </Box>

            <Box marginTop="12px" backgroundColor={Colors.white}>
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setOnpenPayrollTerm(prev => !prev)}
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`employeeScreen.payrollTerms`}</Text>
                <Ionicons
                  name={
                    isOpenPayrollTerm
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                  size={24}
                  color={Colors.subText}
                />
              </TouchableOpacity>

              {isOpenPayrollTerm && (
                <VStack space="2" paddingX="12px" paddingBottom="12px"></VStack>
              )}
            </Box>
          </ScrollView>
        )}
      </Screen>
    </>
  )
}

export default EmployeeDetail
