import { Header, Screen } from '@/Components'
import { useGetBanksQuery, useLazyGetBranchQuery } from '@/Services/categories'
import {
  useDeleteBankAccountMutation,
  useEmployeeBankAccountQuery,
  useUpdateEmployeeBankAccount1Mutation,
} from '@/Services/employee'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  AlertDialog,
  Divider,
  Fab,
  FlatList,
  Flex,
  Icon,
  Text,
  Button,
  VStack,
  FormControl,
  Input,
  Box,
  Select,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function EmployeeBankAccount() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const { data, refetch } = useEmployeeBankAccountQuery(route.params.id)

  useEffect(() => {
    refetch()
  }, [])

  const { data: banks } = useGetBanksQuery({ page: 1, size: 200 })

  const [getBankBranch] = useLazyGetBranchQuery()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{
    bank_name: string
    branch_name: string
    account_number: string
  }>({
    defaultValues: {
      bank_name: data?.bank_name,
      branch_name: data?.branch_name,
      account_number: data?.account_number,
    },
  })

  useEffect(() => {
    if (data && !getValues()?.bank_name) {
      setValue('bank_name', data.bank_name)
      setValue('branch_name', data.branch_name)
      setValue('account_number', data.account_number)
    }
  }, [data])

  const selectedBank = useWatch({ control, name: 'bank_name' })

  const [branch, setBranch] = useState<{ [code: string]: any }>({})
  useEffect(() => {
    const getBranch = async () => {
      if (selectedBank && !branch[selectedBank]) {
        const res = await getBankBranch({
          page: 1,
          size: 1000,
          bank_code: banks.find((item: any) => item.name === selectedBank)
            ?.code,
        })

        setBranch({
          ...branch,
          [selectedBank]: res.data,
        })
      }
    }

    getBranch()
  }, [selectedBank])

  const [
    update,
    { isLoading: isUpdating },
  ] = useUpdateEmployeeBankAccount1Mutation()

  const onSubmit = async (data: any) => {
    const res: any = await update({
      ...data,
      employee_id: route.params.id,
    })

    if (res.data)
      Alert.alert(t`common.success`, t`enterpriseScreen.updateBankSuccess`)
    else Alert.alert(t`common.error`, t`common.errorMsg`)
  }

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`enterpriseScreen.bankAccount`}
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
          mx="4"
        >
          <FormControl isRequired isInvalid={'bank_name' in errors}>
            <FormControl.Label>{t`enterpriseScreen.bank`}</FormControl.Label>
            <Controller
              name="bank_name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Select
                    placeholder={t`enterpriseScreen.bank`}
                    selectedValue={field.value}
                    onValueChange={value => {
                      field.onChange(value)
                      setValue('branch_name', '')
                    }}
                  >
                    {(banks || []).map((item: any) => (
                      <Select.Item
                        label={`${item.name} (${item.code})`}
                        value={item.name}
                        key={item.code}
                      ></Select.Item>
                    ))}
                  </Select>
                )
              }}
            />
            <FormControl.ErrorMessage>{t`common.fieldIsRequire`}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'branch_name' in errors}>
            <FormControl.Label>{t`enterpriseScreen.branch`}</FormControl.Label>
            <Controller
              name="branch_name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Select
                    placeholder={t`enterpriseScreen.branch`}
                    selectedValue={field.value}
                    onValueChange={field.onChange}
                  >
                    {branch?.[selectedBank]?.map((item: any) => (
                      <Select.Item
                        value={item.name}
                        label={item.name}
                        key={item.id}
                      ></Select.Item>
                    ))}
                  </Select>
                )
              }}
            />
            <FormControl.ErrorMessage>{t`common.fieldIsRequire`}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={'account_number' in errors}>
            <FormControl.Label>{t`enterpriseScreen.account_number`}</FormControl.Label>
            <Controller
              name="account_number"
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    placeholder={t`enterpriseScreen.account_number`}
                    onChangeText={field.onChange}
                  />
                )
              }}
            />
            <FormControl.ErrorMessage>{t`common.fieldIsRequire`}</FormControl.ErrorMessage>
          </FormControl>
        </VStack>
      </Screen>

      <Box
        position="absolute"
        padding="16px"
        style={{
          paddingBottom: insets.bottom + 16,
        }}
        borderTopWidth={1}
        borderTopColor={Colors.border}
        backgroundColor={Colors.white}
        left="0"
        right="0"
        bottom={0}
      >
        <Button
          isLoading={isUpdating}
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          {t`enterpriseScreen.updateBankAccount`}
        </Button>
      </Box>
    </>
  )
}

export default EmployeeBankAccount
