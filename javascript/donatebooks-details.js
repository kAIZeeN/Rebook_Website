const donorParams = new URLSearchParams(window.location.search);
const bookInfoForm = document.querySelector(".book-info-form");
const bookImageInput = document.getElementById("book-image");
const bookImagePreview = document.getElementById("book-image-preview");
let bookImagePreviewUrl;

bookImageInput.addEventListener("change", () => {
  const image = bookImageInput.files[0];
  if (!image) return;

  if (bookImagePreviewUrl) URL.revokeObjectURL(bookImagePreviewUrl);
  bookImagePreviewUrl = URL.createObjectURL(image);
  bookImagePreview.src = bookImagePreviewUrl;
  bookImagePreview.hidden = false;
});

document.getElementById("submit-book-donation").addEventListener("click", () => {
  if (!bookInfoForm.reportValidity()) return;

  const donorName = [
    donorParams.get("firstName"),
    donorParams.get("lastName")
  ].filter(Boolean).join(" ");
  const params = new URLSearchParams({
    donor: donorName || "Donor",
    email: donorParams.get("email") || "",
    phone: donorParams.get("phone") || "",
    title: document.getElementById("book-title").value.trim(),
    condition: document.getElementById("condition").selectedOptions[0].text,
    author: document.getElementById("author").value.trim(),
    reference: `RB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  });

  window.location.assign(`donate-book-confirmation.html?${params.toString()}`);
});
