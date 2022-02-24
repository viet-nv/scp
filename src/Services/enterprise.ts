import { pcApi } from './api'

export const enterpriseApi = pcApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getEnterprise: builder.query({
      query: (params: {
        name?: string
        tax_code?: string
        ocation_name?: string
        senior_fullname?: string
        status?: string
        onboarded?: 0 | 1
        size?: number
        page?: number
        meeting_date_from?: string
        meeting_date_to?: string
      }) => ({
        url: '/v1/enterprises',
        params,
      }),
    }),

    getReportSummary: builder.query<
      {
        status:
          | 'REJECTED'
          | 'AGREED_TO_MEET'
          | 'DOCUMENT_REVIEWING'
          | 'ASSESSMENT'
          | 'PERSUADING'
          | 'AGREED_TO_JOIN'
        total: number
      }[],
      void
    >({
      query: () => ({
        url: '/v1/enterprises/meeting',
      }),
    }),

    createEnterprise: builder.mutation({
      query: params => ({
        url: '/v1/enterprises',
        method: 'POST',
        body: params,
      }),
    }),

    getEnterpriseDetail: builder.query({
      query: id => ({
        url: `/v1/enterprises/${id}`,
      }),
    }),

    updateEnterprise: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/v1/enterprises/${id}`,
        method: 'PUT',
        body: body,
      }),
    }),

    clientReport: builder.query({
      query: ({ id, params }) => ({
        url: `/v1/enterprises/${id}/report`,
        params,
      }),
    }),

    addClientReport: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/v1/enterprises/${id}/report`,
        method: 'POST',
        body,
      }),
    }),

    bankAccount: builder.query({
      query: ({ id, params }) => ({
        url: `/v1/enterprises/${id}/bank`,
        params,
      }),
    }),

    updateBankAccount: builder.mutation({
      query: body => ({
        url: `/v1/enterprises/${body.enterprise_id}/bank`,
        method: 'POST',
        body,
      }),
    }),

    deleteBankAccount: builder.mutation({
      query: id => ({
        url: `/v1/enterprises/${id}/bank`,
        method: 'DELETE',
      }),
    }),

    getFrequency: builder.query({
      query: id => ({
        url: `/v1/enterprises/${id}/frequency`,
      }),
    }),

    updateFequency: builder.mutation({
      query: ({ enterprise_id, ...body }) => ({
        url: `/v1/enterprises/${enterprise_id}/frequency`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetEnterpriseQuery,
  useLazyGetEnterpriseQuery,
  useGetReportSummaryQuery,
  useCreateEnterpriseMutation,
  useGetEnterpriseDetailQuery,
  useUpdateEnterpriseMutation,
  useLazyClientReportQuery,
  useAddClientReportMutation,
  useLazyBankAccountQuery,
  useUpdateBankAccountMutation,
  useDeleteBankAccountMutation,
  useGetFrequencyQuery,
  useUpdateFequencyMutation,
} = enterpriseApi
