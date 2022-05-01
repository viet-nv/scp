import { pcApi } from './api'

export const transactionApi = pcApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getTransactions: builder.query({
      query: (params: {
        statuses?: string
        employee_name?: string
        employee_erc_number?: string
        transaction_code?: string
        enterprise_name?: string
        bank_name?: string

        size?: number
        page?: number
      }) => ({
        url: '/v1/transactions',
        params,
      }),
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
} = transactionApi
