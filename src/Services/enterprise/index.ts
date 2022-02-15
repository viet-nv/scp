import { pcApi } from '../api'

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

    getAgreedToMeet: builder.query({
      query: () => ({
        url: '/v1/',
      }),
    }),
  }),
})

export const {
  useGetEnterpriseQuery,
  useLazyGetEnterpriseQuery,
  useGetReportSummaryQuery,
} = enterpriseApi
