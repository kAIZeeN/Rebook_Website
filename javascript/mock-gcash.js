const params = new URLSearchParams(window.location.search);
const amount = Number(params.get("amount"));
const name = params.get("name");
const email = params.get("email");
const reference = params.get("reference");

if (!amount || !name || !email || !reference) {
  document.querySelector(".checkout-content").innerHTML =
    "<h1>Payment details missing</h1><p>Return to the donation form and try again.</p>" +
    '<a href="donatemoney.html">Back to donations</a>';
} else {
  document.getElementById("payment-amount").textContent =
    `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
  document.getElementById("payment-reference").textContent = reference;
  document.getElementById("payment-email").textContent = email;

  function finishPayment(status) {
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
