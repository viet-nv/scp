import { Config } from '@/Config'
import { RootState } from '@/Store'
import { logout, setCredentals } from '@/Store/auth'
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  status_code: string
  data: {
    access_token: string
    refresh_token: string
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: Config.AUTH_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/v1/users/refresh',
        method: 'POST',
        body: {
          refresh_token: (api.getState() as RootState).auth.refreshToken,
        },
      },
      api,
      extraOptions,
    )

    if (refreshResult.data) {
      const res = refreshResult.data as AuthResponse

      api.dispatch(
        setCredentals({
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token,
        }),
      )

      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }
  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithInterceptor,
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: credentials => ({
        url: '/v1/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/v1/users/logout',
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
