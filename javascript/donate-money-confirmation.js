const params = new URLSearchParams(window.location.search);
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
if (params.get("hash")) {
  fetch(`/api/payments/gcash/status?hash=${encodeURIComponent(params.get("hash"))}`)
    .then((response) => response.json())
    .then((result) => {
      if (!result.payment) return;
      document.getElementById("confirmation-lead").textContent =
        result.payment.status === "CO"
          ? "Your mock GCash donation was confirmed."
          : result.payment.status === "CA"
            ? "Your mock GCash payment was cancelled."
            : "Your mock GCash payment is pending.";
    })
    .catch(() => {});
}
