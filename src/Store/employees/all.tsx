import { createSlice } from '@reduxjs/toolkit'

type EmployeesState = {
  page: number
  size: number
  total_record: number
  data: {
    address: string
    bank_account_number?: string
    bank_branch_name?: string
    bank_name?: string
    birthday?: string

    created_at?: string
    created_user?: {
      email?: string
      fullname?: string
      id?: number
    }
    erc_number?: string
    first_granted_date?: string
    gender?: string
    id: number
    issuance_agency?: string
    last_contact_date?: string
    name: string

    phone?: string
    registration_no?: number

    senior_user?: { email?: string; fullname?: string; id?: number }
    social_insurance_no?: string
    status: string
  }[]
}

const slice = createSlice({
  name: 'allEmployees',
  initialState: {
    page: 1,
    size: 10,
    total_record: 0,
    data: [],
  } as EmployeesState,
  reducers: {
    reset: state => {
      state.page = 1
      state.size = 10
      state.total_record = 0
      state.data = []
    },

    appendData: (state, { payload: { page, size, total_record, data } }) => {
      state.page = page
      state.size = size
      state.total_record = total_record
      state.data = [...state.data, ...data]
    },
  },
})

export const { reset, appendData } = slice.actions

export default slice.reducer
