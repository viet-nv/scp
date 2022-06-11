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

    getEmployeeReportSummary: builder.query<
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

    clientReportEmployee: builder.query({
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

    employeeBankAccount: builder.query({
      query: id => ({
        url: `/v1/employees/${id}/bank`,
      }),
    }),

    updateEmployeeBankAccount1: builder.mutation({
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

    assignEmployeeCRM: builder.mutation({
      query: ({ employee_ids, user_id }) => ({
        url: `/v1/employees/assign-crm`,
        method: 'POST',
        body: { employee_ids, user_id },
      }),
    }),

    assignEmployeeCA: builder.mutation({
      query: ({ employee_ids, user_id }) => ({
        url: `/v1/employees/assign-ca`,
        method: 'POST',
        body: { employee_ids, user_id },
      }),
    }),

    getEmployeeLegalType: builder.query({
      query: id => ({
        url: `/v1/employees/${id}/legal-type`,
      }),
    }),

    getEmployeeLegalStatus: builder.query({
      query: id => ({
        url: `/v1/employees/${id}/legal`,
      }),
    }),

    getEmployeeLegalDocs: builder.query({
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

    uploadEmployeeFile: builder.mutation({
      query: body => ({
        url: `/v1/objects/upload`,
        body,
        method: 'POST',
      }),
    }),

    uploadEmployeeLegalDoc: builder.mutation({
      query: ({ employee_id, ...body }) => ({
        url: `/v1/employees/${employee_id}/legal-doc`,
        body,
        method: 'POST',
      }),
    }),

    getEmployeeContracts: builder.query({
      query: ({
        enterprise_id,
        states,
      }: {
        enterprise_id: number | string
        states: string
      }) => ({
        url: `/v1/employees/${enterprise_id}/contracts?states=${states}`,
      }),
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useLazyGetEmployeesQuery,
  useGetEmployeeReportSummaryQuery,
  useGetEmployeeDetailQuery,
  useUpdateEmployeeMutation,
  useLazyClientReportEmployeeQuery,
  useAddClientReportMutation,
  useLazyGetEmployeeLegalDocsQuery,
  useGetEmployeeLegalStatusQuery,
  useGetEmployeeLegalTypeQuery,
  useAssignEmployeeCAMutation,
  useAssignEmployeeCRMMutation,
  useDeleteBankAccountMutation,
  useEmployeeBankAccountQuery,
  useUpdateEmployeeBankAccount1Mutation,
  useGetWorkingQuery,
  useGetEmployeeBankAccountQuery,
  useUpdateDesignatedAccountMutation,
  useUploadEmployeeFileMutation,
  useUploadEmployeeLegalDocMutation,
  useGetEmployeeContractsQuery,
} = employeeApi
