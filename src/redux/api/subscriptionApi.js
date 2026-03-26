import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const SUBSCRIPTION_URL = "/subscription";

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMySubscription: build.query({
            query: () => ({
                url: `${SUBSCRIPTION_URL}/my-subscription`,
                method: "GET",
            }),
            providesTags: [tagTypes.subscription],
        }),
        getSubscriptionHistory: build.query({
            query: () => ({
                url: `${SUBSCRIPTION_URL}/history`,
                method: "GET",
            }),
            providesTags: [tagTypes.subscription],
        }),
        subscribe: build.mutation({
            query: (data) => ({
                url: `${SUBSCRIPTION_URL}/subscribe`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.subscription],
        }),
        cancelSubscription: build.mutation({
            query: () => ({
                url: `${SUBSCRIPTION_URL}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: [tagTypes.subscription],
        }),
    }),
});

export const {
    useGetMySubscriptionQuery,
    useGetSubscriptionHistoryQuery,
    useSubscribeMutation,
    useCancelSubscriptionMutation,
} = subscriptionApi;
