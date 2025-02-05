import { useEffect, useState } from "react";
import GooglePayButton from "@google-pay/button-react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("https://21afa2306130ed.lhr.life/config", {
      mode: "no-cors",
    }).then(async (r) => {
      // const { data } = await r.json();
      setStripePromise(
        loadStripe(
          "pk_test_51Q9vy3HhJngUKlMMrc5JxIih67WjSULLpzpHPF8tJwIJlq81Rg1Y0s67nh6Gg8FQJEsJdoOc03mGJnG3XB1dk6yr00EYZNYbTz"
        )
      );
    });
  }, []);

  useEffect(() => {
    fetch("https://21afa2306130ed.lhr.life/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      console.log(clientSecret);
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
      <GooglePayButton
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
                  stripe: {
                    publishableKey:
                      "pk_test_51QCOxVD8GREPvPdBJRtqz17XAAPdtxqNLhCHyP9NsGRfut7JllS0H4EzGK25JLJglbgccYrna7gDd2bL8grSy9Yu00GyxSmhSM",
                  },
                  gatewayMerchantId: "acct_1QCOxVD8GREPvPdB",
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: "BCR2DN4T27WNVEZ5",
            merchantName: "Saltech",
          },
          transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPriceLabel: "Total",
            totalPrice: "0.05",
            currencyCode: "USD",
            countryCode: "US",
          },
        }}
        onLoadPaymentData={(paymentRequest) => {
          console.log("load payment data", paymentRequest);
        }}
      />
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
