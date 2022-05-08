import { Header, Screen } from '@/Components'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Box, Button, useDisclose } from 'native-base'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGetWorkingEnterpriseQuery } from '@/Services/transaction'
import { useAppSelector } from '@/Store/hooks'

function RequestPayroll() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()
  const { user } = useAppSelector(state => state.auth)

  const { data, isLoading } = useGetWorkingEnterpriseQuery(user?.id || 0)
  console.log(data)

  const handleMakePayment = () => {}

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.background}
      >
        <Header
          title={t`employeeApp.payroll`}
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

        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 80 }} />
        ) : (
          <ScrollView
            style={{
              marginTop: 56,
              marginBottom: insets.bottom + 80,
            }}
          ></ScrollView>
        )}
      </Screen>

      <Box
        position="absolute"
        padding="16px"
        style={{
          paddingBottom: insets.bottom + 16,
        }}
        borderTopWidth={1}
        display="flex"
        flexDirection="row"
        borderTopColor={Colors.border}
        backgroundColor={Colors.white}
        left="0"
        right="0"
        bottom={0}
      >
        <Button
          marginRight="12px"
          flex={1}
          variant="outline"
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={() => {}}
        >{t`transactionScreen.reject`}</Button>
        <Button
          flex={1}
          isLoading={isLoading}
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={handleMakePayment}
        >
          {t`common.confirm`}
        </Button>
      </Box>
    </>
  )
}

export default RequestPayroll
