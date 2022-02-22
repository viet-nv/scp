import { pcApi } from './api'

export const categoriesApi = pcApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getBanks: builder.query({
      query: (params: { size?: number; page?: number }) => ({
        url: '/v1/categories/bank',
        params,
      }),
    }),

    getBranch: builder.query({
      query: (params: {
        size?: number
        page?: number
        bank_code?: string
      }) => ({
        url: '/v1/categories/bank_branch',
        params,
      }),
    }),
  }),
})

export const { useGetBanksQuery, useLazyGetBranchQuery } = categoriesApi
