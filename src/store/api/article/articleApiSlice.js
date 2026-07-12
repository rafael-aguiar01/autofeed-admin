import { apiSlice } from "../apiSlice";

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Atualizado para receber tenant
    fetchArticles: builder.query({
      query: (tenant) => ({
        url: `articles/${tenant}`,
        method: 'GET',
      }),
    }),
    fetchArticleBySlug: builder.query({
      query: (slug) => ({
        url: `articles/slug/${slug}`,
        method: 'GET',
      }),
    }),
    // Atualizado para receber tenant
    fetchArticlePending: builder.query({
      query: (tenant) => ({
        url: `articles/pending/${tenant}`,
        method: 'GET',
      }),
    }),
    deleteArticle: builder.mutation({
      query: ({ slug, token }) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    updateArticle: builder.mutation({
      query: ({slug, article, token} ) => ({
        url: `articles/${slug}`,
        method: "PUT",
        body: article,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    createArticle: builder.mutation({
      query: ({article, token} ) => ({
        url: "articles",
        method: "POST",
        body: article,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
    }),
    uploadImage: builder.mutation({
      query: ({formData, token}) => ({
        url: "upload",
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
      responseHandler: async (response) => {
        const text = await response.text();
        return { imageUrl: text }; 
      },
    }),
  }),
});

export const { 
  useFetchArticlesQuery, 
  useFetchArticleBySlugQuery,
  useFetchArticlePendingQuery, 
  useDeleteArticleMutation, 
  useCreateArticleMutation, 
  useUpdateArticleMutation,
  useUploadImageMutation 
} = newsApi;