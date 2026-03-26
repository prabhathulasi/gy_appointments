export const PLANS = [
  {
    name: "Free Trial",
    subtitle: "Free for 45 days",
    monthlyPrice: 0,
    annualPrice: 0,
    currency: "₹",
    buttonText: "Start Free Trial",
    buttonVariant: "outlined",
    isPopular: false,
    isCurrentPlan: true,
    inheritLabel: null,
    features: [
      "1 Doctor Profile",
      "1 User Login",
      "Basic Scheduling",
      "Online Booking Page",
      "Email Confirmation",
      "Patient Database (Up to 300)",
    ],
  },
  {
    name: "Subscription Plan",
    subtitle: "Full access after 45-day trial",
    monthlyPrice: 2499,
    annualPrice: 1999,
    currency: "₹",
    buttonText: "Subscribe Now",
    buttonVariant: "solid",
    isPopular: true,
    inheritLabel: "EVERYTHING IN FREE TRIAL +",
    features: [
      "Unlimited Patients",
      "SMS & WhatsApp Reminders",
      "Google Calendar Sync",
      "Online Payments Integration",
      "Recurring Appointments",
      "Self-Reschedule Portal",
      "Priority Support",
    ],
  },
];

export const COMPARISON_FEATURES = [
  {
    name: "Patient Database",
    free: "Up to 300",
    subscription: "Unlimited",
  },
  {
    name: "Reminders",
    free: "Email Only",
    subscription: "WhatsApp, SMS & Email",
  },
  {
    name: "Calendar Sync",
    free: null,
    subscription: "Google Calendar",
  },
  {
    name: "Payments",
    free: "Manual",
    subscription: "Online Integrated",
  },
  {
    name: "Recurring Appointments",
    free: null,
    subscription: "Yes",
  },
  {
    name: "Support",
    free: "Community",
    subscription: "Priority",
  },
];
