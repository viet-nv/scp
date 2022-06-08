import { pcApi } from './api'

export interface User {
  created_at: string
  department: string
  email: string
  fullname: string
  id: number
  id_card: string
  phone: string
  position: string
  role: { name: string; permissions: Array<string> }
  status: string
  username: string
  require_change_password?: boolean
  enterprise: {
    id: string | number
    address: string
    createdAt: string
    name: string
  }
}
export const usersApi = pcApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: '/v1/users/me',
      }),
    }),

    getUsers: builder.query({
      query: (params: {
        size?: number
        page?: number
        email?: string
        department?: string
        role?: string
        group_id?: number
      }) => ({
        url: '/v1/users',
        params,
      }),
    }),

    changePassword: builder.mutation({
      query: (body: any) => ({
        url: '/v1/users/change-password',
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useChangePasswordMutation,
} = usersApi
