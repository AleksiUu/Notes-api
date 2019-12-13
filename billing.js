import stripePackage from "stripe";
import { calculateCost } from "./libs/billing-lib";
import { success, failure } from "./libs/response-lib";

export const main = async (event, context) => {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = "Scratch charge";

  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: "eur"
    });
    return success({ status: true });
  } catch (e) {
    return failure({ message: e.message });
  }
};
