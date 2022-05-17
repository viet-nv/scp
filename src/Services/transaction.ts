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

    getTransactionLimit: builder.query<
      {
        available_advance_amount: number
        max_advance_amount: number
        max_advance_labor: number
      },
      { enterprise_id: number | string }
    >({
      query: ({ enterprise_id }) => ({
        url: `/v1/transactions/limit?enterprise_id=${enterprise_id}`,
      }),
    }),

    getEmployeeIncomeNoticeFile: builder.query({
      query: (txId: number) => ({
        url: `/v1/transactions/${txId}/employee-income-notice`,
      }),
    }),

    getWorkingEnterprise: builder.query({
      query: (id: number) => ({
        url: `/v1/employees/${id}/working?size=1000`,
      }),
    }),

    confirmTransaction: builder.mutation({
      query: id => ({
        url: `/v1/transactions/${id}/confirm`,
        method: 'POST',
      }),
    }),

    rejectTransaction: builder.mutation({
      query: id => ({
        url: `/v1/transactions/${id}/reject`,
        method: 'POST',
      }),
    }),

    getPromotions: builder.query({
      query: id => ({
        url: `v1/transactions/promotions?enterprise_id=${id}`,
      }),
    }),

    calculateTransaction: builder.mutation({
      query: (body: {
        amount: number
        enterprise_id: number
        promotion_id?: number
      }) => ({
        url: `v1/transactions/calculate`,
        method: 'POST',
        body,
      }),
    }),

    postTransaction: builder.mutation({
      query: body => ({
        url: `v1/transactions`,
        method: 'POST',
        body,
      }),
    }),

    transactionOtp: builder.mutation({
      query: ({ id, otp }: { id: number; otp: string }) => ({
        url: `v1/transactions/${id}/otp`,
        body: {
          otp,
        },
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useGetTransactionDetailQuery,
  useUpdateStatusMutation,
  useGetTransactionLimitQuery,
  useLazyGetTransactionLimitQuery,
  useGetEmployeeIncomeNoticeFileQuery,
  useGetWorkingEnterpriseQuery,
  useConfirmTransactionMutation,
  useRejectTransactionMutation,
  useLazyGetPromotionsQuery,
  useCalculateTransactionMutation,
  usePostTransactionMutation,
  useTransactionOtpMutation,
} = transactionApi
