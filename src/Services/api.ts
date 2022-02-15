import { Config } from '@/Config'
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { RootState } from '@/Store'
import { logout, setCredentals } from '@/Store/auth'
import { AuthResponse } from './auth'

const baseQuery = fetchBaseQuery({ baseUrl: Config.API_URL })

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
})

const basePcQuery = fetchBaseQuery({
  baseUrl: Config.PC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const basePcQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await basePcQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    const refreshResult = await fetchBaseQuery({
      baseUrl: Config.AUTH_API_URL,
    })(
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

      result = await basePcQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }
  return result
}

export const pcApi = createApi({
  reducerPath: 'pcApi',
  baseQuery: basePcQueryWithInterceptor,
  endpoints: () => ({}),
})
