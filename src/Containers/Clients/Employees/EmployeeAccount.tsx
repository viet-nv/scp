import { Header, Screen } from '@/Components'
import { useGetEmployeeBankAccountQuery } from '@/Services/employee'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Flex, Text, VStack, Divider } from 'native-base'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function EmployeeAccount() {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const enterprise = route.params.enterprise
  const employee_id = route.params?.employee_id

  const { data, refetch } = useGetEmployeeBankAccountQuery({
    employee_id,
    enterprise_id: enterprise.id,
  })

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
    })
    return unsubscribe
  }, [navigation])

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.background}
      >
        <Header
          title={enterprise.name}
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

        <VStack
          marginTop="56px"
          space="sm"
          paddingBottom="120px"
          marginBottom={insets.bottom}
          paddingTop="16px"
        >
          <VStack background={Colors.white} padding="4" space="sm">
            <Flex
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
            >
              <Text
                fontWeight="500"
                fontSize="16px"
                justifyContent="space-between"
              >{t`employeeScreen.designatedAccount`}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EmployeeDesignatedAccount', {
                    enterprise_id: enterprise.id,
                    bank: data.designated,
                    employee_id,
                  })
                }
              >
                <Text color={Colors.link}>{t`common.update`}</Text>
              </TouchableOpacity>
            </Flex>
            <Flex
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
            >
              <Text color={Colors.subText}>{t`enterpriseScreen.bank`}</Text>

              <Text>{data?.designated?.bank_name}</Text>
            </Flex>
            <Divider />

            <Flex
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
            >
              <Text color={Colors.subText}>{t`enterpriseScreen.branch`}</Text>
              <Text>{data?.designated?.branch_name}</Text>
            </Flex>

            <Divider />

            <Flex
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
            >
              <Text
                color={Colors.subText}
              >{t`enterpriseScreen.account_number`}</Text>
              <Text>{data?.designated?.account_number}</Text>
            </Flex>
          </VStack>

          <VStack background={Colors.white} padding="4" space="sm">
            <Text
              fontWeight="500"
              fontSize="16px"
              justifyContent="space-between"
            >{t`employeeScreen.salaryAccount`}</Text>

            <Flex
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
            >
              <Text color={Colors.subText}>{t`enterpriseScreen.bank`}</Text>

              <Text>{data?.salary?.bank_name}</Text>
            </Flex>
            <Divider />

            <Flex
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
            >
              <Text color={Colors.subText}>{t`enterpriseScreen.branch`}</Text>
              <Text>{data?.salary?.branch_name}</Text>
            </Flex>

            <Divider />

            <Flex
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
            >
              <Text
                color={Colors.subText}
              >{t`enterpriseScreen.account_number`}</Text>
              <Text>{data?.salary?.account_number}</Text>
            </Flex>
          </VStack>
        </VStack>
      </Screen>
    </>
  )
}

export default EmployeeAccount
