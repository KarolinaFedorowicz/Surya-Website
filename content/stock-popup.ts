// Home page popup — appears once the reader scrolls past the hero.

export const stockPopup: {
  headline: string;
  welcome: string;
  body: string[];
  signoff: string[];
  emailPlaceholder: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
} = {
  headline: "Oh! Only a couple of Cacao bags left!",
  welcome: "Welcome to the Surya Family!",
  body: [
    "We craft small-batch, ceremonial-grade Cacao in the Dominican Republic. To preserve its natural energy and premium quality, our cacao is traditional sun-dried not roasted.",
    "Because we harvest in small batches, we have a couple bags of cacao left. If we happen to sell out before you place your order, leave your email below! We restock regularly and will make sure you're the first to know.",
  ],
  signoff: ["With gratitude,", "The Surya Family"],
  emailPlaceholder: "Your email",
  submitLabel: "Sign up with email",
  successMessage: "You're on the list — we'll let you know the moment we restock.",
  errorMessage: "That didn't go through. Try again in a moment.",
};
