import { apiSlice } from "../apiSlice";

export const MacroRegionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchMacroRegions: builder.query({
            query: (token) => ({
                url: `macro-region`, 
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            providesTags: ['MacroRegion'], 
        }),

        updateMacroRegion: builder.mutation({
            query: ({ id, macroRegion, token }) => ({
                url: `macro-region/${id}`,
                method: 'PUT',
                body: macroRegion,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['MacroRegion'],  
        }),

        addCity: builder.mutation({
            query: ({ cityData, token }) => ({
                url: `macro-region/addCity`,
                method: 'POST',
                body: cityData, 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['MacroRegion'], 
        }),
    }),
});

export const { 
    useFetchMacroRegionsQuery, 
    useUpdateMacroRegionMutation, 
    useAddCityMutation 
} = MacroRegionApi;