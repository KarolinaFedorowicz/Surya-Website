// Modal shown right after "Add to cart" — offers to upgrade the line just
// added into a subscription.

export const subscribeUpsell: {
  addedMessage: string;
  headline: string;
  monthly: { label: string; description: string };
  everyThreeMonths: { label: string; description: string };
  continueLabel: string;
  notConfiguredMessage: string;
} = {
  addedMessage: "Added to your cart.",
  headline: "Subscribe & Save",
  monthly: {
    label: "Deliver every month",
    description: "Subscribe for monthly deliveries and save 15% on every order.",
  },
  everyThreeMonths: {
    label: "Deliver every 3 months",
    description: "Subscribe for delivery every 3 months and save 10% on every order.",
  },
  continueLabel: "No thanks, one-time purchase",
  notConfiguredMessage: "Subscriptions aren't set up yet — one-time purchase only for now.",
};
