import { apiSlice } from "../apiSlice";

export const scriptApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: ({ account, token }) => ({
        url: "accounts",
        method: "POST",
        body: account,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    // 🚀 Novo endpoint adicionado para corresponder à rota accountRoutes.patch('/:id')
    updateAccount: builder.mutation({
      query: ({ id, account, token }) => ({
        url: `accounts/${id}`,
        method: "PATCH",
        body: account,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    generatePost: builder.mutation({
      query: ({ slug, macroRegionId, token }) => ({
        url: "social-media/instagram/posts",
        method: "POST",
        body: { slug, macroRegionId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    generateReels: builder.mutation({
      query: ({ slug, macroRegionId, token }) => ({
        url: "social-media/instagram/reels",
        method: "POST",
        body: { slug, macroRegionId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateSchedule: builder.mutation({
      query: ({ id, data, token }) => ({
        url: `schedule/${id}`,
        method: 'PATCH',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    // registerManualPost: builder.mutation({
    //   query: ({ body, token }) => ({
    //     url: `schedule/manual`,
    //     method: 'POST',
    //     body: body,
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }),
    // }),
  }),
});

export const { 
  useCreateAccountMutation, 
  useUpdateAccountMutation,
  useGeneratePostMutation, 
  useGenerateReelsMutation, 
  useUpdateScheduleMutation, 
  useRegisterManualPostMutation 
} = scriptApi;