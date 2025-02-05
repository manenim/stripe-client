import { useEffect, useState } from "react";
import GooglePayButton from "@google-pay/button-react"

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("https://e131da29124cc7.lhr.life/api/v1/payment/config", {
      mode: "no-cors",
    }).then(async (r) => {
      const { data } = await r.json();
      setStripePromise(
        loadStripe(
          "pk_test_51Q9vy3HhJngUKlMMrc5JxIih67WjSULLpzpHPF8tJwIJlq81Rg1Y0s67nh6Gg8FQJEsJdoOc03mGJnG3XB1dk6yr00EYZNYbTz"
        )
      );
    });
  }, []);

  useEffect(() => {
    fetch(
      "https://e131da29124cc7.lhr.life/api/v1/payment/create-payment-intent",
      { mode: "no-cors" },
      {
        method: "POST",
        body: JSON.stringify({
          amount: 1000,
          currency: "usd",
          eventId: "your-event-id",
          userId: "your-user-id",
        }),
      }
    ).then(async (result) => {
      var { data } = await result.json();
      console.log(data.clientSecret);
      setClientSecret(data.clientSecret);
    });
  }, []);

  return (
    <>
      {/* <GooglePayButton
        environment="TEST"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["MASTERCARD", "VISA"],
              },
              tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                parameters: {
                  gateway: "stripe",
                  gatewayMerchantId: "acct_1Q9vy3HhJngUKlMM",
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: "BCR2DN4T27WNVEZ5",
            merchantName: "Demo Merchant",
          },
          transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPriceLabel: "Total",
            totalPrice: "100.00",
            currencyCode: "USD",
            countryCode: "US",
          },
        }}
        onLoadPaymentData={(paymentRequest) => {
          console.log("load payment data", paymentRequest);
        }}
      /> */}
      <h1>React Stripe and the Payment Element</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
