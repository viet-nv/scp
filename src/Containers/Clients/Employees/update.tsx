import { Header, Screen } from '@/Components'
import { appendData, reset } from '@/Store/employees/all'
import { useAppDispatch } from '@/Store/hooks'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Radio,
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
import {
  useLazyGetEmployeesQuery,
  useUpdateEmployeeMutation,
} from '@/Services/employee'

function UpdateEmployee() {
  const { t } = useTranslation()

  const navigation = useNavigation()
  const route = useRoute()
  const data: any = (route.params as any)?.data

  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const [getEmployees] = useLazyGetEmployeesQuery()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: data.id,
      name: data.name,
      erc_number: data.erc_number,
      first_granted_date: data.first_granted_date,
      issuance_agency: data.issuance_agency,
      address: data.address,
      contact_address: data.contact_address,
      phone: data.phone,
      email: data.email,
      birthday: data.birthday,
      gender: data.gender,
      registration_no: data.registration_no,
      social_insurance_no: data.social_insurance_no,
    },
  })

  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation()

  const onSubmit: SubmitHandler<any> = async data => {
    console.log(data)
    try {
      const res = await updateEmployee(data)
      // @ts-ignore
      if (res?.error) {
        Alert.alert(t`common.error`, t`common.errorMsg`)
      } else
        Alert.alert(
          t`common.success`,
          t`employeeScreen.updateEmployeeSuccess`,
          [
            {
              text: 'Ok',
              onPress: async () => {
                dispatch(reset())
                getEmployees({ page: 1, size: 10 }).then(res => {
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
      label: t`employeeScreen.employeeName`,
      require: true,
    },
    {
      field: 'erc_number',
      label: t`employeeScreen.idCardNo`,
      require: true,
    },

    {
      field: 'issuance_agency',
      label: t`enterpriseScreen.issuanceAgency`,
      require: true,
    },
    {
      field: 'first_granted_date',
      label: t`employeeScreen.issuanceDate`,
      require: true,
      type: 'date',
    },
    {
      field: 'address',
      label: t`employeeScreen.permanentAddress`,
      require: true,
    },
    {
      field: 'contact_address',
      label: t`employeeScreen.contactAddress`,
      require: true,
    },
    {
      field: 'phone',
      label: t`enterpriseScreen.phone`,
      require: true,
      keyboardType: 'phone-pad',
    },
    {
      field: 'email',
      label: 'Email',
      require: true,
    },
    {
      field: 'birthday',
      label: t`employeeScreen.birthday`,
      require: true,
      type: 'date',
    },
    {
      field: 'gender',
      require: true,
      label: t`employeeScreen.gender`,
      type: 'radio',
      options: [
        { label: t`Mr`, value: 'MALE' },
        { label: t`Ms`, value: 'FEMALE' },
      ],
    },
    {
      field: 'registration_no',
      label: t`employeeScreen.registrationBookNo`,
    },
    {
      field: 'social_insurance_no',
      label: t`employeeScreen.socialInsuranceBookNo`,
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
          title={t`employeeScreen.updateEmployee`}
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
                      item.type === 'radio' ? (
                        <Radio.Group
                          width="100%"
                          name="gender"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <Flex flexDirection="row" width="100%">
                            {item?.options?.map(el => (
                              <Radio
                                flex={1}
                                key={el.value}
                                value={el.value}
                                size="sm"
                              >
                                {el.label}
                              </Radio>
                            ))}
                          </Flex>
                        </Radio.Group>
                      ) : item.type === 'date' ? (
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
        >{t`employeeScreen.updateEmployee`}</Button>
      </Box>
    </>
  )
}

export default UpdateEmployee
