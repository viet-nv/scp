import { authApi } from '@/Services/auth'
import { User, usersApi } from '@/Services/users'
import { createSlice } from '@reduxjs/toolkit'

type AuthState = {
  refreshToken: string | null
  accessToken: string | null
  user?: User
}

const slice = createSlice({
  name: 'auth',
  initialState: { refreshToken: null, accessToken: null } as AuthState,
  reducers: {
    logout: state => {
      state.refreshToken = null
      state.accessToken = null
    },
    setCredentals: (state, { payload: { accessToken, refreshToken } }) => {
      state.accessToken = accessToken
      state.refreshToken = refreshToken
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.refreshToken = payload.data.refresh_token
          state.accessToken = payload.data.access_token
        },
      )
      .addMatcher(
        usersApi.endpoints.getMe.matchFulfilled,
        (state, { payload }) => {
          state.user = payload
        },
      )
  },
})

export const { logout, setCredentals } = slice.actions

export default slice.reducer
