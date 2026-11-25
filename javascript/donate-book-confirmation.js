const donationParams = new URLSearchParams(window.location.search);
const donor = donationParams.get("donor");
const contact = [
  donationParams.get("email"),
  donationParams.get("phone")
].filter(Boolean).join(" / ");

if (donor) {
  document.getElementById("confirm-title").textContent =
    `Thank you for donating a book, ${donor}!`;
  document.getElementById("confirmation-donor").textContent = donor;
}
if (donationParams.get("title")) {
  document.getElementById("confirmation-book-title").textContent =
    donationParams.get("title");
}
if (donationParams.get("condition")) {
  document.getElementById("confirmation-condition").textContent =
    donationParams.get("condition");
}
if (donationParams.get("author")) {
  document.getElementById("confirmation-author").textContent =
    donationParams.get("author");
}
if (contact) {
  document.getElementById("confirmation-contact").textContent = contact;
}
if (donationParams.get("reference")) {
  document.getElementById("confirmation-reference").textContent =
    donationParams.get("reference");
}
