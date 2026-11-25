// Small admin controls for this static demo. Changes are saved in this browser.
var adminPage = location.pathname.split("/").pop();
var adminMain = document.querySelector("main");
var adminMessage = adminMain ? adminMain.querySelector(".admin-feedback") : null;

function showAdminMessage(message) {
  if (adminMessage) adminMessage.textContent = message;
}

function readAdminData(key, fallback) {
  try {
    var saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveAdminData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function addAdminButton(label, className) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.setAttribute("aria-label", label);
  return button;
}

function lowerText(value) {
  return (value || "").trim().toLowerCase();
}

if (adminPage === "admin-donation.html") {
  setupDonationTable();
} else if (adminMain) {
  setupAdminTable();
}

function setupAdminTable() {
  var tableBody = adminMain.querySelector("tbody");
  if (!tableBody) return;

  if (adminPage === "admin-books.html") addDonatedBooks(tableBody);
  if (adminPage === "admin-borrow.html") addBorrowRequests(tableBody);

  var pageKey = "rebook-admin-" + adminPage + "-state";
  var state = readAdminData(pageKey, { removed: [], statuses: {}, edits: {} });
  var search = adminMain.querySelector("[data-admin-search], #borrow-search, #user-search");
  var filter = adminMain.querySelector("[data-admin-filter]");
  var rows = tableBody.querySelectorAll("tr");

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var key = row.dataset.adminKey || adminPage + "-" + i;
    row.dataset.adminKey = key;
    row.dataset.adminStatus = state.statuses[key] || "pending";

    if (state.edits[key]) applyAdminEdit(row, state.edits[key]);
    if (state.removed.indexOf(key) !== -1) {
      row.remove();
      continue;
    }
    prepareAdminActions(row);
  }

  if (adminPage === "admin-users.html") setupUserFilters();
  if (search) search.addEventListener("input", filterAdminRows);
  if (filter) filter.addEventListener("change", filterAdminRows);
  adminMain.addEventListener("click", handleAdminAction);
  filterAdminRows();

  function saveState() {
    saveAdminData(pageKey, state);
  }

  function prepareAdminActions(row) {
    var group = row.querySelector(".row-actions");
    if (!group) return;

    var oldButtons = group.querySelectorAll("span[role='img']");
    for (var i = 0; i < oldButtons.length; i++) {
      var oldButton = oldButtons[i];
      var label = oldButton.getAttribute("aria-label") || oldButton.title;
      var className = oldButton.className;
      if (adminPage === "admin-books.html" || adminPage === "admin-borrow.html") {
        label = oldButton.classList.contains("approve-action") ? "Approve" : "Reject";
      }
      var button = addAdminButton(label, className);
      button.title = oldButton.title;
      if (adminPage !== "admin-books.html" && adminPage !== "admin-borrow.html") {
        button.innerHTML = oldButton.innerHTML;
      }
      oldButton.replaceWith(button);
    }

    if (adminPage === "admin-users.html") {
      group.appendChild(addAdminButton("Delete", "icon-button delete-action"));
    } else {
      group.appendChild(addAdminButton("Edit", "admin-action-button edit-action"));
      group.appendChild(addAdminButton("Delete", "admin-action-button delete-action"));
      if (!group.querySelector(".review-status")) {
        var status = document.createElement("span");
        status.className = "review-status";
        group.appendChild(status);
      }
    }
    updateStatusLabel(row);
  }

  function updateStatusLabel(row) {
    var label = row.querySelector(".review-status");
    if (label) {
      var status = row.dataset.adminStatus;
      label.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  function filterAdminRows() {
    var query = lowerText(search ? search.value : "");
    var selectedStatus = filter ? filter.value : "all";
    var activeTab = document.querySelector(".subnav-tab.active");
    var userFilter = activeTab ? activeTab.dataset.userFilter : "active";
    var visibleCount = 0;
    var currentRows = tableBody.querySelectorAll("tr[data-admin-key]");

    for (var i = 0; i < currentRows.length; i++) {
      var row = currentRows[i];
      var matches = lowerText(row.textContent).indexOf(query) !== -1;
      if (selectedStatus !== "all" && row.dataset.adminStatus !== selectedStatus) matches = false;

      if (adminPage === "admin-users.html") {
        var date = row.cells[3] ? row.cells[3].textContent.trim() : "";
        if (userFilter === "new" && date.indexOf("2026-") !== 0) matches = false;
        if (userFilter === "staff") matches = false;
        if ((userFilter === "suspended" || userFilter === "blocked") && row.dataset.adminStatus !== "blocked") matches = false;
        if (userFilter === "active" && row.dataset.adminStatus === "blocked") matches = false;
      }

      row.hidden = !matches;
      if (matches) visibleCount++;
    }

    if (adminPage === "admin-books.html") {
      var count = adminMain.querySelector(".inventory-count");
      if (count) count.textContent = currentRows.length + " books in inventory · " + visibleCount + " shown";
    }
    if (adminPage === "admin-users.html") {
      var heading = adminMain.querySelector("h1");
      var name = userFilter.charAt(0).toUpperCase() + userFilter.slice(1);
      if (heading) heading.textContent = name + " Users (" + visibleCount + ")";
    }
  }

  function setupUserFilters() {
    var tabs = document.querySelectorAll(".admin-subnav .subnav-tab");
    for (var i = 0; i < tabs.length; i++) {
      var oldTab = tabs[i];
      var value = lowerText(oldTab.textContent);
      var tab = addAdminButton(oldTab.textContent, "subnav-tab");
      tab.dataset.userFilter = value;
      if (oldTab.classList.contains("active")) {
        tab.classList.add("active");
        tab.setAttribute("aria-current", "page");
      }
      oldTab.replaceWith(tab);
      tab.addEventListener("click", function () {
        var allTabs = document.querySelectorAll(".admin-subnav .subnav-tab");
        for (var j = 0; j < allTabs.length; j++) {
          allTabs[j].classList.remove("active");
          allTabs[j].removeAttribute("aria-current");
        }
        this.classList.add("active");
        this.setAttribute("aria-current", "page");
        filterAdminRows();
      });
    }
  }

  function handleAdminAction(event) {
    var button = event.target.closest("button");
    if (!button || !adminMain.contains(button)) return;
    var row = button.closest("tr[data-admin-key]");
    if (!row) return;
    var key = row.dataset.adminKey;

    if (button.classList.contains("approve-action") || button.classList.contains("reject-action")) {
      row.dataset.adminStatus = button.classList.contains("approve-action") ? "approved" : "rejected";
      state.statuses[key] = row.dataset.adminStatus;
      updateStatusLabel(row);
      saveState();
      filterAdminRows();
      showAdminMessage("Request marked " + row.dataset.adminStatus + ".");
    } else if (button.classList.contains("edit-action")) {
      editAdminRow(row, key);
    } else if (button.classList.contains("delete-action")) {
      var title = row.cells[0].textContent.trim();
      if (confirm("Delete " + title + "? This change is saved in this browser.")) {
        state.removed.push(key);
        saveState();
        row.remove();
        filterAdminRows();
        showAdminMessage(title + " deleted.");
      }
    } else if (button.classList.contains("block-action")) {
      row.dataset.adminStatus = row.dataset.adminStatus === "blocked" ? "active" : "blocked";
      state.statuses[key] = row.dataset.adminStatus;
      button.title = row.dataset.adminStatus === "blocked" ? "Unblock" : "Block";
      button.setAttribute("aria-label", button.title);
      saveState();
      filterAdminRows();
      showAdminMessage(row.cells[0].textContent.trim() + " is now " + row.dataset.adminStatus + ".");
    } else if (button.classList.contains("view-action")) {
      var details = [];
      for (var i = 0; i < row.cells.length - 1; i++) details.push(row.cells[i].textContent.trim());
      alert(details.join("\n"));
    }
  }

  function editAdminRow(row, key) {
    var values = {};
    if (adminPage === "admin-books.html") {
      var bookTitle = row.querySelector(".book-title-cell span");
      values.title = prompt("Book title", bookTitle.textContent.trim());
      if (values.title === null) return;
      values.author = prompt("Author", row.cells[2].textContent.trim());
      if (values.author === null) return;
      values.condition = prompt("Condition", row.cells[3].textContent.trim());
      if (values.condition === null) return;
    } else if (adminPage === "admin-users.html") {
      values.username = prompt("Username", row.querySelector(".username-cell").textContent.trim());
      if (values.username === null) return;
      values.email = prompt("Email", row.cells[1].textContent.trim());
      if (values.email === null) return;
    } else {
      values.title = prompt("Book title", row.querySelector(".book-title-cell span").textContent.trim());
      if (values.title === null) return;
      values.borrower = prompt("Borrower details", row.cells[1].textContent.trim().replace(/\s+/g, " "));
      if (values.borrower === null) return;
    }

    for (var field in values) values[field] = values[field].trim();
    state.edits[key] = values;
    applyAdminEdit(row, values);
    saveState();
    filterAdminRows();
    showAdminMessage("Changes saved in this browser.");
  }

  function applyAdminEdit(row, values) {
    if (values.title !== undefined) row.querySelector(".book-title-cell span").textContent = values.title;
    if (values.author !== undefined) row.cells[2].textContent = values.author;
    if (values.condition !== undefined) row.cells[3].textContent = values.condition;
    if (values.username !== undefined) {
      var name = row.querySelector(".username-cell");
      name.querySelector(".user-avatar").textContent = values.username.charAt(0).toUpperCase();
      name.lastChild.textContent = values.username;
    }
    if (values.email !== undefined) row.cells[1].textContent = values.email;
    if (values.borrower !== undefined) {
      var borrower = row.cells[1].querySelector(".borrower-details");
      borrower.textContent = values.borrower;
    }
  }
}

function addDonatedBooks(tableBody) {
  var donatedBooks = readAdminData("rebook-admin-book-donations", []);
  for (var i = 0; i < donatedBooks.length; i++) {
    var book = donatedBooks[i];
    var row = document.createElement("tr");
    row.dataset.adminKey = "donated-book-" + book.id;
    row.dataset.adminStatus = "pending";
    row.dataset.donatedBook = "true";

    var titleCell = document.createElement("td");
    titleCell.className = "book-title-cell";
    var info = document.createElement("div");
    info.className = "donated-book-info";
    var title = document.createElement("span");
    title.textContent = book.title;
    var donor = document.createElement("small");
    donor.textContent = "Donated by " + book.donor + (book.email ? " · " + book.email : "");
    info.appendChild(title);
    info.appendChild(donor);
    titleCell.appendChild(info);
    row.appendChild(titleCell);

    var categoryCell = document.createElement("td");
    var category = document.createElement("span");
    category.className = "category-tag";
    category.textContent = book.category;
    categoryCell.appendChild(category);
    row.appendChild(categoryCell);

    var authorCell = document.createElement("td");
    authorCell.textContent = book.author;
    row.appendChild(authorCell);

    var conditionCell = document.createElement("td");
    conditionCell.textContent = book.condition;
    row.appendChild(conditionCell);

    var actionsCell = document.createElement("td");
    var actions = document.createElement("div");
    actions.className = "row-actions";
    actions.setAttribute("aria-label", "Actions for donated book " + book.title);
    actions.innerHTML = '<span class="approve-action" role="img" aria-label="Approve" title="Approve">✓</span><span class="reject-action" role="img" aria-label="Reject" title="Reject">×</span>';
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);
    tableBody.appendChild(row);
  }
}

function addBorrowRequests(tableBody) {
  var requests = readAdminData("rebook-admin-borrow-requests", []);
  for (var i = 0; i < requests.length; i++) {
    var request = requests[i];
    var row = document.createElement("tr");
    row.dataset.adminKey = "borrow-request-" + request.id;
    row.dataset.adminStatus = "pending";

    var titleCell = document.createElement("td");
    titleCell.className = "book-title-cell";
    var title = document.createElement("span");
    title.textContent = request.title;
    titleCell.appendChild(title);
    row.appendChild(titleCell);

    var borrowerCell = document.createElement("td");
    var borrower = document.createElement("div");
    borrower.className = "borrower-details borrower-details--request";
    var borrowerName = document.createElement("span");
    borrowerName.textContent = request.borrower;
    var borrowerAddress = document.createElement("span");
    borrowerAddress.textContent = request.address + ", " + request.barangay + ", " + request.city + " " + request.postalCode;
    var borrowerSchedule = document.createElement("span");
    borrowerSchedule.textContent = "Preferred: " + request.schedule;
    borrower.appendChild(borrowerName);
    borrower.appendChild(borrowerAddress);
    borrower.appendChild(borrowerSchedule);
    borrowerCell.appendChild(borrower);
    row.appendChild(borrowerCell);

    var standingCell = document.createElement("td");
    var standing = document.createElement("span");
    standing.className = "standing-badge standing-badge--active";
    standing.textContent = "Active";
    standingCell.appendChild(standing);
    row.appendChild(standingCell);

    var dateCell = document.createElement("td");
    dateCell.textContent = new Date(request.date).toLocaleDateString("en-PH");
    row.appendChild(dateCell);

    var actionsCell = document.createElement("td");
    var actions = document.createElement("div");
    actions.className = "row-actions";
    actions.setAttribute("aria-label", "Actions for borrow request " + request.title);
    actions.innerHTML = '<span class="approve-action" role="img" aria-label="Approve" title="Approve">✓</span><span class="reject-action" role="img" aria-label="Reject" title="Reject">×</span>';
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);
    tableBody.appendChild(row);
  }
}

