import { NextFunction, Request, Response } from "express";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/apiError";
import httpStatus from "http-status";

export const subscriptionGuard = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        if (!user || !user.userId) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required!");
        }

        // Only enforce for doctors
        if (user.role !== "doctor") {
            return next();
        }

        const activeSubscription = await prisma.subscription.findFirst({
            where: {
                doctorId: user.userId,
                status: "active",
            },
            orderBy: { createdAt: "desc" },
        });

        if (!activeSubscription) {
            throw new ApiError(httpStatus.FORBIDDEN, "Your subscription has expired. Please subscribe to continue!");
        }

        // Check if trial/subscription has actually expired
        const now = new Date();
        const endDate = activeSubscription.plan === "free_trial"
            ? activeSubscription.trialEndDate
            : activeSubscription.expiryDate;

        if (endDate && now > endDate) {
            // Mark as expired in DB
            await prisma.subscription.update({
                where: { id: activeSubscription.id },
                data: { status: "expired" },
            });
            throw new ApiError(httpStatus.FORBIDDEN, "Your subscription has expired. Please subscribe to continue!");
        }

        next();
    } catch (error) {
        next(error);
    }
};
