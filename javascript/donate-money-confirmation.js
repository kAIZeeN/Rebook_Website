const params = new URLSearchParams(window.location.search);
const paymentStatus = params.get("status");

if (params.get("amount")) {
  document.getElementById("confirmation-amount").textContent =
    `₱${Number(params.get("amount")).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}
if (params.get("name")) {
  document.getElementById("confirm-title").textContent =
    `Thank you for donating, ${params.get("name")}!`;
}
if (params.get("email")) {
  document.getElementById("confirmation-email").textContent = params.get("email");
}
if (params.get("reference")) {
  document.getElementById("confirmation-reference").textContent = params.get("reference");
}
if (params.get("method")) {
  document.getElementById("confirmation-method").textContent = params.get("method");
}
if (params.get("frequency") === "monthly") {
  document.getElementById("confirmation-frequency").textContent = "Monthly";
}

if (paymentStatus === "cancelled") {
  document.getElementById("confirm-title").textContent = "Payment cancelled";
  document.getElementById("confirmation-lead").textContent =
    "Your mock GCash payment was cancelled. No payment was made.";
  document.getElementById("confirmation-icon").textContent = "×";
  document.getElementById("confirmation-icon").classList.add("is-cancelled");
  document.getElementById("next-steps").hidden = true;
} else if (paymentStatus === "confirmed") {
  document.getElementById("confirmation-lead").textContent =
    params.get("frequency") === "monthly"
      ? "Your mock monthly donation was confirmed as one demo payment. No real or recurring payment was made."
      : "Your mock GCash donation was confirmed. No real payment was made.";
}
