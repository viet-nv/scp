import { createSlice } from '@reduxjs/toolkit'

type EnterpriseState = {
  page: number
  size: number
  total_record: number
  data: {
    address: string
    contact_department: string
    contact_email: string
    contact_name: string
    contact_phone: string
    created_at?: string
    created_user?: {
      email?: string
      fullname?: string
      id?: number
    }
    erc_number?: string
    first_granted_date?: string
    id: number
    issuance_agency?: string
    last_contact_date?: string
    legal_representative?: string
    legal_representative_position?: string
    location_code?: string
    location_name?: string
    name: string
    senior_user?: { email?: string; fullname?: string; id?: number }
    status:
      | 'PERSUADING'
      | 'AGREED_TO_MEET'
      | 'AGREED_TO_JOIN'
      | 'DOCUMENT_REVIEWING'
      | 'ASSESSMENT'
      | 'REJECTED'
    tax_code?: string
  }[]
}

const slice = createSlice({
  name: 'allEnterprises',
  initialState: {
    page: 1,
    size: 10,
    total_record: 0,
    data: [],
  } as EnterpriseState,
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
