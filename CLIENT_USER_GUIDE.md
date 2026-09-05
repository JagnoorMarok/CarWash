# Prime Finish Auto Spa - Client Handover & Website Operating Guide

Welcome to your new digital platform! This comprehensive manual is designed for the owners, managers, and staff of **Prime Finish Auto Spa** to help you operate, manage, and customize your website and staff dashboard with confidence.

---

## 📑 Table of Contents
1. [Key Website Links & Access](#1-key-website-links--access)
2. [Logging Into the Staff Portal](#2-logging-into-the-staff-portal)
3. [Mobile Staff Portal & Navigation](#3-mobile-staff-portal--navigation)
4. [Executive Overview & Business KPIs](#4-executive-overview--business-kpis)
5. [Managing Customer Bookings](#5-managing-customer-bookings)
6. [Managing Services & Pricing](#6-managing-services--pricing)
7. [Moderating Customer Reviews](#7-moderating-customer-reviews)
8. [Managing the Portfolio Gallery](#8-managing-the-portfolio-gallery)
9. [Managing Team Profiles](#9-managing-team-profiles)
10. [Customer Experience & Booking Checkout Flow](#10-customer-experience--booking-checkout-flow)
11. [Frequently Asked Questions (FAQ)](#11-frequently-asked-questions-faq)

---

## 1. Key Website Links & Access

| Page / Tool | URL | Description |
|---|---|---|
| **Public Homepage** | `https://yourdomain.com/` | Main landing page with services, reviews, gallery & profile card. |
| **Booking & Checkout** | `https://yourdomain.com/booking` | Multi-service selector and real-time detailing bill calculator. |
| **Full Portfolio Gallery** | `https://yourdomain.com/gallery` | Full screen photo grid with interactive lightbox preview. |
| **Customer Reviews** | `https://yourdomain.com/reviews` | Rating breakdown, testimonials, and review submission. |
| **Meet Our Team** | `https://yourdomain.com/team` | Detailer profiles, bios, and specialty tags. |
| **Staff Portal Login** | `https://yourdomain.com/login` | Secure administrative authentication for staff only. |
| **Staff Dashboard** | `https://yourdomain.com/dashboard` | Central management hub for bookings, prices, and content. |

> **Tip**: You can always reach the login page by clicking the subtle **"Staff Portal"** link located in the bottom footer copyright line on every page of the website.

---

## 2. Logging Into the Staff Portal

1. Go to `/login` (or click **Staff Portal** in the website footer).
2. Enter your authorized staff email address and password.
3. Click **Sign In to Dashboard**.
4. You will be automatically redirected to your private dashboard at `/dashboard`.

> **Security Note**: Public user registration is disabled. Only authorized staff accounts created in your Firebase Console can access the dashboard. When finished on a shared device, always click the **Log Out** icon at the bottom of the sidebar.

---

## 3. Mobile Staff Portal & Navigation

The entire Staff Dashboard has been engineered to work on **smartphones, tablets, and desktop computers**:

* **Mobile Navigation Drawer**: On smartphones, tap the **Hamburger Menu icon (`☰`)** in the top-left corner to slide open the navigation drawer. Tapping any menu item or the dimmed background automatically closes the menu.
* **Quick Web Preview**: Tap **"View Site"** in the top header or sidebar to preview the live website in a new tab without logging out.
* **Touch-Friendly Controls**: All buttons, filters, and action icons are sized for easy one-hand mobile operation.

---

## 4. Executive Overview & Business KPIs

When you log in, the dashboard immediately opens the **Overview & KPIs** hub, giving you a real-time snapshot of your business activity:

* ⏳ **Pending Inquiries**: Counts customer bookings waiting for your response. Displays the estimated CAD pipeline value. Tap this card to jump directly to your bookings.
* 📅 **7-Day Schedule**: Shows upcoming detailing jobs for the next 7 days and highlights how many are scheduled for **Today**.
* 💰 **Completed Jobs Revenue**: Calculates the total revenue earned from finished detailing appointments.
* ⭐ **Customer Satisfaction**: Displays your live average star rating (e.g. 5.0 / 5.0) and alerts you if any new customer reviews are waiting for approval.
* 📊 **Pipeline Status Bar**: A color-coded distribution bar showing the percentage of your bookings across Pending (orange), Confirmed (blue), Completed (green), and Cancelled (slate).
* 🏆 **Most In-Demand Packages**: Ranks your most popular detailing packages based on actual customer booking selections.
* 📋 **Recent Appointments Feed**: Quick list of the latest client requests with customer names, vehicle models, and bill totals.

---

## 5. Managing Customer Bookings

Whenever a client books online through the website, their appointment request appears instantly in your dashboard in real-time — **no page refresh required**.

### How to Process an Incoming Booking:
1. Tap or click **Bookings** in the sidebar.
2. Review the customer's details:
   - **Customer Name, Phone & Email**
   - **Selected Package(s)** and **Estimated Bill Total ($CAD)**
   - **Vehicle Make, Model & Body Type** (e.g., *2023 Tesla Model Y - SUV*)
   - **Preferred Date & Time Window** (Morning, Afternoon, Evening)
   - **Customer Special Notes** (e.g., *pet hair, scratches, paint stains*)
3. **One-Tap Customer Contact**: On a mobile phone, simply tap the customer's phone number to call them immediately.
4. **Update the Booking Status**:
   - Tap **Confirm** (`✓`) after speaking with the client to lock in the appointment time.
   - Tap **Complete** (`⏰`) once the detailing job is finished and payment is received.
   - Tap **Cancel** (`✕`) if the client needs to cancel.
   - Tap **Delete** (`🗑️`) to remove test or duplicate entries.

### Searching and Filtering:
* Use the **Search bar** to quickly find a booking by typing the customer's name, phone number, or email.
* Use the **Filter dropdown** to view only *Pending*, *Confirmed*, *Completed*, or *Cancelled* jobs.

---

## 6. Managing Services & Pricing

You have complete control over all detailing services and prices displayed on the homepage and booking checkout.

### Adding a New Service Package:
1. Tap **Services & Pricing** in the dashboard.
2. Tap the blue **"+ Add New Service"** button.
3. Fill out the package details:
   - **Service Title**: e.g., *Ceramic Coating Protection* or *Headlight Restoration*.
   - **Price / Cost**: e.g., `$149` or `$199.00` (Our system automatically extracts the dollar amount for the customer's checkout bill).
   - **Service Description**: A brief 1–2 sentence overview of what the package offers.
   - **Package Features**: Type the features **one per line** (e.g., *Foam bath wash*, *Clay bar treatment*, *9H ceramic seal*). Each line appears with a stylish checkmark on the website.
   - **Display Order**: The number that decides which package appears first (see below).
4. Tap **"Add Service"**. It goes live on the website immediately!

### How "Display Order" Works:
* **`1`**: Appears at the very top of the homepage accordion and first on the booking page.
* **`2`**: Appears second.
* **`3`**: Appears third, etc.
* **Pro Tip**: If you want your most profitable package to get the most attention, set its Display Order to `1`.

### Starter Presets vs. Your Custom Services:
* When you haven't added any custom services yet, the website displays built-in starter templates (*Exterior Wash*, *Interior Cleaning*, etc.).
* On any starter card in the dashboard, tap **"Customize & Save"** to pre-fill the form and edit it with your own pricing and features!
* **Automatic Hiding**: As soon as you save your own custom services, the starter templates disappear automatically across the entire website.

---

## 7. Moderating Customer Reviews

To protect your business from spam and inappropriate content, the website includes an **automatic review moderation system**.

### How Customer Reviews Work:
1. A customer goes to `/reviews` and submits a 5-star rating, name, and comment.
2. The review is saved with **Pending** status. It will **NOT** appear publicly until you approve it.
3. In your dashboard under **Reviews**, pending reviews are highlighted with an orange border.
4. Tap **"Approve"** (`✓`) to publish the review immediately to the public website.
5. Tap **"Hide"** if you ever want to temporarily unpublish an approved review.
6. Tap **"Delete"** (`🗑️`) to permanently remove any review.

### Dynamic Rating Calculation:
* The overall score (e.g. `5.0 ★`), total count, and 5-to-1 star percentage bars on both the Homepage and Reviews page calculate automatically in real-time from your approved reviews.
* Once you approve real customer reviews, the starter baseline reviews are hidden automatically.

---

## 8. Managing the Portfolio Gallery

Showcase your best paint corrections, ceramic coatings, and interior detailing jobs directly to prospective clients.

### Adding New Photos:
1. Tap **Gallery Photos** in the dashboard.
2. Tap **"+ Add New Photo"**.
3. Choose your upload method:
   - **Upload from Device**: Select any photo from your phone or computer. The platform automatically optimizes the image for fast web loading.
   - **Image URL**: Paste a link to a photo hosted online.
4. Add a short descriptive **Caption / Label** (e.g., *Tesla Model S Ceramic Coating* or *BMW Leather Restoration*).
5. Tap **"Add to Gallery"**.

### Public Lightbox Experience:
* When visitors tap any photo on `/gallery`, it opens in a full-screen interactive carousel with left/right arrows, photo counts, and swipe-friendly navigation.
* Once you upload custom gallery photos, starter baseline photos are hidden automatically.

---

## 9. Managing Team Profiles

Introduce your certified detailers and crew to build trust with customers before they book.

### Adding a Team Member:
1. Tap **Team Members** in the dashboard.
2. Tap **"+ Add Team Member"**.
3. Enter their **Full Name**, **Role / Title** (e.g., *Lead Paint Specialist*), **Photo**, and a **Short Bio**.
4. Enter their **Specialties** separated by commas (e.g., *Ceramic Coating, Paint Correction, Leather Care*).
5. Tap **"Add Member"**.

---

## 10. Customer Experience & Booking Checkout Flow

Here is what your clients experience when booking on your website:

1. **Service Selection (Step 1)**:
   - Clients visit `/booking` and browse your detailing packages.
   - Clients can select **multiple services** (e.g., *Exterior Wash* + *Interior Shampoo*).
   - Selected packages glow with a checkmark badge.
2. **Interactive Detailing Bill Receipt**:
   - A sticky receipt card automatically calculates the **Subtotal**, **5% B.C. GST**, and **Total Job Cost in CAD**.
   - Clients can remove line items directly with the `×` button.
   - Clear reassurance note: *"Zero cancellation fee · Pay after service completion via Debit, Visa, Mastercard, or E-Transfer."*
3. **Contact & Scheduling (Step 2)**:
   - Client enters their Name, Phone, Email, Vehicle Make & Model, Vehicle Type (Sedan, SUV, Truck, etc.), Preferred Date, and Time Window.
4. **Digital Confirmation Receipt**:
   - Immediately upon booking, the customer receives an official digital confirmation summary with a unique Reference ID, their scheduled slot, vehicle info, and itemized bill total.
   - The booking appears simultaneously on your staff dashboard.

---

## 11. Frequently Asked Questions (FAQ)

#### Q1: How do I change a price for a service?
> In your dashboard, go to **Services & Pricing**, find the package card, tap **Edit**, change the Price field (e.g. from `$99` to `$119`), and tap **Update Service**. The new price goes live on both the homepage and booking checkout immediately.

#### Q2: What happens if two services have the same Display Order number?
> Both services will display properly. Firestore will automatically group them together and sort them by their internal creation order. For best results, use sequential numbers like `1`, `2`, `3`, `4`.

#### Q3: Does the customer have to pay online when booking?
> No. Detailing jobs often require inspecting the vehicle's paint and condition in person. The booking checkout generates an itemized estimate and reserves their slot; payment is collected upon completion of the service via Debit, Credit, or E-Transfer.

#### Q4: Why don't I see a review that a customer just submitted?
> All newly submitted reviews go into your moderation queue as **Pending** to protect against spam. Open **Reviews** in your dashboard and tap **Approve** to make it visible on the website.

#### Q5: How do I add another staff member who can log into the dashboard?
> Open your **Firebase Console** ➔ click **Authentication** ➔ click **Add User** ➔ enter their email and a secure password. They can now log in at `/login`.

---

*Documentation prepared for Prime Finish Auto Spa. Built with React 19, Vite, and Cloud Firestore.*
