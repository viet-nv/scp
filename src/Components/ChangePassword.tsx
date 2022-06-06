import { useChangePasswordMutation, useLazyGetMeQuery } from '@/Services/users'
import { Button, FormControl, Input, Modal } from 'native-base'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

function ChangePassword({ hideCancel }: { hideCancel?: boolean }) {
  const { t } = useTranslation()
  const [state, setState] = useState({
    password: '',
    old_password: '',
    confirm_password: '',
  })

  const [getMe] = useLazyGetMeQuery()
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const [error, setError] = useState({
    password: '',
    old_password: '',
    confirm_password: '',
  })

  return (
    <Modal isOpen size="full">
      <Modal.Content>
        <Modal.Header>{t`Change Password`}</Modal.Header>
        <Modal.Body>
          <FormControl isInvalid={!!error.old_password}>
            <FormControl.Label>{t`Current Password`}</FormControl.Label>
            <Input
              secureTextEntry
              value={state.old_password}
              onChangeText={value => {
                setState({ ...state, old_password: value })
                if (!value)
                  setError({ ...error, old_password: t`common.fieldIsRequire` })
                else setError({ ...error, old_password: '' })
              }}
            />
            <FormControl.ErrorMessage>
              {error.old_password}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl mt="3" isInvalid={!!error.password}>
            <FormControl.Label>{t`New Password`}</FormControl.Label>
            <Input
              secureTextEntry
              value={state.password}
              onChangeText={value => {
                setState({ ...state, password: value })
                if (!value)
                  setError({ ...error, password: t`common.fieldIsRequire` })
                else setError({ ...error, password: '' })
              }}
            />

            <FormControl.ErrorMessage>
              {error.password}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl mt="3" isInvalid={!!error.confirm_password}>
            <FormControl.Label>{t`Confirm Password`}</FormControl.Label>
            <Input
              secureTextEntry
              value={state.confirm_password}
              onChangeText={value => {
                setState({ ...state, confirm_password: value })
                if (!value)
                  setError({
                    ...error,
                    confirm_password: t`common.fieldIsRequire`,
                  })
                else if (value !== state.password)
                  setError({
                    ...error,
                    confirm_password: t`Password is not match`,
                  })
                else setError({ ...error, confirm_password: '' })
              }}
            />

            <FormControl.ErrorMessage>
              {error.confirm_password}
            </FormControl.ErrorMessage>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            {!hideCancel ? (
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  //
                }}
              >
                {t`common.cancel`}
              </Button>
            ) : (
              <></>
            )}
            <Button
              isLoading={isLoading}
              onPress={async () => {
                if (
                  !state.password ||
                  !state.confirm_password ||
                  !state.old_password
                ) {
                  setError({
                    password: !state.password ? t`common.fieldIsRequire` : '',
                    old_password: !state.old_password
                      ? t`common.fieldIsRequire`
                      : '',
                    confirm_password: !state.confirm_password
                      ? t`common.fieldIsRequire`
                      : '',
                  })
                  return
                }

                if (!Object.values(error).some(Boolean)) {
                  const res = await changePassword(state)
                  console.log(res)
                  await getMe()
                }
              }}
            >
              {t`common.update`}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default ChangePassword
