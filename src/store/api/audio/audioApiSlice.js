import { apiSlice } from "../apiSlice";

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAudios: builder.query({
      query: () => ({
        url: 'audio',
        method: 'GET',
      }),
    }),
    generateAudio: builder.mutation({
      query: ({script, token}) => ({
        url:'/teasers/audio',
        method: "POST",
        body: { script },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useFetchAudiosQuery, useGenerateAudioMutation } = newsApi;
