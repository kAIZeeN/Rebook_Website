document.querySelectorAll(".price-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("custom-amount").value =
      button.textContent.replace(/[^0-9.]/g, "");
  });
});

document.getElementById("gcash-donation-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(document.getElementById("custom-amount").value);
  const form = event.currentTarget;

  if (!amount || amount < 20 || amount > 100000) {
    alert("Please enter a GCash donation amount between PHP 20 and PHP 100,000.");
    return;
  }

  if (document.getElementById("payment-method").value !== "gcash") {
    alert("This local mockup currently supports GCash only.");
    return;
  }

  const params = new URLSearchParams({
    amount: amount.toFixed(2),
    name: `${document.getElementById("first-name").value.trim()} ${document.getElementById("last-name").value.trim()}`,
    email: document.getElementById("email").value.trim(),
    reference: `RB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    method: "GCash"
  });

  window.location.assign(`mock-gcash.html?${params.toString()}`);
});
