const crypto = require("crypto");
const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
const mockPaymentUrl = "http://localhost:8080";

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/payments/gcash", async (req, res) => {
  const amount = Number(req.body.amount);
  const firstName = String(req.body.firstName || "").trim();
  const lastName = String(req.body.lastName || "").trim();
  const email = String(req.body.email || "").trim();
  const phone = String(req.body.phone || "").trim();

  if (!Number.isFinite(amount) || amount < 20 || amount > 100000) {
    return res.status(400).json({
      error: "GCash amount must be between PHP 20 and PHP 100,000."
    });
  }
  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({
      error: "Name, email, and phone number are required."
    });
  }

  const reference = `RB-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const returnUrl = `${req.protocol}://${req.get("host")}/donate-money-confirmation.html`;
  const confirmationParams = new URLSearchParams({
    amount: amount.toFixed(2),
    name: `${firstName} ${lastName}`,
    email,
    reference,
    method: "GCash"
  });
  const confirmationUrl = `${returnUrl}?${confirmationParams}`;

  try {
    const response = await fetch(`${mockPaymentUrl}/mock/direct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        payment: {
          name: `${firstName} ${lastName}`,
          email,
          country: "ph",
          phone_number: phone,
          payment_type_code: "g-cash",
          redirect_url: confirmationUrl,
          merchant_payment_code: reference,
          currency_code: "PHP",
          amount_total: Number(amount.toFixed(2))
        }
      })
    });
    const result = await response.json();

    if (!response.ok || result.status !== "SUCCESS" || !result.payment) {
      return res.status(response.status || 502).json({
        error: "Could not create the mock GCash payment.",
        details: result.status_message || result.message
      });
    }

    const params = new URLSearchParams({
      amount: amount.toFixed(2),
      name: `${firstName} ${lastName}`,
      email,
      reference,
      method: "GCash",
      hash: result.payment.hash
    });

    return res.json({
      redirectUrl: result.payment.redirect_url,
      reference,
      hash: result.payment.hash,
      status: "pending",
      confirmationUrl: `/donate-money-confirmation.html?${params}`
    });
  } catch (error) {
    return res.status(502).json({
      error: error.name === "TimeoutError"
        ? "Mock GCash server did not respond in time."
        : "Mock GCash server is not running.",
      details: "Check that python mock_gcash.py is running."
    });
  }
});

app.get("/api/payments/gcash/status", async (req, res) => {
  const hash = String(req.query.hash || "").trim();
  if (!hash) {
    return res.status(400).json({ error: "Payment hash is required." });
  }

  try {
    const response = await fetch(`${mockPaymentUrl}/mock/query?hash=${encodeURIComponent(hash)}`, {
      signal: AbortSignal.timeout(10000)
    });
    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (error) {
    return res.status(502).json({ error: "Could not query mock GCash." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, paymentMode: "mock-gcash" });
});

app.listen(port, () => {
  console.log(`ReBook server running at http://localhost:${port}`);
  console.log(`Mock GCash URL: ${mockPaymentUrl}`);
});
