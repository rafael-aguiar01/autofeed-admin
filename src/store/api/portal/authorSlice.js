import { apiSlice } from "../apiSlice";

export const portalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAuthors: builder.query({
      query: (portalId) => ({
        url: `users/${portalId}`,
        method: 'GET',
        
      }),
    }),
    createAuthor: builder.mutation({
      query: ({ formData, token }) => ({
        url: "users",
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useFetchAuthorsQuery, useCreateAuthorMutation } = portalApi;
