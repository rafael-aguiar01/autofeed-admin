import { apiSlice } from "../apiSlice";

export const scriptApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendAudio: builder.mutation({
      query: ({audioUrl, citySlug, token}) => ({
        url: "social-media/whatsapp/audio",
        method: "POST",
        body: { audioUrl, citySlug }, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    connectWhatsapp: builder.mutation({
      query: ({portalId, token}) => ({
        url: "/social-media/whatsapp",
        method: "POST",
        body: { portalId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    saveGroup: builder.mutation({
      query: ({whatsappGroupId ,name, citySlug, token}) => ({
        url: "social-media/whatsapp/groups",
        method: "POST",
        body: { whatsappGroupId, name, citySlug },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    fetchConnection: builder.query({
      query: ({portalId, token}) => ({
        url:  `social-media/whatsapp?portalId=${portalId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }),
    deleteConnection: builder.mutation({
      query: ({portalId, token}) => ({
        url: "social-media/whatsapp",
        method: 'DELETE',
        body: { portalId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }),
    fetchGroups: builder.query({
      query: ({citySlug, token}) => ({
        url: `social-media/whatsapp/groups?citySlug=${citySlug}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useSendAudioMutation, useConnectWhatsappMutation, useSaveGroupMutation, 
               useFetchConnectionQuery,  useDeleteConnectionMutation, useFetchGroupsQuery 
              } = scriptApi;