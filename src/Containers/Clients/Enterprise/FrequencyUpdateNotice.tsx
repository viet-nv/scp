import { Header, Screen } from '@/Components'
import {
  useAddClientReportMutation,
  useGetFrequencyQuery,
  useUpdateFequencyMutation,
} from '@/Services/enterprise'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Box, Button, FormControl, Input, VStack } from 'native-base'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Alert } from 'react-native'

function FrequencyUpdateNotice() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const { control, handleSubmit } = useForm<any>({
    defaultValues: {
      ...(route.params?.frequencyData || {}),
    },
  })

  const [updateFequency, { isLoading }] = useUpdateFequencyMutation()

  const onSubmit: SubmitHandler<{
    status: string
    meetingDate: string
    note: string
  }> = async data => {
    const res: any = await updateFequency({
      enterprise_id: route.params.id,
      ...data,
    })

    if (res?.error) {
      Alert.alert(t`common.error`, t`common.errorMsg`)
    } else {
      Alert.alert(
        t`common.success`,
        t`enterpriseScreen.updateFequencySuccess`,
        [
          {
            text: 'Ok',
            onPress: () => {
              navigation.goBack()
            },
          },
        ],
      )
    }
  }

  return (
    <>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`enterpriseScreen.frequencyOfUpdateNotice`}
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
          <FormControl>
            <FormControl.Label>{t`enterpriseScreen.updateEmployeeInformation`}</FormControl.Label>
            <Controller
              control={control}
              name="update_employee_info"
              render={({ field }) => (
                <Input {...field} onChangeText={field.onChange} />
              )}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>{t`enterpriseScreen.updateWorkingDay`}</FormControl.Label>
            <Controller
              control={control}
              name="update_employee_timekeeping"
              render={({ field }) => (
                <Input {...field} onChangeText={field.onChange} />
              )}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>{t`enterpriseScreen.updateEligibleEmployeeNotice`}</FormControl.Label>
            <Controller
              control={control}
              name="update_eligibility_employee_notice"
              render={({ field }) => (
                <Input {...field} onChangeText={field.onChange} />
              )}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>{t`enterpriseScreen.updateRetiredEmployee`}</FormControl.Label>
            <Controller
              control={control}
              name="update_employee_quit"
              render={({ field }) => (
                <Input {...field} onChangeText={field.onChange} />
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
        >{t`common.update`}</Button>
      </Box>
    </>
  )
}

export default FrequencyUpdateNotice
