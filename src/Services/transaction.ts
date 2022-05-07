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
    getTransactionDetail: builder.query({
      query: (id: string | number) => ({
        url: `/v1/transactions/${id}`,
      }),
    }),
    updateStatus: builder.mutation({
      query: ({
        ids,
        status,
        note,
      }: {
        ids: number[]
        status: string
        note: string
      }) => ({
        url: `/v1/transactions/status`,
        method: 'POST',
        body: {
          status: status,
          note,
          ids,
        },
      }),
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useGetTransactionDetailQuery,
  useUpdateStatusMutation,
} = transactionApi
