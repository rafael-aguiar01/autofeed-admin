import { apiSlice } from "../apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchLayout: builder.query({
      query: ({portalId, token}) => ({
        url: `portal/section/${portalId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateLayout: builder.mutation({
      query: ({section, token}) => ({
        url: `portal/section`,
        method: "PUT",
        body: section,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useFetchLayoutQuery, useUpdateLayoutMutation } = layoutApi;
