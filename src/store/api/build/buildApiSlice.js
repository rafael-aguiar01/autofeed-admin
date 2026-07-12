import { apiSlice } from "../apiSlice";

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    triggerBuild: builder.mutation({
      query: ({token}) => ({
        url: "build",
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useTriggerBuildMutation } = newsApi;
