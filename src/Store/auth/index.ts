import { authApi } from '@/Services/auth'
import { createSlice } from '@reduxjs/toolkit'

type AuthState = {
  refreshToken: string | null
  accessToken: string | null
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
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.refreshToken = payload.data.refresh_token
        state.accessToken = payload.data.access_token
      },
    )
  },
})

export const { logout, setCredentals } = slice.actions

export default slice.reducer
