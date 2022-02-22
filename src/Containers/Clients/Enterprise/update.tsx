import { Header, Screen } from '@/Components'
import {
  useLazyGetEnterpriseQuery,
  useUpdateEnterpriseMutation,
} from '@/Services/enterprise'
import { appendData, reset } from '@/Store/enterprises/all'
import { useAppDispatch } from '@/Store/hooks'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import {
  Box,
  Button,
  FormControl,
  Input,
  ScrollView,
  Stack,
  VStack,
} from 'native-base'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'

function UpdateEnterprise() {
  const { t } = useTranslation()

  const navigation = useNavigation()
  const route = useRoute()
  const data: any = (route.params as any)?.data

  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const [getEnterprise] = useLazyGetEnterpriseQuery()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: data.id,
      name: data.name,
      address: data.address,
      erc_number: data.erc_number,
      issuance_agency: data.issuance_agency,
      first_granted_date: data.first_granted_date,
      amendment_no: `${data.amendment_no || ''}`,
      last_amendment_date: data.last_amendment_date,
      tax_code: data.tax_code,
      phone: data.phone,
      tax: data.tax,
      legal_representative: data.legal_representative,
      legal_representative_position: data.legal_representative_position,
      authorized_representative: data.authorized_representative,
      authorized_representative_position:
        data.authorized_representative_position,
      attorney_letter_no: data.attorney_letter_no,
      attorney_signing_date: data.attorney_signing_date,
      contact_name: data.contact_name,
      contact_department: data.contact_department,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      business_sector: data.business_sector,
    },
  })

  const [updateEnterprise, { isLoading }] = useUpdateEnterpriseMutation()

  const onSubmit: SubmitHandler<any> = async data => {
    try {
      const res = await updateEnterprise({
        ...data,
        amendment_no: Number(data.amendment_no),
      })
      // @ts-ignore
      if (res?.error) {
        Alert.alert(t`common.error`, t`common.errorMsg`)
      } else
        Alert.alert(
          t`common.success`,
          t`enterpriseScreen.updateEnterpriseSuccess`,
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
      field: 'name',
      label: t`enterpriseScreen.enterpriseName`,
      require: true,
    },
    {
      field: 'address',
      label: t`enterpriseScreen.enterpriseAddress`,
      require: true,
    },
    {
      field: 'erc_number',
      label: t`enterpriseScreen.ercNumber`,
      require: true,
    },

    {
      field: 'issuance_agency',
      label: t`enterpriseScreen.issuanceAgency`,
      require: true,
    },
    {
      field: 'first_granted_date',
      label: t`enterpriseScreen.first_granted_date`,
      require: true,
      type: 'date',
    },
    {
      field: 'amendment_no',
      label: t`enterpriseScreen.amendmentNo`,
      require: true,
      keyboardType: 'numeric',
    },
    {
      field: 'last_amendment_date',
      label: t`enterpriseScreen.latestAmendmentDate`,
      type: 'date',
      require: true,
    },
    {
      field: 'tax_code',
      label: t`enterpriseScreen.tax`,
      require: true,
    },
    {
      field: 'phone',
      label: t`enterpriseScreen.phone`,
      keyboardType: 'phone-pad',
    },
    {
      field: 'fax',
      label: t`enterpriseScreen.fax`,
    },
    {
      field: 'legal_representative',
      label: t`enterpriseScreen.legalRepresentative`,
      require: true,
    },
    {
      field: 'legal_representative_position',
      label: t`enterpriseScreen.legalRepresentativePosition`,
      require: true,
    },
    {
      field: 'authorized_representative',
      label: t`enterpriseScreen.authorized_representative`,
    },
    {
      field: 'authorized_representative_position',
      label: t`enterpriseScreen.authorized_representative_position`,
    },
    {
      field: 'attorney_letter_no',
      label: t`enterpriseScreen.attorney_letter_no`,
    },
    {
      field: 'attorney_signing_date',
      label: t`enterpriseScreen.attorney_signing_date`,
      type: 'date',
    },
    {
      field: 'contact_name',
      label: t`enterpriseScreen.contactName`,
      require: true,
    },
    {
      field: 'contact_department',
      label: t`enterpriseScreen.department`,
      require: true,
    },
    {
      field: 'contact_phone',
      label: t`enterpriseScreen.contactPhone`,
      require: true,
      keyboardType: 'phone-pad',
    },
    {
      field: 'contact_email',
      label: t`enterpriseScreen.contactEmail`,
      require: true,
      keyboardType: 'email-address',
    },
    {
      field: 'business_sector',
      label: t`enterpriseScreen.businessSector`,
    },
  ]

  const [show, setShow] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState('')

  return (
    <>
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        onConfirm={date => {
          setValue(showDatePicker as any, date.toISOString())
          setShow(false)
        }}
        onCancel={() => setShow(false)}
      />
      <Screen
        preset="fixed"
        backgroundColor={Colors.white}
        statusBackgroundColor={Colors.navBackground}
      >
        <Header
          title={t`enterpriseScreen.updateEnterprise`}
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
                isRequired={item.require}
                isInvalid={item.field in errors}
                key={item.field}
              >
                <Stack mx="4">
                  <FormControl.Label>{item.label}</FormControl.Label>
                  <Controller
                    name={item.field as any}
                    control={control}
                    defaultValue=""
                    render={({ field }) =>
                      item.type === 'date' ? (
                        <Input
                          {...field}
                          isDisabled
                          _disabled={{
                            backgroundColor: Colors.white,
                          }}
                          value={
                            (field.value &&
                              dayjs(field.value).format('DD-MM-YYYY')) ||
                            ''
                          }
                          onChangeText={undefined}
                          onPressIn={() => {
                            setShowDatePicker(item.field)
                            setShow(true)
                          }}
                          placeholder={item.label}
                          InputRightElement={
                            <Ionicons
                              name="calendar"
                              style={{ paddingHorizontal: 8 }}
                              size={16}
                              color={Colors.text}
                              onPress={() => {
                                setShowDatePicker(item.field)
                                setShow(true)
                              }}
                            />
                          }
                        />
                      ) : (
                        <Input
                          {...field}
                          value={field.value}
                          onChangeText={field.onChange}
                          placeholder={item.label}
                          keyboardType={item.keyboardType as any}
                        />
                      )
                    }
                    rules={{ required: item.require }}
                  />
                  <FormControl.ErrorMessage>
                    {t`common.fieldIsRequire`}
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
        >{t`enterpriseScreen.updateEnterprise`}</Button>
      </Box>
    </>
  )
}

export default UpdateEnterprise
