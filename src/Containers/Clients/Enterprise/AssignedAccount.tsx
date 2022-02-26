import { Header, Screen } from '@/Components'
import {
  useAssignCAMutation,
  useAssignCRMMutation,
  useGetEnterpriseDetailQuery,
} from '@/Services/enterprise'
import { useLazyGetUsersQuery } from '@/Services/users'
import { Colors } from '@/Theme/Variables'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Actionsheet,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, FlatList, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function AssignedAccount() {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const [getUsers, { isLoading, isFetching }] = useLazyGetUsersQuery()
  const [users, setUsers] = useState({
    page: 1,
    size: 10,
    total_record: 0,
    data: [],
  })

  useEffect(() => {
    getUsers({ page: 1, size: 3 }).then(res => {
      setUsers({
        ...res.data.paginate,
        data: res.data.data,
      })
    })
  }, [])

  const [assignCRM, { isLoading: assigningCRM }] = useAssignCRMMutation()
  const [asignCA, { isLoading: assigningCA }] = useAssignCAMutation()

  const { data, refetch } = useGetEnterpriseDetailQuery(route.params.id)

  const { created_user, ca_manager_user, senior_user } = data || {}

  const [show, setShow] = useState('')

  const [selectedUser, setSelectedUser] = useState('')

  return (
    <>
      <Actionsheet
        isOpen={!!show}
        onClose={() => {
          setSelectedUser('')
          setShow('')
        }}
        minHeight="10"
      >
        <Actionsheet.Content>
          <Text fontWeight="500" fontSize={16}>
            Menu
          </Text>

          <FlatList
            style={{ width: '100%' }}
            data={users.data}
            renderItem={({ item }: { item: any }) => {
              return (
                <Actionsheet.Item
                  width="100%"
                  key={item.id}
                  onPress={() => setSelectedUser(item.id + '')}
                >
                  <Radio.Group
                    name="group"
                    value={selectedUser}
                    onChange={setSelectedUser}
                  >
                    <Radio value={item.id + ''}>{item.fullname}</Radio>
                  </Radio.Group>
                </Actionsheet.Item>
              )
            }}
            onEndReached={() => {
              if (
                !isLoading &&
                !isFetching &&
                users.total_record > users.data.length
              )
                getUsers({ page: users.page + 1, size: 3 }).then(res => {
                  setUsers({
                    ...res.data.paginate,
                    data: [...users.data, ...res.data.data],
                  })
                })
            }}
          />

          <Box
            width="100%"
            paddingY="12px"
            paddingX="16px"
            borderTopWidth={1}
            borderTopColor={Colors.border}
          >
            <Button
              isLoading={show === 'crm' ? assigningCRM : assigningCA}
              _loading={{
                backgroundColor: Colors.primary,
              }}
              disabled={!selectedUser}
              onPress={() => {
                if (!selectedUser) return
                if (show === 'crm') {
                  assignCRM({
                    enterprise_ids: [Number(route.params.id)],
                    user_id: Number(selectedUser),
                  }).then((res: any) => {
                    if (res.error) {
                      Alert.alert(t`common.error`, t`common.errorMsg`)
                    } else {
                      setShow('')
                      setSelectedUser('')
                      refetch()
                    }
                  })
                } else {
                  asignCA({
                    enterprise_ids: [Number(route.params.id)],
                    user_id: Number(selectedUser),
                  }).then((res: any) => {
                    if (res.error) {
                      Alert.alert(t`common.error`, t`common.errorMsg`)
                    } else {
                      setShow('')
                      setSelectedUser('')
                      refetch()
                    }
                  })
                }
              }}
            >
              {t`common.update`}
            </Button>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
      <Screen
        preset="fixed"
        statusBackgroundColor={Colors.navBackground}
        backgroundColor={Colors.white}
      >
        <Header
          title={t`enterpriseScreen.assignedAccount`}
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
            mx="4"
          >
            <VStack space="2xs">
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  fontWeight="500"
                  fontSize="16px"
                >{t`enterpriseScreen.caDepartment`}</Text>
                <TouchableOpacity onPress={() => setShow('ca')}>
                  <Text
                    color={Colors.primary}
                    fontWeight="500"
                  >{t`common.change`}</Text>
                </TouchableOpacity>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`common.group`}</Text>
                <Text fontWeight="500">
                  {ca_manager_user?.group_name || '--'}
                </Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`common.name`}</Text>
                <Text fontWeight="500">{ca_manager_user?.fullname}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`position`}</Text>
                <Text fontWeight="500">
                  {ca_manager_user?.position || '--'}
                </Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`role`}</Text>
                {/* MAP role*/}
                <Text fontWeight="500">{ca_manager_user?.role || '--'}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>Email</Text>
                <Text fontWeight="500">{ca_manager_user?.email}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`enterpriseScreen.phone`}</Text>
                <Text fontWeight="500">{ca_manager_user?.phone || '--'}</Text>
              </Flex>
            </VStack>

            <Divider marginTop="8px" />

            <VStack space="2xs">
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  fontWeight="500"
                  fontSize="16px"
                >{t`enterpriseScreen.crmDepartment`}</Text>
                <TouchableOpacity onPress={() => setShow('crm')}>
                  <Text
                    color={Colors.primary}
                    fontWeight="500"
                  >{t`common.change`}</Text>
                </TouchableOpacity>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`common.group`}</Text>
                <Text fontWeight="500">{senior_user?.group_name || '--'}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`common.name`}</Text>
                <Text fontWeight="500">{senior_user?.fullname}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`position`}</Text>
                <Text fontWeight="500">{senior_user?.position || '--'}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`role`}</Text>
                {/* MAP role*/}
                <Text fontWeight="500">{senior_user?.role || '--'}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>Email</Text>
                <Text fontWeight="500">{senior_user?.email}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`enterpriseScreen.phone`}</Text>
                <Text fontWeight="500">{senior_user?.phone || '--'}</Text>
              </Flex>
            </VStack>

            <Divider marginTop="8px" />
            <VStack space="2xs">
              <Text
                fontWeight="500"
                fontSize="16px"
              >{t`enterpriseScreen.enterpriseOriginator`}</Text>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`common.name`}</Text>
                <Text fontWeight="500">{created_user?.fullname}</Text>
              </Flex>

              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`position`}</Text>
                <Text fontWeight="500">{created_user?.position || '--'}</Text>
              </Flex>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`role`}</Text>
                {/* MAP role*/}
                <Text fontWeight="500">{created_user?.role || '--'}</Text>
              </Flex>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>Email</Text>
                <Text fontWeight="500">{created_user?.email}</Text>
              </Flex>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={Colors.subText}>{t`enterpriseScreen.phone`}</Text>
                <Text fontWeight="500">{created_user?.phone || '--'}</Text>
              </Flex>
            </VStack>
          </VStack>
        </ScrollView>
      </Screen>
    </>
  )
}

export default AssignedAccount
