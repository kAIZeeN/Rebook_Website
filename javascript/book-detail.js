const books = {
  "book-1": {
    title: "Sons of the Sword (Featured Story)",
    image: "sons-of-the-sword.png",
    author: "Georges Surdez",
    language: "English",
    isbn: "Not listed",
    condition: "Good",
    category: "Sci-fi, Fantasy",
    status: "available"
  },
  "book-2": {
    title: "In the Town: A Book of London Verses",
    image: "in-the-town.png",
    category: "Arts & Culture",
    status: "available"
  },
  "book-3": {
    title: "A History of the American People",
    image: "history-of-the-american-people.png",
    category: "Education & Reference",
    status: "available"
  },
  "book-4": {
    title: "Narrative of the Surveying Voyages of His Majesty's Ships Adventure and Beagle, Vol. 3",
    image: "surveying-voyages-adventure-beagle.png",
    category: "Education & Reference",
    status: "available"
  },
  "book-5": {
    title: "The Confessions of a Dancing Girl",
    image: "confessions-of-a-dancing-girl.png",
    category: "Arts & Culture",
    status: "available"
  },
  "book-6": {
    title: "A Social Mirage",
    image: "a-social-mirage.png",
    category: "Arts & Culture",
    status: "reserved"
  },
  "book-7": {
    title: "Voyage du Bornou au Baguirmi",
    image: "voyage-du-bornou-au-baguirmi.png",
    category: "Education & Reference",
    status: "available"
  },
  "book-8": {
    title: "Poems",
    image: "poems.png",
    category: "Arts & Culture",
    status: "borrowed"
  },
  "book-9": {
    title: "The Spring Chicken at Mrs. Martin's",
    image: "the-spring-chicken.png",
    category: "Arts & Culture",
    status: "available"
  },
  "book-10": {
    title: "Modern English Biography",
    image: "modern-english-biography.png",
    category: "Education & Reference",
    status: "available"
  },
  "book-11": {
    title: "The Natural History of Pliny, Vol. 6",
    image: "natural-history-pliny.png",
    category: "Health & Medicine",
    status: "available"
  },
  "book-12": {
    title: "The City of God, Vol. 1",
    image: "city-of-god.png",
    category: "Religion & Philosophy",
    status: "available"
  }
};

const requestedBook = new URLSearchParams(window.location.search).get("book") || "book-1";
const book = books[requestedBook];

if (book) {
  const imagePath = `assets/images/books/${book.image}`;
  const cover = document.querySelector('[data-book-field="cover"]');
  const title = document.querySelector('[data-book-field="title"]');
  const bookId = document.querySelector('[data-book-field="book-id"]');
  const borrowLink = document.querySelector('[data-book-field="borrow-link"]');
  const status = document.querySelector('[data-book-field="status"]');

  if (cover) {
    cover.setAttribute("aria-label", `Cover of ${book.title}`);
    cover.setAttribute("data-label", `BOOK COVER\n${imagePath}`);
    cover.querySelector(".img-slot__img").style.backgroundImage = `url("${imagePath}")`;
  }
  if (title) title.textContent = book.title;
  if (bookId) bookId.value = requestedBook;
  if (borrowLink) {
    borrowLink.href = `borrow.html?book=${requestedBook}`;
    borrowLink.hidden = book.status !== "available";
  }
  if (status) {
    status.textContent = book.status.charAt(0).toUpperCase() + book.status.slice(1);
    status.className = `status status--${book.status}`;
  }

  ["author", "language", "isbn", "condition", "category"].forEach((field) => {
    const value = document.querySelector(`[data-book-field="${field}"]`);
    if (value) value.textContent = book[field] || "Not listed";
  });

  const caption = document.querySelector('[data-book-field="caption"]');
  if (caption) caption.textContent = `Details of ${book.title}`;

}

const parameters = new URLSearchParams(window.location.search);
const selectedSchedule = parameters.get("schedule");
const scheduleOutput = document.querySelector("#preferredSchedule");
const scheduleInput = document.querySelector("#schedule");

if (scheduleInput) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  scheduleInput.min = today.toISOString().split("T")[0];
}

if (selectedSchedule && scheduleOutput) {
  const date = new Date(`${selectedSchedule}T00:00:00`);

  scheduleOutput.textContent = date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
