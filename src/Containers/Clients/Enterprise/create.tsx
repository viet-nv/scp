import { Header, Screen } from '@/Components'
import {
  useCreateEnterpriseMutation,
  useGetEnterpriseQuery,
  useLazyGetEnterpriseQuery,
} from '@/Services/enterprise'
import { appendData, reset } from '@/Store/enterprises/all'
import { useAppDispatch } from '@/Store/hooks'
import { Colors } from '@/Theme/Variables'
import { useNavigation } from '@react-navigation/native'
import {
  Box,
  Button,
  FormControl,
  Input,
  ScrollView,
  Stack,
  VStack,
} from 'native-base'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface FormInput {
  tax_code: string
  name: string
  address: string
  legal_representative: string
  legal_representative_position: string
  contact_name: string
  contact_phone: string
  contact_email: string
  business_sector?: string
  department?: string
}
function CreateNewEnterprise() {
  const { t } = useTranslation()

  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const [getEnterprise] = useLazyGetEnterpriseQuery()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  const [createEnterprise, { isLoading }] = useCreateEnterpriseMutation()

  const onSubmit: SubmitHandler<FormInput> = async data => {
    try {
      const res = await createEnterprise(data)
      // @ts-ignore
      if (res?.error) {
        Alert.alert(t`common.error`, t`common.errorMsg`)
      } else
        Alert.alert(
          t`common.success`,
          t`enterpriseScreen.createEnterpriseSuccess`,
          [
            {
              text: 'Ok',
              onPress: async () => {
                dispatch(reset())

                getEnterprise({ page: 1, size: 10 }).then(res => {
                  dispatch(
                    appendData({
                      ...res.data.paginate,
                      data: res.data.data,
                    }),
                  )
                })

                navigation.goBack()
              },
            },
          ],
        )
    } catch (e) {
      Alert.alert('Error', 'Somethings went wrong')
    }
  }

  const arr = [
    {
      field: 'tax_code',
      label: t`enterpriseScreen.tax`,
      error: t`enterpriseScreen.pleaseInputTax`,
    },
    {
      field: 'name',
      label: t`enterpriseScreen.enterpriseName`,
      error: t`enterpriseScreen.pleaseInputName`,
    },
    {
      field: 'address',
      label: t`enterpriseScreen.enterpriseAddress`,
      error: t`enterpriseScreen.pleaseInputAddress`,
    },

    {
      field: 'legal_representative',
      label: t`enterpriseScreen.legalRepresentative`,
      error: t`enterpriseScreen.pleaseInputLegalRepresentative`,
    },
    {
      field: 'legal_representative_position',
      label: t`enterpriseScreen.legalRepresentativePosition`,
      error: t`enterpriseScreen.pleaseInputLegalRepresentativePosition`,
    },
    {
      field: 'business_sector',
      label: t`enterpriseScreen.businessSector`,
      error: '',
    },
    {
      field: 'contact_name',
      label: t`enterpriseScreen.contactName`,
      error: t`enterpriseScreen.pleaseInputContactName`,
    },
    {
      field: 'department',
      label: t`enterpriseScreen.department`,
      error: '',
    },
    {
      field: 'contact_email',
      label: t`enterpriseScreen.contactEmail`,
      error: t`enterpriseScreen.pleaseInputContactEmail`,
    },
    {
      field: 'contact_phone',
      label: t`enterpriseScreen.contactPhone`,
      error: t`enterpriseScreen.pleaseInputContactPhone`,
      type: 'phone',
    },
  ]

  return (
    <>
      <Screen
        preset="fixed"
        backgroundColor={Colors.white}
        statusBackgroundColor={Colors.navBackground}
      >
        <Header
          title={t`enterpriseScreen.addEnterprise`}
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

        <ScrollView style={{ marginTop: 56 }}>
          <VStack
            space="sm"
            paddingBottom="120px"
            marginBottom={insets.bottom}
            paddingTop="16px"
          >
            {arr.map(item => (
              <FormControl
                isRequired={!!item.error}
                isInvalid={item.field in errors}
                key={item.field}
              >
                <Stack mx="4">
                  <FormControl.Label>{item.label}</FormControl.Label>
                  <Controller
                    name={item.field as any}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChangeText={val => field.onChange(val)}
                        placeholder={item.label}
                      />
                    )}
                    rules={{ required: !!item.error }}
                  />
                  <FormControl.ErrorMessage>
                    {item.error}
                  </FormControl.ErrorMessage>
                </Stack>
              </FormControl>
            ))}
          </VStack>
        </ScrollView>
      </Screen>
      <Box
        position="absolute"
        padding="16px"
        paddingBottom={insets.bottom + 16}
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
        >{t`enterpriseScreen.addEnterprise`}</Button>
      </Box>
    </>
  )
}

export default CreateNewEnterprise
