const borrowForm = document.querySelector(".borrow-card form");

borrowForm.addEventListener("submit", () => {
  const requests = JSON.parse(localStorage.getItem("rebook-admin-borrow-requests") || "[]");
  const requestId = `RB-BR-${Date.now()}`;
  const fields = new FormData(borrowForm);

  requests.push({
    id: requestId,
    bookId: fields.get("book"),
    title: document.querySelector('[data-book-field="title"]').textContent.trim(),
    borrower: fields.get("fullName"),
    city: fields.get("city"),
    barangay: fields.get("barangay"),
    postalCode: fields.get("postalCode"),
    address: fields.get("address"),
    schedule: fields.get("schedule"),
    date: new Date().toISOString()
  });

  localStorage.setItem("rebook-admin-borrow-requests", JSON.stringify(requests));
  borrowForm.action = "borrow-confirmation.html?reference=" + encodeURIComponent(requestId);
});
