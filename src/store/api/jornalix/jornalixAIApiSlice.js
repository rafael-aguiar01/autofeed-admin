import { apiSlice } from "../apiSlice";

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    pautaproai: builder.mutation({
      query: ({data, token}) => ({
        url: "articles/ia",
        method: "POST",
        body: data,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { usePautaproaiMutation } = newsApi;
