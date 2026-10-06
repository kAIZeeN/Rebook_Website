# ReBook - Website Development Project

## Tagline

> Empower a Mind, One Book at a Time

---

# 1. Company Profile

## 1.1 Company Name & Description

**Company Name:** ReBook

ReBook is a web-based platform designed to support the donation, preservation, and sharing of books within a community.

The platform allows users to:

- Donate books
- Borrow books
- Make monetary donations
- Browse a digital archive of books

ReBook promotes book sharing and accessibility while reducing book waste.

---

## 1.2 Mission

To provide a convenient way of managing book donations and borrowing while making unused books accessible to others.

## 1.3 Vision

To build a community where books are shared, preserved, and made accessible to everyone through a digital platform.

## 1.4 Objectives

Develop a web-based system that allows users to:

- Donate books
- Donate money
- Borrow books
- Browse an online archive

Administrators can:

- Review donations
- Manage books
- Manage users
- Manage inquiries

---

# 2. Project Overview

## Purpose

The ReBook website provides an online platform for:

- Book donations
- Book borrowing
- Monetary donations
- Digital archiving

## Target Audience

- Students
- Teachers
- Readers
- Donors
- Community Members
- Borrowers
- Administrators

---

# 3. Functional Requirements

## Public Pages

### Home

- Platform introduction
- Featured books
- Statistics
- Donation CTA

### About Us

- Mission
- Vision
- Objectives
- Why it Matters
- How It Works

### Books

- Browse books
- Search books
- Filter by category
- View details
- Borrow available books

### Donate

#### Donate Book

- Donor Information
- Book Information

#### Donate Money

- Donation Amount
- Payment Method
- Donor Information

### Contact Us

- Contact Information
- Inquiry Form

### Login / Sign Up

- Login
- Registration
- Forgot Password

---

# 4. User Features

## Authentication

- Register
- Login
- Logout
- Forgot Password

## Book Archive

- Browse books
- Search books
- Category filtering
- View book details

## Borrowing

Users can:

- Request a book
- Choose a preferred schedule
- Receive confirmation

## Donations

Users can:

- Donate books
- Donate money

## Contact Form

Users can:

- Submit inquiries
- Submit feedback

---

# 5. Admin Portal

## Dashboard

- Statistics
- Alerts
- Quick Overview

## User Management

- View Users
- Create Users
- Edit Users

## Book Management

- Review Books
- Approve Books
- Edit Books
- Delete Books

## Donation Management

- View Donations
- Track Funds
- Generate Reports

## Inquiry Management

- View Inquiries
- Mark as Replied

---

# 6. Book Statuses

## Available

Book can be borrowed.

## Under Review

Waiting for admin approval.

## Reserved

Borrow request exists.

## Borrowed

Currently borrowed.

---

# 7. Scope

Included:

- Home Page
- About Us
- Books
- Donate
- Contact Us
- Login / Sign Up
- User Authentication
- Book Archive
- Borrow Requests
- Admin Portal
- Responsive Layout

---

# 8. Limitations

- GCash payments are simulated.
- Email services are simulated.
- Password reset emails are simulated.
- Sample data is used.
- No discussion boards.
- No delivery tracking.

---

# 9. Technology Stack

## Frontend

- HTML
- CSS
- JavaScript

## Backend

- Node.js

## Database

- MySQL

## Development Tools

- Visual Studio Code
- GitHub
- Jira
- Canva
- Figma
- MySQL Workbench

---

# 10. Database Entities

## Users

- id
- first_name
- last_name
- email
- password_hash
- role

## Books

- id
- title
- author
- category
- description
- status
- cover_image

## Book Donations

- id
- donor_id
- book_id
- submission_date
- approval_status

## Borrow Requests

- id
- user_id
- book_id
- preferred_schedule
- status

## Monetary Donations

- id
- donor_id
- amount
- payment_method
- donation_date

## Inquiries

- id
- name
- email
- message
- status

---

# 11. Coding Guidelines

- Mobile-first design
- Responsive layout
- Semantic HTML
- Accessible forms
- Password hashing required
- Authentication required for borrowing
- Authentication required for admin portal
- Use MySQL relationships and foreign keys
- Follow ReBook branding colors

---

# 12. ReBook Color Palette

| Purpose | Color | Hex |
|----------|--------|--------|
| Navbar/Footer | Deep Navy Blue | #0C00AE |
| Primary Buttons | Royal Blue | #1653E1 |
| CTA Accent | Sky Cyan | #10BFFF |
| Highlight | Deep Violet | #4F47B5 |
| Text | Charcoal Black | #2C2C2C |
| Background | White | #FFFFFF |
| Available Status | Green | #1BED3E |

---

# 13. Future Enhancements

- Real payment integration
- Email notifications
- Community features
- Delivery tracking
- Advanced search and recommendations