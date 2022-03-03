import { Header, Screen } from '@/Components'
import { useAddClientReportMutation } from '@/Services/employee'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import {
  Box,
  Button,
  FormControl,
  Input,
  Select,
  TextArea,
  VStack,
} from 'native-base'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getStatusText } from './components/EmployeeList'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Alert } from 'react-native'

function AddNewEmployeeClientReport() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ status: string; meetingDate: string; note: string }>()

  const [addClientReport, { isLoading }] = useAddClientReportMutation()

  const onSubmit: SubmitHandler<{
    status: string
    meetingDate: string
    note: string
  }> = async data => {
    let meeting_date, meeting_hour, meeting_minute
    if (data.status === 'AGREED_TO_MEET') {
      meeting_date = dayjs(data.meetingDate).toISOString()
      meeting_hour = dayjs(data.meetingDate).get('hours')
      meeting_minute = dayjs(data.meetingDate).get('minutes')
    }

    const res: any = await addClientReport({
      id: route.params.id,
      status: data.status,
      meeting_hour,
      meeting_date,
      meeting_minute,
      note: data.note,
    })

    if (res?.error) {
      Alert.alert(t`common.error`, t`common.errorMsg`)
    } else {
      Alert.alert(t`common.success`, t`enterpriseScreen.addReportSuccess`, [
        {
          text: 'Ok',
          onPress: () => {
            navigation.goBack()
          },
        },
      ])
    }
  }

  const [show, setShow] = useState(false)

  const status = useWatch({ control, name: 'status' })

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`enterpriseScreen.addClientReport`}
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
          <FormControl isRequired isInvalid={'status' in errors}>
            <FormControl.Label>{t`enterpriseScreen.status`}</FormControl.Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    placeholder={t`enterpriseScreen.status`}
                    selectedValue={field.value}
                    onValueChange={field.onChange}
                  >
                    {route.params.STATUSES.map((item: string) => (
                      <Select.Item
                        label={t(getStatusText(item))}
                        value={item}
                        key={item}
                      />
                    ))}
                  </Select>
                )
              }}
              rules={{ required: true }}
            />
            <FormControl.ErrorMessage>{t`common.fieldIsRequire`}</FormControl.ErrorMessage>
          </FormControl>

          {status === 'AGREED_TO_MEET' && (
            <FormControl isRequired isInvalid={'meetingDate' in errors}>
              <FormControl.Label>{t`enterpriseScreen.meetingDate`}</FormControl.Label>
              <Controller
                rules={{ required: true }}
                name={'meetingDate'}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={show}
                      mode="datetime"
                      date={field.value ? new Date(field.value) : undefined}
                      onConfirm={date => {
                        field.onChange(date.toISOString())
                        setShow(false)
                      }}
                      onCancel={() => setShow(false)}
                    />

                    <Input
                      {...field}
                      isDisabled
                      _disabled={{
                        backgroundColor: Colors.white,
                      }}
                      value={
                        (field.value &&
                          dayjs(field.value).format('DD-MM-YYYY HH:mm')) ||
                        ''
                      }
                      onChangeText={undefined}
                      onPressIn={() => {
                        setShow(true)
                      }}
                      placeholder={t`enterpriseScreen.meetingDate`}
                      InputRightElement={
                        <Ionicons
                          name="calendar"
                          style={{ paddingHorizontal: 8 }}
                          size={16}
                          color={Colors.text}
                          onPress={() => {
                            setShow(true)
                          }}
                        />
                      }
                    />
                  </>
                )}
              />

              <FormControl.ErrorMessage>{t`common.fieldIsRequire`}</FormControl.ErrorMessage>
            </FormControl>
          )}

          <FormControl>
            <FormControl.Label>{t`enterpriseScreen.note`}</FormControl.Label>
            <Controller
              name="note"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextArea
                  placeholder={t`enterpriseScreen.note`}
                  {...field}
                  onChangeText={field.onChange}
                />
              )}
            />
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
        >{t`enterpriseScreen.addClientReport`}</Button>
      </Box>
    </>
  )
}

export default AddNewEmployeeClientReport
