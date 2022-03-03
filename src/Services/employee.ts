import { pcApi } from './api'

export const employeeApi = pcApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getEmployees: builder.query({
      query: (params: {
        name?: string
        erc_number?: string
        senior_fullname?: string
        status?: string
        size?: number
        page?: number
      }) => ({
        url: '/v1/employees',
        params,
      }),
    }),

    getReportSummary: builder.query<
      {
        status: 'REJECTED' | 'ASSESSMENT' | 'PERSUADING' | 'AGREED_TO_JOIN'
        total: number
      }[],
      void
    >({
      query: () => ({
        url: '/v1/employees/meeting',
      }),
    }),

    // createEnterprise: builder.mutation({
    //   query: params => ({
    //     url: '/v1/enterprises',
    //     method: 'POST',
    //     body: params,
    //   }),
    // }),

    getEmployeeDetail: builder.query({
      query: id => ({
        url: `/v1/employees/${id}`,
      }),
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/v1/employees/${id}`,
        method: 'PUT',
        body: body,
      }),
    }),

    clientReport: builder.query({
      query: ({ id, params }) => ({
        url: `/v1/employees/${id}/report`,
        params,
      }),
    }),

    addClientReport: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/v1/employees/${id}/report`,
        method: 'POST',
        body,
      }),
    }),

    // bankAccount: builder.query({
    //   query: ({ id, params }) => ({
    //     url: `/v1/enterprises/${id}/bank`,
    //     params,
    //   }),
    // }),

    // updateBankAccount: builder.mutation({
    //   query: body => ({
    //     url: `/v1/enterprises/${body.enterprise_id}/bank`,
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    // deleteBankAccount: builder.mutation({
    //   query: id => ({
    //     url: `/v1/enterprises/${id}/bank`,
    //     method: 'DELETE',
    //   }),
    // }),

    // getFrequency: builder.query({
    //   query: id => ({
    //     url: `/v1/enterprises/${id}/frequency`,
    //   }),
    // }),

    // updateFequency: builder.mutation({
    //   query: ({ enterprise_id, ...body }) => ({
    //     url: `/v1/enterprises/${enterprise_id}/frequency`,
    //     method: 'POST',
    //     body,
    //   }),
    // }),

    assignCRM: builder.mutation({
      query: ({ employee_ids, user_id }) => ({
        url: `/v1/employees/assign-crm`,
        method: 'POST',
        body: { employee_ids, user_id },
      }),
    }),

    assignCA: builder.mutation({
      query: ({ employee_ids, user_id }) => ({
        url: `/v1/employees/assign-ca`,
        method: 'POST',
        body: { employee_ids, user_id },
      }),
    }),

    getLegalType: builder.query({
      query: id => ({
        url: `/v1/employees/${id}/legal-type`,
      }),
    }),

    getLegalStatus: builder.query({
      query: id => ({
        url: `/v1/employees/${id}/legal`,
      }),
    }),

    getLegalDocs: builder.query({
      query: ({ id, ...params }) => ({
        url: `/v1/employees/${id}/legal-doc`,
        params,
      }),
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useLazyGetEmployeesQuery,
  useGetReportSummaryQuery,
  useGetEmployeeDetailQuery,
  useUpdateEmployeeMutation,
  useLazyClientReportQuery,
  useAddClientReportMutation,
  useLazyGetLegalDocsQuery,
  useGetLegalStatusQuery,
  useGetLegalTypeQuery,
  useAssignCAMutation,
  useAssignCRMMutation,
} = employeeApi
