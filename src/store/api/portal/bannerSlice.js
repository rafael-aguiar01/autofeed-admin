import { apiSlice } from "../apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBanners: builder.query({
      query: ({ tenant, token }) => ({
        url: `portal/banner/${tenant}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['Banners'], // ADICIONADO: Necessário para o refetch automático
    }),
    updateBanner: builder.mutation({
      query: ({ banner, token }) => ({
        url: `portal/banner`,
        method: "PUT",
        body: banner,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Banners'], // ADICIONADO: Para atualizar ao editar
    }),
    fetchCities: builder.query({
      query: (token) => ({
        url: `accounts`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    createBanner: builder.mutation({
      query: ({ banner, token }) => ({
        url: `portal/banner`, 
        method: 'POST',
        body: banner,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Banners'],
    }),
  }),
});

export const {
  useFetchBannersQuery,
  useUpdateBannerMutation,
  useFetchCitiesQuery,
  useCreateBannerMutation
} = bannerApi;