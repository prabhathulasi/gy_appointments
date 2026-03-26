import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";
import { Subscription } from "@prisma/client";

const startFreeTrial = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.startFreeTrial(req.user);
    sendResponse<Subscription>(res, {
        statusCode: 200,
        message: "Free trial started successfully! You have 45 days of free access.",
        success: true,
        data: result,
    });
});

const subscribe = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.subscribe(req.user, req.body);
    sendResponse<Subscription>(res, {
        statusCode: 200,
        message: "Subscription activated successfully!",
        success: true,
        data: result,
    });
});

const getMySubscription = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.getMySubscription(req.user);
    sendResponse<Subscription>(res, {
        statusCode: 200,
        message: "Successfully retrieved subscription details!",
        success: true,
        data: result,
    });
});

const getSubscriptionHistory = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.getSubscriptionHistory(req.user);
    sendResponse<Subscription[]>(res, {
        statusCode: 200,
        message: "Successfully retrieved subscription history!",
        success: true,
        data: result,
    });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.cancelSubscription(req.user);
    sendResponse<Subscription>(res, {
        statusCode: 200,
        message: "Subscription cancelled successfully!",
        success: true,
        data: result,
    });
});

const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.getAllSubscriptions();
    sendResponse<Subscription[]>(res, {
        statusCode: 200,
        message: "Successfully retrieved all subscriptions!",
        success: true,
        data: result,
    });
});

const getSubscriptionRevenue = catchAsync(async (req: Request, res: Response) => {
    const result = await SubscriptionService.getSubscriptionRevenue();
    sendResponse(res, {
        statusCode: 200,
        message: "Successfully retrieved subscription revenue!",
        success: true,
        data: result,
    });
});

export const SubscriptionController = {
    startFreeTrial,
    subscribe,
    getMySubscription,
    getSubscriptionHistory,
    cancelSubscription,
    getAllSubscriptions,
    getSubscriptionRevenue,
};
