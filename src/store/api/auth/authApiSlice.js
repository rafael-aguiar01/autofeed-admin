import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ userData }) => ({
        url: `users/change-password`,
        method: "POST",
        body: userData,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ userData }) => ({
        url: `users/change-password`,
        method: "PUT",
        body: userData,
      }),
    }),
    sendCode: builder.mutation({
      query: (email ) => ({
        url: `users/send-email`,
        method: "POST",
        body: email,
      }),
    }),
    verifyCode: builder.mutation({
      query: ( userData )  => ({
        url: `users/verify-code`,
        method: "POST",
        body: userData,
      }),
    }),
  }),
});
export const { useRegisterUserMutation, useLoginMutation, 
               useChangePasswordMutation, useSendCodeMutation, useVerifyCodeMutation 
              } = authApi;
