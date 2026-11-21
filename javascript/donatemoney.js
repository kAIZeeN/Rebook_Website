document.querySelectorAll(".price-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("custom-amount").value =
      button.textContent.replace(/[^0-9.]/g, "");
  });
});

document.getElementById("gcash-donation-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const amount = Number(document.getElementById("custom-amount").value);
  const submitButton = event.currentTarget.querySelector(".submit-button");

  if (!amount || amount < 20 || amount > 100000) {
    alert("Please enter a GCash donation amount between PHP 20 and PHP 100,000.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Processing...";

  try {
    const response = await fetch("/api/payments/gcash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        amount,
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Payment could not be created.");
    window.location.assign(result.redirectUrl);
  } catch (error) {
    alert(error.name === "TimeoutError"
      ? "The payment request timed out. Check that both local servers are running and try again."
      : error.message);
    submitButton.disabled = false;
    submitButton.textContent = "Continue to GCash";
  }
});
