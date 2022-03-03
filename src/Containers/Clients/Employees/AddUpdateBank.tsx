import { Header, Screen } from '@/Components'
import { useGetBanksQuery, useLazyGetBranchQuery } from '@/Services/categories'
import { useUpdateBankAccountMutation } from '@/Services/employee'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Box, Button, FormControl, Input, Select, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function EmployeeAddUpdateBank() {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route: any = useRoute()
  const bank = route.params?.bank
  const employee_id = route.params?.employee_id

  const { data: banks } = useGetBanksQuery({ page: 1, size: 200 })

  const [getBankBranch] = useLazyGetBranchQuery()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{
    bank_name: string
    branch_name: string
    account_number: string
  }>({
    defaultValues: {
      bank_name: bank?.bank_name,
      branch_name: bank?.branch_name,
      account_number: bank?.account_number,
    },
  })

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

  const [updateBankAccount, { isLoading }] = useUpdateBankAccountMutation()

  const onSubmit = (data: any) => {
    const { branch_name } = data
    // branch_name is isInvalid
    if (!branch[selectedBank]?.find((item: any) => item.name === branch_name)) {
      setValue('branch_name', '', { shouldValidate: true })
      return
    }

    updateBankAccount({
      id: bank?.id || null,
      enterprise_id: employee_id,
      bank_name: data.bank_name,
      branch_name: data.branch_name,
      account_number: data.account_number,
    }).then((res: any) => {
      if (res.error) {
        Alert.alert(t`common.error`, t`common.errorMsg`)
      } else {
        Alert.alert(
          t`common.success`,
          !bank
            ? t`enterpriseScreen.createBankSuccess`
            : t`enterpriseScreen.updateBankSuccess`,
          [
            {
              text: 'Ok',
              onPress: () => navigation.goBack(),
            },
          ],
        )
      }
    })
  }

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={
            !bank
              ? t`enterpriseScreen.addBankAccount`
              : t`enterpriseScreen.updateBankAccount`
          }
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
          isLoading={isLoading}
          _loading={{
            backgroundColor: Colors.primary,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          {!bank
            ? t`enterpriseScreen.addBankAccount`
            : t`enterpriseScreen.updateBankAccount`}
        </Button>
      </Box>
    </>
  )
}

export default EmployeeAddUpdateBank