function setupDonationTable() {
  var tableBody = document.querySelector("[data-donation-records]");
  if (!tableBody) return;

  var records = readAdminData("rebook-admin-donations", []);
  var state = readAdminData("rebook-admin-donation-state", { removed: [], edits: {} });
  var search = adminMain.querySelector("[data-admin-search]");
  var filter = adminMain.querySelector("[data-admin-filter]");

  function renderDonations() {
    tableBody.textContent = "";
    var visibleRecords = [];
    var query = lowerText(search.value);

    for (var i = 0; i < records.length; i++) {
      var donation = records[i];
      if (state.removed.indexOf(donation.id) !== -1) continue;
      var edit = state.edits[donation.id] || {};
      var name = edit.name || donation.name;
      var email = edit.email || donation.email;
      var amount = edit.amount || donation.amount;
      var frequency = donation.frequency === "monthly" ? "Monthly" : "One-time";
      var matches = lowerText(name + " " + email + " " + donation.reference + " " + frequency).indexOf(query) !== -1;
      if (filter.value !== "all" && donation.status !== filter.value) matches = false;
      if (matches) visibleRecords.push({ donation: donation, name: name, email: email, amount: amount });
    }

    if (visibleRecords.length === 0) {
      var emptyRow = document.createElement("tr");
      var emptyCell = document.createElement("td");
      emptyCell.colSpan = 8;
      emptyCell.textContent = records.length ? "No donations match these filters." : "No money donations recorded in this browser yet.";
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
    }

    for (var j = 0; j < visibleRecords.length; j++) {
      var item = visibleRecords[j];
      var donation = item.donation;
      var row = document.createElement("tr");
      var frequency = donation.frequency === "monthly" ? "Monthly" : "One-time";
      var cells = [item.name, item.email, "₱" + Number(item.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 }), frequency, donation.reference,
        new Date(donation.date).toLocaleDateString("en-PH"), donation.status];
      for (var k = 0; k < cells.length; k++) {
        var cell = document.createElement("td");
        cell.textContent = cells[k];
        row.appendChild(cell);
      }

      var actionCell = document.createElement("td");
      var actions = document.createElement("div");
      actions.className = "donation-actions";
      var actionNames = ["Approve", "Reject", "Edit", "Delete"];
      var actionTypes = ["approve", "reject", "edit", "delete"];
      for (var a = 0; a < actionNames.length; a++) {
        var button = addAdminButton(actionNames[a], "donation-action");
        button.dataset.action = actionTypes[a];
        button.dataset.id = donation.id;
        actions.appendChild(button);
      }
      actionCell.appendChild(actions);
      row.appendChild(actionCell);
      tableBody.appendChild(row);
    }
  }

  search.addEventListener("input", renderDonations);
  filter.addEventListener("change", renderDonations);
  tableBody.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-id]");
    if (!button) return;
    var record = null;
    for (var i = 0; i < records.length; i++) {
      if (records[i].id === button.dataset.id) record = records[i];
    }
    if (!record) return;

    if (button.dataset.action === "approve" || button.dataset.action === "reject") {
      record.status = button.dataset.action === "approve" ? "approved" : "rejected";
      saveAdminData("rebook-admin-donations", records);
      showAdminMessage("Donation marked " + record.status + ".");
    } else if (button.dataset.action === "edit") {
      var donorName = prompt("Donor name", record.name);
      if (donorName === null) return;
      var donorEmail = prompt("Donor email", record.email);
      if (donorEmail === null) return;
      var amount = prompt("Amount in PHP", String(record.amount));
      if (amount === null) return;
      if (Number(amount) <= 0 || isNaN(Number(amount))) {
        showAdminMessage("Enter a valid amount greater than zero.");
        return;
      }
      state.edits[record.id] = { name: donorName.trim(), email: donorEmail.trim(), amount: Number(amount) };
      saveAdminData("rebook-admin-donation-state", state);
      showAdminMessage("Donation details updated.");
    } else if (button.dataset.action === "delete") {
      if (!confirm("Delete donation " + record.reference + "? This change is saved in this browser.")) return;
      state.removed.push(record.id);
      saveAdminData("rebook-admin-donation-state", state);
      showAdminMessage("Donation deleted.");
    }
    renderDonations();
  });
  renderDonations();
}
