import { Subscription } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/apiError";
import httpStatus from "http-status";
import moment from "moment";

const startFreeTrial = async (user: any): Promise<Subscription> => {
    const { userId } = user;

    const isDoctor = await prisma.doctor.findUnique({
        where: { id: userId },
    });
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, "Doctor Account is not found !!");
    }

    // Check if doctor already has an active subscription or trial
    const existingSubscription = await prisma.subscription.findFirst({
        where: {
            doctorId: userId,
            status: "active",
        },
    });
    if (existingSubscription) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You already have an active plan !!");
    }

    const trialStartDate = new Date();
    const trialEndDate = moment(trialStartDate).add(45, "days").toDate();

    const result = await prisma.subscription.create({
        data: {
            doctorId: userId,
            plan: "free_trial",
            status: "active",
            trialStartDate,
            trialEndDate,
        },
    });
    return result;
};

const subscribe = async (user: any, payload: any): Promise<Subscription> => {
    const { userId } = user;
    const { billingCycle, paymentId, orderId } = payload;

    const isDoctor = await prisma.doctor.findUnique({
        where: { id: userId },
    });
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, "Doctor Account is not found !!");
    }

    const amount = billingCycle === "annual" ? 1999 : 2499;
    const subscribedDate = new Date();
    const expiryDate =
        billingCycle === "annual"
            ? moment(subscribedDate).add(1, "year").toDate()
            : moment(subscribedDate).add(1, "month").toDate();

    // Cancel any existing active subscription/trial
    await prisma.subscription.updateMany({
        where: {
            doctorId: userId,
            status: "active",
        },
        data: {
            status: "expired",
        },
    });

    const result = await prisma.subscription.create({
        data: {
            doctorId: userId,
            plan: "subscription",
            status: "active",
            trialStartDate: subscribedDate,
            trialEndDate: expiryDate,
            subscribedDate,
            expiryDate,
            billingCycle,
            amount,
            paymentId,
            orderId,
        },
    });
    return result;
};

const getMySubscription = async (user: any): Promise<Subscription | null> => {
    const { userId } = user;

    const isDoctor = await prisma.doctor.findUnique({
        where: { id: userId },
    });
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, "Doctor Account is not found !!");
    }

    const result = await prisma.subscription.findFirst({
        where: {
            doctorId: userId,
            status: "active",
        },
        orderBy: { createdAt: "desc" },
    });

    // Check if trial/subscription has expired
    if (result) {
        const now = new Date();
        const endDate = result.plan === "free_trial" ? result.trialEndDate : result.expiryDate;
        if (endDate && now > endDate) {
            await prisma.subscription.update({
                where: { id: result.id },
                data: { status: "expired" },
            });
            return { ...result, status: "expired" };
        }
    }

    return result;
};

const getSubscriptionHistory = async (user: any): Promise<Subscription[]> => {
    const { userId } = user;

    const isDoctor = await prisma.doctor.findUnique({
        where: { id: userId },
    });
    if (!isDoctor) {
        throw new ApiError(httpStatus.NOT_FOUND, "Doctor Account is not found !!");
    }

    const result = await prisma.subscription.findMany({
        where: { doctorId: userId },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

const cancelSubscription = async (user: any): Promise<Subscription> => {
    const { userId } = user;

    const activeSubscription = await prisma.subscription.findFirst({
        where: {
            doctorId: userId,
            status: "active",
        },
    });
    if (!activeSubscription) {
        throw new ApiError(httpStatus.NOT_FOUND, "No active subscription found !!");
    }

    const result = await prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: { status: "cancelled" },
    });
    return result;
};

// Admin: get all subscriptions
const getAllSubscriptions = async (): Promise<Subscription[]> => {
    const result = await prisma.subscription.findMany({
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    img: true,
                    specialization: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

// Admin: get total subscription revenue
const getSubscriptionRevenue = async (): Promise<{ totalRevenue: number; totalPaidSubscriptions: number }> => {
    const paidSubscriptions = await prisma.subscription.findMany({
        where: {
            plan: "subscription",
            amount: { not: null },
        },
        select: { amount: true },
    });

    const totalRevenue = paidSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
    return {
        totalRevenue,
        totalPaidSubscriptions: paidSubscriptions.length,
    };
};

export const SubscriptionService = {
    startFreeTrial,
    subscribe,
    getMySubscription,
    getSubscriptionHistory,
    cancelSubscription,
    getAllSubscriptions,
    getSubscriptionRevenue,
};
