const params = new URLSearchParams(window.location.search);
const amount = Number(params.get("amount"));
const name = params.get("name");
const email = params.get("email");
const reference = params.get("reference");
const frequency = params.get("frequency") === "monthly" ? "monthly" : "once";

if (!amount || !name || !email || !reference) {
  document.querySelector(".checkout-content").innerHTML =
    "<h1>Payment details missing</h1><p>Return to the donation form and try again.</p>" +
    '<a href="donatemoney.html">Back to donations</a>';
} else {
  document.getElementById("payment-amount").textContent =
    `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
  document.getElementById("payment-reference").textContent = reference;
  document.getElementById("payment-email").textContent = email;
  document.getElementById("payment-frequency").textContent = frequency === "monthly" ? "Monthly" : "One-time";

  function finishPayment(status) {
    if (status === "confirmed") {
      const storageKey = "rebook-admin-donations";
      const records = JSON.parse(localStorage.getItem(storageKey) || "[]");
      records.push({
        id: reference,
        name,
        email,
        amount,
        frequency,
        reference,
        date: new Date().toISOString(),
        status: "pending"
      });
      localStorage.setItem(storageKey, JSON.stringify(records));
    }
    params.set("status", status);
    window.location.assign(`donate-money-confirmation.html?${params.toString()}`);
  }

  document.getElementById("approve-payment").addEventListener("click", () => {
    finishPayment("confirmed");
  });
  document.getElementById("decline-payment").addEventListener("click", () => {
    finishPayment("cancelled");
  });
}
