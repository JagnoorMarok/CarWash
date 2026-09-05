# Prime Finish Auto Spa - Platform Documentation & Features Guide

Comprehensive documentation of all public and administrative features, backend database schemas, routing architecture, and workflows implemented for the **Prime Finish Auto Spa** web application.

---

## 📑 Table of Contents
1. [System Architecture & Tech Stack](#1-system-architecture--tech-stack)
2. [Database Architecture (Cloud Firestore)](#2-database-architecture-cloud-firestore)
3. [Authentication & Staff Access Control](#3-authentication--staff-access-control)
4. [Admin Dashboard (`/dashboard`)](#4-admin-dashboard-dashboard)
   - [Bookings Management](#bookings-management)
   - [Reviews Moderation](#reviews-moderation)
   - [Gallery Manager](#gallery-manager)
   - [Team Manager](#team-manager)
5. [Public Website Features](#5-public-website-features)
   - [Homepage](#homepage)
   - [Online Booking System](#online-booking-system)
   - [Customer Reviews Page](#customer-reviews-page)
   - [Interactive Gallery](#interactive-gallery)
   - [Team Profiles](#team-profiles)
6. [Local Development & Deployment](#6-local-development--deployment)

---

## 1. System Architecture & Tech Stack

- **Frontend Core**: React 19 + Vite 8
- **Routing**: `react-router-dom` v7 (Client-side routing with deep link support and scroll restoration)
- **Backend & Storage (BaaS)**: Google Firebase v12
  - **Firebase Authentication**: Email/Password administrative accounts
  - **Cloud Firestore**: Real-time NoSQL document database with live WebSockets (`onSnapshot`)
- **Styling**: Vanilla CSS Variables design system with synchronized Light and Dark modes
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`

---

## 2. Database Architecture (Cloud Firestore)

The application utilizes four primary collections in Cloud Firestore:

### `bookings` Collection
Stores appointment requests submitted by customers through the interactive booking checkout.
```json
{
  "name": "Harpreet Singh",
  "phone": "(778) 637-0025",
  "email": "customer@example.com",
  "vehicle": "2023 Tesla Model Y",
  "vehicleType": "SUV / Crossover",
  "services": [
    { "id": "seed-3", "title": "Exterior and Interior", "price": "$169", "numericPrice": 169 }
  ],
  "serviceName": "Exterior and Interior",
  "subtotal": 169.00,
  "tax": 8.45,
  "totalAmount": 177.45,
  "date": "2026-09-15",
  "time": "morning",
  "notes": "Dog hair on back seats",
  "status": "pending", // "pending" | "confirmed" | "completed" | "cancelled"
  "createdAt": "Timestamp"
}
```

### `services` Collection
Stores custom detailing packages configured from the staff Dashboard.
```json
{
  "title": "Ceramic Coating Protection",
  "price": "$199",
  "description": "Multi-year hydrophobic paint protection with swirl correction.",
  "features": ["Foam wash & clay bar", "Single-stage paint polish", "9H ceramic coating layer"],
  "order": 1,
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### `reviews` Collection
Stores customer testimonials submitted on the `/reviews` page.
```json
{
  "name": "Harpreet S.",
  "rating": 5, // 1 to 5
  "text": "Best auto detailing service in Surrey. Paint looks brand new!",
  "approved": true, // Moderation flag: true = visible publicly, false = pending admin approval
  "createdAt": "Timestamp"
}
```

### `gallery` Collection
Stores custom showcase photos uploaded by administrators via the dashboard.
```json
{
  "src": "data:image/jpeg;base64,... or https://example.com/photo.jpg",
  "label": "Ceramic Coating & Paint Correction",
  "createdAt": "Timestamp"
}
```

### `team` Collection
Stores staff and detailer profiles editable from the dashboard.
```json
{
  "name": "Arjun P.",
  "role": "Founder & Lead Detailer",
  "photo": "https://... or data:image/...",
  "bio": "Certified in ceramic coating with 8+ years experience...",
  "specialties": ["Ceramic Coating", "Paint Correction", "Customer Relations"],
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### `services` Collection
Stores auto detailing packages, pricing tags, and features managed from the dashboard.
```json
{
  "title": "Ceramic Coating Protection",
  "price": "Starting at $149",
  "description": "Multi-year paint protection with hydrophobic gloss finish...",
  "features": [
    "Full exterior hand wash & decontamination",
    "Single-stage paint polish",
    "9H Ceramic Coating applied",
    "Window & wheel face protection"
  ],
  "order": 1,
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

---

## 3. Authentication & Staff Access Control

- **Security Protocol**: Public sign-up is disabled. Staff accounts must be provisioned directly via the Firebase Console (Authentication > Users > Add User).
- **Session Management**: Handled globally by `AuthContext.jsx` using Firebase's `onAuthStateChanged`.
- **Protected Routing**: The `/dashboard` route is wrapped in `ProtectedRoute.jsx`. Any unauthorized or logged-out user attempting to access `/dashboard` is automatically redirected to `/login`.
- **Staff Access Link**: A subtle `Staff Portal` link is located in the bottom copyright bar of the footer on every page.

---

## 4. Admin Dashboard (`/dashboard`)

The dashboard features a dark-themed sidebar layout providing access to five operational hubs:
- **Mobile Off-Canvas Drawer**: On smartphones and tablets (< 992px), a sticky topbar with a hamburger menu (`☰`) slides out the navigation drawer with smooth backdrop blur. Selecting any tab or tapping the backdrop automatically closes the drawer.
- **Adaptive Content Padding**: Dynamically scales margins and paddings for mobile screens (16px) up to ultra-wide displays (32px).
- **Responsive Table-to-Card Transformation**: Wide appointment data tables automatically transform into touch-friendly cards with one-click direct dialing (`tel:` links) and prominent action buttons.

### Overview & KPIs Hub
- **Live Performance Telemetry**: Automatic real-time calculations from Firestore without page refresh.
- **Pending Inquiries**: Counts appointments needing customer contact, displays potential revenue pipeline.
- **Schedule Forecast**: Shows today's bookings and upcoming 7-day bookings with confirmed pipeline value.
- **Completed Job Revenue**: Sums total revenue generated from completed detailing services.
- **Customer Satisfaction**: Live average rating and count of unapproved reviews awaiting moderation.
- **Visual Status Progress Bar**: Color-coded distribution of Pending (orange), Confirmed (blue), Completed (green), and Cancelled (slate).
- **Most In-Demand Packages**: Visual ranking of the top detailing packages chosen by customers.
- **Recent Appointments Feed**: Quick cards of new incoming bookings with vehicle details and direct links.
- **One-Click Navigation**: Clicking any KPI metric, status segment, or quick strip item navigates directly to that management tab.

### Bookings Management
- **Real-Time Feed**: Auto-updates whenever a customer submits an appointment online without page reload.
- **Search & Filters**: Search by customer name, phone number, or email address. Filter by status (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`).
- **Status Workflows**:
  - `Confirm`: Sets status to Confirmed.
  - `Mark Completed`: Sets status to Completed once detailing work is done.
  - `Cancel`: Marks appointment as cancelled.
  - `Delete`: Permanently removes booking records with confirmation modal.

### Reviews Moderation
- **Moderation Queue**: New reviews submitted by visitors default to `approved: false` (PENDING) to prevent spam or inappropriate content from going live automatically.
- **Approval Toggle**: One-click `Approve` to publish to the public website, or `Hide` to take it down.
- **Permanent Deletion**: Delete fraudulent reviews.

### Services & Pricing Manager
- **Custom Service Creation**: Add new detailing tiers with title, price subtitle (e.g. *Starting at $99* or *Full Interior Steaming*), description, and line-by-line feature checklists.
- **Display Order**: Set custom numerical ordering to organize which packages appear first.
- **Live Sync**: Updates the homepage accordion ([Services.jsx](file:///c:/Users/Dell/Desktop/carwash/src/pages/Services.jsx)) and the appointment booking dropdown ([BookingPage.jsx](file:///c:/Users/Dell/Desktop/carwash/src/pages/BookingPage.jsx)) in real time.
- **Edit & Archive/Delete**: Quickly adjust seasonal rates, update inclusions, or delete old packages.

### Gallery Manager
- **Upload File**: Direct photo upload from laptop/mobile (auto-converted to Base64 with a 1MB optimization check).
- **Image URL**: Add photos hosted online with a custom label/caption.
- **Live Preview**: See uploaded images side-by-side with starter assets.
- **Deletion**: Hover over any custom card to delete it from the website gallery immediately.

### Team Manager
- **Add Team Member**: Form modal with responsive two-column grid, profile photo upload/URL selector with a circular avatar preview.
- **Specialties Tags**: Converts comma-separated input into formatted pill badges on the live website.
- **Edit Existing Members**: Click `Edit` to modify names, positions, photos, bios, or specialty tags in Firestore.
- **Delete Members**: Remove profiles when team composition changes.

---

## 5. Public Website Features

### Homepage
- **Hero Video Background**: High-definition looping video with overlay call-to-actions ("View Services", "Book Now").
- **Dark/Light Mode**: Toggleable theme state saved across page navigation.
- **Dynamic Reviews Preview**: Calculates real-time average rating score (e.g. `5.0`), dynamically filled stars, total review count, and dynamic distribution bars across 5, 4, 3, 2, and 1 star ratings.
- **Dynamic Gallery Preview**: Automatically displays the newest custom-uploaded gallery image as the primary featured thumbnail.
- **Sidebar Profile Card**: Displays business logo, operating hours, dynamic star rating, and review count.

### Online Booking System (`/booking` & Modal)
### Online Booking & Checkout System (`/booking`)
- **Step 1: Multi-Service Package Selection**: Customers can browse all available detailing packages and select one or multiple services. Cards highlight active selections, display pricing badges, descriptions, and feature checklists.
- **Step 2: Customer & Scheduling Form**: Fields for Full Name, Phone, Email, Vehicle Make & Model, Vehicle Type (Sedan, SUV, Truck, Van, Coupe), Preferred Appointment Date (validated with min date as today), Preferred Time Window (Morning, Afternoon, Evening, Flexible), and Vehicle Condition Notes.
- **Live Detailing Bill Receipt**: A sticky real-time cost calculator receipt card displaying itemized selected services, quick remove buttons, subtotal, estimated B.C. GST (5%), and total estimated job cost.
- **Post-Booking Receipt**: On confirmation, displays an official digital receipt summary with a unique reference ID, scheduled appointment window, full price breakdown, and next steps.
- **Admin Dashboard Integration**: Bookings appear in real-time in the staff dashboard with total dollar cost and vehicle specifications.

### Customer Reviews Page (`/reviews`)
- **Live Calculation**: Displays dynamic overall score, breakdown bars for each star rating (1 to 5), and review total.
- **Template Separation**: Once the administrator approves custom reviews in Firestore, default seed reviews are hidden so only genuine reviews are shown.
- **Write a Review**: Form with an interactive 5-star picker and review text. Submits to Firestore with pending status for moderation.
- **Helpful Button**: Fully functional reaction button on each review. Increments helpful count, turns blue/active, and persists reaction state in browser `localStorage`.

### Interactive Gallery (`/gallery`)
- **Template Separation**: Displays custom photos uploaded via the Dashboard. If no custom photos have been uploaded yet, seamlessly defaults to starter portfolio photos.
- **Full-Screen Lightbox**: Clicking any photo opens an interactive carousel with previous/next navigation arrows and photo counter (`X / Total`).

### Team Profiles (`/team`)
- **Template Separation**: Displays custom team profiles configured in Firestore. Falls back to baseline founding team members if none are configured.
- Displays photos, roles, detailed biographies, and specialty badges.

---

## 6. Local Development & Deployment

### Running the App
```bash
# 1. Install packages
npm install

# 2. Run local development server (starts on http://localhost:5173/)
npm run dev

# 3. Production build test
npm run build
```

### Key Application Routes
- `/` - Main Landing Page
- `/booking` - Dedicated Booking Request Form
- `/gallery` - Full Portfolio Gallery with Lightbox
- `/reviews` - Customer Reviews & Submission Form
- `/team` - Meet Our Team & Detailing Crew
- `/login` - Staff & Management Portal Login
- `/dashboard` - Authenticated Admin Dashboard (Protected Route)
