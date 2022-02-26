import { pcApi } from './api'

export const usersApi = pcApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getMe: builder.query({
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
  }),
})

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
} = usersApi
