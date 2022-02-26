import { Header, Screen } from '@/Components'
import {
  useGetEnterpriseDetailQuery,
  useGetFrequencyQuery,
} from '@/Services/enterprise'
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
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getStatusColor, getStatusText } from './components/EnterpriseList'
import dayjs from 'dayjs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function EnterpriseDetail() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()

  const { data, isLoading, refetch } = useGetEnterpriseDetailQuery(
    route.params.id,
  )
  const {
    data: frequencyData,
    refetch: refetchFrequency,
  } = useGetFrequencyQuery(route.params.id)

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
      refetchFrequency()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const [isOpenInfo, setOnpenInfo] = React.useState(true)
  const [isOpenPaymentInfo, setOnpenPaymentInfo] = React.useState(false)
  const [
    isOpenTxRepresentativeInfo,
    setOnpenTxRepresentativeInfo,
  ] = React.useState(false)
  const [isOpenCoorperationTerms, setOnpenCoorperationTerms] = React.useState(
    false,
  )
  const [isOpenServiceFee, setIsOpenServiceFee] = React.useState(false)

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
              navigation.navigate('UpdateEnterprise', {
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
              navigation.navigate('ClientReport', {
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

          <Actionsheet.Item padding="0">
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

          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('FrequencyUpdateNotice', {
                id: route.params.id,
                frequencyData,
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
                color={Colors.text}
                name="notifications-outline"
                size={20}
              />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`enterpriseScreen.frequencyOfUpdateNotice`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('BankAccount', {
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
              <Ionicons color={Colors.text} name="podium-outline" size={20} />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`enterpriseScreen.bankAccount`}
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
              <Ionicons color={Colors.text} name="people-outline" size={20} />
              <Text fontWeight="500" fontSize="16px" marginLeft="8px">
                {t`clientScreen.referralPartner`}
              </Text>
            </Flex>
          </Actionsheet.Item>

          <Actionsheet.Item
            padding="0"
            onPress={() => {
              onClose()
              navigation.navigate('AssignedAccount', {
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
          title={t`enterpriseScreen.enterpriseDetail`}
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
          <ActivityIndicator size="large" style={{ marginTop: 80 }} />
        ) : (
          <ScrollView
            style={{
              marginTop: 56,
              marginBottom: insets.bottom,
            }}
          >
            <Box
              marginTop="14px"
              marginX="2"
              shadow={1}
              borderRadius="8px"
              backgroundColor={Colors.white}
            >
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
                <VStack space={2} paddingX="12px" paddingBottom="12px">
                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.enterpriseName`}
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
                      {t`enterpriseScreen.address`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.address}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.ercNumber`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.erc_number}
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
                      {data.issuance_agency}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.first_granted_date`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.first_granted_date &&
                        dayjs(data.first_granted_date).format('DD-MM-YYYY')}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.amendmentNo`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.amendment_no}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.latestAmendmentDate`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.last_amendment_date &&
                        dayjs(data.last_amendment_date).format('DD-MM-YYYY')}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.tax`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.tax_code}
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
                      {data.phone}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.fax`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.fax}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.businessSector`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.business_sector}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.legalRepresentative`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.legal_representative}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.legalRepresentativePosition`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.legal_representative_position}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.authorized_representative`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.authorized_representative}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.authorized_representative_position`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.authorized_representative_position}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.attorney_letter_no`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.attorney_letter_no}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.attorney_signing_date`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.attorney_signing_date &&
                        dayjs(data.attorney_signing_date).format('DD-MM-YYYY')}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.contactName`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.contact_name}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.department`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.contact_department}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.contactEmail`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.contact_email}
                    </Text>
                  </Flex>

                  <Divider />

                  <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text flex={2} color={Colors.subText}>
                      {t`enterpriseScreen.contactPhone`}
                    </Text>
                    <Text flex={3} fontWeight="500" textAlign="right">
                      {data.contact_phone}
                    </Text>
                  </Flex>
                </VStack>
              )}
            </Box>

            <Box
              marginTop="12px"
              marginX="2"
              shadow={1}
              borderRadius="8px"
              backgroundColor={Colors.white}
            >
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setOnpenPaymentInfo(prev => !prev)}
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`enterpriseScreen.formOfPaymentAtMaturity`}</Text>
                <Ionicons
                  name={
                    isOpenPaymentInfo
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                  size={24}
                  color={Colors.subText}
                />
              </TouchableOpacity>

              {isOpenPaymentInfo && (
                <VStack space="2" paddingX="12px" paddingBottom="12px"></VStack>
              )}
            </Box>

            <Box
              marginTop="12px"
              marginX="2"
              shadow={1}
              borderRadius="8px"
              backgroundColor={Colors.white}
            >
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setOnpenTxRepresentativeInfo(prev => !prev)}
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`enterpriseScreen.transactionRepresentativeInformation`}</Text>
                <Ionicons
                  name={
                    isOpenTxRepresentativeInfo
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                  size={24}
                  color={Colors.subText}
                />
              </TouchableOpacity>

              {isOpenTxRepresentativeInfo && (
                <VStack space="2" paddingX="12px" paddingBottom="12px"></VStack>
              )}
            </Box>

            <Box
              marginTop="12px"
              marginX="2"
              shadow={1}
              borderRadius="8px"
              backgroundColor={Colors.white}
            >
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setOnpenCoorperationTerms(prev => !prev)}
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`enterpriseScreen.coorperationTerms`}</Text>
                <Ionicons
                  name={
                    isOpenCoorperationTerms
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                  size={24}
                  color={Colors.subText}
                />
              </TouchableOpacity>

              {isOpenCoorperationTerms && (
                <VStack space="2" paddingX="12px" paddingBottom="12px"></VStack>
              )}
            </Box>

            <Box
              marginTop="12px"
              marginX="2"
              shadow={1}
              borderRadius="8px"
              backgroundColor={Colors.white}
              marginBottom="16px"
            >
              <TouchableOpacity
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => setIsOpenServiceFee(prev => !prev)}
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                >{t`enterpriseScreen.serviceFee`}</Text>
                <Ionicons
                  name={
                    isOpenServiceFee
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                  size={24}
                  color={Colors.subText}
                />
              </TouchableOpacity>

              {isOpenServiceFee && (
                <VStack space="2" paddingX="12px" paddingBottom="12px"></VStack>
              )}
            </Box>
          </ScrollView>
        )}
      </Screen>
    </>
  )
}

export default EnterpriseDetail
