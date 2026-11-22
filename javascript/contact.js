const contactForm = document.getElementById("contact-form");
const contactFeedback = document.getElementById("contact-feedback");

if (contactForm && contactFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactFeedback.textContent = "Your form is complete. This demo does not send or store messages, so please contact ReBook using the details on this page.";
    contactFeedback.hidden = false;
    contactFeedback.focus();
    contactForm.reset();
  });
}
