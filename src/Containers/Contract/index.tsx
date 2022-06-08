import { Header, Screen } from '@/Components'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Box,
  Button,
  ChevronDownIcon,
  Flex,
  Text,
  View,
  Actionsheet,
  Input,
  FormControl,
  Divider,
  VStack,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  useCalculateTransactionMutation,
  useGetWorkingEnterpriseQuery,
  useLazyGetPromotionsQuery,
  useLazyGetTransactionLimitQuery,
  usePostTransactionMutation,
} from '@/Services/transaction'

import { useAppSelector } from '@/Store/hooks'
import { formatNum } from '@/Utils'
import dayjs from 'dayjs'
import { useDebounce } from '@/Hooks'
import { useGetEmployeeContractsQuery } from '@/Services/employee'

function Contract() {
  const navigation: any = useNavigation()
  const route: any = useRoute()
  const insets = useSafeAreaInsets()

  const { t } = useTranslation()
  const { user } = useAppSelector(state => state.auth)

  const { data } = useGetEmployeeContractsQuery(user?.enterprise.id || 0)
  console.log(data)

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`employeeApp.contract`}
          style={{
            backgroundColor: Colors.navBackground,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
          }}
          titleStyle={{ color: Colors.white }}
        />

        <ScrollView
          style={{
            marginTop: 56,
            marginBottom: insets.bottom + 120,
          }}
        ></ScrollView>
      </Screen>
    </>
  )
}

export default Contract
