const donorParams = new URLSearchParams(window.location.search);
const bookInfoForm = document.querySelector(".book-info-form");
const bookImageInput = document.getElementById("book-image");
const bookImagePreview = document.getElementById("book-image-preview");
const languageSelect = document.getElementById("language");
const categorySelect = document.getElementById("category");
const otherLanguageInput = document.getElementById("language-other");
const otherCategoryInput = document.getElementById("category-other");
let bookImagePreviewUrl;

function toggleOtherInput(select, input) {
  const showInput = select.value === "other";
  input.hidden = !showInput;
  input.required = showInput;
  if (!showInput) input.value = "";
}

languageSelect.addEventListener("change", () => toggleOtherInput(languageSelect, otherLanguageInput));
categorySelect.addEventListener("change", () => toggleOtherInput(categorySelect, otherCategoryInput));
toggleOtherInput(languageSelect, otherLanguageInput);
toggleOtherInput(categorySelect, otherCategoryInput);

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

  const donatedBooks = JSON.parse(localStorage.getItem("rebook-admin-book-donations") || "[]");
  donatedBooks.push({
    id: params.get("reference"),
    donor: donorName || "Donor",
    email: donorParams.get("email") || "",
    title: document.getElementById("book-title").value.trim(),
    author: document.getElementById("author").value.trim(),
    isbn: document.getElementById("ISBN").value.trim(),
    language: languageSelect.value === "other" ? otherLanguageInput.value.trim() : languageSelect.selectedOptions[0].text,
    condition: document.getElementById("condition").selectedOptions[0].text,
    category: categorySelect.value === "other" ? otherCategoryInput.value.trim() : categorySelect.selectedOptions[0].text,
    description: document.getElementById("description").value.trim(),
    date: new Date().toISOString()
  });
  localStorage.setItem("rebook-admin-book-donations", JSON.stringify(donatedBooks));

  window.location.assign(`donate-book-confirmation.html?${params.toString()}`);
});
