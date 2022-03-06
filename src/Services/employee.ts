import { pcApi } from './api'

export const employeeApi = pcApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getEmployees: builder.query({
      query: (params: {
        name?: string
        erc_number?: string
        senior_fullname?: string
        meeting_date_from?: string
        meeting_date_to?: string
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

    bankAccount: builder.query({
      query: ({ id, params }) => ({
        url: `/v1/employees/${id}/bank`,
        params,
      }),
    }),

    updateBankAccount: builder.mutation({
      query: body => ({
        url: `/v1/employees/${body.employee_id}/bank`,
        method: 'POST',
        body,
      }),
    }),

    deleteBankAccount: builder.mutation({
      query: id => ({
        url: `/v1/employees/${id}/bank`,
        method: 'DELETE',
      }),
    }),

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

    getWorking: builder.query({
      query: id => ({
        url: `/v1/employees/${id}/working?page=1&size=30`,
      }),
    }),

    getEmployeeBankAccount: builder.query({
      query: ({ employee_id, enterprise_id }) => ({
        url: `/v1/employees/${employee_id}/bank/${enterprise_id}`,
      }),
    }),

    updateDesignatedAccount: builder.mutation({
      query: ({ employee_id, id, ...body }) => ({
        url: `/v1/employees/${employee_id}/bank/${id}`,
        body,
        method: 'POST',
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
  useDeleteBankAccountMutation,
  useLazyBankAccountQuery,
  useUpdateBankAccountMutation,
  useGetWorkingQuery,
  useGetEmployeeBankAccountQuery,
  useUpdateDesignatedAccountMutation,
} = employeeApi
