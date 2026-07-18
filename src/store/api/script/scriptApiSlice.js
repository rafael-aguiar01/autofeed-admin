import { apiSlice } from "../apiSlice";

export const scriptApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Busca os tópicos dinamicamente pelo ID da conta selecionada
    fetchScripts: builder.query({
      query: ({ accountId, token }) => ({
        url: `accounts/${accountId}/topics`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    // 🗓️ LISTAGEM DA FILA: Busca os agendamentos filtrando por conta (accountId) e data
    fetchScheduleByDate: builder.query({
      query: ({ accountId, date, token }) => ({
        url: `schedule?accountId=${accountId}&date=${date}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    // 🗓️ CRIAÇÃO: Cria o agendamento real na fila do Autofeed
    generateScript: builder.mutation({
      query: ({ ids, token }) => ({
        url: "schedule",
        method: "POST",
        body: ids, // Passa o objeto completo contendo accountId, topicId, type e appointment
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    saveScript: builder.mutation({
      query: ({ script, token }) => ({
        url: "script/save",
        method: "POST",
        body: script,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    registerManualPost: builder.mutation({
      query: ({ body, token }) => ({
        url: "accounts/topics",
        method: "POST",
        body: body,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    deleteScript: builder.mutation({
      query: ({ topicId, token }) => ({
        url: `accounts/topics/${topicId}`,
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { 
  useFetchScriptsQuery,
  useFetchScheduleByDateQuery, 
  useGenerateScriptMutation, 
  useSaveScriptMutation,
  useRegisterManualPostMutation,
  useDeleteScriptMutation
} = scriptApi;